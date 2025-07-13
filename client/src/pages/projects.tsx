import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Navigation } from "@/components/navigation";
import { SubscriptionGuard } from "@/components/subscription-guard";
import { ProjectCard } from "@/components/project-card";
import { BidTable } from "@/components/bid-table";
import { PropertyModal } from "@/components/property-modal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Search, Filter, Plus, DollarSign, Calendar, MapPin } from "lucide-react";
import { authService } from "@/lib/auth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertMaintenanceRequestSchema } from "@shared/schema";
import { z } from "zod";

const maintenanceFormSchema = insertMaintenanceRequestSchema.omit({ propertyId: true });
type MaintenanceFormData = z.infer<typeof maintenanceFormSchema>;

export default function Projects() {
  const [authState, setAuthState] = useState(authService.getState());
  const [showPropertyModal, setShowPropertyModal] = useState(false);
  const [showMaintenanceModal, setShowMaintenanceModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const { toast } = useToast();

  useEffect(() => {
    return authService.subscribe(setAuthState);
  }, []);

  // Fetch data based on user type
  const { data: projects = [], isLoading } = useQuery({
    queryKey: authState.user?.userType === "property_manager" 
      ? ["/api/users", authState.user?.id, "properties"]
      : ["/api/properties"],
  });

  const { data: projectBids = [] } = useQuery({
    queryKey: ["/api/projects", "all-bids"],
    queryFn: async () => {
      if (!authState.user || authState.user.userType !== "homeowner" || projects.length === 0) {
        return [];
      }
      
      const allBids = [];
      for (const project of projects) {
        const response = await fetch(`/api/projects/${project.id}/bids`);
        if (response.ok) {
          const bids = await response.json();
          allBids.push(...bids.map((bid: any) => ({ ...bid, projectTitle: project.title })));
        }
      }
      return allBids;
    },
    enabled: authState.user?.userType === "homeowner" && projects.length > 0,
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<MaintenanceFormData>({
    resolver: zodResolver(maintenanceFormSchema),
  });

  const categories = [
    "Kitchen Renovation",
    "Bathroom Remodel", 
    "Roofing",
    "Flooring",
    "Deck/Patio",
    "Painting",
    "General Construction",
  ];

  const filteredProjects = projects.filter((project: any) => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || project.category === categoryFilter;
    const matchesStatus = statusFilter === "all" || project.status === statusFilter;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleBidSubmit = async (data: BidFormData) => {
    if (!authState.contractor || !selectedProject) return;

    try {
      const bidData = {
        ...data,
        amount: parseInt(data.amount.toString()),
        projectId: selectedProject.id,
        contractorId: authState.contractor.id,
      };

      await apiRequest("POST", "/api/bids", bidData);

      toast({
        title: "Bid submitted successfully!",
        description: "The homeowner will review your proposal.",
      });

      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      reset();
      setShowBidModal(false);
      setSelectedProject(null);
    } catch (error) {
      toast({
        title: "Failed to submit bid",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  const handlePlaceBid = (project: any) => {
    setSelectedProject(project);
    setShowBidModal(true);
  };

  const handleAcceptBid = async (bid: any) => {
    try {
      await apiRequest("PUT", `/api/bids/${bid.id}`, { status: "accepted" });
      
      toast({
        title: "Bid accepted!",
        description: `You have awarded the project to ${bid.contractor?.companyName}.`,
      });

      queryClient.invalidateQueries({ queryKey: ["/api/projects", "all-bids"] });
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

      queryClient.invalidateQueries({ queryKey: ["/api/projects", "all-bids"] });
    } catch (error) {
      toast({
        title: "Failed to reject bid",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <SubscriptionGuard feature="project management">
        <div className="min-h-screen bg-neutral-50">
          <Navigation />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center">Loading...</div>
          </div>
        </div>
      </SubscriptionGuard>
    );
  }

  return (
    <SubscriptionGuard feature="project management">
      <div className="min-h-screen bg-neutral-50">
        <Navigation onPostProject={() => setShowProjectModal(true)} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 md:pb-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900 mb-2">
              {authState.user?.userType === "homeowner" ? "Your Projects" : "Available Projects"}
            </h1>
            <p className="text-neutral-600">
              {authState.user?.userType === "homeowner" 
                ? "Manage your renovation projects and review bids"
                : "Find and bid on renovation projects"
              }
            </p>
          </div>
          {authState.user?.userType === "homeowner" && (
            <Button onClick={() => setShowProjectModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Post Project
            </Button>
          )}
        </div>

        {authState.user?.userType === "homeowner" ? (
          /* Homeowner View */
          <Tabs defaultValue="projects" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="projects">Projects ({projects.length})</TabsTrigger>
              <TabsTrigger value="bids">Bids ({projectBids.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="projects" className="space-y-6">
              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-neutral-400" />
                  <Input
                    placeholder="Search projects..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="posted">Posted</SelectItem>
                    <SelectItem value="bidding">Bidding</SelectItem>
                    <SelectItem value="awarded">Awarded</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Projects Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.length === 0 ? (
                  <div className="col-span-full text-center py-12">
                    <p className="text-neutral-600 mb-4">
                      {projects.length === 0 ? "No projects yet." : "No projects match your filters."}
                    </p>
                    {projects.length === 0 && (
                      <Button onClick={() => setShowProjectModal(true)}>
                        Post Your First Project
                      </Button>
                    )}
                  </div>
                ) : (
                  filteredProjects.map((project: any) => (
                    <ProjectCard key={project.id} project={project} />
                  ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="bids" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>All Bids</CardTitle>
                </CardHeader>
                <CardContent>
                  <BidTable
                    bids={projectBids}
                    onAcceptBid={handleAcceptBid}
                    onRejectBid={handleRejectBid}
                    showProjectColumn={true}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        ) : (
          /* Contractor View */
          <div className="space-y-6">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-neutral-400" />
                <Input
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <p className="text-neutral-600">No projects match your filters.</p>
                </div>
              ) : (
                filteredProjects
                  .filter((project: any) => project.status === "posted" || project.status === "bidding")
                  .map((project: any) => (
                    <Card key={project.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="font-semibold text-neutral-900 mb-1">
                              {project.title}
                            </h3>
                            <div className="flex items-center text-sm text-neutral-600 mb-2">
                              <MapPin className="h-4 w-4 mr-1" />
                              {project.location}
                            </div>
                          </div>
                          <Badge className="bg-orange-100 text-orange-800">
                            Bidding
                          </Badge>
                        </div>

                        <p className="text-sm text-neutral-600 mb-4 line-clamp-3">
                          {project.description}
                        </p>

                        <div className="flex items-center justify-between text-sm mb-4">
                          <div className="flex items-center text-neutral-600">
                            <DollarSign className="h-4 w-4 mr-1" />
                            <span className="font-medium text-neutral-900">
                              {project.budgetMin && project.budgetMax 
                                ? `$${project.budgetMin.toLocaleString()} - $${project.budgetMax.toLocaleString()}`
                                : "Budget not specified"
                              }
                            </span>
                          </div>
                          {project.timeline && (
                            <div className="flex items-center text-neutral-600">
                              <Calendar className="h-4 w-4 mr-1" />
                              <span>{project.timeline}</span>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-neutral-200">
                          <div className="text-xs text-neutral-500">
                            Category: {project.category}
                          </div>
                          <Button
                            size="sm"
                            onClick={() => handlePlaceBid(project)}
                          >
                            Place Bid
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
              )}
            </div>
          </div>
        )}
      </div>

      <ProjectModal
        open={showProjectModal}
        onOpenChange={setShowProjectModal}
      />

      {/* Bid Modal */}
      <Dialog open={showBidModal} onOpenChange={setShowBidModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Submit Bid</DialogTitle>
            <p className="text-sm text-neutral-600">
              {selectedProject?.title}
            </p>
          </DialogHeader>

          <form onSubmit={handleSubmit(handleBidSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Bid Amount ($)</Label>
              <Input
                id="amount"
                type="number"
                {...register("amount", { valueAsNumber: true })}
                placeholder="25000"
              />
              {errors.amount && (
                <p className="text-sm text-destructive">{errors.amount.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="timeline">Timeline</Label>
              <Input
                id="timeline"
                {...register("timeline")}
                placeholder="2-3 weeks"
              />
              {errors.timeline && (
                <p className="text-sm text-destructive">{errors.timeline.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Proposal Details (Optional)</Label>
              <Textarea
                id="description"
                {...register("description")}
                rows={3}
                placeholder="Describe your approach, materials, etc..."
              />
            </div>

            <div className="flex items-center justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowBidModal(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Submit Bid</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      </div>
    </SubscriptionGuard>
  );
}
