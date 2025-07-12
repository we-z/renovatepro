import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Navigation } from "@/components/navigation";
import { SubscriptionGuard } from "@/components/subscription-guard";
import { ContractorCard } from "@/components/contractor-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Search, Filter, Star, MapPin, Phone, Mail, Shield, Award, Calendar } from "lucide-react";
import { authService } from "@/lib/auth";
import type { Contractor } from "@shared/schema";

export default function Contractors() {
  const [authState, setAuthState] = useState(authService.getState());
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("all");
  const [specialtyFilter, setSpecialtyFilter] = useState("all");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [selectedContractor, setSelectedContractor] = useState<any>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);

  useEffect(() => {
    return authService.subscribe(setAuthState);
  }, []);

  const { data: contractors = [], isLoading } = useQuery({
    queryKey: ["/api/contractors"],
  });

  const specialties = [
    "Kitchen Renovation",
    "Bathroom Remodel",
    "Roofing",
    "Flooring",
    "Deck/Patio",
    "Painting",
    "General Construction",
  ];

  const locations = Array.from(
    new Set(
      contractors
        .map((contractor: any) => contractor.user?.location)
        .filter(Boolean)
        .map((location: string) => location.split(",")[1]?.trim())
        .filter(Boolean)
    )
  ).sort();

  const filteredContractors = contractors.filter((contractor: any) => {
    const matchesSearch = 
      contractor.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contractor.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contractor.specialties?.some((specialty: string) => 
        specialty.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesLocation = 
      locationFilter === "all" || 
      contractor.user?.location?.includes(locationFilter);

    const matchesSpecialty = 
      specialtyFilter === "all" || 
      contractor.specialties?.includes(specialtyFilter);

    const matchesRating = 
      ratingFilter === "all" || 
      (ratingFilter === "4+" && Number(contractor.rating) >= 4) ||
      (ratingFilter === "3+" && Number(contractor.rating) >= 3);

    return matchesSearch && matchesLocation && matchesSpecialty && matchesRating;
  });

  const handleViewProfile = (contractor: any) => {
    setSelectedContractor(contractor);
    setShowProfileModal(true);
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />);
    }

    if (hasHalfStar) {
      stars.push(<Star key="half" className="h-4 w-4 fill-yellow-400/50 text-yellow-400" />);
    }

    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="h-4 w-4 text-gray-300" />);
    }

    return stars;
  };

  const getInitials = (firstName?: string, lastName?: string) => {
    if (!firstName || !lastName) return "C";
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">Loading contractors...</div>
        </div>
      </div>
    );
  }

  return (
    <SubscriptionGuard feature="contractor directory">
      <div className="min-h-screen bg-neutral-50">
        <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 md:pb-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">
            Find Trusted Contractors
          </h1>
          <p className="text-neutral-600">
            Browse verified contractors and find the perfect match for your renovation project
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-neutral-400" />
                <Input
                  placeholder="Search contractors, specialties..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Select value={locationFilter} onValueChange={setLocationFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                {locations.map((location) => (
                  <SelectItem key={location} value={location}>
                    {location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={specialtyFilter} onValueChange={setSpecialtyFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Specialty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Specialties</SelectItem>
                {specialties.map((specialty) => (
                  <SelectItem key={specialty} value={specialty}>
                    {specialty}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={ratingFilter} onValueChange={setRatingFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Rating" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Ratings</SelectItem>
                <SelectItem value="4+">4+ Stars</SelectItem>
                <SelectItem value="3+">3+ Stars</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between mt-4 pt-4 border-t border-neutral-200">
            <div className="text-sm text-neutral-600">
              {filteredContractors.length} contractor{filteredContractors.length !== 1 ? 's' : ''} found
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchTerm("");
                setLocationFilter("all");
                setSpecialtyFilter("all");
                setRatingFilter("all");
              }}
            >
              <Filter className="h-4 w-4 mr-2" />
              Clear Filters
            </Button>
          </div>
        </div>

        {/* Contractors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredContractors.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-neutral-600">
                No contractors match your search criteria.
              </p>
            </div>
          ) : (
            filteredContractors.map((contractor: any) => (
              <ContractorCard
                key={contractor.id}
                contractor={contractor}
                onViewProfile={handleViewProfile}
                showActions={true}
              />
            ))
          )}
        </div>
      </div>

      {/* Contractor Profile Modal */}
      <Dialog open={showProfileModal} onOpenChange={setShowProfileModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedContractor && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl">
                  {selectedContractor.companyName}
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-6">
                {/* Header Info */}
                <div className="flex items-start space-x-6">
                  <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-2xl font-medium">
                      {getInitials(
                        selectedContractor.user?.firstName,
                        selectedContractor.user?.lastName
                      )}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="flex items-center">
                        {renderStars(Number(selectedContractor.rating) || 0)}
                      </div>
                      <span className="text-lg font-semibold">
                        {Number(selectedContractor.rating).toFixed(1)}
                      </span>
                      <span className="text-neutral-600">
                        ({selectedContractor.reviewCount} reviews)
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      {selectedContractor.user?.location && (
                        <div className="flex items-center text-neutral-600">
                          <MapPin className="h-4 w-4 mr-2" />
                          {selectedContractor.user.location}
                        </div>
                      )}
                      {selectedContractor.experience && (
                        <div className="flex items-center text-neutral-600">
                          <Calendar className="h-4 w-4 mr-2" />
                          {selectedContractor.experience} years experience
                        </div>
                      )}
                      {selectedContractor.user?.phone && (
                        <div className="flex items-center text-neutral-600">
                          <Phone className="h-4 w-4 mr-2" />
                          {selectedContractor.user.phone}
                        </div>
                      )}
                      {selectedContractor.user?.email && (
                        <div className="flex items-center text-neutral-600">
                          <Mail className="h-4 w-4 mr-2" />
                          {selectedContractor.user.email}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center space-x-4 mt-4">
                      {selectedContractor.insurance && (
                        <div className="flex items-center text-green-600">
                          <Shield className="h-4 w-4 mr-1" />
                          <span className="text-sm font-medium">Insured</span>
                        </div>
                      )}
                      {selectedContractor.licenses && selectedContractor.licenses.length > 0 && (
                        <div className="flex items-center text-blue-600">
                          <Award className="h-4 w-4 mr-1" />
                          <span className="text-sm font-medium">Licensed</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Description */}
                {selectedContractor.description && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">About</h3>
                    <p className="text-neutral-600 leading-relaxed">
                      {selectedContractor.description}
                    </p>
                  </div>
                )}

                {/* Specialties */}
                {selectedContractor.specialties && selectedContractor.specialties.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Specialties</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedContractor.specialties.map((specialty: string, index: number) => (
                        <Badge key={index} variant="secondary">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Licenses */}
                {selectedContractor.licenses && selectedContractor.licenses.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Licenses & Certifications</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedContractor.licenses.map((license: string, index: number) => (
                        <Badge key={index} variant="outline">
                          {license}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Portfolio */}
                {selectedContractor.portfolio && selectedContractor.portfolio.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Portfolio</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {selectedContractor.portfolio.map((image: string, index: number) => (
                        <div
                          key={index}
                          className="aspect-square bg-neutral-200 rounded-lg flex items-center justify-center"
                        >
                          <span className="text-neutral-500 text-sm">Portfolio Image</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center space-x-4 pt-4 border-t border-neutral-200">
                  <Button className="flex-1">
                    <Mail className="h-4 w-4 mr-2" />
                    Send Message
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Phone className="h-4 w-4 mr-2" />
                    Call Now
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
      </div>
    </SubscriptionGuard>
  );
}
