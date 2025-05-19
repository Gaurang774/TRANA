
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import Index from "./pages/Index";
import Emergency from "./pages/Emergency";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import BedManagement from "./pages/BedManagement";
import RoutePlanning from "./pages/RoutePlanning";
import Reports from "./pages/Reports";
import { useEffect } from "react";

// Create a component to handle redirects from wrong urls
const RedirectHandler = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if we have a navigate state in sessionStorage
    const redirectPath = sessionStorage.getItem('redirectTo');
    if (redirectPath) {
      sessionStorage.removeItem('redirectTo');
      navigate(redirectPath);
    }
  }, [navigate]);
  
  return null;
};

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <RedirectHandler />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/emergency" element={<Emergency />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/login" element={<Login />} />
          <Route path="/beds" element={<BedManagement />} />
          <Route path="/routes" element={<RoutePlanning />} />
          <Route path="/reports" element={<Reports />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
