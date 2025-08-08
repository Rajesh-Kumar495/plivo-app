// components/Provider.tsx
"use client";

import { SessionProvider } from "next-auth/react";
import React from "react";

// The children prop should have a specific type, React.ReactNode
interface ProviderProps {
  children: React.ReactNode;
}

// Ensure you use 'export default'
export default function Provider({ children }: ProviderProps) {
  return <SessionProvider>{children}</SessionProvider>;
}