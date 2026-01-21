import { Pencil, Trash2, Tag } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Category } from "@/types";
import { ICON_MAP } from "@/types/category.types";

interface CategoryCardProps {
  category: Category;
  onEdit?: (category: Category) => void;
  onDelete?: (category: Category) => void;
}

export function CategoryCard({
  category,
  onEdit,
  onDelete,
}: CategoryCardProps) {
  return (
    <Card className="border-grayscale-200 h-full">
      <CardContent className="p-6 flex flex-col h-full">
        <div className="flex items-start justify-between mb-6">
          <div
            className="h-10 w-10 shrink-0 rounded-lg flex items-center justify-center"
            style={{
              backgroundColor: `${category.color}20`,
              color: category.color,
            }}
            title={category.name}
          >
            {(() => {
              const IconComponent =
                ICON_MAP[category.icon] ||
                ICON_MAP[category.icon.toLowerCase()] ||
                Tag;
              return <IconComponent className="h-4 w-4" />;
            })()}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              className="h-10 w-10 p-0 rounded-xl border border-grayscale-300 hover:bg-grayscale-200 transition-colors"
              title="Excluir"
              onClick={() => onDelete?.(category)}
            >
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
            <Button
              variant="ghost"
              className="h-10 w-10 p-0 rounded-xl border border-grayscale-300 hover:bg-grayscale-200 transition-colors"
              title="Editar"
              onClick={() => onEdit?.(category)}
            >
              <Pencil className="h-4 w-4 text-grayscale-700" />
            </Button>
          </div>
        </div>

        <div className="mb-6 flex-grow">
          <h3 className="font-semibold text-grayscale-800 mb-1">
            {category.name}
          </h3>
          <p className="text-sm text-grayscale-600 leading-relaxed">
            {category.description || "Restaurantes, delivery e refeições"}
          </p>
        </div>

        <div className="flex items-center justify-between mt-auto">
          <span
            className="text-sm font-medium px-3 py-1 rounded-full"
            style={{
              backgroundColor: `${category.color}18`,
              color: category.color,
            }}
          >
            {category.name}
          </span>
          <span className="text-sm text-grayscale-600">
            {category.transactionCount ?? 0} itens
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
