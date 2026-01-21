import { apolloClient } from "@/lib/graphql/apollo";
import { LIST_TRANSACTIONS } from "@/lib/graphql/queries/TransactionQueries";
import { LIST_CATEGORIES } from "@/lib/graphql/queries/Categories";
import { Transaction, Category, TransactionFilterInput } from "@/types";
import { useEffect, useState } from "react";

type ListTransactionsData = {
  listTransactions: Transaction[];
};

type ListCategoriesData = {
  listCategories: Category[];
};

type TransactionsData = {
  transactions: Transaction[];
  categories: Category[];
};

export function useTransactionsData(
  filter: TransactionFilterInput,
  limit: number,
  offset: number,
) {
  const [data, setData] = useState<TransactionsData>({
    transactions: [],
    categories: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      setLoading(true);
      try {
        const [txs, cats] = await Promise.all([
          apolloClient.query<ListTransactionsData>({
            query: LIST_TRANSACTIONS,
            variables: { filter, limit, offset },
            fetchPolicy: "network-only",
          }),
          apolloClient.query<ListCategoriesData>({
            query: LIST_CATEGORIES,
          }),
        ]);

        if (!mounted) return;

        setData({
          transactions: txs.data?.listTransactions ?? [],
          categories: cats.data?.listCategories ?? [],
        });
      } catch (error) {
        console.error("Error fetching transactions data:", error);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchData();

    return () => {
      mounted = false;
    };
  }, [JSON.stringify(filter), limit, offset]);

  const refetch = async () => {
    setLoading(true);
    try {
      const [txs, cats] = await Promise.all([
        apolloClient.query<ListTransactionsData>({
          query: LIST_TRANSACTIONS,
          variables: { filter, limit, offset },
          fetchPolicy: "network-only",
        }),
        apolloClient.query<ListCategoriesData>({
          query: LIST_CATEGORIES,
          fetchPolicy: "network-only",
        }),
      ]);

      setData({
        transactions: txs.data?.listTransactions ?? [],
        categories: cats.data?.listCategories ?? [],
      });
    } catch (error) {
      console.error("Error fetching transactions data:", error);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, refetch };
}
