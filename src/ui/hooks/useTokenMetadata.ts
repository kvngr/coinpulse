import { useQuery } from "@tanstack/react-query";

import { TokenMetadataService } from "@infrastructure/services/TokenMetadataService";
import { QUERY_KEYS } from "@shared/constants";

import { useTokenMetadataStore } from "../stores/tokenMetadataStore";

export const useTokenMetadata = (contractAddress: string) => {
  const normalizedAddress = contractAddress.toLowerCase();

  const metadata = useTokenMetadataStore((state) =>
    state.getMetadata(normalizedAddress),
  );

  useQuery({
    queryKey: [QUERY_KEYS.TOKEN_METADATA, normalizedAddress],
    queryFn: async () => {
      const metadata =
        await TokenMetadataService.getTokenMetadata(contractAddress);

      useTokenMetadataStore.getState().setMetadata(normalizedAddress, metadata);

      return metadata;
    },
    enabled: contractAddress.length > 0 && metadata === null,
    staleTime: Infinity,
    gcTime: 1000 * 60 * 60 * 24,
    retry: 1,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  return {
    metadata: metadata ?? {
      symbol: "UNKNOWN",
      name: "Unknown Token",
      decimals: 0,
      logo: undefined,
    },
  };
};
