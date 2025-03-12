
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Report } from "@/utils/reportUtils";
import StatusBadge from "@/components/ui/StatusBadge";
import PriorityBadge from "@/components/ui/PriorityBadge";
import { Calendar, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface RecentReportsProps {
  reports: Report[];
  className?: string;
}

const RecentReports = ({ reports, className }: RecentReportsProps) => {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);
  
  // Get last 3 reports, or more if expanded
  const displayedReports = expanded ? reports.slice(0, 5) : reports.slice(0, 3);
  
  return (
    <div className={cn("bg-white rounded-xl shadow-soft border border-gray-100", className)}>
      <div className="p-4 border-b border-gray-100">
        <h3 className="text-lg font-medium">Recent Reports</h3>
      </div>
      
      <div className="divide-y divide-gray-100">
        {displayedReports.map((report) => (
          <div 
            key={report.id}
            className="p-4 hover:bg-gray-50 cursor-pointer transition-colors duration-150 ease-in-out"
            onClick={() => navigate(`/reports/${report.id}`)}
          >
            <div className="flex items-start justify-between">
              <h4 className="font-medium text-gray-900">{report.title}</h4>
              <div className="flex space-x-2">
                <PriorityBadge priority={report.priority} />
                <StatusBadge status={report.status} />
              </div>
            </div>
            
            <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
              <span>{report.area}</span>
              <div className="flex items-center">
                <Calendar className="w-3.5 h-3.5 mr-1" />
                <span>{report.dateLogged.toLocaleDateString()}</span>
              </div>
            </div>
            
            <p className="mt-2 text-sm text-gray-600 line-clamp-2">
              {report.description}
            </p>
          </div>
        ))}
      </div>
      
      {reports.length > 3 && (
        <button
          className="w-full p-3 text-sm font-medium text-primary flex items-center justify-center border-t border-gray-100 hover:bg-gray-50 transition-colors"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? (
            <>
              <ChevronUp className="w-4 h-4 mr-1" />
              Show Less
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4 mr-1" />
              Show More
            </>
          )}
        </button>
      )}
    </div>
  );
};

export default RecentReports;
