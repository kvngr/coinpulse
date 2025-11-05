import { Trade } from "@domain/entities/Trade";
import { type TradeUpdateCallback } from "@domain/repositories/WebSocketRepositoryOutputPort";
import { ContractAddress } from "@domain/value-objects/ContractAddress";
import {
  extractTokenAddress,
  extractTradeAmount,
} from "@infrastructure/api/mobula/parsers";
import { isValidTradeMessage } from "@infrastructure/api/mobula/validators";
import { WS_MESSAGE_TYPES } from "@shared/constants";
import { generateId } from "@shared/utils/id";

import { type WebSocketClient } from "./WebSocketClient";

/**
 * Mobula fast-trade message
 * Note: Mobula uses inconsistent field naming (both camelCase and snake_case)
 * Use parsers.ts utilities to extract values safely
 */
interface FastTradeMessage {
  pair: string;
  type: "buy" | "sell";
  date: number;
  hash: string;
  blockchain: string;
  sender: string;
  [key: string]: unknown;
}

/**
 * Fast-trade subscription message
 */
interface FastTradeSubscription {
  type: "fast-trade";
  authorization: string;
  payload: {
    assetMode: boolean;
    items: Array<{
      blockchain: string;
      address: string;
    }>;
    subscriptionTracking: boolean;
  };
}

/**
 * Trade WebSocket Service
 * Handles trade subscriptions and parses Mobula fast-trade messages
 * Uses the generic WebSocket client for connection management
 */
export class TradeWebSocketService {
  private wsClient: WebSocketClient;
  private subscriptions: Map<
    string,
    { contractAddress: string; callback: TradeUpdateCallback }
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
      this.unsubscribeMessage();
    }

    this.unsubscribeMessage = this.wsClient.onMessage((data: string) => {
      try {
        const message = JSON.parse(data);

        // Handle subscription confirmation
        if (message.event === "subscribed" && message.type === "fast-trade") {
          return;
        }

        // Handle fast-trade messages (buy/sell)
        if (message.type === "buy" || message.type === "sell") {
          this.handleFastTradeUpdate(message).catch((error) => {
            console.error(
              "[TradeWebSocketService] Error handling fast-trade update:",
              error,
            );
          });
        }
      } catch (error) {
        console.error(
          "[TradeWebSocketService] Failed to parse message:",
          error,
        );
      }
    });
  }

  /**
   * Subscribe to trade updates for a token
   * Returns an unsubscribe function
   */
  subscribe(
    contractAddress: ContractAddress,
    callback: TradeUpdateCallback,
  ): () => void {
    const key = generateId();

    this.subscriptions.set(key, {
      contractAddress: contractAddress.value,
      callback,
    });

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
      return;
    }

    // Collect all unique contract addresses
    const addresses = new Set<string>();
    this.subscriptions.forEach((sub) => {
      addresses.add(sub.contractAddress);
    });

    if (addresses.size === 0) {
      return;
    }

    const message: FastTradeSubscription = {
      type: "fast-trade",
      authorization: getMobulaApiKey(),
      payload: {
        assetMode: true,
        items: Array.from(addresses).map((address) => ({
          blockchain: "solana",
          address,
        })),
        subscriptionTracking: true,
      },
    };

    this.wsClient.sendMessage(message);
  }

  /**
   * Unsubscribe from all trade updates
   */
  unsubscribeAll(): void {
    if (this.wsClient.isConnected()) {
      this.wsClient.sendMessage({
        type: WS_MESSAGE_TYPES.UNSUBSCRIBE,
        authorization: getMobulaApiKey(),
        payload: {
          type: "fast-trade",
        },
      });
    }

    this.subscriptions.clear();

    if (this.unsubscribeMessage !== null) {
      this.unsubscribeMessage();
    }
  }

  /**
   * Handle fast-trade update
   */
  private async handleFastTradeUpdate(
    fastTradeMessage: FastTradeMessage,
  ): Promise<void> {
    // Extract token address using parser
    const tokenAddress = extractTokenAddress(fastTradeMessage);
    if (tokenAddress === null) {
      console.warn(
        "[TradeWebSocketService] Trade has no valid token address:",
        fastTradeMessage,
      );
      return;
    }

    // Extract amount using parser
    const amount = extractTradeAmount(fastTradeMessage);

    // Validate required fields
    if (isValidTradeMessage(fastTradeMessage) === false) {
      console.warn(
        "[TradeWebSocketService] Invalid trade data:",
        fastTradeMessage,
      );
      return;
    }

    // Notify all trade subscriptions for this token
    this.subscriptions.forEach((subscription) => {
      if (subscription.contractAddress === tokenAddress) {
        try {
          const trade = Trade.create(
            generateId(),
            ContractAddress.create(subscription.contractAddress),
            fastTradeMessage.sender,
            amount ?? 0,
            "USD",
            fastTradeMessage.type === "buy" ? "BUY" : "SELL",
            new Date(fastTradeMessage.date),
            fastTradeMessage.hash,
          );

          subscription.callback(trade);
        } catch (error) {
          console.error(
            "[TradeWebSocketService] Failed to create Trade entity:",
            error,
          );
        }
      }
    });
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
