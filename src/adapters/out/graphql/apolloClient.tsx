"use client";

import { HttpLink } from "@apollo/client";
import {
  ApolloClient,
  ApolloNextAppProvider,
  InMemoryCache,
} from "@apollo/client-integration-nextjs";
import { auth } from "../firebase/firebaseConfig";
import { clientEnv } from "@/lib/env";

function makeClient() {
  const httpLink = new HttpLink({
    uri: clientEnv.NEXT_PUBLIC_CHAT_GRAPHQL_URL,
    fetch: async (input, init) => {
      const user = auth?.currentUser;
      const token = user ? await user.getIdToken() : null;
      const headers = new Headers(init?.headers);
      if (token) headers.set("authorization", `Bearer ${token}`);
      return fetch(input, { ...init, headers });
    },
  });

  return new ApolloClient({
    cache: new InMemoryCache(),
    link: httpLink,
  });
}

export function ApolloWrapper({ children }: { children: React.ReactNode }) {
  return (
    <ApolloNextAppProvider makeClient={makeClient}>
      {children}
    </ApolloNextAppProvider>
  );
}
