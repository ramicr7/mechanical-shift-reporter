
import { toast } from "@/hooks/use-toast";
import { Credentials, User } from "./authUtils";
import { Area, Priority, Report, Status } from "./reportUtils";

// API base URL - change this to match your backend
const API_URL = "http://localhost:5000/api";

// Helper to get auth token from localStorage
const getToken = (): string | null => {
  const tokenData = localStorage.getItem('authToken');
  return tokenData ? tokenData : null;
};

// Helper for making authenticated API requests
const apiRequest = async (
  endpoint: string,
  method: string = 'GET',
  data: any = null
): Promise<any> => {
  const url = `${API_URL}${endpoint}`;
  const token = getToken();
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const options: RequestInit = {
    method,
    headers,
  };
  
  if (data) {
    options.body = JSON.stringify(data);
  }
  
  try {
    const response = await fetch(url, options);
    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error || 'Something went wrong');
    }
    
    return result;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error(`API Error (${endpoint}):`, message);
    throw error;
  }
};

// Auth API calls
export const loginApi = async (credentials: Credentials): Promise<User> => {
  try {
    const response = await apiRequest('/auth/login', 'POST', credentials);
    
    // Store token
    localStorage.setItem('authToken', response.token);
    
    // Store user data
    localStorage.setItem('currentUser', JSON.stringify(response.user));
    
    return response.user;
  } catch (error) {
    throw error;
  }
};

export const logoutApi = (): void => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('currentUser');
};

export const getCurrentUserApi = (): User | null => {
  const userJson = localStorage.getItem('currentUser');
  return userJson ? JSON.parse(userJson) : null;
};

// Reports API calls
export const getReportsApi = async (): Promise<Report[]> => {
  try {
    const response = await apiRequest('/reports');
    return response.data.map((report: any) => ({
      ...report,
      id: report._id,
      dateLogged: new Date(report.dateLogged),
      dateAction: report.dateAction ? new Date(report.dateAction) : undefined,
      remarks: report.remarks ? report.remarks.map((remark: any) => ({
        ...remark,
        id: remark._id,
        dateAdded: new Date(remark.dateAdded)
      })) : []
    }));
  } catch (error) {
    toast({
      title: "Error",
      description: "Failed to fetch reports",
      variant: "destructive",
    });
    throw error;
  }
};

export const getReportByIdApi = async (id: string): Promise<Report | undefined> => {
  try {
    const response = await apiRequest(`/reports/${id}`);
    const report = response.data;
    
    return {
      ...report,
      id: report._id,
      dateLogged: new Date(report.dateLogged),
      dateAction: report.dateAction ? new Date(report.dateAction) : undefined,
      remarks: report.remarks ? report.remarks.map((remark: any) => ({
        ...remark,
        id: remark._id,
        dateAdded: new Date(remark.dateAdded)
      })) : []
    };
  } catch (error) {
    toast({
      title: "Error",
      description: "Failed to fetch report details",
      variant: "destructive",
    });
    throw error;
  }
};

export const addReportApi = async (report: Omit<Report, 'id'>): Promise<Report> => {
  try {
    const response = await apiRequest('/reports', 'POST', {
      ...report,
      dateLogged: report.dateLogged.toISOString(),
      dateAction: report.dateAction?.toISOString()
    });
    
    const newReport = response.data;
    
    return {
      ...newReport,
      id: newReport._id,
      dateLogged: new Date(newReport.dateLogged),
      dateAction: newReport.dateAction ? new Date(newReport.dateAction) : undefined,
      remarks: []
    };
  } catch (error) {
    toast({
      title: "Error",
      description: "Failed to create report",
      variant: "destructive",
    });
    throw error;
  }
};

export const updateReportApi = async (report: Report): Promise<Report> => {
  try {
    // Convert dates to ISO strings for the API
    const reportData = {
      ...report,
      dateLogged: report.dateLogged.toISOString(),
      dateAction: report.dateAction?.toISOString(),
      // Remove id to avoid confusion with MongoDB _id
      id: undefined,
      _id: undefined
    };
    
    const response = await apiRequest(`/reports/${report.id}`, 'PUT', reportData);
    const updatedReport = response.data;
    
    return {
      ...updatedReport,
      id: updatedReport._id,
      dateLogged: new Date(updatedReport.dateLogged),
      dateAction: updatedReport.dateAction ? new Date(updatedReport.dateAction) : undefined,
      remarks: updatedReport.remarks ? updatedReport.remarks.map((remark: any) => ({
        ...remark,
        id: remark._id,
        dateAdded: new Date(remark.dateAdded)
      })) : []
    };
  } catch (error) {
    toast({
      title: "Error",
      description: "Failed to update report",
      variant: "destructive",
    });
    throw error;
  }
};

export const addRemarkToReportApi = async (
  reportId: string, 
  remarkText: string, 
  addedBy: string
): Promise<Report> => {
  try {
    const response = await apiRequest(`/reports/${reportId}`, 'PUT', {
      newRemark: remarkText,
      remarkAddedBy: addedBy
    });
    
    const updatedReport = response.data;
    
    return {
      ...updatedReport,
      id: updatedReport._id,
      dateLogged: new Date(updatedReport.dateLogged),
      dateAction: updatedReport.dateAction ? new Date(updatedReport.dateAction) : undefined,
      remarks: updatedReport.remarks ? updatedReport.remarks.map((remark: any) => ({
        ...remark,
        id: remark._id,
        dateAdded: new Date(remark.dateAdded)
      })) : []
    };
  } catch (error) {
    toast({
      title: "Error",
      description: "Failed to add remark",
      variant: "destructive",
    });
    throw error;
  }
};

export const deleteReportApi = async (id: string): Promise<boolean> => {
  try {
    await apiRequest(`/reports/${id}`, 'DELETE');
    return true;
  } catch (error) {
    toast({
      title: "Error",
      description: "Failed to delete report",
      variant: "destructive",
    });
    throw error;
  }
};
