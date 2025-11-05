import { create } from "zustand";

import { type TokenMetadata } from "@infrastructure/services/TokenMetadataService";

/**
 * Token Metadata Store State
 */
type TokenMetadataStoreState = {
  metadata: Map<string, TokenMetadata>;
  setMetadata: (contractAddress: string, metadata: TokenMetadata) => void;
  getMetadata: (contractAddress: string) => TokenMetadata | null;
  clear: () => void;
};

/**
 * Token Metadata Store
 * Caches token metadata (symbol, name, decimals) to avoid redundant API calls
 * Used for fast synchronous reads in hooks that re-render frequently (due to WebSocket updates)
 */
export const useTokenMetadataStore = create<TokenMetadataStoreState>(
  (set, get) => ({
    metadata: new Map(),

    setMetadata: (contractAddress: string, metadata: TokenMetadata) => {
      set((state) => {
        const newMetadata = new Map(state.metadata);
        newMetadata.set(contractAddress.toLowerCase(), metadata);
        return { metadata: newMetadata };
      });
    },

    getMetadata: (contractAddress: string) => {
      return get().metadata.get(contractAddress.toLowerCase()) ?? null;
    },

    clear: () => {
      set({ metadata: new Map() });
    },
  }),
);
