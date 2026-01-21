import { useState } from "react";
import { apolloClient } from "@/lib/graphql/apollo";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  CircleArrowUp,
  CircleArrowDown,
} from "lucide-react";
import { Page } from "@/components/Page";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Pagination } from "@/components/Pagination";
import { TransactionDialog } from "@/components/TransactionDialog";
import {
  Transaction,
  TransactionType,
  Category,
  TransactionFilterInput,
} from "@/types";
import { useTransactionsData } from "@/hooks/useTransactionsData";
import {
  CREATE_TRANSACTION,
  UPDATE_TRANSACTION,
  DELETE_TRANSACTION,
} from "@/lib/graphql/mutations/TransactionMutations";
import { toast } from "sonner";
import { ICON_MAP } from "@/types/category.types";
import { Tag } from "lucide-react";

const ITEMS_PER_PAGE = 10;

const MONTHS = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

export function TransactionsPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [selectedMonth, setSelectedMonth] = useState<number>(
    new Date().getMonth(),
  );
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear(),
  );

  // Build filter object
  const filter: TransactionFilterInput = {};
  if (searchQuery) {
    filter.description = searchQuery;
  }
  if (typeFilter !== "all") {
    filter.type = typeFilter as TransactionType;
  }
  if (categoryFilter !== "all") {
    filter.categoryId = categoryFilter;
  }
  const startDate = new Date(selectedYear, selectedMonth, 1);
  const endDate = new Date(selectedYear, selectedMonth + 1, 0, 23, 59, 59);
  filter.startDate = startDate.toISOString();
  filter.endDate = endDate.toISOString();

  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  const {
    data: { transactions, categories },
    loading: loadingTransactions,
    refetch,
  } = useTransactionsData(filter, ITEMS_PER_PAGE, offset);

  const handleCreateTransaction = () => {
    setSelectedTransaction(null);
    setDialogOpen(true);
  };

  const handleEditTransaction = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setDialogOpen(true);
  };

  const handleDeleteTransaction = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir esta transação?")) return;

    try {
      await apolloClient.mutate({
        mutation: DELETE_TRANSACTION,
        variables: { id },
      });
      toast.success("Transação excluída com sucesso!");
      refetch();
    } catch (error) {
      toast.error("Erro ao excluir transação");
      console.error(error);
    }
  };

  const handleSaveTransaction = async (data: {
    description?: string;
    amount: number;
    date: string;
    type: TransactionType;
    categoryId?: string;
  }) => {
    try {
      if (selectedTransaction) {
        await apolloClient.mutate({
          mutation: UPDATE_TRANSACTION,
          variables: {
            id: selectedTransaction.id,
            data,
          },
        });
        toast.success("Transação atualizada com sucesso!");
      } else {
        await apolloClient.mutate({
          mutation: CREATE_TRANSACTION,
          variables: { data },
        });
        toast.success("Transação criada com sucesso!");
      }
      refetch();
    } catch (error) {
      toast.error("Erro ao salvar transação");
      console.error(error);
      throw error;
    }
  };

  const totalItems = transactions.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    });
  };

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);

  return (
    <Page>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-grayscale-900">
              Transações
            </h1>
            <p className="text-sm text-grayscale-600 mt-1">
              Gerencie todas as suas transações financeiras
            </p>
          </div>
          <Button
            onClick={handleCreateTransaction}
            className="bg-emerald-700 hover:bg-emerald-800 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nova transação
          </Button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-grayscale-700">
              Buscar
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-grayscale-400" />
              <Input
                placeholder="Buscar por descrição"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-grayscale-700">
              Tipo
            </label>
            <Select
              value={typeFilter}
              onValueChange={(value) => {
                setTypeFilter(value);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value={TransactionType.INCOME}>Entrada</SelectItem>
                <SelectItem value={TransactionType.EXPENSE}>Saída</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-grayscale-700">
              Categoria
            </label>
            <Select
              value={categoryFilter}
              onValueChange={(value) => {
                setCategoryFilter(value);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Todas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                {categories.map((category: Category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-grayscale-700">
              Período
            </label>
            <div className="flex gap-2">
              <Select
                value={selectedMonth.toString()}
                onValueChange={(value) => {
                  setSelectedMonth(parseInt(value));
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="flex-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MONTHS.map((month, index) => (
                    <SelectItem key={index} value={index.toString()}>
                      {month}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={selectedYear.toString()}
                onValueChange={(value) => {
                  setSelectedYear(parseInt(value));
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {yearOptions.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg border border-grayscale-200">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-grayscale-200">
                  <th className="text-left py-3 px-4 text-xs font-medium text-grayscale-500 uppercase tracking-wider">
                    Descrição
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-grayscale-500 uppercase tracking-wider">
                    Data
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-grayscale-500 uppercase tracking-wider">
                    Categoria
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-grayscale-500 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="text-right py-3 px-4 text-xs font-medium text-grayscale-500 uppercase tracking-wider">
                    Valor
                  </th>
                  <th className="text-center py-3 px-4 text-xs font-medium text-grayscale-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody>
                {loadingTransactions ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="text-center py-8 text-grayscale-500"
                    >
                      Carregando...
                    </td>
                  </tr>
                ) : transactions.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="text-center py-8 text-grayscale-500"
                    >
                      Nenhuma transação encontrada
                    </td>
                  </tr>
                ) : (
                  transactions.map((transaction: Transaction) => {
                    const IconComponent = transaction.category
                      ? ICON_MAP[transaction.category.icon] ||
                        ICON_MAP[transaction.category.icon.toLowerCase()] ||
                        Tag
                      : Tag;

                    return (
                      <tr
                        key={transaction.id}
                        className="border-b border-grayscale-100 hover:bg-grayscale-50 transition-colors"
                      >
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            {transaction.category && (
                              <div
                                className="h-10 w-10 shrink-0 rounded-lg flex items-center justify-center"
                                style={{
                                  backgroundColor: `${transaction.category.color}20`,
                                  color: transaction.category.color,
                                }}
                              >
                                <IconComponent className="h-4 w-4" />
                              </div>
                            )}
                            <span className="font-medium text-grayscale-800">
                              {transaction.description || "Sem descrição"}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-sm text-grayscale-600">
                          {formatDate(transaction.date)}
                        </td>
                        <td className="py-4 px-4">
                          {transaction.category ? (
                            <span
                              className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium"
                              style={{
                                backgroundColor: `${transaction.category.color}18`,
                                color: transaction.category.color,
                              }}
                            >
                              {transaction.category.name}
                            </span>
                          ) : (
                            <span className="text-sm text-grayscale-400">
                              -
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-4">
                          <span
                            className={`inline-flex items-center gap-1 text-sm font-medium ${
                              transaction.type === TransactionType.INCOME
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {transaction.type === TransactionType.INCOME ? (
                              <>
                                <CircleArrowUp className="h-4 w-4" />
                                Entrada
                              </>
                            ) : (
                              <>
                                <CircleArrowDown className="h-4 w-4" />
                                Saída
                              </>
                            )}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-right font-semibold text-sm text-grayscale-800">
                          {transaction.type === TransactionType.INCOME
                            ? "+"
                            : "-"}{" "}
                          {formatCurrency(transaction.amount)}
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center justify-center gap-2">
                            <Button
                              variant="ghost"
                              className="h-8 w-8 p-0 rounded-xl border border-grayscale-300 hover:bg-grayscale-200 transition-colors"
                              title="Excluir"
                              onClick={() =>
                                handleDeleteTransaction(transaction.id)
                              }
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                            <Button
                              variant="ghost"
                              className="h-8 w-8 p-0 rounded-xl border border-grayscale-300 hover:bg-grayscale-200 transition-colors"
                              title="Editar"
                              onClick={() => handleEditTransaction(transaction)}
                            >
                              <Pencil className="h-4 w-4 text-grayscale-700" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalItems > 0 && (
            <div className="px-4 py-3 border-t border-grayscale-200">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalItems}
                itemsPerPage={ITEMS_PER_PAGE}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </div>
      </div>

      <TransactionDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        transaction={selectedTransaction}
        onSave={handleSaveTransaction}
      />
    </Page>
  );
}
