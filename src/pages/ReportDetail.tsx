
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Report, getReportById } from "@/utils/reportUtils";
import Navbar from "@/components/layout/Navbar";
import ReportDetailComponent from "@/components/reports/ReportDetail";
import { Loader2 } from "lucide-react";

const ReportDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [report, setReport] = useState<Report | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchReport = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        const data = await getReportById(id);
        
        if (!data) {
          setError("Report not found");
          return;
        }
        
        setReport(data);
      } catch (err) {
        console.error("Error fetching report:", err);
        setError("Failed to load report");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchReport();
  }, [id]);
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="bg-white rounded-xl shadow-soft border border-gray-100 p-8 text-center">
            <h2 className="text-xl font-medium text-gray-900 mb-2">{error}</h2>
            <p className="text-gray-500">
              The report you're looking for could not be found.
            </p>
          </div>
        ) : report ? (
          <ReportDetailComponent report={report} />
        ) : null}
      </main>
    </div>
  );
};

export default ReportDetail;
