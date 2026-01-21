import { registerEnumType } from "type-graphql";
import { TransactionType } from "@prisma/client";

export { TransactionType };

registerEnumType(TransactionType, {
  name: "TransactionType",
  description: "Type of the transaction (INCOME or EXPENSE)",
});
