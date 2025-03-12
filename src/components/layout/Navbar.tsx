
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { FileText, Home, PlusCircle } from "lucide-react";

const Navbar = () => {
  const location = useLocation();
  
  const navItems = [
    { name: "Home", path: "/", icon: <Home className="w-5 h-5" /> },
    { name: "All Reports", path: "/reports", icon: <FileText className="w-5 h-5" /> },
    { name: "New Report", path: "/new-report", icon: <PlusCircle className="w-5 h-5" /> }
  ];
  
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
        </div>
      </div>
    </header>
  );
};

export default Navbar;
