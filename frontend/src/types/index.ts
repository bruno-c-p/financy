export interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

export interface UpdateUserInput {
  name?: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  icon: string;
  color: string;
  transactionCount?: number;
  totalAmount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export enum TransactionType {
  INCOME = "INCOME",
  EXPENSE = "EXPENSE",
}

export interface Transaction {
  id: string;
  description?: string;
  amount: number;
  date: string;
  type: TransactionType;
  categoryId?: string;
  category?: Category;
  userId: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateTransactionInput {
  description?: string;
  amount: number;
  date: string;
  type: TransactionType;
  categoryId?: string;
}

export interface UpdateTransactionInput {
  description?: string;
  amount?: number;
  date?: string;
  type?: TransactionType;
  categoryId?: string;
}

export interface TransactionFilterInput {
  description?: string;
  type?: TransactionType;
  categoryId?: string;
  startDate?: string;
  endDate?: string;
}

export interface DashboardStats {
  totalBalance: number;
  totalIncome: number;
  totalExpense: number;
}
