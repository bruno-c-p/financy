import { Category } from "@/types";
import { ICON_MAP } from "@/types/category.types";
import { Tag } from "lucide-react";

interface CategorySummaryCardProps {
  category: Category;
}

export function CategorySummaryCard({ category }: CategorySummaryCardProps) {
  const IconComponent =
    ICON_MAP[category.icon] || ICON_MAP[category.icon.toLowerCase()] || Tag;

  const formattedAmount = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(category.totalAmount || 0);

  return (
    <div className="flex items-center justify-between py-3 px-2 hover:bg-grayscale-50 rounded-lg transition-colors">
      <div className="flex items-center gap-3">
        <div
          className="h-10 w-10 shrink-0 rounded-lg flex items-center justify-center"
          style={{
            backgroundColor: `${category.color}20`,
            color: category.color,
          }}
        >
          <IconComponent className="h-4 w-4" />
        </div>
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
