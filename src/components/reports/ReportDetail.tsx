
import { Report } from "@/utils/reportUtils";
import { Button } from "@/components/ui/button";
import StatusBadge from "@/components/ui/StatusBadge";
import PriorityBadge from "@/components/ui/PriorityBadge";
import { Calendar, ChevronLeft, Clock, User } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";

interface ReportDetailProps {
  report: Report;
}

const ReportDetail = ({ report }: ReportDetailProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="bg-white rounded-xl shadow-soft border border-gray-100 overflow-hidden animate-fade-up">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center space-x-2 mb-6">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center space-x-1"
            onClick={() => navigate('/reports')}
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Back</span>
          </Button>
        </div>
        
        <div className="flex items-start justify-between flex-wrap gap-4">
          <h1 className="text-2xl font-semibold text-gray-900">{report.title}</h1>
          <div className="flex items-center space-x-3">
            <PriorityBadge priority={report.priority} className="text-sm px-3 py-1" />
            <StatusBadge status={report.status} className="text-sm px-3 py-1" />
          </div>
        </div>
      </div>
      
      <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <div>
            <h2 className="text-lg font-medium mb-3">Description</h2>
            <p className="text-gray-600 whitespace-pre-line">{report.description}</p>
          </div>
          
          {report.actionTaken && (
            <div>
              <h2 className="text-lg font-medium mb-3">Action Taken</h2>
              <p className="text-gray-600 whitespace-pre-line">{report.actionTaken}</p>
            </div>
          )}
          
          {report.imageUrl && (
            <div>
              <h2 className="text-lg font-medium mb-3">Attached Media</h2>
              <div className="rounded-lg overflow-hidden border border-gray-200">
                <img
                  src={report.imageUrl}
                  alt="Issue media"
                  className="w-full h-auto max-h-[400px] object-contain bg-gray-50"
                />
              </div>
            </div>
          )}
        </div>
        
        <div className="space-y-6">
          <div className="bg-gray-50 rounded-lg p-5 border border-gray-100">
            <h2 className="text-lg font-medium mb-4">Details</h2>
            
            <div className="space-y-4">
              <div>
                <span className="text-sm text-gray-500 block mb-1">Area</span>
                <span className="font-medium">{report.area}</span>
              </div>
              
              <Separator />
              
              <div>
                <span className="text-sm text-gray-500 block mb-1">Logged By</span>
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-1.5 text-gray-400" />
                  <span className="font-medium">{report.loggedBy}</span>
                </div>
              </div>
              
              <div>
                <span className="text-sm text-gray-500 block mb-1">Date Logged</span>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1.5 text-gray-400" />
                  <span className="font-medium">{report.dateLogged.toLocaleDateString()}</span>
                </div>
              </div>
              
              {report.actionTakenBy && (
                <>
                  <Separator />
                  
                  <div>
                    <span className="text-sm text-gray-500 block mb-1">Action Taken By</span>
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-1.5 text-gray-400" />
                      <span className="font-medium">{report.actionTakenBy}</span>
                    </div>
                  </div>
                </>
              )}
              
              {report.dateAction && (
                <div>
                  <span className="text-sm text-gray-500 block mb-1">Date of Action</span>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1.5 text-gray-400" />
                    <span className="font-medium">{report.dateAction.toLocaleDateString()}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportDetail;
