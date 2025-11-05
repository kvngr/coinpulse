import { mobulaApiClient } from "@infrastructure/api/mobula/MobulaApiClient";
import { NATIVE_SOL_TOKEN_ADDRESS } from "@shared/constants";

/**
 * Token metadata type
 */
export type TokenMetadata = {
  symbol: string;
  name: string;
  decimals: number;
  logo?: string;
};

/**
 * Token Metadata Service
 * Manages fetching and caching of token metadata
 * Pure service - no UI dependencies, just data fetching with internal cache
 */
export class TokenMetadataService {
  private static cache = new Map<string, TokenMetadata>();

  /**
   * Get token metadata (from cache or API)
   */
  static async getTokenMetadata(
    contractAddress: string,
  ): Promise<TokenMetadata> {
    const normalizedAddress = contractAddress.toLowerCase();

    // Check internal cache first
    const cached = this.cache.get(normalizedAddress);
    if (cached !== undefined) {
      return cached;
    }

    // Special case: Native SOL token
    if (normalizedAddress === NATIVE_SOL_TOKEN_ADDRESS.toLowerCase()) {
      const solMetadata: TokenMetadata = {
        symbol: "SOL",
        name: "Solana",
        decimals: 9,
      };
      // Cache it
      this.cache.set(normalizedAddress, solMetadata);
      return solMetadata;
    }

    // Fetch from API
    const result = await mobulaApiClient.getTokenMetadata(contractAddress);

    if (result.outcome === "success") {
      const metadata: TokenMetadata = {
        symbol: result.value.symbol,
        name: result.value.name,
        decimals: result.value.decimals,
        logo: result.value.logo,
      };

      // Cache the metadata
      this.cache.set(normalizedAddress, metadata);

      return metadata;
    }

    // Fallback if API call fails
    console.warn(
      `[TokenMetadataService] Failed to fetch metadata for ${contractAddress}, using fallback`,
    );
    const fallback: TokenMetadata = {
      symbol: "UNKNOWN",
      name: "Unknown Token",
      decimals: 0,
    };
    this.cache.set(normalizedAddress, fallback);
    return fallback;
  }

  /**
   * Prefetch and cache metadata for a token
   */
  static async prefetchMetadata(contractAddress: string): Promise<void> {
    await this.getTokenMetadata(contractAddress);
  }

  /**
   * Clear internal cache (useful for testing)
   */
  static clearCache(): void {
    this.cache.clear();
  }
}
