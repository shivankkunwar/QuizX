'use client'

import '../instrumentation-client'

import { BYOKProvider } from "@/components/BYOK";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = React.useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
        <BYOKProvider>
        {children}
        </BYOKProvider>
    </QueryClientProvider>
  );
}
