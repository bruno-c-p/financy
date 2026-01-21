import { Prisma } from "@prisma/client";
import { prismaClient } from "../../prisma/prisma";
import {
  CreateTransactionInput,
  UpdateTransactionInput,
  TransactionFilterInput,
} from "../dtos/input/transaction.input";

export class TransactionService {
  async createTransaction(userId: string, data: CreateTransactionInput) {
    if (data.categoryId) {
      const category = await prismaClient.category.findFirst({
        where: { id: data.categoryId, userId },
      });
      if (!category) throw new Error("Category not found or access denied");
    }

    return prismaClient.transaction.create({
      data: {
        ...data,
        userId,
      },
      include: {
        user: true,
        category: true,
      },
    });
  }

  async listTransactions(
    userId: string,
    limit?: number,
    offset?: number,
    filter?: TransactionFilterInput,
  ) {
    const where: Prisma.TransactionWhereInput = { userId };

    if (filter) {
      if (filter.description) {
        where.description = { contains: filter.description };
      }
      if (filter.type) {
        where.type = filter.type;
      }
      if (filter.categoryId) {
        where.categoryId = filter.categoryId;
      }
      if (filter.startDate || filter.endDate) {
        where.date = {};
        if (filter.startDate) where.date.gte = filter.startDate;
        if (filter.endDate) where.date.lte = filter.endDate;
      }
    }

    return prismaClient.transaction.findMany({
      where,
      take: limit,
      skip: offset,
      orderBy: { date: "desc" },
      include: {
        user: true,
        category: true,
      },
    });
  }

  async findTransaction(id: string, userId: string) {
    const transaction = await prismaClient.transaction.findFirst({
      where: { id, userId },
      include: {
        user: true,
        category: true,
      },
    });
    if (!transaction) throw new Error("Transaction not found or access denied");
    return transaction;
  }

  async updateTransaction(
    id: string,
    userId: string,
    data: UpdateTransactionInput,
  ) {
    await this.findTransaction(id, userId);

    if (data.categoryId) {
      const category = await prismaClient.category.findFirst({
        where: { id: data.categoryId, userId },
      });
      if (!category) throw new Error("Category not found or access denied");
    }

    return prismaClient.transaction.update({
      where: { id },
      data: {
        amount: data.amount ?? undefined,
        date: data.date ?? undefined,
        description: data.description ?? undefined,
        type: data.type ?? undefined,
        categoryId: data.categoryId ?? undefined,
      },
      include: {
        user: true,
        category: true,
      },
    });
  }

  async deleteTransaction(id: string, userId: string) {
    await this.findTransaction(id, userId);

    await prismaClient.transaction.delete({ where: { id } });
    return true;
  }

  async countTransactions(userId: string) {
    return prismaClient.transaction.count({
      where: { userId },
    });
  }
}
