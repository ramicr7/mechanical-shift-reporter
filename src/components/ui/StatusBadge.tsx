
import { cn } from "@/lib/utils";
import { Status } from "@/utils/reportUtils";

interface StatusBadgeProps {
  status: Status;
  className?: string;
}

const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
  
  const statusClasses = {
    Open: "bg-blue-100 text-blue-800 border border-blue-200",
    Ongoing: "bg-amber-100 text-amber-800 border border-amber-200",
    Closed: "bg-green-100 text-green-800 border border-green-200"
  };
  
  return (
    <span className={cn(baseClasses, statusClasses[status], className)}>
      {status}
    </span>
  );
};

export default StatusBadge;
