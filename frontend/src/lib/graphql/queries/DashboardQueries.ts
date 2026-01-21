import { gql } from "@apollo/client";

export const DASHBOARD_STATS = gql`
  query DashboardStats {
    dashboardStats {
      totalBalance
      totalIncome
      totalExpense
    }
  }
`;

export const RECENT_TRANSACTIONS = gql`
  query RecentTransactions($limit: Int) {
    listTransactions(limit: $limit) {
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
    }
  }
`;
