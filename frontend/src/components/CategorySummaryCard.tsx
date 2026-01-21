import { Category } from "@/types";

interface CategorySummaryCardProps {
  category: Category;
}

export function CategorySummaryCard({ category }: CategorySummaryCardProps) {
  const formattedAmount = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(category.totalAmount || 0);

  return (
    <div className="flex items-center justify-between py-1 hover:bg-grayscale-50 rounded-lg transition-colors">
      <div className="flex items-center gap-3">
        <span
          className="text-sm font-medium px-3 py-1 rounded-full"
          style={{
            backgroundColor: `${category.color}18`,
            color: category.color,
          }}
        >
          {category.name}
        </span>
      </div>

      <div className="flex items-center gap-6">
        <span className="text-sm text-grayscale-600">
          {category.transactionCount ?? 0} itens
        </span>
        <span className="text-sm font-semibold text-grayscale-900 min-w-[100px] text-right">
          {formattedAmount}
        </span>
      </div>
    </div>
  );
}
