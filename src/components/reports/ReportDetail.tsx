
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Report, deleteReport } from "@/utils/reportUtils";
import { Button } from "@/components/ui/button";
import StatusBadge from "@/components/ui/StatusBadge";
import PriorityBadge from "@/components/ui/PriorityBadge";
import { Calendar, ChevronLeft, Clock, Edit, Trash2, User } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import EditReportForm from "./EditReportForm";
import RemarkList from "./RemarkList";
import { canEditReport, isAdmin } from "@/utils/authUtils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface ReportDetailProps {
  report: Report;
  onReportUpdate: (updatedReport: Report) => void;
}

const ReportDetail = ({ report, onReportUpdate }: ReportDetailProps) => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const canEdit = canEditReport(report.status);
  const userIsAdmin = isAdmin();
  
  const handleEditClick = () => {
    setIsEditing(true);
  };
  
  const handleCancelEdit = () => {
    setIsEditing(false);
  };
  
  const handleSaveEdit = (updatedReport: Report) => {
    onReportUpdate(updatedReport);
    setIsEditing(false);
  };
  
  const handleDeleteReport = async () => {
    setIsDeleting(true);
    try {
      await deleteReport(report.id);
      toast({
        title: "Report Deleted",
        description: "The report has been successfully deleted",
      });
      navigate("/reports");
    } catch (error) {
      console.error("Error deleting report:", error);
      toast({
        title: "Error",
        description: "Failed to delete report. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };
  
  if (isEditing) {
    return (
      <div className="bg-white rounded-xl shadow-soft border border-gray-100 overflow-hidden animate-fade-up">
        <div className="p-6 border-b border-gray-100">
          <h1 className="text-2xl font-semibold text-gray-900">Edit Report</h1>
        </div>
        <div className="p-6">
          <EditReportForm 
            report={report} 
            onSave={handleSaveEdit} 
            onCancel={handleCancelEdit}
          />
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-xl shadow-soft border border-gray-100 overflow-hidden animate-fade-up">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center space-x-1"
            onClick={() => navigate('/reports')}
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Back</span>
          </Button>
          
          <div className="flex items-center space-x-3">
            {canEdit && (
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center space-x-1"
                onClick={handleEditClick}
              >
                <Edit className="h-4 w-4" />
                <span>Edit</span>
              </Button>
            )}
            
            {userIsAdmin && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    className="flex items-center space-x-1"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>Delete</span>
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete the report.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={handleDeleteReport}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
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
          
          <div>
            <h2 className="text-lg font-medium mb-3">Remarks & Updates</h2>
            <RemarkList remarks={report.remarks || []} />
          </div>
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
