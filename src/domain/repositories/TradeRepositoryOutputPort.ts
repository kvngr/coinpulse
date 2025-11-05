import { type Trade } from "@domain/entities/Trade";
import { type ContractAddress } from "@domain/value-objects/ContractAddress";
import { type Result } from "@shared/utils/result";

export interface TradeQueryOptions {
  limit?: number;
  offset?: number;
}

/**
 * TradeRepositoryOutputPort - Port (Interface)
 * Defines the contract for fetching trade data
 * Infrastructure layer will implement this interface
 */
export interface TradeRepositoryOutputPort {
  /**
   * Fetch recent trades for a token
   * @param contractAddress - The token's contract address
   * @param options - Query options (limit, offset)
   * @returns Result with array of Trade entities or error
   */
  getTrades(
    contractAddress: ContractAddress,
    options?: TradeQueryOptions,
  ): Promise<Result<Trade[], Error>>;

  /**
   * Fetch a single trade by ID
   * @param tradeId - The trade identifier
   * @returns Result with Trade entity or error
   */
  getTradeById(tradeId: string): Promise<Result<Trade, Error>>;
}
