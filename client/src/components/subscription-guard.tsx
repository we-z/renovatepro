import { authService } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Crown, Lock } from "lucide-react";
import { Link } from "wouter";

interface SubscriptionGuardProps {
  children: React.ReactNode;
  requiredPlan?: "basic" | "pro" | "enterprise";
  feature?: string;
}

export function SubscriptionGuard({ 
  children, 
  requiredPlan = "basic",
  feature = "feature"
}: SubscriptionGuardProps) {
  const authState = authService.getState();
  const user = authState.user;

  // Check if user has an active subscription
  const hasActiveSubscription = user?.subscriptionStatus === "active";
  
  // Check if user has the required plan level
  const planLevels = { basic: 1, pro: 2, enterprise: 3 };
  const userPlanLevel = user?.subscriptionPlan ? planLevels[user.subscriptionPlan as keyof typeof planLevels] || 0 : 0;
  const requiredPlanLevel = planLevels[requiredPlan];
  
  const hasRequiredPlan = userPlanLevel >= requiredPlanLevel;

  if (!hasActiveSubscription || !hasRequiredPlan) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Crown className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="flex items-center gap-2 justify-center">
              <Lock className="h-5 w-5" />
              Premium Feature
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-neutral-600 mb-6">
              {!hasActiveSubscription 
                ? `You need an active subscription to access ${feature}.`
                : `You need the ${requiredPlan} plan or higher to access ${feature}.`
              }
            </p>
            <div className="space-y-3">
              <Link href="/subscribe">
                <Button className="w-full">
                  Upgrade Now
                </Button>
              </Link>
              <Link href="/app">
                <Button variant="outline" className="w-full">
                  Back to Dashboard
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}