import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
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

interface PropertyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PropertyModal({ open, onOpenChange }: PropertyModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
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
    { value: "apartment", label: "Apartment Complex" },
    { value: "house", label: "Single Family Home" },
    { value: "commercial", label: "Commercial Building" },
    { value: "mixed_use", label: "Mixed Use Property" }
  ];

  const amenityOptions = [
    "Pool", "Gym", "Parking", "Laundry", "Balcony", 
    "Storage", "Garden", "Security", "Elevator", "AC"
  ];

  const handleAmenityChange = (amenity: string, checked: boolean) => {
    const updated = checked 
      ? [...selectedAmenities, amenity]
      : selectedAmenities.filter(a => a !== amenity);
    setSelectedAmenities(updated);
    setValue("amenities", updated);
  };

  const onSubmit = async (data: PropertyFormData) => {
    if (!authState.user) return;

    setIsSubmitting(true);
    try {
      const propertyData = {
        ...data,
        amenities: selectedAmenities,
      };

      await apiRequest("POST", "/api/properties", propertyData);
      await queryClient.invalidateQueries({ queryKey: ["/api/properties"] });
      
      toast({
        title: "Success",
        description: "Property added successfully!",
      });
      
      reset();
      setSelectedAmenities([]);
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add property. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Add New Property</DialogTitle>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Property Name</Label>
              <Input
                id="name"
                {...register("name")}
                placeholder="e.g., Sunset Apartments"
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="propertyType">Property Type</Label>
              <Select onValueChange={(value) => setValue("propertyType", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select property type" />
                </SelectTrigger>
                <SelectContent>
                  {propertyTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.propertyType && (
                <p className="text-sm text-destructive">{errors.propertyType.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              {...register("address")}
              placeholder="123 Main Street"
            />
            {errors.address && (
              <p className="text-sm text-destructive">{errors.address.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                {...register("city")}
                placeholder="San Francisco"
              />
              {errors.city && (
                <p className="text-sm text-destructive">{errors.city.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Input
                id="state"
                {...register("state")}
                placeholder="CA"
                maxLength={2}
              />
              {errors.state && (
                <p className="text-sm text-destructive">{errors.state.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="zipCode">ZIP Code</Label>
              <Input
                id="zipCode"
                {...register("zipCode")}
                placeholder="94102"
              />
              {errors.zipCode && (
                <p className="text-sm text-destructive">{errors.zipCode.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="units">Number of Units</Label>
              <Input
                id="units"
                type="number"
                {...register("units", { valueAsNumber: true })}
                placeholder="24"
              />
              {errors.units && (
                <p className="text-sm text-destructive">{errors.units.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="squareFootage">Square Footage</Label>
              <Input
                id="squareFootage"
                type="number"
                {...register("squareFootage", { valueAsNumber: true })}
                placeholder="18000"
              />
              {errors.squareFootage && (
                <p className="text-sm text-destructive">{errors.squareFootage.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="yearBuilt">Year Built</Label>
              <Input
                id="yearBuilt"
                type="number"
                {...register("yearBuilt", { valueAsNumber: true })}
                placeholder="2015"
              />
              {errors.yearBuilt && (
                <p className="text-sm text-destructive">{errors.yearBuilt.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Amenities</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {amenityOptions.map((amenity) => (
                <div key={amenity} className="flex items-center space-x-2">
                  <Checkbox
                    id={amenity}
                    checked={selectedAmenities.includes(amenity)}
                    onCheckedChange={(checked) => 
                      handleAmenityChange(amenity, checked as boolean)
                    }
                  />
                  <Label htmlFor={amenity} className="text-sm font-normal">
                    {amenity}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="bg-slate-900 hover:bg-slate-800"
            >
              {isSubmitting ? "Adding..." : "Add Property"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}