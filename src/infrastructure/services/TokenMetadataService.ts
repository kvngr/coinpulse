import { mobulaApiClient } from "@infrastructure/api/mobula/MobulaApiClient";

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

    const result = await mobulaApiClient.getTokenMetadata(contractAddress);

    if (result.outcome === "success") {
      const metadata: TokenMetadata = {
        symbol: result.value.symbol,
        name: result.value.name,
        decimals: result.value.decimals,
        logo: result.value.logo,
      };

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
   * Prefetch and cache metadata for a token (for WebSocket services)
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
