import { prismaClient } from "../../prisma/prisma";
import { TransactionType } from "../enums/TransactionType";

export class DashboardService {
  async getDashboardStats(userId: string) {
    const incomeAgg = await prismaClient.transaction.aggregate({
      _sum: { amount: true },
      where: { userId, type: TransactionType.INCOME },
    });

    const expenseAgg = await prismaClient.transaction.aggregate({
      _sum: { amount: true },
      where: { userId, type: TransactionType.EXPENSE },
    });

    const totalIncome = incomeAgg._sum.amount || 0;
    const totalExpense = expenseAgg._sum.amount || 0;
    const totalBalance = totalIncome - totalExpense;

    return {
      totalBalance,
      totalIncome,
      totalExpense,
    };
  }

  async getMonthlyStats(userId: string) {
    const now = new Date();
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(now.getFullYear() - 1);

    const transactions = await prismaClient.transaction.findMany({
      where: {
        userId,
        date: {
          gte: oneYearAgo,
        },
      },
      select: {
        amount: true,
        type: true,
        date: true,
      },
    });

    const statsMap = new Map<string, { income: number; expense: number }>();

    transactions.forEach((t) => {
      const date = new Date(t.date);
      const monthKey = date.toISOString().slice(0, 7);

      if (!statsMap.has(monthKey)) {
        statsMap.set(monthKey, { income: 0, expense: 0 });
      }

      const entry = statsMap.get(monthKey)!;
      if (t.type === TransactionType.INCOME) {
        entry.income += t.amount;
      } else {
        entry.expense += t.amount;
      }
    });

    const result = Array.from(statsMap.entries())
      .map(([month, data]) => ({
        month,
        totalIncome: data.income,
        totalExpense: data.expense,
      }))
      .sort((a, b) => a.month.localeCompare(b.month));

    return result;
  }
}
