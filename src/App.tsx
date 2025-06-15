import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Chat from "./pages/Chat";
import Alerts from "./pages/Alerts";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import Knowledge from "./pages/Knowledge";
import ShiftSummaryPage from "./pages/ShiftSummary";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings"; // Add this import

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/alerts" element={<Alerts />} />
        <Route path="/incidents" element={<Alerts />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/workspaces" element={<Dashboard />} />
        <Route path="/knowledge" element={<Knowledge />} />
        <Route path="/connectors" element={<Dashboard />} />
        <Route path="/shift-summary" element={<ShiftSummaryPage />} />
        <Route path="/analytics" element={<Analytics />} /> {/* FIX: now renders Analytics page */}
        <Route path="/settings" element={<Settings />} /> {/* FIX: was <Dashboard /> */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
