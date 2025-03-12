
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Report, getReports } from "@/utils/reportUtils";
import Navbar from "@/components/layout/Navbar";
import StatCard from "@/components/dashboard/StatCard";
import RecentReports from "@/components/dashboard/RecentReports";
import { AlertCircle, Clock, FileText, FilePlus } from "lucide-react";
import { Button } from "@/components/ui/button";

const Home = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const data = await getReports();
        setReports(data);
      } catch (error) {
        console.error("Error fetching reports:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchReports();
  }, []);
  
  // Calculate dashboard statistics
  const totalReports = reports.length;
  const openReports = reports.filter(report => report.status === "Open").length;
  const highPriorityReports = reports.filter(report => report.priority === "High").length;
  const recentReports = [...reports].sort((a, b) => 
    b.dateLogged.getTime() - a.dateLogged.getTime()
  );
  
  // Navigate to filtered report lists
  const navigateToAllReports = () => navigate('/reports');
  const navigateToOpenReports = () => {
    navigate('/reports', { state: { initialFilters: { status: ['Open'] } } });
  };
  const navigateToHighPriorityReports = () => {
    navigate('/reports', { state: { initialFilters: { priority: ['High'] } } });
  };
  
  // Determine animation delay for staggered entrance
  const getAnimationDelay = (index: number) => `${(index + 1) * 0.1}s`;
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="mt-1 text-gray-500">
              Overview of maintenance reports and status
            </p>
          </div>
          
          <Button
            className="mt-4 md:mt-0"
            onClick={() => navigate("/new-report")}
          >
            <FilePlus className="mr-2 h-4 w-4" />
            New Report
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Total Reports"
            value={totalReports}
            icon={FileText}
            description="Total number of maintenance reports"
            className="animate-fade-up"
            style={{ animationDelay: getAnimationDelay(0) }}
            onClick={navigateToAllReports}
          />
          
          <StatCard
            title="Open Reports"
            value={openReports}
            icon={Clock}
            description="Reports waiting to be addressed"
            className="animate-fade-up"
            style={{ animationDelay: getAnimationDelay(1) }}
            onClick={navigateToOpenReports}
          />
          
          <StatCard
            title="High Priority"
            value={highPriorityReports}
            icon={AlertCircle}
            description="Issues requiring immediate attention"
            className="animate-fade-up"
            style={{ animationDelay: getAnimationDelay(2) }}
            onClick={navigateToHighPriorityReports}
          />
        </div>
        
        <div className="animate-fade-up" style={{ animationDelay: getAnimationDelay(3) }}>
          <RecentReports reports={recentReports} />
        </div>
      </main>
    </div>
  );
};

export default Home;
