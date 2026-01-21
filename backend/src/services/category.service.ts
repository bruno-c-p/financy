import { prismaClient } from "../../prisma/prisma";
import {
  CreateCategoryInput,
  UpdateCategoryInput,
} from "../dtos/input/category.input";

export class CategoryService {
  async createCategory(userId: string, data: CreateCategoryInput) {
    return prismaClient.category.create({
      data: {
        ...data,
        userId,
      },
      include: { user: true },
    });
  }

  async listCategories(userId: string) {
    return prismaClient.category.findMany({
      where: { userId },
      include: { user: true },
    });
  }

  async findCategory(id: string, userId: string) {
    const category = await prismaClient.category.findFirst({
      where: { id, userId },
      include: { user: true },
    });
    if (!category) throw new Error("Category not found or access denied");
    return category;
  }

  async updateCategory(id: string, userId: string, data: UpdateCategoryInput) {
    await this.findCategory(id, userId);

    return prismaClient.category.update({
      where: { id },
      data,
      include: { user: true },
    });
  }

  async deleteCategory(id: string, userId: string) {
    await this.findCategory(id, userId);

    await prismaClient.category.delete({ where: { id } });
    return true;
  }

  async countCategories(userId: string) {
    return prismaClient.category.count({
      where: { userId },
    });
  }

  async getMostUsedCategory(userId: string) {
    const grouped = await prismaClient.transaction.groupBy({
      by: ["categoryId"],
      where: { userId, categoryId: { not: null } },
      _count: {
        categoryId: true,
      },
      orderBy: {
        _count: {
          categoryId: "desc",
        },
      },
      take: 1,
    });

    if (grouped.length === 0 || !grouped[0].categoryId) {
      return null;
    }

    return prismaClient.category.findUnique({
      where: { id: grouped[0].categoryId },
      include: { user: true },
    });
  }
}
