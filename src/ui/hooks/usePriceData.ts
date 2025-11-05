import { useEffect } from "react";

import { useQuery } from "@tanstack/react-query";

import { GetPriceUseCase } from "@application/use-cases/price/GetPriceUseCase";
import { ContractAddress } from "@domain/value-objects/ContractAddress";
import { PriceRepository } from "@infrastructure/repositories/PriceRepository";
import { webSocketClient } from "@infrastructure/websocket/MobulaWebSocketClient";
import { QUERY_KEYS } from "@shared/constants";

import { usePriceStore } from "../stores/priceStore";

// Initialize use case
const priceRepository = new PriceRepository();
const getPriceUseCase = new GetPriceUseCase(priceRepository);

/**
 * Hook to fetch and subscribe to price data
 */
export const usePriceData = (contractAddress: string) => {
  const setPrice = usePriceStore((state) => state.setPrice);
  const price = usePriceStore((state) => state.prices.get(contractAddress));

  // Fetch initial price data
  const { isLoading, error, refetch } = useQuery({
    queryKey: [QUERY_KEYS.PRICE, contractAddress],
    queryFn: async () => {
      const result = await getPriceUseCase.execute(contractAddress);
      if (result.outcome === "success") {
        setPrice(contractAddress, result.value);
        return result.value;
      }
      throw result.error;
    },
    enabled: contractAddress.length > 0,
  });

  // Subscribe to real-time updates via WebSocket
  useEffect(() => {
    if (contractAddress.length === 0) {
      return;
    }

    const address = ContractAddress.create(contractAddress);

    const unsubscribe = webSocketClient.subscribeToPriceUpdates(
      address,
      (updatedPrice) => {
        setPrice(contractAddress, updatedPrice);
      },
    );

    return unsubscribe;
  }, [contractAddress, setPrice]);

  return {
    price,
    isLoading,
    error,
    refetch,
  };
};
