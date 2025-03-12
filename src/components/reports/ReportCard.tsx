
import { Report } from "@/utils/reportUtils";
import { Card } from "@/components/ui/card";
import StatusBadge from "@/components/ui/StatusBadge";
import PriorityBadge from "@/components/ui/PriorityBadge";
import { Calendar, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface ReportCardProps {
  report: Report;
  onClick?: () => void;
  className?: string;
}

const ReportCard = ({ report, onClick, className }: ReportCardProps) => {
  return (
    <Card 
      className={cn(
        "overflow-hidden border border-gray-200 hover:shadow-md transition-all duration-300 cursor-pointer animate-fade-up",
        className
      )} 
      onClick={onClick}
    >
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-medium text-lg text-gray-900 line-clamp-1">{report.title}</h3>
          <div className="flex items-center space-x-2">
            <PriorityBadge priority={report.priority} />
            <StatusBadge status={report.status} />
          </div>
        </div>
        
        <p className="text-gray-600 text-sm line-clamp-2 mb-4">{report.description}</p>
        
        <div className="flex flex-wrap items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-3 mb-2 sm:mb-0">
            <div className="flex items-center">
              <User className="h-3.5 w-3.5 mr-1" />
              <span>{report.loggedBy}</span>
            </div>
            <div className="flex items-center">
              <Calendar className="h-3.5 w-3.5 mr-1" />
              <span>{report.dateLogged.toLocaleDateString()}</span>
            </div>
          </div>
          
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {report.area}
          </span>
        </div>
      </div>
    </Card>
  );
};

export default ReportCard;
