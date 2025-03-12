
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import StatCard from "./StatCard";
import RecentReports from "./RecentReports";
import { AlertCircle, CheckCircle, Flag } from "lucide-react";
import { getReports, Report } from "@/utils/reportUtils";

const Dashboard = () => {
  const [stats, setStats] = useState({
    total: 0,
    open: 0,
    highPriority: 0
  });
  const [reports, setReports] = useState<Report[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch reports and calculate dashboard statistics
    const fetchReports = async () => {
      try {
        const fetchedReports = await getReports();
        setReports(fetchedReports);
        
        setStats({
          total: fetchedReports.length,
          open: fetchedReports.filter(report => report.status === "Open").length,
          highPriority: fetchedReports.filter(report => report.priority === "High").length
        });
      } catch (error) {
        console.error("Failed to fetch reports:", error);
      }
    };
    
    fetchReports();
  }, []);

  const handleStatCardClick = (filter: string) => {
    switch(filter) {
      case "total":
        navigate("/reports", { state: { filter: "all" } });
        break;
      case "open":
        navigate("/reports", { state: { filter: "status", value: "Open" } });
        break;
      case "highPriority":
        navigate("/reports", { state: { filter: "priority", value: "High" } });
        break;
    }
  };

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Total Reports" 
          value={stats.total} 
          icon={CheckCircle} 
          description="All reports in the system"
          className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200"
          onClick={() => handleStatCardClick("total")}
          style={{ animationDelay: "0s" }}
        />
        
        <StatCard 
          title="Open Issues" 
          value={stats.open} 
          icon={AlertCircle} 
          description="Reports needing attention"
          className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200"
          onClick={() => handleStatCardClick("open")}
          style={{ animationDelay: "0.1s" }}
        />
        
        <StatCard 
          title="High Priority" 
          value={stats.highPriority} 
          icon={Flag} 
          description="Critical reports"
          className="bg-gradient-to-br from-red-50 to-red-100 border-red-200"
          onClick={() => handleStatCardClick("highPriority")}
          style={{ animationDelay: "0.2s" }}
        />
      </div>
      
      <div className="mt-10">
        <RecentReports reports={reports} />
      </div>
    </div>
  );
};

export default Dashboard;
