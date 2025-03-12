import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Dashboard from "@/components/dashboard/Dashboard";
import { isAuthenticated } from "./../utils/authUtils";

const Home = () => {
  const navigate = useNavigate();

  // Add this near the top of the component
  useEffect(() => {
    // If not authenticated, navigate to login
    if (!isAuthenticated()) {
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <Dashboard />
      </main>
    </div>
  );
};

export default Home;
