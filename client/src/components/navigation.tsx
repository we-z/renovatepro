import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Hammer, Bell, Home, FolderOpen, Users, MessageCircle, Menu } from "lucide-react";
import { authService } from "@/lib/auth";
import { useState, useEffect } from "react";
import { ProjectModal } from "./project-modal";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface NavigationProps {
  onPostProject?: () => void;
}

export function Navigation({ onPostProject }: NavigationProps) {
  const [location] = useLocation();
  const [authState, setAuthState] = useState(authService.getState());
  const [showProjectModal, setShowProjectModal] = useState(false);

  useEffect(() => {
    return authService.subscribe(setAuthState);
  }, []);

  const handleLogout = () => {
    authService.logout();
  };

  const handlePostProject = () => {
    if (onPostProject) {
      onPostProject();
    } else {
      setShowProjectModal(true);
    }
  };

  const navItems = [
    { path: "/app", label: "Dashboard", icon: Home },
    { path: "/app/projects", label: "Projects", icon: FolderOpen },
    { path: "/app/contractors", label: "Contractors", icon: Users },
    { path: "/app/messages", label: "Messages", icon: MessageCircle },
  ];

  const getInitials = (firstName?: string, lastName?: string) => {
    if (!firstName || !lastName) return "U";
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <>
      <header className="bg-white shadow-sm border-b border-neutral-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <Link href="/app" className="flex items-center space-x-2">
                <Hammer className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold text-neutral-900">RenovatePro</span>
              </Link>
              
              <nav className="hidden md:flex space-x-6">
                {navItems.map((item) => {
                  const isActive = location === item.path;
                  return (
                    <Link
                      key={item.path}
                      href={item.path}
                      className={`px-1 pb-1 font-medium transition-colors ${
                        isActive
                          ? "text-primary border-b-2 border-primary"
                          : "text-neutral-600 hover:text-primary"
                      }`}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="flex items-center space-x-4">
              {authState.user?.userType === "homeowner" && (
                <Button onClick={handlePostProject} className="bg-accent hover:bg-accent/90">
                  Post Project
                </Button>
              )}
              
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="h-4 w-4" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </Button>
              
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {getInitials(authState.user?.firstName, authState.user?.lastName)}
                  </span>
                </div>
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  Logout
                </Button>
              </div>

              {/* Mobile menu */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className="md:hidden">
                    <Menu className="h-4 w-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <div className="flex flex-col space-y-4 mt-8">
                    {navItems.map((item) => {
                      const Icon = item.icon;
                      const isActive = location === item.path;
                      return (
                        <Link
                          key={item.path}
                          href={item.path}
                          className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                            isActive
                              ? "bg-primary text-white"
                              : "text-neutral-700 hover:bg-neutral-100"
                          }`}
                        >
                          <Icon className="h-5 w-5" />
                          <span>{item.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 z-40">
        <div className="grid grid-cols-4 py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`flex flex-col items-center justify-center py-2 ${
                  isActive ? "text-primary" : "text-neutral-600"
                }`}
              >
                <Icon className="h-5 w-5 mb-1" />
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      <ProjectModal
        open={showProjectModal}
        onOpenChange={setShowProjectModal}
      />
    </>
  );
}
