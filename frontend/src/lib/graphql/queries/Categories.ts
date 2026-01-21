import { gql } from "@apollo/client";

export const LIST_CATEGORIES = gql`
  query ListCategories {
    listCategories {
      id
      name
      description
      icon
      color
      transactionCount
      totalAmount
    }
  }
`;

export const COUNT_CATEGORIES = gql`
  query CountCategories {
    countCategories
  }
`;

export const COUNT_TRANSACTIONS = gql`
  query CountTransactions {
    countTransactions
  }
`;

export const MOST_USED_CATEGORY = gql`
  query MostUsedCategory {
    mostUsedCategory {
      id
      name
      description
      icon
      color
    }
  }
`;
