import { Field, InputType, Float, GraphQLISODateTime } from "type-graphql";
import { TransactionType } from "../../enums/TransactionType";

@InputType()
export class CreateTransactionInput {
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
}

@InputType()
export class UpdateTransactionInput {
  @Field(() => Float, { nullable: true })
  amount?: number;

  @Field(() => GraphQLISODateTime, { nullable: true })
  date?: Date;

  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => TransactionType, { nullable: true })
  type?: TransactionType;

  @Field(() => String, { nullable: true })
  categoryId?: string;
}

@InputType()
export class TransactionFilterInput {
  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => TransactionType, { nullable: true })
  type?: TransactionType;

  @Field(() => String, { nullable: true })
  categoryId?: string;

  @Field(() => GraphQLISODateTime, { nullable: true })
  startDate?: Date;

  @Field(() => GraphQLISODateTime, { nullable: true })
  endDate?: Date;
}
