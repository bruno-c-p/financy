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
