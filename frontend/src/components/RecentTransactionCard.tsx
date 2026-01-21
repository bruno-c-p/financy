import { Transaction, TransactionType } from "@/types";
import { ICON_MAP } from "@/types/category.types";
import { Tag, ArrowUpCircle, ArrowDownCircle } from "lucide-react";

interface RecentTransactionCardProps {
  transaction: Transaction;
  onClick?: () => void;
}

export function RecentTransactionCard({
  transaction,
  onClick,
}: RecentTransactionCardProps) {
  const IconComponent = transaction.category
    ? ICON_MAP[transaction.category.icon] ||
      ICON_MAP[transaction.category.icon.toLowerCase()] ||
      Tag
    : transaction.type === TransactionType.INCOME
      ? ArrowUpCircle
      : ArrowDownCircle;

  const date = new Date(transaction.date);
  const formattedDate = `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}/${String(date.getFullYear()).slice(-2)}`;

  const formattedAmount = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(transaction.amount);

  const isIncome = transaction.type === TransactionType.INCOME;

  return (
    <div
      className="flex items-center gap-4 py-3 cursor-pointer hover:bg-grayscale-50 px-2 rounded-lg transition-colors"
      onClick={onClick}
    >
      <div
        className="h-10 w-10 shrink-0 rounded-lg flex items-center justify-center"
        style={{
          backgroundColor: transaction.category
            ? `${transaction.category.color}20`
            : isIncome
              ? "#22c55e20"
              : "#ef444420",
          color: transaction.category
            ? transaction.category.color
            : isIncome
              ? "#22c55e"
              : "#ef4444",
        }}
      >
        <IconComponent className="h-4 w-4" />
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-medium text-grayscale-900 truncate">
          {transaction.description || "Transação sem descrição"}
        </p>
        <p className="text-xs text-grayscale-500">{formattedDate}</p>
      </div>

      {transaction.category && (
        <span
          className="text-xs font-medium px-3 py-1 rounded-full whitespace-nowrap"
          style={{
            backgroundColor: `${transaction.category.color}18`,
            color: transaction.category.color,
          }}
        >
          {transaction.category.name}
        </span>
      )}

      <div className="flex items-center gap-1">
        <span
          className={`font-semibold whitespace-nowrap ${
            isIncome ? "text-green-600" : "text-red-600"
          }`}
        >
          {isIncome ? "+" : "-"} {formattedAmount}
        </span>
      </div>
    </div>
  );
}
