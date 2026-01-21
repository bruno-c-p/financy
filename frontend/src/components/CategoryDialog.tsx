import { useState, useEffect } from "react";
import { Check } from "lucide-react";
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
import { AVAILABLE_ICONS, AVAILABLE_COLORS } from "@/types/category.types";
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
      // Try to find the icon name, otherwise default
      // This handles case-insensitive matching or full string matches
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
          </div>

          <div className="space-y-2">
            <Label>Opcional</Label>
            <p className="text-sm font-medium mb-2">Ícone</p>
            <div className="grid grid-cols-6 sm:grid-cols-8 gap-2">
              {AVAILABLE_ICONS.map(
                ({ name: iconName, icon: IconComponent }) => (
                  <button
                    key={iconName}
                    type="button"
                    onClick={() => setSelectedIcon(iconName)}
                    className={cn(
                      "p-2 rounded-md border flex items-center justify-center transition-all hover:bg-muted",
                      selectedIcon === iconName
                        ? "border-emerald-600 bg-emerald-50 text-emerald-600 ring-1 ring-emerald-600"
                        : "border-gray-200 text-gray-500",
                    )}
                    title={iconName}
                  >
                    <IconComponent className="h-5 w-5" />
                  </button>
                ),
              )}
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium mb-2">Cor</p>
            <div className="flex flex-wrap gap-2">
              {AVAILABLE_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setSelectedColor(color)}
                  className={cn(
                    "w-8 h-8 rounded-md transition-all relative",
                    selectedColor === color
                      ? "ring-2 ring-offset-2 ring-gray-400"
                      : "hover:scale-110",
                  )}
                  style={{ backgroundColor: color }}
                  title={color}
                >
                  {selectedColor === color && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Check className="h-4 w-4 text-white" />
                    </div>
                  )}
                </button>
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
