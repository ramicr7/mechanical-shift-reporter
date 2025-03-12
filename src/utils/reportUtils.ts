import { toast } from "@/hooks/use-toast";
import { 
  addRemarkToReportApi, 
  addReportApi, 
  deleteReportApi, 
  getReportByIdApi, 
  getReportsApi, 
  updateReportApi 
} from "./api";

export type Area = 
  | "Furnace"
  | "Gear box"
  | "Screwpost"
  | "Spindle and Carrier"
  | "C&C Shear"
  | "C&D Shear"
  | "Divide Shear"
  | "Power Slitter"
  | "Loopers"
  | "Pinch Roll"
  | "RES"
  | "Cooling Bed"
  | "Cold Shear"
  | "Bundling Station"
  | "Hydraulic System"
  | "Lubrication System"
  | "Water System"
  | "Store and Spare";

export type Status = "Open" | "Ongoing" | "Closed";
export type Priority = "High" | "Medium" | "Low";

export interface Remark {
  id: string;
  text: string;
  addedBy: string;
  dateAdded: Date;
}

export interface Report {
  id: string;
  title: string;
  description: string;
  area: Area;
  loggedBy: string;
  dateLogged: Date;
  actionTakenBy?: string;
  actionTaken?: string;
  dateAction?: Date;
  status: Status;
  priority: Priority;
  imageUrl?: string;
  remarks?: Remark[];
}

// Sample data for development
export const AREAS: Area[] = [
  "Furnace",
  "Gear box",
  "Screwpost",
  "Spindle and Carrier",
  "C&C Shear",
  "C&D Shear",
  "Divide Shear",
  "Power Slitter",
  "Loopers",
  "Pinch Roll",
  "RES",
  "Cooling Bed",
  "Cold Shear",
  "Bundling Station",
  "Hydraulic System",
  "Lubrication System",
  "Water System",
  "Store and Spare"
];

// Function to get reports - now calls the API
export const getReports = async (): Promise<Report[]> => {
  return getReportsApi();
};

// Function to get report by ID - now calls the API
export const getReportById = async (id: string): Promise<Report | undefined> => {
  return getReportByIdApi(id);
};

// Function to add a new report - now calls the API
export const addReport = async (report: Omit<Report, 'id'>): Promise<Report> => {
  return addReportApi(report);
};

// Update a report - now calls the API
export const updateReport = async (updatedReport: Report): Promise<Report> => {
  return updateReportApi(updatedReport);
};

// Add a remark to a report - now calls the API
export const addRemarkToReport = async (
  reportId: string, 
  remarkText: string, 
  addedBy: string
): Promise<Report> => {
  return addRemarkToReportApi(reportId, remarkText, addedBy);
};

// Delete a report - now calls the API
export const deleteReport = async (id: string): Promise<boolean> => {
  return deleteReportApi(id);
};

// Helper function to export reports to CSV
export const exportToCSV = (reports: Report[]) => {
  // Headers for CSV
  const headers = [
    'ID',
    'Title',
    'Description',
    'Area',
    'Logged By',
    'Date Logged',
    'Action Taken By',
    'Action Taken',
    'Date Action',
    'Status',
    'Priority'
  ];

  // Format reports into CSV rows
  const csvRows = reports.map(report => {
    return [
      report.id,
      `"${report.title.replace(/"/g, '""')}"`,
      `"${report.description.replace(/"/g, '""')}"`,
      report.area,
      report.loggedBy,
      report.dateLogged.toLocaleDateString(),
      report.actionTakenBy || '',
      `"${report.actionTaken?.replace(/"/g, '""') || ''}"`,
      report.dateAction ? report.dateAction.toLocaleDateString() : '',
      report.status,
      report.priority
    ].join(',');
  });

  // Combine headers and rows
  const csvContent = [headers.join(','), ...csvRows].join('\n');

  // Create a blob and download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `shift_reports_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  toast({
    title: "Export Successful",
    description: "Reports have been exported to CSV",
  });
};

// Filter reports based on criteria
export const filterReports = (
  reports: Report[],
  filters: {
    search?: string;
    status?: Status[];
    priority?: Priority[];
    area?: Area[];
    dateFrom?: Date;
    dateTo?: Date;
  }
): Report[] => {
  return reports.filter(report => {
    // Search filter
    if (filters.search && !report.title.toLowerCase().includes(filters.search.toLowerCase()) && 
        !report.description.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    
    // Status filter
    if (filters.status && filters.status.length > 0 && !filters.status.includes(report.status)) {
      return false;
    }
    
    // Priority filter
    if (filters.priority && filters.priority.length > 0 && !filters.priority.includes(report.priority)) {
      return false;
    }
    
    // Area filter
    if (filters.area && filters.area.length > 0 && !filters.area.includes(report.area)) {
      return false;
    }
    
    // Date range filter
    if (filters.dateFrom && report.dateLogged < filters.dateFrom) {
      return false;
    }
    
    if (filters.dateTo) {
      // Add one day to include the end date in the range
      const adjustedDateTo = new Date(filters.dateTo);
      adjustedDateTo.setDate(adjustedDateTo.getDate() + 1);
      if (report.dateLogged > adjustedDateTo) {
        return false;
      }
    }
    
    return true;
  });
};
