
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import Index from "./pages/Index";
import Emergency from "./pages/Emergency";
import Settings from "./pages/Settings";
import Medicines from "./pages/Medicines";
import Appointments from "./pages/Appointments";
import NotFound from "./pages/NotFound";
import BedManagement from "./pages/BedManagement";
import RoutePlanning from "./pages/RoutePlanning";
import Reports from "./pages/Reports";
import Auth from "./pages/Auth";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { useEffect } from "react";

// Create a component to handle redirects from auth routes
const RedirectHandler = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect auth-related routes to auth page
    const currentPath = window.location.pathname;
    if (currentPath === '/login' || currentPath === '/register' || currentPath === '/signup') {
      navigate('/auth');
    }
    
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
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <RedirectHandler />
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/" element={
              <ProtectedRoute>
                <Index />
              </ProtectedRoute>
            } />
            <Route path="/emergency" element={
              <ProtectedRoute>
                <Emergency />
              </ProtectedRoute>
            } />
            <Route path="/medicines" element={
              <ProtectedRoute>
                <Medicines />
              </ProtectedRoute>
            } />
            <Route path="/appointments" element={
              <ProtectedRoute>
                <Appointments />
              </ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            } />
            <Route path="/beds" element={
              <ProtectedRoute>
                <BedManagement />
              </ProtectedRoute>
            } />
            <Route path="/routes" element={
              <ProtectedRoute>
                <RoutePlanning />
              </ProtectedRoute>
            } />
            <Route path="/reports" element={
              <ProtectedRoute>
                <Reports />
              </ProtectedRoute>
            } />
            {/* Redirect legacy auth routes to new auth page */}
            <Route path="/login" element={<Auth />} />
            <Route path="/register" element={<Auth />} />
            <Route path="/signup" element={<Auth />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
