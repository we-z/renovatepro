import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Phone, Mail, Shield } from "lucide-react";
import type { User } from "@shared/schema";

interface ContractorCardProps {
  contractor: User & {
    companyName?: string;
    rating?: number;
    reviewCount?: number;
  };
  onViewProfile?: (contractor: User) => void;
  onSendMessage?: (contractor: User) => void;
  showActions?: boolean;
}

export function ContractorCard({ 
  contractor, 
  onViewProfile, 
  onSendMessage, 
  showActions = true 
}: ContractorCardProps) {
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

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start space-x-4 mb-4">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-white text-lg font-medium">
              {getInitials(contractor.user?.firstName, contractor.user?.lastName)}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-neutral-900 mb-1">
              {contractor.companyName}
            </h3>
            <div className="flex items-center space-x-1 mb-2">
              <div className="flex items-center">
                {renderStars(Number(contractor.rating) || 0)}
              </div>
              <span className="text-sm text-neutral-600">
                {Number(contractor.rating).toFixed(1)} ({contractor.reviewCount} reviews)
              </span>
            </div>
            {contractor.user?.location && (
              <div className="flex items-center text-sm text-neutral-600">
                <MapPin className="h-4 w-4 mr-1" />
                {contractor.user.location}
              </div>
            )}
          </div>
        </div>

        {contractor.description && (
          <p className="text-sm text-neutral-600 mb-4 line-clamp-3">
            {contractor.description}
          </p>
        )}

        {contractor.specialties && contractor.specialties.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {contractor.specialties.slice(0, 3).map((specialty, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {specialty}
                </Badge>
              ))}
              {contractor.specialties.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{contractor.specialties.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between text-sm mb-4">
          <div className="flex items-center space-x-4">
            {contractor.experience && (
              <span className="text-neutral-600">
                {contractor.experience} years experience
              </span>
            )}
            {contractor.insurance && (
              <div className="flex items-center text-green-600">
                <Shield className="h-4 w-4 mr-1" />
                Insured
              </div>
            )}
          </div>
        </div>

        {contractor.user && (
          <div className="flex items-center space-x-4 text-sm text-neutral-600 mb-4">
            {contractor.user.email && (
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-1" />
                <span className="truncate">{contractor.user.email}</span>
              </div>
            )}
            {contractor.user.phone && (
              <div className="flex items-center">
                <Phone className="h-4 w-4 mr-1" />
                <span>{contractor.user.phone}</span>
              </div>
            )}
          </div>
        )}

        {showActions && (
          <div className="flex items-center space-x-2 pt-2 border-t border-neutral-200">
            {onSendMessage && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onSendMessage(contractor)}
                className="flex-1"
              >
                Message
              </Button>
            )}
            {onViewProfile && (
              <Button
                size="sm"
                onClick={() => onViewProfile(contractor)}
                className="flex-1"
              >
                View Profile
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
