import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { DepositPaymentModal } from '@/components/deposit-payment-modal';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, CreditCard } from 'lucide-react';
import type { Bid, Project, Contractor } from '@shared/schema';

// Make sure to call `loadStripe` outside of a component's render to avoid
// recreating the `Stripe` object on every render.
if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error('Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY');
}
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

export default function DepositPayment() {
  const [location, setLocation] = useLocation();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  // Get URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const bidId = urlParams.get('bidId');
  const projectId = urlParams.get('projectId');

  // Fetch bid details
  const { data: bid, isLoading: bidLoading } = useQuery({
    queryKey: [`/api/bids/${bidId}`],
    enabled: !!bidId
  });

  // Fetch project details
  const { data: project, isLoading: projectLoading } = useQuery({
    queryKey: [`/api/projects/${projectId}`],
    enabled: !!projectId
  });

  // Fetch contractor details if bid exists
  const { data: contractor } = useQuery({
    queryKey: [`/api/contractors/${bid?.contractorId}`],
    enabled: !!bid?.contractorId
  });

  // Combine data
  const bidWithContractor = bid && contractor ? { ...bid, contractor } : bid;

  const handlePaymentSuccess = () => {
    // Redirect to dashboard or project page
    setLocation('/dashboard');
  };

  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(cents / 100);
  };

  if (!bidId || !projectId) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">
              Invalid Payment Link
            </h2>
            <p className="text-slate-600 mb-6">
              This payment link is invalid or has expired.
            </p>
            <Button onClick={() => setLocation('/dashboard')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Return to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (bidLoading || projectLoading) {
    return (
      <div className="min-h-screen bg-slate-50 py-12">
        <div className="max-w-2xl mx-auto px-4">
          <div className="space-y-6">
            <Skeleton className="h-8 w-64" />
            <Card>
              <CardContent className="p-8">
                <div className="space-y-4">
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-6 w-1/2" />
                </div>
              </CardContent>
            </Card>
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!bid || !project) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">
              Payment Information Not Found
            </h2>
            <p className="text-slate-600 mb-6">
              Could not find the bid or project information for this payment.
            </p>
            <Button onClick={() => setLocation('/dashboard')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Return to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const depositPercentage = project.depositPercentage || 25;
  const depositAmount = Math.round(bid.amount * (depositPercentage / 100));

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => setLocation('/dashboard')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Project Deposit Payment
          </h1>
          <p className="text-slate-600">
            Secure your project by paying the required deposit
          </p>
        </div>

        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-slate-900 mb-4">
                  Payment Details
                </h2>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-slate-500">Project:</span>
                    <p className="font-medium text-slate-900">{project.title}</p>
                  </div>
                  
                  <div>
                    <span className="text-slate-500">Contractor:</span>
                    <p className="font-medium text-slate-900">
                      {contractor?.companyName || 'Selected Contractor'}
                    </p>
                  </div>
                  
                  <div>
                    <span className="text-slate-500">Total Bid:</span>
                    <p className="font-medium text-slate-900">
                      {formatCurrency(bid.amount * 100)}
                    </p>
                  </div>
                  
                  <div>
                    <span className="text-slate-500">Deposit Required:</span>
                    <p className="font-bold text-blue-600 text-lg">
                      {formatCurrency(depositAmount * 100)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="font-medium text-blue-900 mb-2">
                  Why is a deposit required?
                </h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Secures your contractor's commitment to the project</li>
                  <li>• Protects both parties with escrow service</li>
                  <li>• Allows contractor to purchase materials and start work</li>
                  <li>• Remaining balance due upon project completion</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center">
          <Button 
            size="lg"
            onClick={() => setShowPaymentModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4"
          >
            <CreditCard className="h-5 w-5 mr-2" />
            Pay Deposit - {formatCurrency(depositAmount * 100)}
          </Button>
        </div>

        {/* Payment Modal */}
        {showPaymentModal && project && bidWithContractor && (
          <Elements 
            stripe={stripePromise} 
            options={{
              mode: 'payment',
              amount: depositAmount * 100, // Convert to cents
              currency: 'usd',
              appearance: {
                theme: 'stripe',
                variables: {
                  colorPrimary: '#2563eb',
                }
              }
            }}
          >
            <DepositPaymentModal
              open={showPaymentModal}
              onOpenChange={setShowPaymentModal}
              bid={bidWithContractor}
              project={project}
              onPaymentSuccess={handlePaymentSuccess}
            />
          </Elements>
        )}
      </div>
    </div>
  );
}