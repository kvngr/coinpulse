import { mobulaApiClient } from "@infrastructure/api/mobula/MobulaApiClient";
import { NATIVE_SOL_TOKEN_ADDRESS } from "@shared/constants";
import {
  useTokenMetadataStore,
  type TokenMetadata,
} from "@ui/stores/tokenMetadataStore";

/**
 * Token Metadata Service
 * Manages fetching and caching of token metadata
 */
export class TokenMetadataService {
  /**
   * Get token metadata (from cache or API)
   */
  static async getTokenMetadata(
    contractAddress: string,
  ): Promise<TokenMetadata> {
    const normalizedAddress = contractAddress.toLowerCase();

    // Check cache first
    const cached = useTokenMetadataStore
      .getState()
      .getMetadata(normalizedAddress);
    if (cached !== null) {
      return cached;
    }

    // Special case: Native SOL token
    if (normalizedAddress === NATIVE_SOL_TOKEN_ADDRESS.toLowerCase()) {
      const solMetadata: TokenMetadata = {
        symbol: "SOL",
        name: "Solana",
        decimals: 9,
      };
      // Cache it so it's available in the store
      useTokenMetadataStore
        .getState()
        .setMetadata(normalizedAddress, solMetadata);
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
      useTokenMetadataStore.getState().setMetadata(normalizedAddress, metadata);

      return metadata;
    }

    // Fallback if API call fails
    console.warn(
      `[TokenMetadataService] Failed to fetch metadata for ${contractAddress}, using fallback`,
    );
    return {
      symbol: "UNKNOWN",
      name: "Unknown Token",
      decimals: 0,
    };
  }

  /**
   * Prefetch and cache metadata for a token
   */
  static async prefetchMetadata(contractAddress: string): Promise<void> {
    await this.getTokenMetadata(contractAddress);
  }
}
