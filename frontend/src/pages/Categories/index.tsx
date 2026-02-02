import { useState } from "react";
import { Tag, ArrowUpDown } from "lucide-react";
import { useCategoriesData } from "@/hooks/useCategoriesData";
import { Button } from "@/components/ui/button";
import { FinancialCards } from "@/components/FinancialCards";
import { CategoryCard } from "@/components/CategoryCard";
import { CategoryDialog } from "@/components/CategoryDialog";
import { ICON_MAP } from "@/types/category.types";
import { Category } from "@/types";
import { apolloClient } from "@/lib/graphql/apollo";
import {
  CREATE_CATEGORY,
  UPDATE_CATEGORY,
  DELETE_CATEGORY,
} from "@/lib/graphql/mutations/CategoryMutations";
import { toast } from "sonner";

export function CategoriesPage() {
  const {
    data: { categories, totalCategories, totalTransactions, mostUsedCategory },
    loading: loadingCategories,
    refetch,
  } = useCategoriesData();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const getMostUsedIcon = () => {
    if (!mostUsedCategory?.icon) {
      return Tag;
    }
    return (
      ICON_MAP[mostUsedCategory.icon] ||
      ICON_MAP[mostUsedCategory.icon.toLowerCase()] ||
      Tag
    );
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setDialogOpen(true);
  };

  const handleDelete = async (category: Category) => {
    if (
      confirm(`Tem certeza que deseja excluir a categoria "${category.name}"?`)
    ) {
      try {
        await apolloClient.mutate({
          mutation: DELETE_CATEGORY,
          variables: { id: category.id },
        });
        toast.success("Categoria excluída com sucesso!");
        refetch();
      } catch (error) {
        toast.error("Erro ao excluir categoria");
        console.error(error);
      }
    }
  };

  const handleSave = async (data: {
    name: string;
    description: string;
    icon: string;
    color: string;
  }) => {
    try {
      if (editingCategory) {
        await apolloClient.mutate({
          mutation: UPDATE_CATEGORY,
          variables: {
            id: editingCategory.id,
            data,
          },
        });
        toast.success("Categoria atualizada com sucesso!");
      } else {
        await apolloClient.mutate({
          mutation: CREATE_CATEGORY,
          variables: {
            data,
          },
        });
        toast.success("Categoria criada com sucesso!");
      }
      refetch();
    } catch (error) {
      toast.error("Erro ao salvar categoria");
      console.error(error);
      throw error;
    }
  };

  const handleNewCategory = () => {
    setEditingCategory(null);
    setDialogOpen(true);
  };

  return (
    <div className="container">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-grayscale-800">Categorias</h1>
          <p className="text-grayscale-600">
            Organize suas transações por categorias
          </p>
        </div>
        <Button
          onClick={handleNewCategory}
          className="bg-brand-base hover:bg-brand-dark text-neutral-white"
        >
          <span className="text-grayscale-100">+</span>{" "}
          <span className="text-sm font-medium">Nova categoria</span>
        </Button>
      </div>

      <div className="mb-8">
        <FinancialCards
          cards={[
            {
              icon: Tag,
              value: totalCategories,
              label: "Total de categorias",
            },
            {
              icon: ArrowUpDown,
              iconColor: "text-purple-base",
              value: totalTransactions,
              label: "Total de transações",
            },
            {
              icon: getMostUsedIcon(),
              value: mostUsedCategory?.name || "Nenhuma",
              label: "Categoria mais utilizada",
              iconBackgroundColor: mostUsedCategory?.color
                ? `${mostUsedCategory.color}20`
                : undefined,
              customIconColor: mostUsedCategory?.color,
            },
          ]}
        />
      </div>

      <div
        className="grid gap-4"
        style={{ gridTemplateColumns: "repeat(auto-fit, minmax(284px, 1fr))" }}
      >
        {loadingCategories && categories.length === 0 ? (
          <p className="text-sm text-grayscale-500">Carregando categorias...</p>
        ) : categories.length === 0 ? (
          <p className="text-sm text-grayscale-500">
            Nenhuma categoria cadastrada
          </p>
        ) : (
          categories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>

      <CategoryDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        category={editingCategory}
        onSave={handleSave}
      />
    </div>
  );
}
