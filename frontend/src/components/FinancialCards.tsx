import type { LucideIcon } from "lucide-react";

export interface FinancialCardItem {
  icon: LucideIcon;
  value: number | string;
  label: string;
  iconColor?: string;
  iconBackgroundColor?: string;
  customIconColor?: string;
  formatCurrency?: boolean;
}

interface FinancialCardsProps {
  cards: FinancialCardItem[];
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);

function FinancialCard({
  icon: Icon,
  value,
  label,
  iconColor,
  iconBackgroundColor,
  customIconColor,
  formatCurrency: shouldFormatCurrency,
}: FinancialCardItem) {
  const wrapperStyle = iconBackgroundColor
    ? { backgroundColor: iconBackgroundColor }
    : undefined;
  const iconWrapperClass = `p-2 rounded ${customIconColor ? "" : (iconColor ?? "text-gray-600")}`;
  const displayValue =
    shouldFormatCurrency && typeof value === "number"
      ? formatCurrency(value)
      : value;

  return (
    <div className="bg-white rounded-xl p-6 border border-grayscale-200">
      <div className="flex items-center gap-3 mb-4">
        <div className={iconWrapperClass} style={wrapperStyle}>
          <Icon
            size={20}
            {...(customIconColor && { color: customIconColor })}
            className={!customIconColor && iconColor ? iconColor : undefined}
          />
        </div>
        <span className="text-gray-600 text-sm font-medium">{label}</span>
      </div>
      <div className="text-3xl font-bold text-gray-900">{displayValue}</div>
    </div>
  );
}

export function FinancialCards({ cards }: FinancialCardsProps) {
  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card, index) => (
          <FinancialCard key={index} {...card} />
        ))}
      </div>
    </div>
  );
}
