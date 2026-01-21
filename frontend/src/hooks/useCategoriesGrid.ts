import { Category } from "@/types";
import { useMemo } from "react";

export function useCategoriesGrid(categories: Category[]) {
  return useMemo(() => {
    const rows: Category[][] = [];
    for (let i = 0; i < categories.length; i += 3) {
      rows.push(categories.slice(i, i + 3));
    }
    return rows;
  }, [categories]);
}
