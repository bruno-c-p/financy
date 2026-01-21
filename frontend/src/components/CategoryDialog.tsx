import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  AVAILABLE_ICONS,
  AVAILABLE_COLORS,
  CATEGORY_LIST,
} from "@/types/category.types";
import { cn } from "@/lib/utils";
import { Category } from "@/types";

interface CategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category?: Category | null;
  onSave: (data: {
    name: string;
    description: string;
    icon: string;
    color: string;
  }) => Promise<void>;
}

export function CategoryDialog({
  open,
  onOpenChange,
  category,
  onSave,
}: CategoryDialogProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedIcon, setSelectedIcon] = useState<string>(
    AVAILABLE_ICONS[0].name,
  );
  const [selectedColor, setSelectedColor] = useState<string>(
    AVAILABLE_COLORS[0],
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (category) {
      setName(category.name);
      setDescription(category.description || "");

      const matchedIcon = AVAILABLE_ICONS.find(
        (i) => i.name.toLowerCase() === category.icon.toLowerCase(),
      );
      setSelectedIcon(matchedIcon ? matchedIcon.name : category.icon);
      setSelectedColor(category.color);
    } else {
      setName("");
      setDescription("");
      setSelectedIcon(AVAILABLE_ICONS[0].name);
      setSelectedColor(AVAILABLE_COLORS[0]);
    }
  }, [category, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !selectedIcon || !selectedColor) return;

    try {
      setLoading(true);
      await onSave({
        name,
        description,
        icon: selectedIcon,
        color: selectedColor,
      });
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to save category", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>
              {category ? "Editar categoria" : "Nova categoria"}
            </DialogTitle>
          </div>
          <DialogDescription>
            Organize suas transações com categorias
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Título</Label>
            <Input
              id="name"
              placeholder="Ex. Alimentação"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Input
              id="description"
              placeholder="Descrição da categoria"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <Label className="text-grayscale-500 mt-2">Opcional</Label>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium mb-2">Ícone</p>
            <div className="grid grid-cols-6 sm:grid-cols-8 gap-2">
              {AVAILABLE_ICONS.map(
                ({ name: iconName, icon: IconComponent, label }) => {
                  const isSelected = selectedIcon === iconName;
                  return (
                    <button
                      key={iconName}
                      type="button"
                      onClick={() => {
                        setSelectedIcon(iconName);
                        const matchingCategory = CATEGORY_LIST.find(
                          (c) => c.icon === IconComponent,
                        );
                        if (matchingCategory) {
                          setSelectedColor(matchingCategory.defaultColor);
                        }
                      }}
                      className={cn(
                        "p-3 rounded-lg border flex items-center justify-center transition-all",
                        isSelected
                          ? "border-brand-base text-grayscale-600 bg-grayscale-100"
                          : "border-grayscale-200 text-grayscale-600 hover:border-grayscale-300 hover:bg-grayscale-50",
                      )}
                      title={label}
                    >
                      <IconComponent className="h-5 w-5" />
                    </button>
                  );
                },
              )}
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium mb-2">Cor</p>
            <div className="flex gap-4">
              {AVAILABLE_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setSelectedColor(color)}
                  className={cn(
                    "w-full h-[30px] rounded-lg transition-all relative ring-1 ring-offset-4 ring-grayscale-300",
                    selectedColor === color
                      ? "ring-brand-base"
                      : "hover:scale-105",
                  )}
                  style={{ backgroundColor: color }}
                  title={color}
                ></button>
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="submit"
              className="w-full bg-emerald-700 hover:bg-emerald-800 text-white"
              disabled={loading}
            >
              {loading ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
