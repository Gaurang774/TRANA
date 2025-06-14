
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/contexts/AuthContext";
import { AuthGuard } from "@/components/auth/AuthGuard";
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
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <RedirectHandler />
            <Routes>
              <Route path="/auth" element={<Auth />} />
              <Route path="/" element={
                <AuthGuard>
                  <Index />
                </AuthGuard>
              } />
              <Route path="/emergency" element={
                <AuthGuard roles={['admin', 'doctor', 'dispatcher', 'paramedic']}>
                  <Emergency />
                </AuthGuard>
              } />
              <Route path="/medicines" element={
                <AuthGuard roles={['admin', 'doctor', 'nurse']}>
                  <Medicines />
                </AuthGuard>
              } />
              <Route path="/appointments" element={
                <AuthGuard>
                  <Appointments />
                </AuthGuard>
              } />
              <Route path="/settings" element={
                <AuthGuard>
                  <Settings />
                </AuthGuard>
              } />
              <Route path="/beds" element={
                <AuthGuard roles={['admin', 'doctor', 'nurse']}>
                  <BedManagement />
                </AuthGuard>
              } />
              <Route path="/routes" element={
                <AuthGuard roles={['admin', 'dispatcher', 'paramedic']}>
                  <RoutePlanning />
                </AuthGuard>
              } />
              <Route path="/reports" element={
                <AuthGuard roles={['admin', 'doctor']}>
                  <Reports />
                </AuthGuard>
              } />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
