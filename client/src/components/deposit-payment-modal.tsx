import { useState } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { 
  CreditCard, 
  Shield, 
  CheckCircle, 
  AlertCircle,
  DollarSign,
  Calendar,
  User,
  Building
} from 'lucide-react';
import type { Bid, Project, Contractor } from '@shared/schema';

interface DepositPaymentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bid: Bid & { contractor?: Contractor };
  project: Project;
  onPaymentSuccess?: () => void;
}

export function DepositPaymentModal({ 
  open, 
  onOpenChange, 
  bid, 
  project,
  onPaymentSuccess 
}: DepositPaymentModalProps) {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStep, setPaymentStep] = useState<'details' | 'payment' | 'success'>('details');

  // Calculate deposit amount (25% of bid amount)
  const depositPercentage = project.depositPercentage || 25;
  const depositAmount = Math.round(bid.amount * (depositPercentage / 100));

  const handleInitiatePayment = async () => {
    try {
      setIsProcessing(true);
      
      const response = await apiRequest('POST', '/api/deposits/create-payment-intent', {
        bidId: bid.id,
        projectId: project.id,
        contractorId: bid.contractorId,
        amount: depositAmount / 100, // Convert back to dollars for API
        description: `Deposit for project: ${project.title}`
      });

      const { clientSecret, depositId } = response;
      
      if (clientSecret) {
        // Store deposit ID for later use
        window.sessionStorage.setItem('currentDepositId', depositId.toString());
        setPaymentStep('payment');
      } else {
        throw new Error('Failed to create payment intent');
      }
    } catch (error: any) {
      toast({
        title: "Payment Setup Failed",
        description: error.message || "Failed to initialize payment",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      toast({
        title: "Payment Error",
        description: "Payment system not ready. Please try again.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment-success`,
        },
        redirect: 'if_required'
      });

      if (error) {
        toast({
          title: "Payment Failed",
          description: error.message,
          variant: "destructive",
        });
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        // Confirm payment on backend
        const depositId = window.sessionStorage.getItem('currentDepositId');
        
        await apiRequest('POST', '/api/deposits/confirm-payment', {
          paymentIntentId: paymentIntent.id,
          depositId: parseInt(depositId || '0')
        });

        window.sessionStorage.removeItem('currentDepositId');
        setPaymentStep('success');
        
        toast({
          title: "Payment Successful!",
          description: "Your deposit has been processed successfully.",
        });

        onPaymentSuccess?.();
      }
    } catch (error: any) {
      toast({
        title: "Payment Error",
        description: error.message || "Payment processing failed",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(cents / 100);
  };

  const renderDetailsStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
          <DollarSign className="h-8 w-8 text-blue-600" />
        </div>
        <h3 className="text-xl font-semibold text-slate-900 mb-2">
          Secure Your Project
        </h3>
        <p className="text-slate-600">
          Pay a deposit to confirm your contractor and start your project
        </p>
      </div>

      <Card className="border-blue-200 bg-blue-50/30">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-slate-600">Project:</span>
              <span className="font-medium text-slate-900">{project.title}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-slate-600">Contractor:</span>
              <span className="font-medium text-slate-900">
                {bid.contractor?.companyName || 'Selected Contractor'}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-600">Total Bid Amount:</span>
              <span className="font-medium text-slate-900">{formatCurrency(bid.amount * 100)}</span>
            </div>

            <Separator />

            <div className="flex items-center justify-between text-lg">
              <span className="text-slate-700 font-medium">
                Deposit ({depositPercentage}%):
              </span>
              <span className="font-bold text-blue-600 text-xl">
                {formatCurrency(depositAmount * 100)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="bg-slate-50 rounded-lg p-4 space-y-3">
        <h4 className="font-medium text-slate-900 flex items-center">
          <Shield className="h-4 w-4 mr-2 text-green-600" />
          Protected Payment
        </h4>
        <ul className="text-sm text-slate-600 space-y-1">
          <li>• Secure processing through Stripe</li>
          <li>• Funds held in escrow until project completion</li>
          <li>• Full refund if contractor doesn't deliver</li>
        </ul>
      </div>

      <div className="flex gap-3">
        <Button 
          variant="outline" 
          onClick={() => onOpenChange(false)}
          className="flex-1"
        >
          Cancel
        </Button>
        <Button 
          onClick={handleInitiatePayment}
          disabled={isProcessing}
          className="flex-1 bg-blue-600 hover:bg-blue-700"
        >
          {isProcessing ? (
            <>
              <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
              Setting up...
            </>
          ) : (
            <>
              <CreditCard className="h-4 w-4 mr-2" />
              Continue to Payment
            </>
          )}
        </Button>
      </div>
    </div>
  );

  const renderPaymentStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <CreditCard className="h-8 w-8 text-green-600" />
        </div>
        <h3 className="text-xl font-semibold text-slate-900 mb-2">
          Complete Payment
        </h3>
        <div className="text-2xl font-bold text-green-600 mb-2">
          {formatCurrency(depositAmount * 100)}
        </div>
        <p className="text-slate-600">
          Secure deposit for {project.title}
        </p>
      </div>

      <Card className="border-slate-200">
        <CardContent className="p-6">
          <form onSubmit={handlePaymentSubmit} className="space-y-6">
            <PaymentElement 
              options={{
                layout: {
                  type: 'tabs',
                  defaultCollapsed: false,
                }
              }}
            />
            
            <div className="flex gap-3">
              <Button 
                type="button"
                variant="outline" 
                onClick={() => setPaymentStep('details')}
                className="flex-1"
                disabled={isProcessing}
              >
                Back
              </Button>
              <Button 
                type="submit"
                disabled={!stripe || !elements || isProcessing}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Shield className="h-4 w-4 mr-2" />
                    Pay {formatCurrency(depositAmount * 100)}
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="text-center">
        <div className="flex items-center justify-center text-sm text-slate-500">
          <Shield className="h-4 w-4 mr-1" />
          Secured by Stripe
        </div>
      </div>
    </div>
  );

  const renderSuccessStep = () => (
    <div className="space-y-6 text-center">
      <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
        <CheckCircle className="h-10 w-10 text-green-600" />
      </div>
      
      <div>
        <h3 className="text-2xl font-bold text-slate-900 mb-2">
          Payment Successful!
        </h3>
        <p className="text-slate-600 mb-6">
          Your deposit has been securely processed and your project has been awarded to {bid.contractor?.companyName}.
        </p>
      </div>

      <Card className="border-green-200 bg-green-50/30">
        <CardContent className="p-6">
          <div className="space-y-3 text-left">
            <div className="flex justify-between">
              <span className="text-slate-600">Amount Paid:</span>
              <span className="font-bold text-green-600">{formatCurrency(depositAmount * 100)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Project:</span>
              <span className="font-medium">{project.title}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Contractor:</span>
              <span className="font-medium">{bid.contractor?.companyName}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="bg-blue-50 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">What's Next?</h4>
        <ul className="text-sm text-blue-800 space-y-1 text-left">
          <li>• Your contractor will be notified and can begin work</li>
          <li>• You can track progress in your dashboard</li>
          <li>• Remaining payment due upon project completion</li>
        </ul>
      </div>

      <Button 
        onClick={() => onOpenChange(false)}
        className="w-full bg-green-600 hover:bg-green-700"
      >
        <Building className="h-4 w-4 mr-2" />
        Go to Dashboard
      </Button>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Project Deposit</span>
            <Badge variant="outline" className="ml-2">
              Step {paymentStep === 'details' ? '1' : paymentStep === 'payment' ? '2' : '3'} of 3
            </Badge>
          </DialogTitle>
        </DialogHeader>
        
        <div className="mt-4">
          {paymentStep === 'details' && renderDetailsStep()}
          {paymentStep === 'payment' && renderPaymentStep()}
          {paymentStep === 'success' && renderSuccessStep()}
        </div>
      </DialogContent>
    </Dialog>
  );
}