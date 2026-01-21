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
    <Card className="border-grayscale-200">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div
              className="h-9 w-9 rounded-md flex items-center justify-center text-white text-sm font-medium"
              style={{ backgroundColor: category.color }}
              title={category.name}
            >
              {(() => {
                const IconComponent =
                  ICON_MAP[category.icon] ||
                  ICON_MAP[category.icon.toLowerCase()] ||
                  Tag;
                return <IconComponent className="h-5 w-5" />;
              })()}
            </div>
            <div>
              <h3 className="text-base font-semibold text-grayscale-900">
                {category.name}
              </h3>
              {category.description && (
                <p className="text-sm text-grayscale-500">
                  {category.description}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              className="h-9 w-9 p-0 hover:bg-grayscale-100"
              title="Editar"
              onClick={() => onEdit?.(category)}
            >
              <Pencil className="h-4 w-4 text-grayscale-600" />
            </Button>
            <Button
              variant="ghost"
              className="h-9 w-9 p-0 hover:bg-grayscale-100"
              title="Excluir"
              onClick={() => onDelete?.(category)}
            >
              <Trash2 className="h-4 w-4 text-grayscale-600" />
            </Button>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <span
            className="text-xs font-medium px-2 py-1 rounded-full"
            style={{
              backgroundColor: `${category.color}22`,
              color: category.color,
            }}
          >
            {category.name}
          </span>
          <span className="text-xs text-grayscale-500">
            {category.transactionCount ?? 0} itens
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
