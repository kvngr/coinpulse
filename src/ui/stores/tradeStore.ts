import { create } from "zustand";

import { type Trade } from "@domain/entities/Trade";
import { WIDGET_CONFIG } from "@shared/constants";

type TradeStoreState = {
  trades: Map<string, Trade[]>;
  pendingTrades: Map<string, Trade[]>; // Buffer pour batch updates
  setTrades: (contractAddress: string, trades: Trade[]) => void;
  addTrade: (contractAddress: string, trade: Trade) => void;
  flushPendingTrades: (contractAddress: string) => void;
  getTrades: (contractAddress: string) => Trade[];
  clear: () => void;
};

/**
 * Deduplicate trades by transaction hash (unique identifier)
 * Prevents same trade from appearing multiple times (API + WebSocket overlap)
 */
const deduplicateTrades = (trades: Trade[]): Trade[] => {
  const seen = new Set<string>();
  return trades.filter((trade) => {
    if (seen.has(trade.transactionHash)) {
      return false;
    }
    seen.add(trade.transactionHash);
    return true;
  });
};

/**
 * Trade Store
 * Caches trade data in memory for quick access
 *
 * Performance optimizations:
 * - Limits to MAX_TRADES_DISPLAY (20) to prevent memory leaks
 * - Deduplicates by hash to avoid showing same trade twice
 * - Batch updates with pendingTrades buffer to reduce re-renders
 * - Keeps newest trades first (descending order by timestamp)
 */
export const useTradeStore = create<TradeStoreState>((set, get) => ({
  trades: new Map(),
  pendingTrades: new Map(),

  setTrades: (contractAddress: string, trades: Trade[]) => {
    set((state) => {
      const newTrades = new Map(state.trades);

      // Dedupe and limit to prevent memory issues
      const dedupedTrades = deduplicateTrades(trades);
      const limitedTrades = dedupedTrades.slice(
        0,
        WIDGET_CONFIG.MAX_TRADES_DISPLAY,
      );

      newTrades.set(contractAddress, limitedTrades);
      return { trades: newTrades };
    });
  },

  addTrade: (contractAddress: string, trade: Trade) => {
    const pending = get().pendingTrades.get(contractAddress) ?? [];

    if (
      pending.some((trade) => trade.transactionHash === trade.transactionHash)
    ) {
      return;
    }

    const newPendingTrades = new Map(get().pendingTrades);
    newPendingTrades.set(contractAddress, [...pending, trade]);

    set({ pendingTrades: newPendingTrades });
  },

  flushPendingTrades: (contractAddress: string) => {
    const pending = get().pendingTrades.get(contractAddress);
    if (pending === undefined || pending.length === 0) {
      return; // Nothing to flush
    }

    set((state) => {
      const newTrades = new Map(state.trades);
      const existing = newTrades.get(contractAddress) ?? [];

      // Filter out duplicates from pending
      const newUniqueTrades = pending.filter((newTrade) =>
        existing.every(
          (existingTrade) =>
            existingTrade.transactionHash !== newTrade.transactionHash,
        ),
      );

      if (newUniqueTrades.length === 0) {
        // Clear pending buffer
        const newPendingTrades = new Map(state.pendingTrades);
        newPendingTrades.delete(contractAddress);
        return { pendingTrades: newPendingTrades };
      }

      // Merge pending with existing, limit to MAX_TRADES_DISPLAY
      const updated = [...newUniqueTrades, ...existing].slice(
        0,
        WIDGET_CONFIG.MAX_TRADES_DISPLAY,
      );

      newTrades.set(contractAddress, updated);

      // Clear pending buffer
      const newPendingTrades = new Map(state.pendingTrades);
      newPendingTrades.delete(contractAddress);

      return { trades: newTrades, pendingTrades: newPendingTrades };
    });
  },

  getTrades: (contractAddress: string) => {
    return get().trades.get(contractAddress) ?? [];
  },

  clear: () => {
    set({ trades: new Map(), pendingTrades: new Map() });
  },
}));
