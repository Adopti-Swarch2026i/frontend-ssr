"use client";

import {
  createContext,
  useContext,
  useMemo,
  type ReactNode,
} from "react";
import type { AuthRepository } from "@/domain/ports/out/AuthRepository";
import type { PetRepository } from "@/domain/ports/out/PetRepository";
import type { ChatRepository } from "@/domain/ports/out/ChatRepository";
import { FirebaseAuthAdapter } from "@/adapters/out/firebase/FirebaseAuthAdapter";
import { PetApiAdapter } from "@/adapters/out/api/PetApiAdapter";
import { ChatGraphQLAdapter } from "@/adapters/out/graphql/ChatGraphQLAdapter";
import { ChatWebSocketAdapter } from "@/adapters/out/websocket/ChatWebSocketAdapter";
import { ChatCompositeAdapter } from "@/adapters/out/ChatCompositeAdapter";
import axiosInstance from "@/adapters/out/api/axiosInstance";
import { createStompClient } from "@/adapters/out/websocket/stompClient";
import { useApolloClient } from "@apollo/client/react";

interface Dependencies {
  authRepository: AuthRepository;
  petRepository: PetRepository;
  chatRepository: ChatRepository;
}

const DependencyContext = createContext<Dependencies | null>(null);

export function DependencyProvider({ children }: { children: ReactNode }) {
  const apolloClient = useApolloClient();

  const deps = useMemo<Dependencies>(() => {
    const stompClient = createStompClient();
    return {
      authRepository: new FirebaseAuthAdapter(),
      petRepository: new PetApiAdapter(axiosInstance),
      chatRepository: new ChatCompositeAdapter(
        new ChatGraphQLAdapter(apolloClient),
        new ChatWebSocketAdapter(stompClient)
      ),
    };
  }, [apolloClient]);

  return (
    <DependencyContext.Provider value={deps}>
      {children}
    </DependencyContext.Provider>
  );
}

export function useDependencies(): Dependencies {
  const context = useContext(DependencyContext);
  if (!context) {
    throw new Error("useDependencies must be used within DependencyProvider");
  }
  return context;
}
