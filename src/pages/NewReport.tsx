
import Navbar from "@/components/layout/Navbar";
import ReportForm from "@/components/reports/ReportForm";

const NewReport = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <ReportForm />
      </main>
    </div>
  );
};

export default NewReport;
