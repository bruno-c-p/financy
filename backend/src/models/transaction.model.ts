import { Field, ID, ObjectType, Float, GraphQLISODateTime } from "type-graphql";
import { UserModel } from "./user.model";
import { CategoryModel } from "./category.model";
import { TransactionType } from "../enums/TransactionType";

@ObjectType()
export class TransactionModel {
  @Field(() => ID)
  id!: string;

  @Field(() => Float)
  amount!: number;

  @Field(() => GraphQLISODateTime)
  date!: Date;

  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => TransactionType)
  type!: TransactionType;

  @Field(() => String, { nullable: true })
  categoryId?: string;

  @Field(() => CategoryModel, { nullable: true })
  category?: CategoryModel;

  @Field(() => String)
  userId!: string;

  @Field(() => UserModel)
  user?: UserModel;

  @Field(() => GraphQLISODateTime)
  createdAt!: Date;

  @Field(() => GraphQLISODateTime)
  updatedAt!: Date;
}
