import { apolloClient } from "@/lib/graphql/apollo";
import {
  DASHBOARD_STATS,
  RECENT_TRANSACTIONS,
} from "@/lib/graphql/queries/DashboardQueries";
import { LIST_CATEGORIES } from "@/lib/graphql/queries/Categories";
import {
  DashboardStats,
  Transaction,
  Category,
  TransactionType,
} from "@/types";
import { useEffect, useState } from "react";

interface UseDashboardDataReturn {
  dashboardStats: DashboardStats | undefined;
  monthlyIncome: number;
  monthlyExpense: number;
  recentTransactions: Transaction[];
  topCategories: Category[];
  loading: boolean;
  refetch: () => Promise<void>;
}

export function useDashboardData(): UseDashboardDataReturn {
  const [dashboardStats, setDashboardStats] = useState<DashboardStats>();
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>(
    [],
  );
  const [topCategories, setTopCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [stats, transactions, categories] = await Promise.all([
        apolloClient.query<{ dashboardStats: DashboardStats }>({
          query: DASHBOARD_STATS,
          fetchPolicy: "network-only",
        }),
        apolloClient.query<{ listTransactions: Transaction[] }>({
          query: RECENT_TRANSACTIONS,
          variables: { limit: 5 },
          fetchPolicy: "network-only",
        }),
        apolloClient.query<{ listCategories: Category[] }>({
          query: LIST_CATEGORIES,
          fetchPolicy: "network-only",
        }),
      ]);

      setDashboardStats(stats.data?.dashboardStats);
      setRecentTransactions(transactions.data?.listTransactions ?? []);

      const sortedCategories = (categories.data?.listCategories ?? [])
        .filter((cat: Category) => cat.totalAmount && cat.totalAmount > 0)
        .sort(
          (a: Category, b: Category) =>
            (b.totalAmount || 0) - (a.totalAmount || 0),
        )
        .slice(0, 5);

      setTopCategories(sortedCategories);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const monthlyIncome = recentTransactions
    .filter((t: Transaction) => {
      const date = new Date(t.date);
      return (
        t.type === TransactionType.INCOME &&
        date.getMonth() === currentMonth &&
        date.getFullYear() === currentYear
      );
    })
    .reduce((sum: number, t: Transaction) => sum + t.amount, 0);

  const monthlyExpense = recentTransactions
    .filter((t: Transaction) => {
      const date = new Date(t.date);
      return (
        t.type === TransactionType.EXPENSE &&
        date.getMonth() === currentMonth &&
        date.getFullYear() === currentYear
      );
    })
    .reduce((sum: number, t: Transaction) => sum + t.amount, 0);

  return {
    dashboardStats,
    monthlyIncome,
    monthlyExpense,
    recentTransactions,
    topCategories,
    loading,
    refetch: fetchData,
  };
}
