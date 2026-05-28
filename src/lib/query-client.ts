import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,   // 5 min — data considered fresh
      gcTime: 10 * 60 * 1000,     // 10 min — unused cache kept in memory
      retry: 2,
      refetchOnWindowFocus: false, // avoids surprise re-fetches on tab switch
    },
  },
});
