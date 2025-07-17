import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "./hooks/useAuth";

import Dashboard from "@/pages/dashboard";
import Projects from "@/pages/projects";
import Contractors from "@/pages/contractors";
import Messages from "@/pages/messages";
import Landing from "@/pages/landing";
import Subscribe from "@/pages/subscribe";
import DepositPayment from "@/pages/deposit-payment";
import Onboarding from "@/pages/onboarding";
import NotFound from "@/pages/not-found";

function Router() {
  const { user, isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show landing page for unauthenticated users
  if (!isAuthenticated) {
    return (
      <Switch>
        <Route path="/" component={Landing} />
        <Route path="/subscribe" component={Subscribe} />
        <Route component={Landing} />
      </Switch>
    );
  }

  // Show onboarding if user hasn't set their user type
  if (!user?.userType) {
    return <Onboarding />;
  }

  // Show authenticated routes
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/projects" component={Projects} />
      <Route path="/contractors" component={Contractors} />
      <Route path="/messages" component={Messages} />
      <Route path="/subscribe" component={Subscribe} />
      <Route path="/deposit-payment" component={DepositPayment} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
