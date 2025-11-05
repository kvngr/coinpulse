import {
  type GetTradesInputPort,
  type GetTradesQuery,
} from "@application/ports/input/GetTradesInputPort";
import { type Trade } from "@domain/entities/Trade";
import { type TradeRepositoryOutputPort } from "@domain/repositories/TradeRepositoryOutputPort";
import { ContractAddress } from "@domain/value-objects/ContractAddress";
import { WIDGET_CONFIG } from "@shared/constants";
import { type Result, err } from "@shared/utils/result";
import { contractAddressSchema } from "@shared/validation/schemas";

/**
 * Get Trades Use Case Implementation
 */
export class GetTradesUseCase implements GetTradesInputPort {
  constructor(private readonly tradeRepository: TradeRepositoryOutputPort) {}

  async execute(query: GetTradesQuery): Promise<Result<Trade[], Error>> {
    try {
      // Validate input
      const validated = contractAddressSchema.parse(query.contractAddress);

      // Create value object
      const address = ContractAddress.create(validated);

      // Fetch trades from repository
      return await this.tradeRepository.getTrades(address, {
        limit: query.limit ?? WIDGET_CONFIG.MAX_TRADES_DISPLAY,
      });
    } catch (error) {
      return err(
        error instanceof Error ? error : new Error("Failed to get trades"),
        error instanceof Error ? error.message : undefined,
      );
    }
  }
}
