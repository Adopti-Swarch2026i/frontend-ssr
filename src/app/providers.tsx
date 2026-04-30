"use client";

import { ThemeProvider } from "next-themes";
import { ApolloWrapper } from "@/adapters/out/graphql/apolloClient";
import { DependencyProvider } from "@/context/DependencyContext";
import { AuthProvider } from "@/context/AuthContext";
import { ChatProvider } from "@/context/ChatContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <ApolloWrapper>
        <DependencyProvider>
          <AuthProvider>
            <ChatProvider>{children}</ChatProvider>
          </AuthProvider>
        </DependencyProvider>
      </ApolloWrapper>
    </ThemeProvider>
  );
}
