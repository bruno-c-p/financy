import { Page } from "@/components/Page";
import { FinancialCards } from "@/components/FinancialCards";
import { RecentTransactionCard } from "@/components/RecentTransactionCard";
import { CategorySummaryCard } from "@/components/CategorySummaryCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useDashboardData } from "@/hooks/useDashboardData";
import { apolloClient } from "@/lib/graphql/apollo";
import { CREATE_TRANSACTION } from "@/lib/graphql/mutations/TransactionMutations";
import { Plus } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { TransactionDialog } from "@/components/TransactionDialog";
import { TransactionType } from "@/types";
import { toast } from "sonner";

export function DashboardPage() {
  const navigate = useNavigate();
  const [isTransactionDialogOpen, setIsTransactionDialogOpen] = useState(false);

  const {
    dashboardStats,
    monthlyIncome,
    monthlyExpense,
    recentTransactions,
    topCategories,
    loading,
    refetch,
  } = useDashboardData();

  const handleSaveTransaction = async (data: {
    description?: string;
    amount: number;
    date: string;
    type: TransactionType;
    categoryId?: string;
  }) => {
    try {
      await apolloClient.mutate({
        mutation: CREATE_TRANSACTION,
        variables: { data },
      });
      toast.success("Transação criada com sucesso!");
      refetch();
    } catch (error) {
      toast.error("Erro ao salvar transação");
      console.error(error);
      throw error;
    }
  };

  if (loading) {
    return (
      <Page>
        <div className="flex items-center justify-center h-96">
          <p className="text-grayscale-500">Carregando...</p>
        </div>
      </Page>
    );
  }

  return (
    <Page>
      <div className="space-y-6 container">
        <FinancialCards
          totalAmount={dashboardStats?.totalBalance || 0}
          monthlyIncome={monthlyIncome}
          monthlyExpense={monthlyExpense}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="border-grayscale-200 lg:col-span-2">
            <CardHeader className="pb-3 border-b border-grayscale-200">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xs tracking-wider text-grayscale-500 uppercase font-normal">
                  Transações Recentes
                </CardTitle>
                <Link
                  to="/transactions"
                  className="text-sm text-brand-base hover:text-brand-dark font-medium flex items-center gap-1"
                >
                  Ver todas
                  <span className="text-lg">›</span>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="py-0 px-0">
              {recentTransactions.length === 0 ? (
                <p className="text-center text-grayscale-500 py-8">
                  Nenhuma transação encontrada
                </p>
              ) : (
                recentTransactions.map((transaction) => (
                  <RecentTransactionCard
                    key={transaction.id}
                    transaction={transaction}
                    onClick={() => navigate("/transactions")}
                  />
                ))
              )}

              <Button
                variant="ghost"
                className="w-full hover:border-brand-base hover:bg-brand-light text-brand-base hover:text-brand-dark transition-colors h-[60px]"
                onClick={() => setIsTransactionDialogOpen(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Nova transação
              </Button>
            </CardContent>
          </Card>

          <Card className="border-grayscale-200">
            <CardHeader className="pb-3 border-b border-grayscale-200">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xs tracking-wider text-grayscale-500 uppercase font-normal">
                  Categorias
                </CardTitle>
                <Link
                  to="/categories"
                  className="text-sm text-brand-base hover:text-brand-dark font-medium flex items-center gap-1"
                >
                  Gerenciar
                  <span className="text-lg">›</span>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="space-y-1 p-6">
              {topCategories.length === 0 ? (
                <p className="text-center text-grayscale-500 py-8">
                  Nenhuma categoria encontrada
                </p>
              ) : (
                topCategories.map((category) => (
                  <CategorySummaryCard key={category.id} category={category} />
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <TransactionDialog
        open={isTransactionDialogOpen}
        onOpenChange={setIsTransactionDialogOpen}
        onSave={handleSaveTransaction}
      />
    </Page>
  );
}
