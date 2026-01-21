import {
  Arg,
  Ctx,
  FieldResolver,
  Int,
  Mutation,
  Query,
  Resolver,
  Root,
  UseMiddleware,
} from "type-graphql";
import { CategoryModel } from "../models/category.model";
import { CategoryService } from "../services/category.service";
import { IsAuth } from "../middlewares/auth.middleware";
import {
  CreateCategoryInput,
  UpdateCategoryInput,
} from "../dtos/input/category.input";
import { GraphqlContext } from "../graphql/context";
import { prismaClient } from "../../prisma/prisma";

@Resolver(() => CategoryModel)
@UseMiddleware(IsAuth)
export class CategoryResolver {
  private categoryService = new CategoryService();

  @FieldResolver(() => Int)
  async transactionCount(@Root() category: CategoryModel): Promise<number> {
    return prismaClient.transaction.count({
      where: {
        categoryId: category.id,
      },
    });
  }

  @FieldResolver(() => Number)
  async totalAmount(@Root() category: CategoryModel): Promise<number> {
    const aggregate = await prismaClient.transaction.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        categoryId: category.id,
      },
    });
    return aggregate._sum.amount || 0;
  }

  @Mutation(() => CategoryModel)
  async createCategory(
    @Arg("data", () => CreateCategoryInput) data: CreateCategoryInput,
    @Ctx() ctx: GraphqlContext
  ): Promise<CategoryModel> {
    return this.categoryService.createCategory(ctx.user, data);
  }

  @Mutation(() => CategoryModel)
  async updateCategory(
    @Arg("id", () => String) id: string,
    @Arg("data", () => UpdateCategoryInput) data: UpdateCategoryInput,
    @Ctx() ctx: GraphqlContext
  ): Promise<CategoryModel> {
    return this.categoryService.updateCategory(id, ctx.user, data);
  }

  @Mutation(() => Boolean)
  async deleteCategory(
    @Arg("id", () => String) id: string,
    @Ctx() ctx: GraphqlContext
  ): Promise<boolean> {
    return this.categoryService.deleteCategory(id, ctx.user);
  }

  @Query(() => CategoryModel)
  async getCategory(
    @Arg("id", () => String) id: string,
    @Ctx() ctx: GraphqlContext
  ): Promise<CategoryModel> {
    return this.categoryService.findCategory(id, ctx.user);
  }

  @Query(() => [CategoryModel])
  async listCategories(@Ctx() ctx: GraphqlContext): Promise<CategoryModel[]> {
    return this.categoryService.listCategories(ctx.user);
  }

  @Query(() => Number)
  async countCategories(@Ctx() ctx: GraphqlContext): Promise<number> {
    return this.categoryService.countCategories(ctx.user);
  }

  @Query(() => CategoryModel, { nullable: true })
  async mostUsedCategory(
    @Ctx() ctx: GraphqlContext
  ): Promise<CategoryModel | null> {
    return this.categoryService.getMostUsedCategory(ctx.user);
  }
}
