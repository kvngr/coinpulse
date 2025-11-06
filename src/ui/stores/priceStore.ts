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
    const currentPrice = get().prices.get(contractAddress);

    // Only update if price actually changed (compare values, not object references)
    if (currentPrice !== undefined) {
      const currentValue = currentPrice.priceUSD.amount;
      const newValue = price.priceUSD.amount;

      // If price is the same, don't trigger update
      if (currentValue === newValue) {
        return;
      }
    }

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
