import { type Price } from "@domain/entities/Price";
import { type ContractAddress } from "@domain/value-objects/ContractAddress";
import { type Result } from "@shared/utils/result";

/**
 * PriceRepositoryOutputPort - Port (Interface)
 * Defines the contract for fetching price data
 * Infrastructure layer will implement this interface
 */
export interface PriceRepositoryOutputPort {
  /**
   * Fetch current price data for a token
   * @param contractAddress - The token's contract address
   * @returns Result with Price entity or error
   */
  getPrice(contractAddress: ContractAddress): Promise<Result<Price, Error>>;

  /**
   * Fetch prices for multiple tokens
   * @param contractAddresses - Array of contract addresses
   * @returns Result with Map of contract address to Price or error
   */
  getPrices(
    contractAddresses: ContractAddress[],
  ): Promise<Result<Map<string, Price>, Error>>;
}
