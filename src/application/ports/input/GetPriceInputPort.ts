import { type Price } from "@domain/entities/Price";
import { type Result } from "@shared/utils/result";

/**
 * Input Port - Get Price Use Case
 */
export interface GetPriceInputPort {
  execute(contractAddress: string): Promise<Result<Price, Error>>;
}
