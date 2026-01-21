import { gql } from "@apollo/client";

export const REFRESH_TOKEN = gql`
  mutation RefreshToken($token: String!) {
    refreshToken(token: $token) {
      token
      refreshToken
      user {
        id
        name
        email
      }
    }
  }
`;
