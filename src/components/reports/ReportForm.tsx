
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { AREAS, Area, Priority, Report, Status, addReport } from "@/utils/reportUtils";
import { ArrowLeft, Loader2, Upload } from "lucide-react";

const ReportForm = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [area, setArea] = useState<Area | "">("");
  const [loggedBy, setLoggedBy] = useState("");
  const [priority, setPriority] = useState<Priority | "">("");
  const [status, setStatus] = useState<Status>("Open");
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      
      // Create preview URL
      const fileReader = new FileReader();
      fileReader.onload = () => {
        if (fileReader.result) {
          setFilePreview(fileReader.result.toString());
        }
      };
      fileReader.readAsDataURL(selectedFile);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !description || !area || !loggedBy || !priority) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // In a real application, we would upload the file to a server
      // and get back the URL. For now, we'll just use the placeholder
      const imageUrl = filePreview || "/placeholder.svg";
      
      const newReport: Omit<Report, "id"> = {
        title,
        description,
        area: area as Area,
        loggedBy,
        dateLogged: new Date(),
        status,
        priority: priority as Priority,
        imageUrl,
      };
      
      const savedReport = await addReport(newReport);
      
      toast({
        title: "Report Submitted",
        description: "Your report has been successfully submitted",
      });
      
      // Navigate to the reports list page after a short delay
      setTimeout(() => navigate("/reports"), 1500);
    } catch (error) {
      console.error("Error submitting report:", error);
      toast({
        title: "Error",
        description: "Failed to submit report. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Card className="border border-gray-200 animate-fade-up">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center space-x-2 mb-6">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center space-x-1"
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </Button>
        </div>
        
        <h1 className="text-2xl font-semibold">Create New Report</h1>
        <p className="text-gray-500 mt-2">
          Fill in the details below to submit a new maintenance issue report.
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="p-6">
        <div className="grid grid-cols-1 gap-6">
          <div className="grid grid-cols-1 gap-2">
            <Label htmlFor="title" className="text-sm font-medium">
              Title <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              placeholder="Brief title of the issue"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          
          <div className="grid grid-cols-1 gap-2">
            <Label htmlFor="description" className="text-sm font-medium">
              Description <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="description"
              placeholder="Detailed description of the issue"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              required
            />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="grid grid-cols-1 gap-2">
              <Label htmlFor="area" className="text-sm font-medium">
                Area <span className="text-red-500">*</span>
              </Label>
              <Select
                value={area}
                onValueChange={(value) => setArea(value as Area)}
                required
              >
                <SelectTrigger id="area">
                  <SelectValue placeholder="Select an area" />
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
            
            <div className="grid grid-cols-1 gap-2">
              <Label htmlFor="loggedBy" className="text-sm font-medium">
                Logged By <span className="text-red-500">*</span>
              </Label>
              <Input
                id="loggedBy"
                placeholder="Your name"
                value={loggedBy}
                onChange={(e) => setLoggedBy(e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="grid grid-cols-1 gap-2">
              <Label htmlFor="priority" className="text-sm font-medium">
                Priority <span className="text-red-500">*</span>
              </Label>
              <Select
                value={priority}
                onValueChange={(value) => setPriority(value as Priority)}
                required
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
            
            <div className="grid grid-cols-1 gap-2">
              <Label htmlFor="status" className="text-sm font-medium">
                Status
              </Label>
              <Select
                value={status}
                onValueChange={(value) => setStatus(value as Status)}
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
          </div>
          
          <div className="grid grid-cols-1 gap-3">
            <Label className="text-sm font-medium">
              Media Attachment
            </Label>
            <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center">
              <input
                type="file"
                id="media"
                className="sr-only"
                accept="image/*,video/*"
                onChange={handleFileChange}
              />
              
              {filePreview ? (
                <div className="space-y-4">
                  <div className="mx-auto max-w-xs overflow-hidden rounded-lg">
                    <img
                      src={filePreview}
                      alt="Preview"
                      className="h-auto w-full object-cover"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setFile(null);
                      setFilePreview(null);
                    }}
                  >
                    Remove
                  </Button>
                </div>
              ) : (
                <label
                  htmlFor="media"
                  className="flex flex-col items-center cursor-pointer"
                >
                  <Upload className="h-12 w-12 text-gray-400 mb-2" />
                  <span className="text-sm font-medium">
                    Click to upload an image or video
                  </span>
                  <span className="text-xs text-gray-500 mt-1">
                    (Optional) PNG, JPG, or MP4 up to 10MB
                  </span>
                </label>
              )}
            </div>
          </div>
          
          <div className="mt-4 flex justify-end space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/")}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Report"
              )}
            </Button>
          </div>
        </div>
      </form>
    </Card>
  );
};

export default ReportForm;
