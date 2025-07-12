import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, ArrowLeft } from "lucide-react";
import { authService } from "@/lib/auth";
import { Link } from "wouter";

// Make sure to call `loadStripe` outside of a component's render to avoid
// recreating the `Stripe` object on every render.
if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error('Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY');
}
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const plans = [
  {
    id: 'basic',
    name: 'Basic',
    price: 29,
    period: 'month',
    description: 'Perfect for occasional home projects',
    features: [
      'Post up to 3 projects per month',
      'Basic contractor matching',
      'Standard support',
      'Project management tools',
      'Secure messaging'
    ]
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 79,
    period: 'month',
    description: 'Best for active homeowners and small property managers',
    features: [
      'Unlimited project posting',
      'Priority contractor matching',
      'Advanced project analytics',
      'Priority support',
      'Custom project templates',
      'Bulk project management'
    ]
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 199,
    period: 'month',
    description: 'For large property management companies',
    features: [
      'Everything in Pro',
      'Dedicated account manager',
      'Custom integrations',
      'Team collaboration tools',
      'Advanced reporting',
      'White-label options'
    ]
  }
];

const SubscribeForm = ({ selectedPlan }: { selectedPlan: any }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/app`,
        },
      });

      if (error) {
        toast({
          title: "Payment Failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Subscription Successful",
          description: `Welcome to ${selectedPlan.name}! You now have full access to RenovatePro.`,
        });
      }
    } catch (err) {
      toast({
        title: "Payment Failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      <Button 
        type="submit" 
        disabled={!stripe || isLoading} 
        className="w-full"
        size="lg"
      >
        {isLoading ? "Processing..." : `Subscribe to ${selectedPlan.name} - $${selectedPlan.price}/${selectedPlan.period}`}
      </Button>
    </form>
  );
};

export default function Subscribe() {
  const [clientSecret, setClientSecret] = useState("");
  const [selectedPlan, setSelectedPlan] = useState(plans[1]); // Default to Pro plan
  const [planFromUrl, setPlanFromUrl] = useState<string | null>(null);
  const authState = authService.getState();

  useEffect(() => {
    // Get plan from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const plan = urlParams.get('plan');
    if (plan) {
      const foundPlan = plans.find(p => p.id === plan);
      if (foundPlan) {
        setSelectedPlan(foundPlan);
        setPlanFromUrl(plan);
      }
    }
  }, []);

  useEffect(() => {
    if (selectedPlan && authState.user) {
      // Create subscription when plan is selected
      apiRequest("POST", "/api/create-subscription", { 
        planId: selectedPlan.id,
        planName: selectedPlan.name,
        amount: selectedPlan.price 
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.clientSecret) {
            setClientSecret(data.clientSecret);
          }
        })
        .catch((error) => {
          console.error('Error creating subscription:', error);
        });
    }
  }, [selectedPlan, authState.user]);

  if (!authState.isAuthenticated) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-6 text-center">
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">Authentication Required</h2>
            <p className="text-neutral-600 mb-6">
              Please sign in to subscribe to a plan.
            </p>
            <Link href="/app">
              <Button className="w-full">Sign In</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="mb-8">
            <Link href="/">
              <Button variant="ghost" className="mb-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-neutral-900 mb-2">Choose Your Plan</h1>
            <p className="text-neutral-600">Select the perfect plan for your renovation needs</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <Card 
                key={plan.id}
                className={`cursor-pointer transition-all duration-200 ${
                  selectedPlan.id === plan.id 
                    ? 'border-primary shadow-lg scale-105' 
                    : 'border-neutral-200 hover:border-primary/50'
                }`}
                onClick={() => setSelectedPlan(plan)}
              >
                <CardHeader className="text-center">
                  {plan.id === 'pro' && (
                    <Badge className="self-center mb-2">Most Popular</Badge>
                  )}
                  <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                  <div className="text-4xl font-bold text-primary">
                    ${plan.price}
                    <span className="text-lg text-neutral-600">/{plan.period}</span>
                  </div>
                  <p className="text-neutral-600">{plan.description}</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-neutral-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Button 
              onClick={() => {
                // This will trigger the useEffect to create subscription
                setClientSecret('loading');
              }}
              disabled={!selectedPlan}
              size="lg"
            >
              Continue with {selectedPlan.name}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (clientSecret === 'loading') {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-neutral-600">Setting up your subscription...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">Complete Your Subscription</h1>
          <p className="text-neutral-600">You're subscribing to the {selectedPlan.name} plan</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Plan Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-medium">{selectedPlan.name} Plan</span>
                <span className="font-bold">${selectedPlan.price}/{selectedPlan.period}</span>
              </div>
              <div className="pt-4 border-t">
                <p className="text-sm text-neutral-600 mb-3">Includes:</p>
                <ul className="space-y-2">
                  {selectedPlan.features.slice(0, 3).map((feature, index) => (
                    <li key={index} className="flex items-start text-sm">
                      <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                  {selectedPlan.features.length > 3 && (
                    <li className="text-sm text-neutral-600">
                      +{selectedPlan.features.length - 3} more features
                    </li>
                  )}
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Payment Form */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Details</CardTitle>
            </CardHeader>
            <CardContent>
              <Elements stripe={stripePromise} options={{ clientSecret }}>
                <SubscribeForm selectedPlan={selectedPlan} />
              </Elements>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 text-center text-sm text-neutral-600">
          <p>
            By subscribing, you agree to our Terms of Service and Privacy Policy.
            <br />
            You can cancel your subscription at any time.
          </p>
        </div>
      </div>
    </div>
  );
}