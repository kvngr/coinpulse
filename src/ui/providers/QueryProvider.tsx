import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { DATA_STALENESS } from "@shared/constants";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: DATA_STALENESS.PRICE,
      gcTime: DATA_STALENESS.PRICE * 5, // 5 minutes
      retry: 2,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 1,
    },
  },
});

type QueryProviderProps = {
  children: React.ReactNode;
};

export const QueryProvider: React.FC<QueryProviderProps> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};
