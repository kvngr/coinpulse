import { Price } from "@domain/entities/Price";
import { type PriceRepositoryOutputPort } from "@domain/repositories/PriceRepositoryOutputPort";
import { type ContractAddress } from "@domain/value-objects/ContractAddress";
import { type MobulaApiClient } from "@infrastructure/api/mobula/MobulaApiClient";
import { mobulaApiClient } from "@infrastructure/api/mobula/MobulaApiClient";
import { type Result, ok, err } from "@shared/utils/result";

/**
 * Price Repository Implementation
 * Uses Mobula API client to fetch price data
 */
export class PriceRepository implements PriceRepositoryOutputPort {
  constructor(private readonly apiClient: MobulaApiClient = mobulaApiClient) {}

  async getPrice(
    contractAddress: ContractAddress,
  ): Promise<Result<Price, Error>> {
    const result = await this.apiClient.getMarketData(contractAddress.value);

    if (result.outcome === "failed") {
      return err(result.error, result.cause);
    }

    const data = result.value;

    try {
      const price = Price.create(
        contractAddress,
        data.priceUSD,
        data.priceSOL,
        data.variation24h,
        data.timestamp ? new Date(data.timestamp) : undefined,
      );

      return ok(price);
    } catch (error) {
      return err(
        error instanceof Error
          ? error
          : new Error("Failed to create Price entity"),
        `Failed to create Price entity for ${contractAddress.value}`,
      );
    }
  }

  async getPrices(
    contractAddresses: ContractAddress[],
  ): Promise<Result<Map<string, Price>, Error>> {
    try {
      const pricesMap = new Map<string, Price>();

      // Fetch prices in parallel
      const results = await Promise.all(
        contractAddresses.map((address) => this.getPrice(address)),
      );

      // Collect successful results
      results.forEach((result, index) => {
        if (result.outcome === "success") {
          pricesMap.set(contractAddresses[index].value, result.value);
        }
      });

      return ok(pricesMap);
    } catch (error) {
      return err(
        error instanceof Error ? error : new Error("Failed to get prices"),
        error instanceof Error ? error.message : undefined,
      );
    }
  }
}
