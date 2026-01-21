import { useState, useEffect } from "react";
import { apolloClient } from "@/lib/graphql/apollo";
import { CircleArrowDown, CircleArrowUp } from "lucide-react";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Transaction, TransactionType, Category } from "@/types";
import { LIST_CATEGORIES } from "@/lib/graphql/queries/Categories";
import { cn } from "@/lib/utils";

interface TransactionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transaction?: Transaction | null;
  onSave: (data: {
    description?: string;
    amount: number;
    date: string;
    type: TransactionType;
    categoryId?: string;
  }) => Promise<void>;
}

export function TransactionDialog({
  open,
  onOpenChange,
  transaction,
  onSave,
}: TransactionDialogProps) {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [type, setType] = useState<TransactionType>(TransactionType.EXPENSE);
  const [categoryId, setCategoryId] = useState<string>("none");
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    if (open) {
      apolloClient
        .query<{ listCategories: Category[] }>({
          query: LIST_CATEGORIES,
        })
        .then((result) => {
          setCategories(result.data?.listCategories ?? []);
        })
        .catch((error) => {
          console.error("Error loading categories:", error);
        });
    }
  }, [open]);

  useEffect(() => {
    if (transaction) {
      setDescription(transaction.description || "");
      setAmount(transaction.amount.toString());
      setDate(transaction.date.split("T")[0]);
      setType(transaction.type);
      setCategoryId(transaction.categoryId || "none");
    } else {
      setDescription("");
      setAmount("");
      setDate(new Date().toISOString().split("T")[0]);
      setType(TransactionType.EXPENSE);
      setCategoryId("none");
    }
  }, [transaction, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !date || !type) return;

    try {
      setLoading(true);
      await onSave({
        description: description || undefined,
        amount: parseFloat(amount),
        date: new Date(date).toISOString(),
        type,
        categoryId: categoryId === "none" ? undefined : categoryId,
      });
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to save transaction", error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrencyInput = (value: string) => {
    // Remove non-numeric characters except decimal point
    const numericValue = value.replace(/[^\d.]/g, "");
    return numericValue;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {transaction ? "Editar transação" : "Nova transação"}
          </DialogTitle>
          <DialogDescription>Registre sua despesa ou receita</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          {/* Type Selector Buttons */}
          <div className="grid grid-cols-2 gap-3 border p-2 rounded-xl border-grayscale-200">
            <button
              type="button"
              onClick={() => setType(TransactionType.EXPENSE)}
              className={cn(
                "flex items-center justify-center gap-2 py-3 px-4 rounded-xl border transition-all font-medium",
                type === TransactionType.EXPENSE
                  ? "border-red-500 bg-grayscale-100 text-grayscale-800"
                  : "border-grayscale-200 bg-white text-grayscale-600 hover:border-grayscale-300",
              )}
            >
              <CircleArrowDown className="h-5 w-5 text-red-base" />
              Despesa
            </button>
            <button
              type="button"
              onClick={() => setType(TransactionType.INCOME)}
              className={cn(
                "flex items-center justify-center gap-2 py-3 px-4 rounded-xl border transition-all font-medium",
                type === TransactionType.INCOME
                  ? "border-brand-base bg-grayscale-100 text-grayscale-800"
                  : "border-grayscale-200 bg-white text-grayscale-600 hover:border-grayscale-300",
              )}
            >
              <CircleArrowUp className="h-5 w-5 text-brand-base" />
              Receita
            </button>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Input
              id="description"
              placeholder="Ex. Almoço no restaurante"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="text-base"
            />
          </div>

          {/* Date and Amount - Side by Side */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Data</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="text-base"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Valor</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-grayscale-600 font-medium">
                  R$
                </span>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  placeholder="0,00"
                  value={amount}
                  onChange={(e) =>
                    setAmount(formatCurrencyInput(e.target.value))
                  }
                  required
                  className="pl-12 text-base"
                />
              </div>
            </div>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category">Categoria</Label>
            <Select value={categoryId} onValueChange={setCategoryId}>
              <SelectTrigger className="text-base">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Nenhuma</SelectItem>
                {categories.map((category: Category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button
              type="submit"
              className="w-full bg-emerald-700 hover:bg-emerald-800 text-white py-6 text-base font-semibold"
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
