import { Trade } from "@domain/entities/Trade";
import {
  type TradeRepositoryOutputPort,
  type TradeQueryOptions,
} from "@domain/repositories/TradeRepositoryOutputPort";
import { type ContractAddress } from "@domain/value-objects/ContractAddress";
import {
  type MobulaApiClient,
  mobulaApiClient,
} from "@infrastructure/api/mobula/MobulaApiClient";
import { type Result, ok, err } from "@shared/utils/result";

/**
 * Trade Repository Implementation
 * Uses Mobula API client to fetch trade data
 */
export class TradeRepository implements TradeRepositoryOutputPort {
  constructor(private readonly apiClient: MobulaApiClient = mobulaApiClient) {}

  async getTrades(
    contractAddress: ContractAddress,
    options?: TradeQueryOptions,
  ): Promise<Result<Trade[], Error>> {
    const result = await this.apiClient.getTradeHistory(
      contractAddress.value,
      options?.limit,
    );

    if (result.outcome === "failed") {
      return err(result.error, result.cause);
    }

    try {
      const mappedTrades = result.value.map((trade) =>
        Trade.create(
          trade.id,
          contractAddress,
          trade.symbol,
          trade.name,
          trade.walletAddress,
          trade.amount,
          trade.currency,
          trade.type === "BUY" ? "BUY" : "SELL",
          new Date(trade.timestamp),
          trade.transactionHash,
        ),
      );

      return ok(mappedTrades);
    } catch (error) {
      return err(
        error instanceof Error
          ? error
          : new Error("Failed to create Trade entities"),
        `Failed to create Trade entities for ${contractAddress.value}`,
      );
    }
  }

  async getTradeById(tradeId: string): Promise<Result<Trade, Error>> {
    // Note: This would require a specific API endpoint
    return err(
      new Error(`getTradeById not implemented for ${tradeId}`),
      "Method not implemented",
    );
  }
}
