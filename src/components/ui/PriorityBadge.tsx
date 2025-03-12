
import { cn } from "@/lib/utils";
import { Priority } from "@/utils/reportUtils";

interface PriorityBadgeProps {
  priority: Priority;
  className?: string;
}

const PriorityBadge = ({ priority, className }: PriorityBadgeProps) => {
  const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
  
  const priorityClasses = {
    High: "bg-red-100 text-red-800 border border-red-200",
    Medium: "bg-amber-100 text-amber-800 border border-amber-200",
    Low: "bg-green-100 text-green-800 border border-green-200"
  };
  
  return (
    <span className={cn(baseClasses, priorityClasses[priority], className)}>
      {priority}
    </span>
  );
};

export default PriorityBadge;
