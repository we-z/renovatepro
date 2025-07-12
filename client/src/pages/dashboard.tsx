import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Navigation } from "@/components/navigation";
import { ProjectCard } from "@/components/project-card";
import { ContractorCard } from "@/components/contractor-card";
import { BidTable } from "@/components/bid-table";
import { ProjectModal } from "@/components/project-modal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  FolderOpen, 
  FileText, 
  MessageCircle, 
  CheckCircle2,
  Users,
  Eye,
  Check,
  X
} from "lucide-react";
import { authService } from "@/lib/auth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function Dashboard() {
  const [authState, setAuthState] = useState(authService.getState());
  const [showProjectModal, setShowProjectModal] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    return authService.subscribe(setAuthState);
  }, []);

  // Fetch user's projects if homeowner
  const { data: userProjects = [] } = useQuery({
    queryKey: ["/api/users", authState.user?.id, "projects"],
    enabled: !!authState.user && authState.user.userType === "homeowner",
  });

  // Fetch contractor's bids if contractor
  const { data: contractorBids = [] } = useQuery({
    queryKey: ["/api/contractors", authState.contractor?.id, "bids"],
    enabled: !!authState.contractor,
  });

  // Fetch all projects for contractors
  const { data: allProjects = [] } = useQuery({
    queryKey: ["/api/projects"],
    enabled: authState.user?.userType === "contractor",
  });

  // Fetch recommended contractors for homeowners
  const { data: contractors = [] } = useQuery({
    queryKey: ["/api/contractors"],
    enabled: authState.user?.userType === "homeowner",
  });

  // Fetch bids for homeowner's projects
  const { data: projectBids = [] } = useQuery({
    queryKey: ["/api/projects", "bids"],
    queryFn: async () => {
      if (!authState.user || authState.user.userType !== "homeowner" || userProjects.length === 0) {
        return [];
      }
      
      const allBids = [];
      for (const project of userProjects) {
        const response = await fetch(`/api/projects/${project.id}/bids`);
        if (response.ok) {
          const bids = await response.json();
          allBids.push(...bids);
        }
      }
      return allBids;
    },
    enabled: !!authState.user && authState.user.userType === "homeowner" && userProjects.length > 0,
  });

  const handleAcceptBid = async (bid: any) => {
    try {
      await apiRequest("PUT", `/api/bids/${bid.id}`, { status: "accepted" });
      
      toast({
        title: "Bid accepted!",
        description: `You have awarded the project to ${bid.contractor?.companyName}.`,
      });

      queryClient.invalidateQueries({ queryKey: ["/api/projects", "bids"] });
      queryClient.invalidateQueries({ queryKey: ["/api/users", authState.user?.id, "projects"] });
    } catch (error) {
      toast({
        title: "Failed to accept bid",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleRejectBid = async (bid: any) => {
    try {
      await apiRequest("PUT", `/api/bids/${bid.id}`, { status: "rejected" });
      
      toast({
        title: "Bid rejected",
        description: "The contractor has been notified.",
      });

      queryClient.invalidateQueries({ queryKey: ["/api/projects", "bids"] });
    } catch (error) {
      toast({
        title: "Failed to reject bid",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  const getQuickStats = () => {
    if (authState.user?.userType === "homeowner") {
      return {
        activeProjects: userProjects.filter((p: any) => p.status !== "completed").length,
        pendingBids: projectBids.filter((b: any) => b.status === "pending").length,
        messages: 0, // TODO: Implement message count
        completed: userProjects.filter((p: any) => p.status === "completed").length,
      };
    } else {
      return {
        activeProjects: contractorBids.filter((b: any) => b.status === "accepted").length,
        pendingBids: contractorBids.filter((b: any) => b.status === "pending").length,
        messages: 0, // TODO: Implement message count
        completed: contractorBids.filter((b: any) => b.status === "accepted" && b.project?.status === "completed").length,
      };
    }
  };

  const stats = getQuickStats();

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navigation onPostProject={() => setShowProjectModal(true)} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 md:pb-8">
        {/* Dashboard Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">
            Welcome back, {authState.user?.firstName}
          </h1>
          <p className="text-neutral-600">
            {authState.user?.userType === "homeowner" 
              ? "Manage your renovation projects and connect with trusted contractors"
              : "Find new projects and manage your bids"
            }
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-neutral-600">
                    {authState.user?.userType === "homeowner" ? "Active Projects" : "Active Contracts"}
                  </p>
                  <p className="text-2xl font-bold text-neutral-900">{stats.activeProjects}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FolderOpen className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-neutral-600">Pending Bids</p>
                  <p className="text-2xl font-bold text-neutral-900">{stats.pendingBids}</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <FileText className="h-6 w-6 text-accent" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-neutral-600">Messages</p>
                  <p className="text-2xl font-bold text-neutral-900">{stats.messages}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <MessageCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-neutral-600">Completed</p>
                  <p className="text-2xl font-bold text-neutral-900">{stats.completed}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle2 className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {authState.user?.userType === "homeowner" ? (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Your Projects</CardTitle>
                    <Button variant="ghost" size="sm">View All</Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {userProjects.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-neutral-600 mb-4">No projects yet.</p>
                        <Button onClick={() => setShowProjectModal(true)}>
                          Post Your First Project
                        </Button>
                      </div>
                    ) : (
                      userProjects.slice(0, 3).map((project: any) => (
                        <ProjectCard key={project.id} project={project} />
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Available Projects</CardTitle>
                    <Button variant="ghost" size="sm">View All</Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {allProjects.length === 0 ? (
                      <div className="text-center py-8 text-neutral-600">
                        No projects available at the moment.
                      </div>
                    ) : (
                      allProjects
                        .filter((project: any) => project.status === "posted" || project.status === "bidding")
                        .slice(0, 3)
                        .map((project: any) => (
                          <ProjectCard key={project.id} project={project} />
                        ))
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {authState.user?.userType === "homeowner" ? (
              <Card>
                <CardHeader>
                  <CardTitle>Recommended Contractors</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {contractors.slice(0, 3).map((contractor: any) => (
                      <div key={contractor.id} className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-white text-sm font-medium">
                            {contractor.user?.firstName?.[0]}{contractor.user?.lastName?.[0]}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-neutral-900">
                            {contractor.companyName}
                          </p>
                          <p className="text-xs text-neutral-600">
                            ⭐ {Number(contractor.rating).toFixed(1)} ({contractor.reviewCount} reviews)
                          </p>
                          <p className="text-xs text-neutral-600">
                            {contractor.specialties?.[0] || "General Contractor"}
                          </p>
                        </div>
                        <Button size="sm" variant="outline">View</Button>
                      </div>
                    ))}
                    {contractors.length > 3 && (
                      <Button variant="ghost" size="sm" className="w-full">
                        Browse All Contractors
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Your Recent Bids</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {contractorBids.slice(0, 3).map((bid: any) => (
                      <div key={bid.id} className="border border-neutral-200 rounded-lg p-3">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="font-medium text-sm">{bid.project?.title}</p>
                            <p className="text-xs text-neutral-600">{bid.project?.location}</p>
                          </div>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            bid.status === "pending" ? "bg-yellow-100 text-yellow-800" :
                            bid.status === "accepted" ? "bg-green-100 text-green-800" :
                            "bg-red-100 text-red-800"
                          }`}>
                            {bid.status}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-xs text-neutral-600">
                          <span>Bid: ${bid.amount.toLocaleString()}</span>
                          <span>{bid.timeline}</span>
                        </div>
                      </div>
                    ))}
                    {contractorBids.length === 0 && (
                      <p className="text-center text-neutral-600 text-sm py-4">
                        No bids submitted yet.
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Recent Bids Table (for homeowners) */}
        {authState.user?.userType === "homeowner" && projectBids.length > 0 && (
          <Card className="mt-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Recent Bids</CardTitle>
                <Select defaultValue="all">
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Projects</SelectItem>
                    {userProjects.map((project: any) => (
                      <SelectItem key={project.id} value={project.id.toString()}>
                        {project.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <BidTable
                bids={projectBids.slice(0, 5)}
                onAcceptBid={handleAcceptBid}
                onRejectBid={handleRejectBid}
              />
            </CardContent>
          </Card>
        )}
      </div>

      <ProjectModal
        open={showProjectModal}
        onOpenChange={setShowProjectModal}
      />
    </div>
  );
}
