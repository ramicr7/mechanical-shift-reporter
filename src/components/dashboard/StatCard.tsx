
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { CSSProperties } from "react";

interface StatCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
  style?: CSSProperties;
}

const StatCard = ({
  title,
  value,
  icon: Icon,
  description,
  trend,
  className,
  style,
}: StatCardProps) => {
  return (
    <div 
      className={cn(
        "p-6 rounded-xl bg-white shadow-soft transition-all duration-300 hover:shadow-md border border-gray-100",
        className
      )}
      style={style}
    >
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <div className="flex items-baseline space-x-2">
            <p className="text-2xl font-semibold">{value}</p>
            {trend && (
              <span
                className={cn(
                  "text-xs font-medium",
                  trend.isPositive ? "text-green-600" : "text-red-600"
                )}
              >
                {trend.isPositive ? "+" : "-"}
                {trend.value}%
              </span>
            )}
          </div>
        </div>
        <div className="rounded-full p-2 bg-primary bg-opacity-10">
          <Icon className="h-5 w-5 text-primary" />
        </div>
      </div>
      {description && (
        <p className="mt-2 text-sm text-gray-500">{description}</p>
      )}
    </div>
  );
};

export default StatCard;
