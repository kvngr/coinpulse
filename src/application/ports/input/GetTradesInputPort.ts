import { type Trade } from "@domain/entities/Trade";
import { type Result } from "@shared/utils/result";

export interface GetTradesQuery {
  contractAddress: string;
  limit?: number;
}

/**
 * Input Port - Get Trades Use Case
 */
export interface GetTradesInputPort {
  execute(query: GetTradesQuery): Promise<Result<Trade[], Error>>;
}
