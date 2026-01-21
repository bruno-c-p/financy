import {
  ApolloClient,
  HttpLink,
  ApolloLink,
  InMemoryCache,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import { authBridge, isTokenExpired } from "../auth-bridge";
import { useAuthStore } from "@/stores/auth";

const httpLink = new HttpLink({
  uri: "http://localhost:4000/graphql",
});

const errorLink = onError(({ graphQLErrors, networkError }: any) => {
  if (graphQLErrors) {
    const unauthenticated = graphQLErrors.some(
      (e: any) =>
        e?.message === "User not authenticated!" ||
        e?.message === "User does not exist" ||
        e?.extensions?.code === "UNAUTHENTICATED",
    );
    if (unauthenticated) {
      authBridge.logout();
    }
  }
  if (networkError && "statusCode" in networkError) {
    const status = (networkError as { statusCode: number }).statusCode;
    if (status === 401 || status === 403) {
      authBridge.logout();
    }
  }
});

const authLink = setContext(async (_, { headers }) => {
  let token = authBridge.getToken();

  if (token && isTokenExpired(token)) {
    const refreshToken = authBridge.getRefreshToken();
    if (refreshToken) {
      try {
        const response = await fetch("http://localhost:4000/graphql", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: `
              mutation RefreshToken($token: String!) {
                refreshToken(token: $token) {
                  token
                  refreshToken
                }
              }
            `,
            variables: {
              token: refreshToken,
            },
          }),
        });

        const { data, errors } = await response.json();

        if (data?.refreshToken && !errors) {
          const { token: newToken, refreshToken: newRefreshToken } =
            data.refreshToken;
          useAuthStore.getState().setTokens(newToken, newRefreshToken);
          token = newToken;
        } else {

          authBridge.logout();
          return { headers };
        }
      } catch (error) {
        console.error("Failed to refresh token", error);
        authBridge.logout();
        return { headers };
      }
    } else {
      authBridge.logout();
      return { headers };
    }
  }

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

export const apolloClient = new ApolloClient({
  link: ApolloLink.from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache(),
});
