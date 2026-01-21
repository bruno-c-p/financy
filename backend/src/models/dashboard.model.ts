import { Field, ObjectType, Float } from "type-graphql";

@ObjectType()
export class DashboardStats {
  @Field(() => Float)
  totalBalance!: number;

  @Field(() => Float)
  totalIncome!: number;

  @Field(() => Float)
  totalExpense!: number;
}

@ObjectType()
export class MonthlyStat {
  @Field(() => String)
  month!: string;

  @Field(() => Float)
  totalIncome!: number;

  @Field(() => Float)
  totalExpense!: number;
}
