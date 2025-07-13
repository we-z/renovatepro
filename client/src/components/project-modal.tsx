import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertPropertySchema } from "@shared/schema";
import { z } from "zod";
import { authService } from "@/lib/auth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { X } from "lucide-react";

const propertyFormSchema = insertPropertySchema.extend({
  yearBuilt: z.number().min(1800).max(new Date().getFullYear()),
  units: z.number().min(1).max(1000),
  squareFootage: z.number().min(100).max(100000),
});

type PropertyFormData = z.infer<typeof propertyFormSchema>;

interface ProjectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProjectModal({ open, onOpenChange }: ProjectModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const authState = authService.getState();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<PropertyFormData>({
    resolver: zodResolver(propertyFormSchema),
    defaultValues: {
      managerId: authState.user?.id || 0,
      status: "active",
      images: [],
      amenities: [],
    },
  });

  const propertyTypes = [
    "apartment",
    "house", 
    "commercial",
    "mixed_use"
  ];

  const amenityOptions = [
    "Pool",
    "Gym", 
    "Parking",
    "Laundry",
    "Balcony",
    "Storage",
    "Garden",
    "Security"
  ];

  const onSubmit = async (data: PropertyFormData) => {
    if (!authState.user) return;

    setIsSubmitting(true);
    try {
      const budgetRange = budgetRanges.find(range => range.value === data.budgetRange);
      
      const projectData = {
        ...data,
        homeownerId: authState.user.id,
        budgetMin: budgetRange?.min || 0,
        budgetMax: budgetRange?.max || 0,
      };

      delete (projectData as any).budgetRange;

      await apiRequest("POST", "/api/projects", projectData);

      toast({
        title: "Project posted successfully!",
        description: "Your project is now live and contractors can start bidding.",
      });

      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      queryClient.invalidateQueries({ queryKey: ["/api/users", authState.user.id, "projects"] });
      
      reset();
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Failed to post project",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Post New Project</DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onOpenChange(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Project Title</Label>
            <Input
              id="title"
              {...register("title")}
              placeholder="e.g., Kitchen Renovation"
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Project Category</Label>
            <Select onValueChange={(value) => setValue("category", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && (
              <p className="text-sm text-destructive">{errors.category.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register("description")}
              rows={4}
              placeholder="Describe your project in detail..."
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="budgetRange">Budget Range</Label>
              <Select onValueChange={(value) => setValue("budgetRange", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select budget range" />
                </SelectTrigger>
                <SelectContent>
                  {budgetRanges.map((range) => (
                    <SelectItem key={range.value} value={range.value}>
                      {range.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.budgetRange && (
                <p className="text-sm text-destructive">{errors.budgetRange.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="timeline">Preferred Timeline</Label>
              <Select onValueChange={(value) => setValue("timeline", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select timeline" />
                </SelectTrigger>
                <SelectContent>
                  {timelines.map((timeline) => (
                    <SelectItem key={timeline} value={timeline}>
                      {timeline}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.timeline && (
                <p className="text-sm text-destructive">{errors.timeline.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              {...register("location")}
              placeholder="City, State"
            />
            {errors.location && (
              <p className="text-sm text-destructive">{errors.location.message}</p>
            )}
          </div>

          <div className="flex items-center justify-end space-x-4 pt-4 border-t border-neutral-200">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Posting..." : "Post Project"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
