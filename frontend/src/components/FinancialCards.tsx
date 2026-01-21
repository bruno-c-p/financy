import { TrendingDown, TrendingUp, Wallet } from "lucide-react";

interface FinancialCardsProps {
  totalAmount: number;
  monthlyIncome: number;
  monthlyExpense: number;
}

export function FinancialCards({
  totalAmount,
  monthlyIncome,
  monthlyExpense,
}: FinancialCardsProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 border border-grayscale-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded">
              <Wallet className="text-purple-600" size={20} />
            </div>
            <span className="text-gray-600 text-sm font-medium">
              SALDO TOTAL
            </span>
          </div>
          <div className="text-3xl font-bold text-gray-900">
            {formatCurrency(totalAmount)}
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-grayscale-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded">
              <TrendingUp className="text-green-600" size={20} />
            </div>
            <span className="text-gray-600 text-sm font-medium">
              RECEITAS DO MÊS
            </span>
          </div>
          <div className="text-3xl font-bold text-gray-900">
            {formatCurrency(monthlyIncome)}
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-grayscale-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded">
              <TrendingDown className="text-red-600" size={20} />
            </div>
            <span className="text-gray-600 text-sm font-medium">
              DESPESAS DO MÊS
            </span>
          </div>
          <div className="text-3xl font-bold text-gray-900">
            {formatCurrency(monthlyExpense)}
          </div>
        </div>
      </div>
    </div>
  );
}
