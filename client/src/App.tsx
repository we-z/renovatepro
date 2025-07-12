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
import Landing from "@/pages/landing";
import Subscribe from "@/pages/subscribe";
import NotFound from "@/pages/not-found";

function Router() {
  const [authState, setAuthState] = useState(authService.getState());

  useEffect(() => {
    return authService.subscribe(setAuthState);
  }, []);

  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/subscribe" component={Subscribe} />
      <Route path="/app">
        {!authState.isAuthenticated ? (
          <Login />
        ) : (
          <Switch>
            <Route path="/app" component={Dashboard} />
            <Route path="/app/projects" component={Projects} />
            <Route path="/app/contractors" component={Contractors} />
            <Route path="/app/messages" component={Messages} />
            <Route component={NotFound} />
          </Switch>
        )}
      </Route>
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
