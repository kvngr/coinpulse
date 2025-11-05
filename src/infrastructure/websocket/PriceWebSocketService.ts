import { Price } from "@domain/entities/Price";
import { type PriceUpdateCallback } from "@domain/repositories/WebSocketRepositoryOutputPort";
import { ContractAddress } from "@domain/value-objects/ContractAddress";
import {
  extractPriceSOL,
  extractPriceUSD,
} from "@infrastructure/api/mobula/parsers";
import { TokenMetadataService } from "@infrastructure/services/TokenMetadataService";
import { NATIVE_SOL_TOKEN_ADDRESS, WS_MESSAGE_TYPES } from "@shared/constants";
import { generateId } from "@shared/utils/id";

import { type WebSocketClient } from "./WebSocketClient";

/**
 * Mobula token data interface
 */
interface TokenData {
  address: string;
  symbol: string;
  name: string;
  price?: number;
  priceUSD?: number;
  priceToken?: number;
  priceChange24hPercentage?: number;
  price_change_24h?: number;
  [key: string]: unknown;
}

/**
 * Mobula trade message with token data
 */
interface TokenDetailsTrade {
  type: "buy" | "sell";
  tokenData: TokenData;
  [key: string]: unknown;
}

/**
 * Token-details subscription message
 */
interface TokenDetailsSubscription {
  type: "token-details";
  authorization: string;
  payload: {
    tokens: Array<{
      blockchain: string;
      address: string;
    }>;
    subscriptionTracking: boolean;
  };
}

/**
 * Price WebSocket Service
 * Handles price subscriptions and parses Mobula token-details messages
 * Uses the generic WebSocket client for connection management
 */
export class PriceWebSocketService {
  private wsClient: WebSocketClient;
  private subscriptions: Map<
    string,
    { contractAddress: string; callback: PriceUpdateCallback }
  > = new Map();
  private unsubscribeMessage: (() => void) | null = null;

  constructor(wsClient: WebSocketClient) {
    this.wsClient = wsClient;
    this.setupHandlers();
  }

  /**
   * Setup message handler to listen to WebSocket messages
   * Public method to allow re-initialization after reconnection
   */
  setupHandlers(): void {
    // Unsubscribe from previous handler if exists
    if (this.unsubscribeMessage !== null) {
      console.info(
        "[PriceWebSocketService] Removing old handler before re-setup",
      );
      this.unsubscribeMessage();
    }

    this.unsubscribeMessage = this.wsClient.onMessage((data: string) => {
      try {
        const message = JSON.parse(data);
        if (
          message.event === "subscribed" &&
          message.type === "token-details"
        ) {
          console.info(
            "[PriceWebSocketService] ✅ Subscription confirmed:",
            message.subscriptionId,
          );
          return;
        }

        if (
          (message.type === "buy" || message.type === "sell") &&
          message.tokenData !== undefined
        ) {
          this.handleTokenDetailsUpdate(message as TokenDetailsTrade).catch(
            (error) => {
              console.error(
                "[PriceWebSocketService] Error handling token details update:",
                error,
              );
            },
          );
        }
      } catch (error) {
        console.error(
          "[PriceWebSocketService] Failed to parse message:",
          error,
        );
      }
    });
  }

  /**
   * Subscribe to price updates for a token
   * Returns an unsubscribe function
   */
  subscribe(
    contractAddress: ContractAddress,
    callback: PriceUpdateCallback,
  ): () => void {
    const key = generateId();

    this.subscriptions.set(key, {
      contractAddress: contractAddress.value,
      callback,
    });

    // Prefetch token metadata in the background
    TokenMetadataService.prefetchMetadata(contractAddress.value).catch(
      (error) => {
        console.warn(
          `[PriceWebSocketService] Failed to prefetch metadata for ${contractAddress.value}:`,
          error,
        );
      },
    );

    if (this.wsClient.isConnected()) {
      this.sendSubscription();
    }

    return () => {
      this.subscriptions.delete(key);
      if (this.wsClient.isConnected()) {
        this.sendSubscription();
      }
    };
  }

