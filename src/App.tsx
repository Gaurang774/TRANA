
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import ErrorBoundary from "@/components/ErrorBoundary";
import Index from "./pages/Index";
import Emergency from "./pages/Emergency";
import Settings from "./pages/Settings";
import Medicines from "./pages/Medicines";
import Appointments from "./pages/Appointments";
import NotFound from "./pages/NotFound";
import BedManagement from "./pages/BedManagement";
import RoutePlanning from "./pages/RoutePlanning";
import Reports from "./pages/Reports";
import PluginManagement from "./pages/PluginManagement";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error: any) => {
        // Don't retry on 4xx errors except 408, 429
        if (error?.status >= 400 && error?.status < 500 && ![408, 429].includes(error.status)) {
          return false;
        }
        return failureCount < 3;
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
    },
    mutations: {
      retry: false,
    },
  },
});

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/emergency" element={<Emergency />} />
              <Route path="/medicines" element={<Medicines />} />
              <Route path="/appointments" element={<Appointments />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/beds" element={<BedManagement />} />
              <Route path="/routes" element={<RoutePlanning />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/plugins" element={<PluginManagement />} />
              {/* Catch-all route for 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
