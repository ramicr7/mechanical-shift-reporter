
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { FileText, Home, LogOut, PlusCircle, User } from "lucide-react";
import { getCurrentUser, logout } from "@/utils/authUtils";
import { Button } from "../ui/button";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentUser = getCurrentUser();
  
  const navItems = [
    { name: "Home", path: "/", icon: <Home className="w-5 h-5" /> },
    { name: "All Reports", path: "/reports", icon: <FileText className="w-5 h-5" /> },
    { name: "New Report", path: "/new-report", icon: <PlusCircle className="w-5 h-5" /> }
  ];
  
  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  
  return (
    <header className="fixed top-0 left-0 right-0 z-10 bg-white bg-opacity-90 backdrop-blur-sm border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <span className="text-xl font-semibold text-primary">Shift Reporter</span>
          </div>
          
          <nav className="flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ease-in-out",
                  location.pathname === item.path
                    ? "text-primary font-semibold border-b-2 border-primary"
                    : "text-gray-600 hover:text-primary hover:bg-gray-50"
                )}
              >
                <span className="mr-1.5">{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>
          
          {currentUser && (
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <User className="w-4 h-4 mr-2 text-gray-500" />
                <span className="text-sm font-medium">
                  {currentUser.name}
                  {currentUser.role === "admin" && (
                    <span className="ml-1 text-xs bg-primary text-white px-1.5 py-0.5 rounded-full">
                      Admin
                    </span>
                  )}
                </span>
              </div>
              
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleLogout}
                className="flex items-center text-gray-600 hover:text-red-600"
              >
                <LogOut className="w-4 h-4 mr-1" />
                <span>Logout</span>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
