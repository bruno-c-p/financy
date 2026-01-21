import {
  Arg,
  Ctx,
  Int,
  Mutation,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import { TransactionModel } from "../models/transaction.model";
import { TransactionService } from "../services/transaction.service";
import { IsAuth } from "../middlewares/auth.middleware";
import {
  CreateTransactionInput,
  UpdateTransactionInput,
  TransactionFilterInput,
} from "../dtos/input/transaction.input";
import { GraphqlContext } from "../graphql/context";

@Resolver(() => TransactionModel)
@UseMiddleware(IsAuth)
export class TransactionResolver {
  private transactionService = new TransactionService();

  @Mutation(() => TransactionModel)
  async createTransaction(
    @Arg("data", () => CreateTransactionInput) data: CreateTransactionInput,
    @Ctx() ctx: GraphqlContext
  ): Promise<TransactionModel> {
    return this.transactionService.createTransaction(ctx.user, data);
  }

  @Mutation(() => TransactionModel)
  async updateTransaction(
    @Arg("id", () => String) id: string,
    @Arg("data", () => UpdateTransactionInput) data: UpdateTransactionInput,
    @Ctx() ctx: GraphqlContext
  ): Promise<TransactionModel> {
    return this.transactionService.updateTransaction(id, ctx.user, data);
  }

  @Mutation(() => Boolean)
  async deleteTransaction(
    @Arg("id", () => String) id: string,
    @Ctx() ctx: GraphqlContext
  ): Promise<boolean> {
    return this.transactionService.deleteTransaction(id, ctx.user);
  }

  @Query(() => TransactionModel)
  async getTransaction(
    @Arg("id", () => String) id: string,
    @Ctx() ctx: GraphqlContext
  ): Promise<TransactionModel> {
    return this.transactionService.findTransaction(id, ctx.user);
  }

  @Query(() => [TransactionModel])
  async listTransactions(
    @Ctx() ctx: GraphqlContext,
    @Arg("limit", () => Int, { nullable: true }) limit?: number,
    @Arg("offset", () => Int, { nullable: true }) offset?: number,
    @Arg("filter", () => TransactionFilterInput, { nullable: true })
    filter?: TransactionFilterInput
  ): Promise<TransactionModel[]> {
    return this.transactionService.listTransactions(
      ctx.user,
      limit,
      offset,
      filter
    );
  }

  @Query(() => Number)
  async countTransactions(@Ctx() ctx: GraphqlContext): Promise<number> {
    return this.transactionService.countTransactions(ctx.user);
  }
}
