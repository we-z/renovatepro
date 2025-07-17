import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Home, Hammer, ArrowRight, CheckCircle } from "lucide-react";

export default function Onboarding() {
  const [selectedUserType, setSelectedUserType] = useState<string | null>(null);
  const { toast } = useToast();

  const onboardingMutation = useMutation({
    mutationFn: async (userType: string) => {
      await apiRequest("POST", "/api/auth/onboarding", { userType });
    },
    onSuccess: () => {
      toast({
        title: "Welcome to RenovatePro!",
        description: "Your account has been set up successfully.",
      });
      // Invalidate user query to refresh user data
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      // Redirect to dashboard
      window.location.href = "/dashboard";
    },
    onError: (error) => {
      toast({
        title: "Setup Failed",
        description: "There was an error setting up your account. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleUserTypeSelect = (userType: string) => {
    setSelectedUserType(userType);
  };

  const handleContinue = () => {
    if (selectedUserType) {
      onboardingMutation.mutate(selectedUserType);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Welcome to RenovatePro</h1>
          <p className="text-lg text-slate-600">Let's set up your account to get started</p>
        </div>

        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-xl">Choose Your Account Type</CardTitle>
            <CardDescription>
              Select how you'll be using RenovatePro to customize your experience
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Homeowner Option */}
            <div
              className={`p-6 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                selectedUserType === "homeowner"
                  ? "border-blue-500 bg-blue-50/50 shadow-md"
                  : "border-slate-200 hover:border-slate-300 hover:bg-slate-50/50"
              }`}
              onClick={() => handleUserTypeSelect("homeowner")}
            >
              <div className="flex items-start space-x-4">
                <div
                  className={`p-3 rounded-lg ${
                    selectedUserType === "homeowner"
                      ? "bg-blue-500 text-white"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  <Home className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="font-semibold text-slate-900">Homeowner</h3>
                    <Badge variant="secondary">Post Projects</Badge>
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    I need contractors for home renovation projects. I want to post projects, 
                    review bids, and hire trusted professionals for my home improvement needs.
                  </p>
                  <ul className="mt-3 space-y-1 text-xs text-slate-500">
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="w-3 h-3" />
                      <span>Post unlimited projects</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="w-3 h-3" />
                      <span>Browse verified contractors</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="w-3 h-3" />
                      <span>Secure payment processing</span>
                    </li>
                  </ul>
                </div>
                {selectedUserType === "homeowner" && (
                  <CheckCircle className="w-5 h-5 text-blue-500 mt-1" />
                )}
              </div>
            </div>

            {/* Contractor Option */}
            <div
              className={`p-6 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                selectedUserType === "contractor"
                  ? "border-blue-500 bg-blue-50/50 shadow-md"
                  : "border-slate-200 hover:border-slate-300 hover:bg-slate-50/50"
              }`}
              onClick={() => handleUserTypeSelect("contractor")}
            >
              <div className="flex items-start space-x-4">
                <div
                  className={`p-3 rounded-lg ${
                    selectedUserType === "contractor"
                      ? "bg-blue-500 text-white"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  <Hammer className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="font-semibold text-slate-900">Contractor</h3>
                    <Badge variant="secondary">Find Work</Badge>
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    I'm a licensed contractor looking for renovation projects. I want to bid on 
                    projects, showcase my work, and grow my business with quality clients.
                  </p>
                  <ul className="mt-3 space-y-1 text-xs text-slate-500">
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="w-3 h-3" />
                      <span>Browse and bid on projects</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="w-3 h-3" />
                      <span>Showcase portfolio and reviews</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="w-3 h-3" />
                      <span>Direct client communication</span>
                    </li>
                  </ul>
                </div>
                {selectedUserType === "contractor" && (
                  <CheckCircle className="w-5 h-5 text-blue-500 mt-1" />
                )}
              </div>
            </div>

            <div className="pt-6">
              <Button
                onClick={handleContinue}
                disabled={!selectedUserType || onboardingMutation.isPending}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-base font-medium"
                size="lg"
              >
                {onboardingMutation.isPending ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Setting up your account...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <span>Continue to RenovatePro</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}