import { type GetPriceInputPort } from "@application/ports/input/GetPriceInputPort";
import { type Price } from "@domain/entities/Price";
import { type PriceRepositoryOutputPort } from "@domain/repositories/PriceRepositoryOutputPort";
import { ContractAddress } from "@domain/value-objects/ContractAddress";
import { type Result, err } from "@shared/utils/result";
import { contractAddressSchema } from "@shared/validation/schemas";

/**
 * Get Price Use Case Implementation
 */
export class GetPriceUseCase implements GetPriceInputPort {
  constructor(private readonly priceRepository: PriceRepositoryOutputPort) {}

  async execute(contractAddress: string): Promise<Result<Price, Error>> {
    try {
      // Validate input
      const validated = contractAddressSchema.parse(contractAddress);

      // Create value object
      const address = ContractAddress.create(validated);

      // Fetch price from repository
      return await this.priceRepository.getPrice(address);
    } catch (error) {
      return err(
        error instanceof Error ? error : new Error("Failed to get price"),
        error instanceof Error ? error.message : undefined,
      );
    }
  }
}
