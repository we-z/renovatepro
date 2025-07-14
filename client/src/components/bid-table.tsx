import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Eye, Check, X, CreditCard } from "lucide-react";
import { useLocation } from "wouter";
import type { Bid } from "@shared/schema";

interface BidTableProps {
  bids: (Bid & {
    contractor?: any;
    project?: any;
  })[];
  onViewBid?: (bid: Bid) => void;
  onAcceptBid?: (bid: Bid) => void;
  onRejectBid?: (bid: Bid) => void;
  onPayDeposit?: (bid: Bid) => void;
  showProjectColumn?: boolean;
}

export function BidTable({ 
  bids, 
  onViewBid, 
  onAcceptBid, 
  onRejectBid,
  onPayDeposit,
  showProjectColumn = false 
}: BidTableProps) {
  const [, setLocation] = useLocation();
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "accepted":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending":
        return "Under Review";
      case "accepted":
        return "Accepted";
      case "rejected":
        return "Rejected";
      default:
        return status;
    }
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />);
    }
    
    const remainingStars = 5 - fullStars;
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="h-3 w-3 text-gray-300" />);
    }
    
    return stars;
  };

  const getInitials = (firstName?: string, lastName?: string) => {
    if (!firstName || !lastName) return "C";
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  if (bids.length === 0) {
    return (
      <div className="text-center py-8 text-neutral-600">
        No bids found.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Contractor</TableHead>
            {showProjectColumn && <TableHead>Project</TableHead>}
            <TableHead>Bid Amount</TableHead>
            <TableHead>Timeline</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bids.map((bid) => (
            <TableRow key={bid.id}>
              <TableCell>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm font-medium">
                      {getInitials(
                        bid.contractor?.user?.firstName,
                        bid.contractor?.user?.lastName
                      )}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-neutral-900">
                      {bid.contractor?.companyName || "Unknown Contractor"}
                    </p>
                    {bid.contractor?.rating && (
                      <div className="flex items-center space-x-1">
                        <div className="flex items-center">
                          {renderStars(Number(bid.contractor.rating))}
                        </div>
                        <span className="text-xs text-neutral-600">
                          {Number(bid.contractor.rating).toFixed(1)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </TableCell>
              
              {showProjectColumn && (
                <TableCell>
                  <div>
                    <p className="font-medium text-neutral-900">
                      {bid.project?.title || "Unknown Project"}
                    </p>
                    <p className="text-sm text-neutral-600">
                      {bid.project?.location}
                    </p>
                  </div>
                </TableCell>
              )}
              
              <TableCell>
                <span className="font-medium text-neutral-900">
                  ${bid.amount.toLocaleString()}
                </span>
              </TableCell>
              
              <TableCell>
                <span className="text-neutral-600">{bid.timeline}</span>
              </TableCell>
              
              <TableCell>
                <Badge className={getStatusColor(bid.status)}>
                  {getStatusLabel(bid.status)}
                </Badge>
              </TableCell>
              
              <TableCell>
                <div className="flex items-center space-x-2">
                  {onViewBid && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onViewBid(bid)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                  )}
                  
                  {bid.status === "pending" && onAcceptBid && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-green-600 hover:text-green-700"
                      onClick={() => onAcceptBid(bid)}
                    >
                      <Check className="h-4 w-4 mr-1" />
                      Accept
                    </Button>
                  )}
                  
                  {bid.status === "pending" && onRejectBid && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                      onClick={() => onRejectBid(bid)}
                    >
                      <X className="h-4 w-4 mr-1" />
                      Decline
                    </Button>
                  )}
                  
                  {bid.status === "accepted" && (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-blue-600 hover:text-blue-700"
                        onClick={() => setLocation(`/app/deposit-payment?bidId=${bid.id}&projectId=${bid.projectId}`)}
                      >
                        <CreditCard className="h-4 w-4 mr-1" />
                        Pay Deposit
                      </Button>
                      <Button variant="ghost" size="sm">
                        Message
                      </Button>
                    </>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
