
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Area, Priority, Report, Status, exportToCSV, filterReports, getReports } from "@/utils/reportUtils";
import Navbar from "@/components/layout/Navbar";
import ReportCard from "@/components/reports/ReportCard";
import ReportFilter from "@/components/reports/ReportFilter";
import { Button } from "@/components/ui/button";
import { FileDown, Loader2 } from "lucide-react";

interface LocationState {
  initialFilters?: {
    search?: string;
    status?: Status[];
    priority?: Priority[];
    area?: Area[];
    dateFrom?: Date;
    dateTo?: Date;
  };
}

const AllReports = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { initialFilters } = (location.state as LocationState) || {};
  
  const [reports, setReports] = useState<Report[]>([]);
  const [filteredReports, setFilteredReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const data = await getReports();
        setReports(data);
        
        // Apply initial filters if provided
        if (initialFilters) {
          const filtered = filterReports(data, initialFilters);
          setFilteredReports(filtered);
        } else {
          setFilteredReports(data);
        }
      } catch (error) {
        console.error("Error fetching reports:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchReports();
  }, [initialFilters]);
  
  const handleFilterChange = (filters: {
    search?: string;
    status?: Status[];
    priority?: Priority[];
    area?: Area[];
    dateFrom?: Date;
    dateTo?: Date;
  }) => {
    const result = filterReports(reports, filters);
    setFilteredReports(result);
  };
  
  const handleExport = () => {
    exportToCSV(filteredReports);
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">All Reports</h1>
            <p className="mt-1 text-gray-500">
              View and manage all maintenance reports
            </p>
          </div>
          
          <Button
            variant="outline"
            className="mt-4 md:mt-0"
            onClick={handleExport}
            disabled={filteredReports.length === 0}
          >
            <FileDown className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        </div>
        
        <div className="mb-6 animate-fade-up">
          <ReportFilter onFilterChange={handleFilterChange} />
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filteredReports.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center animate-fade-up">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No reports found</h3>
            <p className="text-gray-500 mb-6">
              {reports.length === 0
                ? "There are no reports yet. Create your first report to get started."
                : "No reports match your current filter criteria. Try adjusting your filters."}
            </p>
            {reports.length === 0 && (
              <Button onClick={() => navigate("/new-report")}>
                Create First Report
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredReports.map((report, index) => (
              <ReportCard
                key={report.id}
                report={report}
                onClick={() => navigate(`/reports/${report.id}`)}
                className="animate-fade-up"
                style={{ animationDelay: `${index * 0.05}s` }}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default AllReports;
