
import { useState } from "react";
import { Report, AREAS, Area, Status, Priority, updateReport, addRemarkToReport } from "@/utils/reportUtils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { getCurrentUser, isAdmin } from "@/utils/authUtils";
import { Loader2 } from "lucide-react";

interface EditReportFormProps {
  report: Report;
  onSave: (updatedReport: Report) => void;
  onCancel: () => void;
}

const EditReportForm = ({ report, onSave, onCancel }: EditReportFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<Report>({...report});
  const [newRemark, setNewRemark] = useState("");
  
  const currentUser = getCurrentUser();
  const isAdminUser = isAdmin();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      let updatedReport = {...formData};
      
      // If there's a new remark, add it to the report
      if (newRemark.trim()) {
        if (currentUser) {
          const reportWithRemark = await addRemarkToReport(
            report.id,
            newRemark,
            currentUser.name
          );
          updatedReport = reportWithRemark;
        }
      }
      
      // Update the report
      const savedReport = await updateReport(updatedReport);
      
      toast({
        title: "Report Updated",
        description: "The report has been successfully updated",
      });
      
      onSave(savedReport);
    } catch (error) {
      console.error("Error updating report:", error);
      toast({
        title: "Error",
        description: "Failed to update report. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            disabled={!isAdminUser}
            required
          />
        </div>
        
        <div className="grid grid-cols-1 gap-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            rows={4}
            disabled={!isAdminUser}
            required
          />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="area">Area</Label>
            <Select
              value={formData.area}
              onValueChange={(value) => setFormData({...formData, area: value as Area})}
              disabled={!isAdminUser}
            >
              <SelectTrigger id="area">
                <SelectValue placeholder="Select area" />
              </SelectTrigger>
              <SelectContent>
                {AREAS.map((area) => (
                  <SelectItem key={area} value={area}>
                    {area}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="priority">Priority</Label>
            <Select
              value={formData.priority}
              onValueChange={(value) => setFormData({...formData, priority: value as Priority})}
              disabled={!isAdminUser}
            >
              <SelectTrigger id="priority">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => setFormData({...formData, status: value as Status})}
            >
              <SelectTrigger id="status">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Open">Open</SelectItem>
                <SelectItem value="Ongoing">Ongoing</SelectItem>
                <SelectItem value="Closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="actionTakenBy">Action Taken By</Label>
            <Input
              id="actionTakenBy"
              value={formData.actionTakenBy || ""}
              onChange={(e) => setFormData({...formData, actionTakenBy: e.target.value})}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-2">
          <Label htmlFor="actionTaken">Action Taken</Label>
          <Textarea
            id="actionTaken"
            value={formData.actionTaken || ""}
            onChange={(e) => setFormData({...formData, actionTaken: e.target.value})}
            rows={3}
          />
        </div>
        
        <div className="grid grid-cols-1 gap-2">
          <Label htmlFor="newRemark">Add New Remark</Label>
          <Textarea
            id="newRemark"
            value={newRemark}
            onChange={(e) => setNewRemark(e.target.value)}
            placeholder="Add your comments or observations here..."
            rows={3}
          />
        </div>
      </div>
      
      <div className="flex justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Changes"
          )}
        </Button>
      </div>
    </form>
  );
};

export default EditReportForm;
