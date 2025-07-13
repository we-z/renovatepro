import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, DollarSign, Clock, MessageCircle } from "lucide-react";
import type { Property } from "@shared/schema";

interface ProjectCardProps {
  project: Property & {
    manager?: any;
    tenantCount?: number;
  };
  onViewDetails?: (project: Property) => void;
  onSendMessage?: (project: Property) => void;
  showActions?: boolean;
}

export function ProjectCard({ 
  project, 
  onViewDetails, 
  onSendMessage, 
  showActions = true 
}: ProjectCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "posted":
      case "bidding":
        return "bg-orange-100 text-orange-800";
      case "awarded":
        return "bg-yellow-100 text-yellow-800";
      case "in_progress":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "posted":
        return "Bidding";
      case "bidding":
        return "Bidding";
      case "awarded":
        return "Awarded";
      case "in_progress":
        return "In Progress";
      case "completed":
        return "Completed";
      default:
        return status;
    }
  };

  const formatBudget = (min?: number | null, max?: number | null) => {
    if (!min && !max) return "Budget not specified";
    if (min && max) {
      return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
    }
    if (min) return `From $${min.toLocaleString()}`;
    if (max) return `Up to $${max.toLocaleString()}`;
    return "Budget not specified";
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="font-semibold text-neutral-900 mb-1">{project.title}</h3>
            <div className="flex items-center text-sm text-neutral-600 mb-2">
              <MapPin className="h-4 w-4 mr-1" />
              {project.location}
            </div>
          </div>
          <Badge className={getStatusColor(project.status)}>
            {getStatusLabel(project.status)}
          </Badge>
        </div>

        <p className="text-sm text-neutral-600 mb-4 line-clamp-3">
          {project.description}
        </p>

        <div className="flex items-center justify-between text-sm mb-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center text-neutral-600">
              <DollarSign className="h-4 w-4 mr-1" />
              <span className="font-medium text-neutral-900">
                {formatBudget(project.budgetMin, project.budgetMax)}
              </span>
            </div>
            {project.bidCount !== undefined && (
              <div className="flex items-center text-neutral-600">
                <span>Bids: </span>
                <span className="font-medium text-primary ml-1">
                  {project.bidCount}
                </span>
              </div>
            )}
          </div>
          {project.timeline && (
            <div className="flex items-center text-neutral-600">
              <Clock className="h-4 w-4 mr-1" />
              <span>{project.timeline}</span>
            </div>
          )}
        </div>

        {showActions && (
          <div className="flex items-center justify-between pt-2 border-t border-neutral-200">
            <div className="text-xs text-neutral-500">
              Category: {project.category}
            </div>
            <div className="flex items-center space-x-2">
              {onSendMessage && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onSendMessage(project)}
                >
                  <MessageCircle className="h-4 w-4 mr-1" />
                  Message
                </Button>
              )}
              {onViewDetails && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onViewDetails(project)}
                >
                  View Details
                </Button>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
