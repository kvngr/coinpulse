import { type AxiosInstance } from "axios";

import { apiClient } from "@config/api.config";
import { API_ENDPOINTS, NATIVE_SOL_TOKEN_ADDRESS } from "@shared/constants";
import { type PriceData, type TradeData } from "@shared/types";
import { type Result, ok, err } from "@shared/utils/result";

import { isValidTradeData } from "./validators";

/**
 * Mobula API Response Wrapper
 */
interface MobulaApiResponse<T> {
  data: T;
}

/**
 * Mobula Market Data Response
 * From /market/data endpoint
 */
interface MobulaMarketData {
  price: number;
  symbol: string;
  name: string;
  price_change_24h?: number;
  price_24h_ago?: number;
  volume_24h?: number;
  liquidity?: number;
  market_cap?: number;
  off_chain_volume?: number;
  // Additional fields
  [key: string]: unknown;
}

/**
 * Mobula Trade Response
 * From /market/trades endpoint
 */
interface MobulaTrade {
  hash: string;
  from: string;
  to: string;
  amount: number;
  amount_usd?: number;
  token_amount: number;
  type: "buy" | "sell";
  timestamp: number;
  price?: number;
  blockchain?: string;
  // Additional fields
  [key: string]: unknown;
}

/**
 * Mobula Token Metadata Response
 * From /token/metadata endpoint
 */
interface MobulaTokenMetadata {
  name: string;
  symbol: string;
  decimals: number;
  logo?: string;
}

/**
 * Type guard to validate trade type
 */
function isValidTradeType(type: string): type is "BUY" | "SELL" {
  const normalized = type.toUpperCase();
  return normalized === "BUY" || normalized === "SELL";
}

/**
 * Mobula API Client
 * Handles all HTTP communication with Mobula API
 */
export class MobulaApiClient {
  private readonly client: AxiosInstance;
  private solPriceUsd: number = 150; // Fallback SOL price

  constructor(client?: AxiosInstance) {
    this.client = client ?? apiClient;
    // Fetch and cache SOL price on initialization
    this.fetchSolPrice().catch(() => {
      // Use fallback if fetching fails
      console.warn(
        "[MobulaApiClient] Failed to fetch SOL price, using fallback",
      );
    });
  }

