import {
  Briefcase,
  Car,
  HeartPulse,
  PiggyBank,
  ShoppingCart,
  Ticket,
  ShoppingBasket,
  Utensils,
  PawPrint,
  Home,
  Gift,
  Dumbbell,
  BookOpen,
  Luggage,
  Wallet,
  Receipt,
  LucideIcon,
} from "lucide-react";

export const AVAILABLE_COLORS = [
  "#2f9e44",
  "#3b5bdb",
  "#8e3deb",
  "#c9366e",
  "#cc3629",
  "#e0621d",
  "#d99006",
] as const;

export type CategoryColor = (typeof AVAILABLE_COLORS)[number];

export type CategoryId =
  | "work"
  | "transport"
  | "health"
  | "savings"
  | "shopping"
  | "entertainment"
  | "groceries"
  | "dining"
  | "pets"
  | "housing"
  | "gifts"
  | "fitness"
  | "education"
  | "travel"
  | "misc"
  | "bills";

export interface CategoryConfig {
  id: CategoryId;
  label: string;
  icon: LucideIcon;
  defaultColor: CategoryColor;
}

export const CATEGORY_MAP: Record<CategoryId, CategoryConfig> = {
  work: {
    id: "work",
    label: "Work",
    icon: Briefcase,
    defaultColor: AVAILABLE_COLORS[0],
  },
  transport: {
    id: "transport",
    label: "Transport",
    icon: Car,
    defaultColor: AVAILABLE_COLORS[1],
  },
  health: {
    id: "health",
    label: "Health",
    icon: HeartPulse,
    defaultColor: AVAILABLE_COLORS[4],
  },
  savings: {
    id: "savings",
    label: "Savings",
    icon: PiggyBank,
    defaultColor: AVAILABLE_COLORS[3],
  },
  shopping: {
    id: "shopping",
    label: "Shopping",
    icon: ShoppingCart,
    defaultColor: AVAILABLE_COLORS[2],
  },
  entertainment: {
    id: "entertainment",
    label: "Entertainment",
    icon: Ticket,
    defaultColor: AVAILABLE_COLORS[5],
  },
  groceries: {
    id: "groceries",
    label: "Groceries",
    icon: ShoppingBasket,
    defaultColor: AVAILABLE_COLORS[0],
  },
  dining: {
    id: "dining",
    label: "Dining",
    icon: Utensils,
    defaultColor: AVAILABLE_COLORS[5],
  },
  pets: {
    id: "pets",
    label: "Pets",
    icon: PawPrint,
    defaultColor: AVAILABLE_COLORS[6],
  },
  housing: {
    id: "housing",
    label: "Housing",
    icon: Home,
    defaultColor: AVAILABLE_COLORS[1],
  },
  gifts: {
    id: "gifts",
    label: "Gifts",
    icon: Gift,
    defaultColor: AVAILABLE_COLORS[3],
  },
  fitness: {
    id: "fitness",
    label: "Fitness",
    icon: Dumbbell,
    defaultColor: AVAILABLE_COLORS[4],
  },
  education: {
    id: "education",
    label: "Education",
    icon: BookOpen,
    defaultColor: AVAILABLE_COLORS[1],
  },
  travel: {
    id: "travel",
    label: "Travel",
    icon: Luggage,
    defaultColor: AVAILABLE_COLORS[1],
  },
  misc: {
    id: "misc",
    label: "General",
    icon: Wallet,
    defaultColor: AVAILABLE_COLORS[2],
  },
  bills: {
    id: "bills",
    label: "Bills",
    icon: Receipt,
    defaultColor: AVAILABLE_COLORS[4],
  },
};

export const ICON_MAP: Record<string, LucideIcon> = {
  Briefcase,
  Car,
  Heart: HeartPulse,
  PiggyBank,
  ShoppingCart,
  Ticket,
  ShoppingBasket,
  Utensils,
  PawPrint,
  Home,
  Gift,
  Dumbbell,
  BookOpen,
  Luggage,
  Wallet,
  Receipt,
  // Mapping some generic names in case legacy data uses them
  work: Briefcase,
  transport: Car,
  health: HeartPulse,
  savings: PiggyBank,
  shopping: ShoppingCart,
  entertainment: Ticket,
  groceries: ShoppingBasket,
  dining: Utensils,
  pets: PawPrint,
  housing: Home,
  gifts: Gift,
  fitness: Dumbbell,
  education: BookOpen,
  travel: Luggage,
  misc: Wallet,
  bills: Receipt,
};

export const AVAILABLE_ICONS = [
  { name: "Briefcase", icon: Briefcase, label: "Trabalho" },
  { name: "Car", icon: Car, label: "Transporte" },
  { name: "Heart", icon: HeartPulse, label: "Saúde" },
  { name: "PiggyBank", icon: PiggyBank, label: "Investimentos" },
  { name: "ShoppingCart", icon: ShoppingCart, label: "Mercado" },
  { name: "Ticket", icon: Ticket, label: "Lazer" },
  { name: "Gift", icon: Gift, label: "Presentes" },
  { name: "Utensils", icon: Utensils, label: "Alimentação" },
  { name: "PawPrint", icon: PawPrint, label: "Pets" },
  { name: "Home", icon: Home, label: "Casa" },
  { name: "Dumbbell", icon: Dumbbell, label: "Esportes" },
  { name: "BookOpen", icon: BookOpen, label: "Educação" },
  { name: "ShoppingBasket", icon: ShoppingBasket, label: "Compras" },
  { name: "Luggage", icon: Luggage, label: "Viagem" },
  { name: "Wallet", icon: Wallet, label: "Geral" },
  { name: "Receipt", icon: Receipt, label: "Contas" },
];

export const CATEGORY_LIST = Object.values(CATEGORY_MAP);
