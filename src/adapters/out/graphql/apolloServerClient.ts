import "server-only";
import { HttpLink } from "@apollo/client";
import {
  ApolloClient,
  InMemoryCache,
  registerApolloClient,
} from "@apollo/client-integration-nextjs";
import { getServerEnv } from "@/lib/env";

export const { getClient, query, PreloadQuery } = registerApolloClient(() => {
  const env = getServerEnv();
  return new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({
      uri: env.CHAT_GRAPHQL_URL_INTERNAL,
    }),
  });
});
