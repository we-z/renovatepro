import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { authService } from "./lib/auth";
import { useState, useEffect } from "react";

import Dashboard from "@/pages/dashboard";
import Projects from "@/pages/projects";
import Contractors from "@/pages/contractors";
import Messages from "@/pages/messages";
import Login from "@/pages/login";
import NotFound from "@/pages/not-found";

function Router() {
  const [authState, setAuthState] = useState(authService.getState());

  useEffect(() => {
    return authService.subscribe(setAuthState);
  }, []);

  if (!authState.isAuthenticated) {
    return <Login />;
  }

  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/projects" component={Projects} />
      <Route path="/contractors" component={Contractors} />
      <Route path="/messages" component={Messages} />
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
