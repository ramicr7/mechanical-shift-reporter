
interface User {
  id: string;
  name: string;
  role: "user" | "admin";
}

interface Credentials {
  id: string;
  password: string;
}

// Predefined users
const USERS: Record<string, { password: string, user: User }> = {
  "User@nbm": {
    password: "User@1234",
    user: {
      id: "User@nbm",
      name: "User",
      role: "user"
    }
  },
  "administrator": {
    password: "mastermind",
    user: {
      id: "administrator",
      name: "Administrator",
      role: "admin"
    }
  }
};

// Login function
export const login = (credentials: Credentials): User | null => {
  const userEntry = USERS[credentials.id];
  
  if (userEntry && userEntry.password === credentials.password) {
    // Store user in localStorage for persistence
    localStorage.setItem('currentUser', JSON.stringify(userEntry.user));
    return userEntry.user;
  }
  
  return null;
};

// Logout function
export const logout = (): void => {
  localStorage.removeItem('currentUser');
};

// Get current user function
export const getCurrentUser = (): User | null => {
  const userJson = localStorage.getItem('currentUser');
  return userJson ? JSON.parse(userJson) : null;
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
