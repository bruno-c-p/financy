import { gql } from "@apollo/client";

export const LIST_TRANSACTIONS = gql`
  query ListTransactions(
    $filter: TransactionFilterInput
    $limit: Int
    $offset: Int
  ) {
    listTransactions(filter: $filter, limit: $limit, offset: $offset) {
      id
      description
      amount
      date
      type
      categoryId
      category {
        id
        name
        color
        icon
      }
      createdAt
      updatedAt
    }
  }
`;

export const COUNT_TRANSACTIONS = gql`
  query CountTransactions {
    countTransactions
  }
`;

export const GET_TRANSACTION = gql`
  query GetTransaction($id: String!) {
    getTransaction(id: $id) {
      id
      description
      amount
      date
      type
      categoryId
      category {
        id
        name
        color
        icon
      }
      createdAt
      updatedAt
    }
  }
`;
