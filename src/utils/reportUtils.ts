import { toast } from "@/hooks/use-toast";

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

export const SAMPLE_REPORTS: Report[] = [
  {
    id: "1",
    title: "Hydraulic leak in station 4",
    description: "Observed hydraulic fluid leaking from the main cylinder at station 4. The leak appears to be coming from the seal.",
    area: "Hydraulic System",
    loggedBy: "John Smith",
    dateLogged: new Date("2023-10-15"),
    status: "Open",
    priority: "High",
    imageUrl: "/placeholder.svg"
  },
  {
    id: "2",
    title: "Bearing failure in Gear box",
    description: "Unusual noise coming from the main drive gear box. Suspect bearing failure based on sound analysis.",
    area: "Gear box",
    loggedBy: "Emma Johnson",
    dateLogged: new Date("2023-10-12"),
    actionTakenBy: "Mike Williams",
    actionTaken: "Replaced the damaged bearing and realigned the shaft.",
    dateAction: new Date("2023-10-14"),
    status: "Closed",
    priority: "Medium",
    imageUrl: "/placeholder.svg"
  },
  {
    id: "3",
    title: "Cooling water flow decreased",
    description: "The cooling water flow to furnace zone 2 has decreased by approximately 30%, causing temperature fluctuations.",
    area: "Water System",
    loggedBy: "Alex Garcia",
    dateLogged: new Date("2023-10-16"),
    actionTakenBy: "Sarah Chen",
    actionTaken: "Initial inspection shows partial blockage. Currently cleaning the system.",
    dateAction: new Date("2023-10-16"),
    status: "Ongoing",
    priority: "High",
    imageUrl: "/placeholder.svg"
  },
  {
    id: "4",
    title: "Lubrication pump failure",
    description: "The automatic lubrication system for the main drive train has stopped functioning. No oil is being delivered to bearings.",
    area: "Lubrication System",
    loggedBy: "James Wilson",
    dateLogged: new Date("2023-10-10"),
    actionTakenBy: "Robert Johnson",
    actionTaken: "Replaced pump motor and verified system operation. All points now receiving lubrication.",
    dateAction: new Date("2023-10-11"),
    status: "Closed",
    priority: "High",
    imageUrl: "/placeholder.svg"
  },
  {
    id: "5",
    title: "Misalignment in C&C Shear",
    description: "The C&C Shear is producing uneven cuts due to misalignment of the blade.",
    area: "C&C Shear",
    loggedBy: "David Miller",
    dateLogged: new Date("2023-10-13"),
    status: "Open",
    priority: "Medium",
    imageUrl: "/placeholder.svg"
  },
  {
    id: "6",
    title: "Spare motor inventory low",
    description: "Inventory of 50HP replacement motors is down to only 1 unit. Need to reorder.",
    area: "Store and Spare",
    loggedBy: "Patricia Lopez",
    dateLogged: new Date("2023-10-14"),
    actionTakenBy: "Patricia Lopez",
    actionTaken: "Placed order for 3 additional motors with supplier.",
    dateAction: new Date("2023-10-14"),
    status: "Closed",
    priority: "Low",
    imageUrl: "/placeholder.svg"
  },
  {
    id: "7",
    title: "Power Slitter blade damage",
    description: "The main blade on Power Slitter #2 shows excessive wear on the cutting edge.",
    area: "Power Slitter",
    loggedBy: "Thomas Wright",
    dateLogged: new Date("2023-10-16"),
    status: "Open",
    priority: "Medium",
    imageUrl: "/placeholder.svg"
  }
];

let reports = [...SAMPLE_REPORTS];

// Update the sample reports to include remarks field
reports = reports.map(report => ({
  ...report,
  remarks: []
}));

// Mock function to get reports - would be replaced with API call in production
export const getReports = (): Promise<Report[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...reports]);
    }, 500);
  });
};

// Mock function to get report by ID - would be replaced with API call in production
export const getReportById = (id: string): Promise<Report | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(reports.find(report => report.id === id));
    }, 300);
  });
};

// Mock function to add a new report - would be replaced with API call in production
export const addReport = (report: Omit<Report, 'id'>): Promise<Report> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newReport = {
        ...report,
        id: Math.random().toString(36).substr(2, 9),
        remarks: []
      };
      reports.push(newReport);
      resolve(newReport);
    }, 500);
  });
};

// Update a report
export const updateReport = (updatedReport: Report): Promise<Report> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = reports.findIndex(r => r.id === updatedReport.id);
      
      if (index !== -1) {
        reports[index] = updatedReport;
        resolve(updatedReport);
      } else {
        reject(new Error("Report not found"));
      }
    }, 500);
  });
};

// Add a remark to a report
export const addRemarkToReport = (
  reportId: string, 
  remarkText: string, 
  addedBy: string
): Promise<Report> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = reports.findIndex(r => r.id === reportId);
      
      if (index !== -1) {
        const newRemark: Remark = {
          id: Math.random().toString(36).substr(2, 9),
          text: remarkText,
          addedBy,
          dateAdded: new Date()
        };
        
        // Create a new remarks array if it doesn't exist
        const currentRemarks = reports[index].remarks || [];
        reports[index].remarks = [...currentRemarks, newRemark];
        
        resolve(reports[index]);
      } else {
        reject(new Error("Report not found"));
      }
    }, 500);
  });
};

// Delete a report
export const deleteReport = (id: string): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const initialLength = reports.length;
      reports = reports.filter(report => report.id !== id);
      resolve(reports.length < initialLength);
    }, 500);
  });
};

// Helper function to export reports to Excel (CSV)
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
