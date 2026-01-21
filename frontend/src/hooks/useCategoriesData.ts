import { apolloClient } from "@/lib/graphql/apollo";
import {
  COUNT_CATEGORIES,
  COUNT_TRANSACTIONS,
  LIST_CATEGORIES,
  MOST_USED_CATEGORY,
} from "@/lib/graphql/queries/Categories";
import { Category } from "@/types";
import { useEffect, useState } from "react";

type ListCategoriesData = {
  listCategories: Category[];
};

type CountCategoriesData = {
  countCategories: number;
};

type CountTransactionsData = {
  countTransactions: number;
};

type MostUsedCategoryData = {
  mostUsedCategory: Category | null;
};

type CategoriesStats = {
  categories: Category[];
  totalCategories: number;
  totalTransactions: number;
  mostUsedCategory: Category | null;
};

export function useCategoriesData() {
  const [data, setData] = useState<CategoriesStats>({
    categories: [],
    totalCategories: 0,
    totalTransactions: 0,
    mostUsedCategory: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      setLoading(true);
      try {
        const [cats, countCats, countTx, mostUsed] = await Promise.all([
          apolloClient.query<ListCategoriesData>({ query: LIST_CATEGORIES }),
          apolloClient.query<CountCategoriesData>({ query: COUNT_CATEGORIES }),
          apolloClient.query<CountTransactionsData>({
            query: COUNT_TRANSACTIONS,
          }),
          apolloClient.query<MostUsedCategoryData>({
            query: MOST_USED_CATEGORY,
          }),
        ]);

        if (!mounted) return;

        setData({
          categories: cats.data?.listCategories ?? [],
          totalCategories: countCats.data?.countCategories ?? 0,
          totalTransactions: countTx.data?.countTransactions ?? 0,
          mostUsedCategory: mostUsed.data?.mostUsedCategory ?? null,
        });
      } catch (error) {
        console.error("Error fetching categories data:", error);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchData();

    return () => {
      mounted = false;
    };
  }, []);

  const refetch = () => {
    // Re-trigger the effect by toggling a state or simply calling fetchData again
    const fetchData = async () => {
      setLoading(true);
      try {
        const [cats, countCats, countTx, mostUsed] = await Promise.all([
          apolloClient.query<ListCategoriesData>({
            query: LIST_CATEGORIES,
            fetchPolicy: "network-only",
          }),
          apolloClient.query<CountCategoriesData>({
            query: COUNT_CATEGORIES,
            fetchPolicy: "network-only",
          }),
          apolloClient.query<CountTransactionsData>({
            query: COUNT_TRANSACTIONS,
            fetchPolicy: "network-only",
          }),
          apolloClient.query<MostUsedCategoryData>({
            query: MOST_USED_CATEGORY,
            fetchPolicy: "network-only",
          }),
        ]);

        setData({
          categories: cats.data?.listCategories ?? [],
          totalCategories: countCats.data?.countCategories ?? 0,
          totalTransactions: countTx.data?.countTransactions ?? 0,
          mostUsedCategory: mostUsed.data?.mostUsedCategory ?? null,
        });
      } catch (error) {
        console.error("Error fetching categories data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  };

  return { data, loading, refetch };
}