  /**
   * Fetch market data (price) for a token
   */
  async getMarketData(
    contractAddress: string,
  ): Promise<Result<PriceData, Error>> {
    try {
      const response = await this.client.get<
        MobulaApiResponse<MobulaMarketData>
      >(API_ENDPOINTS.MARKET_DATA, {
        params: {
          asset: contractAddress, // Use the actual token address passed
          blockchain: "solana",
        },
      });

      const data = response.data.data;

      // Calculate 24h variation percentage
      const variation24h = this.calculate24hVariation(
        data.price,
        data.price_change_24h,
        data.price_24h_ago,
      );

      // Special case: For native SOL token, priceSOL should always be 1.0
      const isNativeSol =
        contractAddress.toLowerCase() ===
        NATIVE_SOL_TOKEN_ADDRESS.toLowerCase();
      const priceSOL = isNativeSol ? 1.0 : this.convertToSOL(data.price ?? 0);

      // Extract symbol and name with fallbacks
      const symbol = data.symbol;
      const name = data.name;

      return ok({
        contractAddress,
        symbol,
        name,
        priceUSD: data.price ?? 0,
        priceSOL,
        variation24h,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      return err(
        error instanceof Error
          ? error
          : new Error("Failed to fetch market data"),
        `Failed to fetch market data for ${contractAddress}`,
      );
    }
  }

  /**
   * Fetch trade history for a token
   */
  async getTradeHistory(
    contractAddress: string,
    limit: number = 20,
  ): Promise<Result<TradeData[], Error>> {
    try {
      // Import dynamically to avoid circular dependencies
      const { TokenMetadataService } = await import(
        "@infrastructure/services/TokenMetadataService"
      );

      // Fetch token metadata first
      const metadata =
        await TokenMetadataService.getTokenMetadata(contractAddress);

      const response = await this.client.get<MobulaApiResponse<MobulaTrade[]>>(
        API_ENDPOINTS.PAIR_TRADES,
        {
          params: {
            mode: "asset",
            asset: contractAddress,
            blockchain: "solana",
            sortOrder: "desc",
            limit,
          },
        },
      );

      const trades = response.data.data;

      // Transform API response to our TradeData format
      const tradeData = trades
        .filter(
          (trade) => isValidTradeType(trade.type) && isValidTradeData(trade),
        )
        .map((trade) => {
          const upperType = trade.type.toUpperCase();
          const tradeType: "BUY" | "SELL" =
            upperType === "BUY" ? "BUY" : "SELL";

          return {
            id: trade.hash,
            contractAddress,
            symbol: metadata.symbol,
            name: metadata.name,
            walletAddress: trade.from,
            amount: trade.amount_usd ?? trade.amount ?? 0,
            currency: "USD",
            type: tradeType,
            timestamp: new Date(trade.timestamp * 1000).toISOString(),
            transactionHash: trade.hash,
          };
        });

      return ok(tradeData);
    } catch (error) {
      return err(
        error instanceof Error
          ? error
          : new Error("Failed to fetch trade history"),
        `Failed to fetch trade history for ${contractAddress}`,
      );
    }
  }

  /**
   * Fetch token metadata
   */
  async getTokenMetadata(
    contractAddress: string,
  ): Promise<Result<MobulaTokenMetadata, Error>> {
    try {
      const response = await this.client.get<
        MobulaApiResponse<{
          name: string;
          symbol: string;
          decimals: number;
          logo?: string;
        }>
      >(API_ENDPOINTS.TOKEN_METADATA, {
        params: {
          asset: contractAddress,
          blockchain: "solana",
        },
      });

      return ok(response.data.data);
    } catch (error) {
      return err(
        error instanceof Error
          ? error
          : new Error("Failed to fetch token metadata"),
        `Failed to fetch token metadata for ${contractAddress}`,
      );
    }
  }

  /**
   * Fetch current SOL price in USD
   * Used for converting token prices to SOL
   */
  private async fetchSolPrice(): Promise<void> {
    try {
      const response = await this.client.get<
        MobulaApiResponse<MobulaMarketData>
      >(API_ENDPOINTS.MARKET_DATA, {
        params: {
          asset: NATIVE_SOL_TOKEN_ADDRESS, // Native SOL token
          blockchain: "solana",
        },
      });

      const solPrice = response.data.data.price;
      if (solPrice > 0) {
        // Update the SOL price cache
        this.solPriceUsd = solPrice;
      }
    } catch (error) {
      console.error("[MobulaApiClient] Failed to fetch SOL price:", error);
    }
  }

  /**
   * Convert USD price to SOL
   */
  private convertToSOL(priceUSD: number): number {
    if (this.solPriceUsd === 0) {
      return 0;
    }
    return priceUSD / this.solPriceUsd;
  }

  /**
   * Calculate 24h variation percentage
   */
  private calculate24hVariation(
    currentPrice: number,
    priceChange24h?: number,
    price24hAgo?: number,
  ): number {
    // If price_change_24h is provided, it might already be the percentage
    if (
      priceChange24h !== undefined &&
      priceChange24h !== null &&
      Math.abs(priceChange24h) < 1000
    ) {
      return priceChange24h;
    }

    // Calculate from price_24h_ago if available
    if (price24hAgo !== undefined && price24hAgo !== null && price24hAgo > 0) {
      return ((currentPrice - price24hAgo) / price24hAgo) * 100;
    }

    // Calculate from price_change_24h if it's an absolute value
    if (priceChange24h !== undefined && priceChange24h !== null) {
      const price24hAgo = currentPrice - priceChange24h;
      if (price24hAgo > 0) {
        return (priceChange24h / price24hAgo) * 100;
      }
    }

    // Default to 0 if we can't calculate
    return 0;
  }
}

/**
 * Default Mobula API client instance
 */
export const mobulaApiClient = new MobulaApiClient();
