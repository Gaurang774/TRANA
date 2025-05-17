
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center bg-white p-8 rounded-lg shadow-sm border max-w-md">
        <div className="mx-auto w-16 h-16 bg-medical-red/10 rounded-full flex items-center justify-center mb-6">
          <AlertTriangle className="h-8 w-8 text-medical-red" />
        </div>
        <h1 className="text-3xl font-bold mb-2 text-gray-900">404</h1>
        <p className="text-xl text-gray-600 mb-6">
          This emergency route was not found
        </p>
        <p className="text-gray-500 mb-6">
          The page you're looking for doesn't exist or may have been moved.
        </p>
        <Button asChild className="bg-medical-blue hover:bg-medical-blue/90">
          <a href="/">Return to Command Center</a>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
