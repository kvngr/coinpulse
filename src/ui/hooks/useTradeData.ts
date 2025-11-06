import React from "react";

import { useQuery } from "@tanstack/react-query";

import { GetTradesUseCase } from "@application/use-cases/trade/GetTradesUseCase";
import { ContractAddress } from "@domain/value-objects/ContractAddress";
import { TradeRepository } from "@infrastructure/repositories/TradeRepository";
import { webSocketClient } from "@infrastructure/websocket/MobulaWebSocketClient";
import { QUERY_KEYS, WIDGET_CONFIG } from "@shared/constants";

import { useTradeStore } from "../stores/tradeStore";

// Initialize use case
const tradeRepository = new TradeRepository();
const getTradesUseCase = new GetTradesUseCase(tradeRepository);

// Flush interval for batching WebSocket updates (reduce re-renders)
const FLUSH_INTERVAL_MS = 1000; // 1 second batching

/**
 * Hook to fetch and subscribe to trade data
 */
export const useTradeData = (contractAddress: string) => {
  const setTrades = useTradeStore((state) => state.setTrades);
  const addTrade = useTradeStore((state) => state.addTrade);
  const flushPendingTrades = useTradeStore((state) => state.flushPendingTrades);
  const trades = useTradeStore((state) => state.trades.get(contractAddress));

  // Setup flush interval for batching
  const flushIntervalRef = React.useRef<NodeJS.Timeout | null>(null);

  React.useEffect(() => {
    if (contractAddress.length === 0) {
      return;
    }

    // Start flush interval (batch updates every 1s)
    flushIntervalRef.current = setInterval(() => {
      flushPendingTrades(contractAddress);
    }, FLUSH_INTERVAL_MS);

    return () => {
      if (flushIntervalRef.current !== null) {
        clearInterval(flushIntervalRef.current);
        flushIntervalRef.current = null;
      }
      // Flush remaining trades on unmount
      flushPendingTrades(contractAddress);
    };
  }, [contractAddress, flushPendingTrades]);

  // Fetch initial trade data
  const { isLoading, error, refetch } = useQuery({
    queryKey: [QUERY_KEYS.TRADES, contractAddress],
    queryFn: async () => {
      const result = await getTradesUseCase.execute({
        contractAddress,
        limit: WIDGET_CONFIG.MAX_TRADES_DISPLAY,
      });
      if (result.outcome === "success") {
        setTrades(contractAddress, result.value);
        return result.value;
      }
      throw result.error;
    },
    enabled: contractAddress.length > 0,
  });

  // Subscribe to real-time updates via WebSocket
  React.useEffect(() => {
    if (contractAddress.length === 0) {
      return;
    }

    const address = ContractAddress.create(contractAddress);

    const unsubscribe = webSocketClient.subscribeToTradeUpdates(
      address,
      (newTrade) => {
        addTrade(contractAddress, newTrade);
      },
    );

    return unsubscribe;
  }, [contractAddress, addTrade]);

  return {
    trades: trades ?? [],
    isLoading,
    error,
    refetch,
  };
};
