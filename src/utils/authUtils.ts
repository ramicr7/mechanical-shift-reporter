
import { getCurrentUserApi, loginApi, logoutApi } from "./api";

interface User {
  id: string;
  name: string;
  role: "user" | "admin";
}

interface Credentials {
  id: string;
  password: string;
}

// Login function
export const login = (credentials: Credentials): User | null => {
  try {
    // The API call will handle storing the user in localStorage
    return loginApi(credentials) as unknown as User;
  } catch (error) {
    console.error("Login error:", error);
    return null;
  }
};

// Logout function
export const logout = (): void => {
  logoutApi();
};

// Get current user function
export const getCurrentUser = (): User | null => {
  return getCurrentUserApi();
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return getCurrentUser() !== null;
};

// Check if user is admin
export const isAdmin = (): boolean => {
  const user = getCurrentUser();
  return user?.role === "admin";
};

// Check if user can edit a report based on its status
export const canEditReport = (reportStatus: string): boolean => {
  const user = getCurrentUser();
  
  if (!user) return false;
  
  if (user.role === "admin") return true;
  
  // Users can only edit reports with 'Open' or 'Ongoing' status
  return user.role === "user" && (reportStatus === "Open" || reportStatus === "Ongoing");
};

export type { User, Credentials };
