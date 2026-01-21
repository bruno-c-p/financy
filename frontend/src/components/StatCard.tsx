import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  icon: LucideIcon;
  value: string | number;
  label: string;
  className?: string;
  iconColor?: string;
}

export function StatCard({
  icon: Icon,
  value,
  label,
  className,
  iconColor = "text-grayscale-700",
}: StatCardProps) {
  return (
    <Card className={cn("border-grayscale-200", className)}>
      <CardContent className="p-6">
        <div className="flex items-start gap-3">
          <Icon className={cn("size-8", iconColor)} />
          <div>
            <p className="text-[28px] font-semibold text-grayscale-900">
              {value}
            </p>
            <p className="text-xs tracking-wider text-grayscale-500 uppercase">
              {label}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
