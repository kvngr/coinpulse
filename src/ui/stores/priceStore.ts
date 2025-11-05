import { create } from "zustand";

import { type Price } from "@domain/entities/Price";

type PriceStoreState = {
  prices: Map<string, Price>;
  setPrice: (contractAddress: string, price: Price) => void;
  getPrice: (contractAddress: string) => Price | undefined;
  clear: () => void;
};

/**
 * Price Store
 * Caches price data in memory for quick access
 */
export const usePriceStore = create<PriceStoreState>((set, get) => ({
  prices: new Map(),

  setPrice: (contractAddress: string, price: Price) => {
    set((state) => {
      const newPrices = new Map(state.prices);
      newPrices.set(contractAddress, price);
      return { prices: newPrices };
    });
  },

  getPrice: (contractAddress: string) => {
    return get().prices.get(contractAddress);
  },

  clear: () => {
    set({ prices: new Map() });
  },
}));