  /**
   * Send subscription message to Mobula API
   */
  sendSubscription(): void {
    if (this.wsClient.isConnected() === false) {
      console.warn("[PriceWebSocketService] Not connected, cannot subscribe");
      return;
    }

    // Collect all unique contract addresses
    const addresses = new Set<string>();
    this.subscriptions.forEach((sub) => {
      addresses.add(sub.contractAddress);
    });

    if (addresses.size === 0) {
      console.warn("[PriceWebSocketService] No addresses to subscribe to");
      return;
    }

    const message: TokenDetailsSubscription = {
      type: "token-details",
      authorization: getMobulaApiKey(),
      payload: {
        tokens: Array.from(addresses).map((address) => ({
          blockchain: "solana",
          address,
        })),
        subscriptionTracking: true,
      },
    };

    this.wsClient.sendMessage(message);
  }

  /**
   * Unsubscribe from all price updates
   */
  unsubscribeAll(): void {
    if (this.wsClient.isConnected()) {
      this.wsClient.sendMessage({
        type: WS_MESSAGE_TYPES.UNSUBSCRIBE,
        authorization: getMobulaApiKey(),
        payload: {
          type: "token-details",
        },
      });
    }

    this.subscriptions.clear();

    if (this.unsubscribeMessage !== null) {
      this.unsubscribeMessage();
    }
  }

  /**
   * Handle token-details trade update
   */
  private async handleTokenDetailsUpdate(
    trade: TokenDetailsTrade,
  ): Promise<void> {
    const { tokenData } = trade;

    if (tokenData === undefined || tokenData === null) {
      console.warn("[PriceWebSocketService] ⚠️ No tokenData in message");
      return;
    }

    const tokenAddress = tokenData.address.toLowerCase();

    // Extract price using parser (handles multiple field name formats)
    const priceUSD = extractPriceUSD(tokenData);
    let priceSOL = extractPriceSOL(tokenData);

    if (priceUSD === null) {
      console.warn(
        "[PriceWebSocketService] ⚠️ Could not extract priceUSD for token:",
        tokenAddress,
        "tokenData:",
        tokenData,
      );
      return;
    }

    // Special case: For native SOL token, priceSOL should always be 1.0
    // (1 SOL = 1 SOL, regardless of what Mobula sends)
    const isNativeSol = tokenAddress === NATIVE_SOL_TOKEN_ADDRESS.toLowerCase();
    if (isNativeSol) {
      priceSOL = 1.0;
    }

    // Fetch token metadata from cache or API
    const metadata = await TokenMetadataService.getTokenMetadata(tokenAddress);

    // Notify all price subscriptions for this token
    let matchFound = false;
    this.subscriptions.forEach((subscription) => {
      if (subscription.contractAddress.toLowerCase() === tokenAddress) {
        matchFound = true;

        try {
          const variation24h =
            tokenData.priceChange24hPercentage ??
            tokenData.price_change_24h ??
            0;

          const price = Price.create(
            ContractAddress.create(subscription.contractAddress),
            metadata.symbol,
            metadata.name,
            priceUSD,
            priceSOL ?? 0,
            typeof variation24h === "number" ? variation24h : 0,
          );

          subscription.callback(price);
        } catch (error) {
          console.error(
            "[PriceWebSocketService] ❌ Failed to create Price entity:",
            error,
          );
        }
      }
    });

    if (matchFound === false) {
      console.warn(
        "[PriceWebSocketService] ⚠️ No matching subscription found for:",
        tokenAddress,
      );
    }
  }
}

// Helper to get API key (should be imported from config)
function getMobulaApiKey(): string {
  const apiKey = import.meta.env.VITE_MOBULA_API_KEY;
  if (apiKey === undefined || apiKey.length === 0) {
    throw new Error("VITE_MOBULA_API_KEY environment variable is not set");
  }
  return apiKey;
}
