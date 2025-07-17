import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Hammer,
  CheckCircle2,
  Users,
  MessageSquare,
  FileText,
  Shield,
  Star,
  ArrowRight,
  Check,
} from "lucide-react";

export default function Landing() {
  const [hoveredPlan, setHoveredPlan] = useState<string | null>(null);

  const features = [
    {
      icon: FileText,
      title: "Smart Project Posting",
      description:
        "Create detailed project listings with budgets, timelines, and requirements to attract the right contractors.",
    },
    {
      icon: Users,
      title: "Verified Contractor Profiles",
      description:
        "Browse vetted contractors with ratings, portfolios, and verified credentials for peace of mind.",
    },
    {
      icon: CheckCircle2,
      title: "Intelligent Bid Management",
      description:
        "Compare proposals side-by-side with automated matching based on your project requirements.",
    },
    {
      icon: MessageSquare,
      title: "Secure Communication",
      description:
        "Built-in messaging system keeps all project communication organized and accessible.",
    },
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Homeowner",
      content:
        "Found the perfect contractor for my kitchen renovation. The whole process was seamless!",
      rating: 5,
    },
    {
      name: "Mike Chen",
      role: "Property Manager",
      content:
        "Managing multiple properties is so much easier now. Great contractor network and fair pricing.",
      rating: 5,
    },
    {
      name: "Lisa Rodriguez",
      role: "Homeowner",
      content:
        "The bid comparison feature saved me thousands. Highly recommend RenovatePro!",
      rating: 5,
    },
  ];

  const plans = [
    {
      name: "Basic",
      price: 29,
      period: "month",
      description: "Perfect for occasional home projects",
      features: [
        "Post up to 3 projects per month",
        "Basic contractor matching",
        "Standard support",
        "Project management tools",
        "Secure messaging",
      ],
      popular: false,
      cta: "Start Basic Plan",
    },
    {
      name: "Pro",
      price: 79,
      period: "month",
      description: "Best for active homeowners and small property managers",
      features: [
        "Unlimited project posting",
        "Priority contractor matching",
        "Advanced project analytics",
        "Priority support",
        "Custom project templates",
        "Bulk project management",
      ],
      popular: true,
      cta: "Start Pro Plan",
    },
    {
      name: "Enterprise",
      price: 199,
      period: "month",
      description: "For large property management companies",
      features: [
        "Everything in Pro",
        "Dedicated account manager",
        "Custom integrations",
        "Team collaboration tools",
        "Advanced reporting",
        "White-label options",
      ],
      popular: false,
      cta: "Contact Sales",
    },
  ];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white/95 backdrop-blur-md border-b border-neutral-200 sticky top-0 z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2 group cursor-pointer">
              <Hammer className="h-8 w-8 text-primary transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110" />
              <span className="text-2xl font-bold text-neutral-900 transition-colors duration-300 group-hover:text-primary">
                RenovatePro
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a
                href="#features"
                className="text-neutral-600 hover:text-primary transition-all duration-300 hover:scale-105 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-primary after:transition-all after:duration-300 hover:after:w-full"
              >
                Features
              </a>
              <a
                href="#pricing"
                className="text-neutral-600 hover:text-primary transition-all duration-300 hover:scale-105 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-primary after:transition-all after:duration-300 hover:after:w-full"
              >
                Pricing
              </a>
              <a
                href="#about"
                className="text-neutral-600 hover:text-primary transition-all duration-300 hover:scale-105 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-primary after:transition-all after:duration-300 hover:after:w-full"
              >
                How it Works
              </a>
            </div>
            <div className="flex items-center space-x-4">
              <a href="/api/auth/google">
                <Button
                  variant="ghost"
                  className="transition-all duration-300 hover:scale-105 hover:shadow-md"
                >
                  Sign In
                </Button>
              </a>
              <Link href="/subscribe?plan=pro">
                <Button className="transition-all duration-300 hover:scale-105 hover:shadow-lg hover:-translate-y-1 bg-gradient-to-r from-primary to-blue-600 hover:from-blue-600 hover:to-primary">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5"></div>
        <div className="absolute top-10 right-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse delay-1000"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in-up">
              <Badge className="mb-4 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-all duration-300 hover:scale-105 animate-bounce-subtle">
                ✨ Trusted by 10,000+ Property Owners
              </Badge>
              <h1 className="text-4xl lg:text-6xl font-bold text-neutral-900 mb-6 leading-tight">
                <span className="inline-block hover:scale-105 transition-transform duration-300">
                  Connect with
                </span>
                <span className="text-primary bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent hover:from-blue-600 hover:to-primary transition-all duration-500">
                  {" "}
                  Trusted Contractors
                </span>
                <br />
                <span className="inline-block hover:scale-105 transition-transform duration-300">
                  for Your Next Project
                </span>
              </h1>
              <p className="text-xl text-neutral-600 mb-8 leading-relaxed opacity-90 hover:opacity-100 transition-opacity duration-300">
                RenovatePro makes it easy to find, compare, and hire qualified
                contractors for your home renovation projects. Get competitive
                bids and manage everything in one place.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/subscribe?plan=pro">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto group bg-gradient-to-r from-primary to-blue-600 hover:from-blue-600 hover:to-primary transition-all duration-500 hover:scale-105 hover:shadow-xl hover:-translate-y-1 transform"
                  >
                    Start Your Project
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto group hover:bg-primary hover:text-white transition-all duration-300 hover:scale-105 hover:shadow-lg border-2 hover:border-primary"
                  onClick={() => {
                    console.log("Redirecting to Google OAuth...");
                    window.location.href = `/api/auth/google?t=${Date.now()}`;
                  }}
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Sign in with Google
                </Button>
              </div>
              <div className="flex flex-wrap items-center gap-6 mt-8 text-sm text-neutral-600">
                <div className="flex items-center group hover:scale-105 transition-transform duration-300">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 group-hover:scale-110 transition-transform duration-300" />
                  <span className="group-hover:text-green-600 transition-colors duration-300">
                    Free to get started
                  </span>
                </div>
                <div className="flex items-center group hover:scale-105 transition-transform duration-300">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 group-hover:scale-110 transition-transform duration-300" />
                  <span className="group-hover:text-green-600 transition-colors duration-300">
                    No hidden fees
                  </span>
                </div>
                <div className="flex items-center group hover:scale-105 transition-transform duration-300">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 group-hover:scale-110 transition-transform duration-300" />
                  <span className="group-hover:text-green-600 transition-colors duration-300">
                    Cancel anytime
                  </span>
                </div>
              </div>
            </div>
            <div className="lg:pl-12 animate-fade-in-right">
              <div className="relative group">
                <div className="bg-white rounded-2xl shadow-2xl p-8 hover:shadow-3xl transition-all duration-500 hover:-translate-y-2 transform border border-neutral-100 hover:border-primary/20">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-blue-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <Hammer className="h-6 w-6 text-white group-hover:rotate-12 transition-transform duration-300" />
                    </div>
                    <div>
                      <h3 className="font-semibold group-hover:text-primary transition-colors duration-300">
                        Kitchen Renovation
                      </h3>
                      <p className="text-sm text-neutral-600">
                        San Francisco, CA
                      </p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-neutral-50 rounded-lg hover:bg-primary/5 transition-all duration-300 hover:scale-[1.02] transform">
                      <span className="text-sm font-medium">Budget Range</span>
                      <span className="font-semibold">$25,000 - $40,000</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-all duration-300 hover:scale-[1.02] transform">
                      <span className="text-sm font-medium">Bids Received</span>
                      <span className="font-semibold text-green-600">
                        5 Qualified
                      </span>
                    </div>
                    <Button className="w-full group/btn bg-gradient-to-r from-primary to-blue-600 hover:from-blue-600 hover:to-primary transition-all duration-300 hover:scale-105 hover:shadow-lg">
                      <span className="group-hover/btn:scale-105 transition-transform duration-300">
                        Review Bids
                      </span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="py-20 bg-gradient-to-br from-neutral-50 to-blue-50 relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/5 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16 animate-fade-in-up">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-all duration-300 hover:scale-105">
              🚀 Powerful Features
            </Badge>
            <h2 className="text-3xl lg:text-4xl font-bold text-neutral-900 mb-4">
              <span className="bg-gradient-to-r from-neutral-900 to-primary bg-clip-text text-transparent">
                Everything You Need to Manage Projects
              </span>
            </h2>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto opacity-90 hover:opacity-100 transition-opacity duration-300">
              From posting your first project to managing multiple renovations,
              RenovatePro provides all the tools you need for successful project
              completion.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={index}
                  className="border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 transform bg-white/80 backdrop-blur-sm hover:bg-white group cursor-pointer hover:border-primary/20"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardContent className="p-6 text-center relative">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary/10 to-blue-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-all duration-300 group-hover:shadow-lg group-hover:bg-gradient-to-br group-hover:from-primary/20 group-hover:to-blue-500/20">
                      <Icon className="h-8 w-8 text-primary group-hover:scale-110 transition-transform duration-300 group-hover:text-blue-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-neutral-900 mb-3 group-hover:text-primary transition-colors duration-300">
                      {feature.title}
                    </h3>
                    <p className="text-neutral-600 leading-relaxed group-hover:text-neutral-700 transition-colors duration-300">
                      {feature.description}
                    </p>
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-blue-500/5 opacity-0 duration-300 rounded-lg"></div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="about" className="py-24 bg-gradient-to-br from-slate-50 via-white to-blue-50 relative overflow-hidden">
        {/* Enhanced background elements */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-primary/10 to-blue-500/5 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-bl from-purple-500/10 to-primary/5 rounded-full blur-3xl animate-float-delayed"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-accent/5 to-transparent rounded-full blur-2xl"></div>
        
        {/* Decorative grid */}
        <div className="absolute inset-0 opacity-[0.02]">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgb(59 130 246) 1px, transparent 0)`,
            backgroundSize: '60px 60px'
          }}></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          {/* Enhanced header */}
          <div className="text-center mb-20 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 mb-6">
              <div className="w-12 h-[2px] bg-gradient-to-r from-transparent to-primary rounded-full"></div>
              <Badge className="bg-gradient-to-r from-primary/10 to-blue-500/10 text-primary border-primary/30 hover:from-primary/20 hover:to-blue-500/20 transition-all duration-500 hover:scale-105 px-6 py-2 text-sm font-medium shadow-lg hover:shadow-xl">
                ⚡ Simple 3-Step Process
              </Badge>
              <div className="w-12 h-[2px] bg-gradient-to-l from-transparent to-primary rounded-full"></div>
            </div>
            
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-slate-900 via-primary to-blue-600 bg-clip-text text-transparent hover:from-primary hover:via-blue-600 hover:to-purple-600 transition-all duration-700">
                How RenovatePro Works
              </span>
            </h2>
            
            <p className="text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed font-light">
              Transform your renovation dreams into reality with our streamlined, secure, and intelligent platform
            </p>
            
            {/* Visual connection line */}
            <div className="hidden md:block absolute top-full left-1/2 transform -translate-x-1/2 mt-12">
              <div className="w-[2px] h-12 bg-gradient-to-b from-primary/50 to-transparent"></div>
            </div>
          </div>

          {/* Enhanced process steps */}
          <div className="relative">
            {/* Connection line for desktop */}
            <div className="hidden md:block absolute top-16 left-0 right-0 h-[2px] bg-gradient-to-r from-primary/20 via-primary/50 to-primary/20 z-0">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50 animate-pulse"></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 relative z-10">
              {/* Step 1 */}
              <div 
                className="group relative animate-fade-in-up"
                style={{ animationDelay: "200ms" }}
              >
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 lg:p-10 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-700 hover:-translate-y-4 hover:bg-white/90 group-hover:border-primary/30">
                  {/* Floating elements */}
                  <div className="absolute -top-2 -right-2 w-4 h-4 bg-primary/20 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 animate-pulse"></div>
                  <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-blue-500/20 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-700 animate-pulse delay-200"></div>
                  
                  {/* Step number with enhanced design */}
                  <div className="relative mb-8">
                    <div className="w-24 h-24 bg-gradient-to-br from-primary via-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg group-hover:shadow-2xl group-hover:shadow-primary/25 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
                      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-transparent to-black/10"></div>
                      <span className="text-3xl font-bold text-white relative z-10 group-hover:scale-110 transition-transform duration-300">
                        1
                      </span>
                      {/* Sparkle effect */}
                      <div className="absolute top-2 right-2 w-2 h-2 bg-white/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-ping"></div>
                    </div>
                  </div>

                  <h3 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-6 group-hover:text-primary transition-colors duration-500 text-center">
                    Post Your Project
                  </h3>
                  
                  <p className="text-slate-600 leading-relaxed text-center group-hover:text-slate-700 transition-colors duration-300 text-lg font-light">
                    Share your vision with detailed project requirements, budget range, and timeline. Our intelligent matching system connects you with pre-vetted contractors in your area.
                  </p>

                  {/* Progress indicator */}
                  <div className="mt-8 flex justify-center">
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 bg-primary rounded-full"></div>
                      <div className="w-3 h-3 bg-primary/30 rounded-full"></div>
                      <div className="w-3 h-3 bg-primary/30 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div 
                className="group relative animate-fade-in-up"
                style={{ animationDelay: "400ms" }}
              >
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 lg:p-10 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-700 hover:-translate-y-4 hover:bg-white/90 group-hover:border-primary/30">
                  {/* Floating elements */}
                  <div className="absolute -top-1 -left-2 w-5 h-5 bg-blue-500/20 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 animate-pulse delay-100"></div>
                  <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-primary/20 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-700 animate-pulse delay-300"></div>
                  
                  {/* Step number with enhanced design */}
                  <div className="relative mb-8">
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-500 via-primary to-purple-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg group-hover:shadow-2xl group-hover:shadow-blue-500/25 transition-all duration-500 group-hover:scale-110 group-hover:-rotate-3 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
                      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-transparent to-black/10"></div>
                      <span className="text-3xl font-bold text-white relative z-10 group-hover:scale-110 transition-transform duration-300">
                        2
                      </span>
                      {/* Sparkle effect */}
                      <div className="absolute top-2 right-2 w-2 h-2 bg-white/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-ping delay-100"></div>
                    </div>
                  </div>

                  <h3 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-6 group-hover:text-primary transition-colors duration-500 text-center">
                    Review & Compare
                  </h3>
                  
                  <p className="text-slate-600 leading-relaxed text-center group-hover:text-slate-700 transition-colors duration-300 text-lg font-light">
                    Receive detailed proposals from qualified contractors. Compare portfolios, reviews, pricing, and timelines to find the perfect match for your project.
                  </p>

                  {/* Progress indicator */}
                  <div className="mt-8 flex justify-center">
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 bg-primary/30 rounded-full"></div>
                      <div className="w-3 h-3 bg-primary rounded-full"></div>
                      <div className="w-3 h-3 bg-primary/30 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div 
                className="group relative animate-fade-in-up"
                style={{ animationDelay: "600ms" }}
              >
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 lg:p-10 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-700 hover:-translate-y-4 hover:bg-white/90 group-hover:border-primary/30">
                  {/* Floating elements */}
                  <div className="absolute -top-2 -left-1 w-3 h-3 bg-purple-500/20 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 animate-pulse delay-200"></div>
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-primary/20 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-700 animate-pulse delay-400"></div>
                  
                  {/* Step number with enhanced design */}
                  <div className="relative mb-8">
                    <div className="w-24 h-24 bg-gradient-to-br from-purple-600 via-primary to-green-500 rounded-2xl flex items-center justify-center mx-auto shadow-lg group-hover:shadow-2xl group-hover:shadow-purple-500/25 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
                      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-transparent to-black/10"></div>
                      <span className="text-3xl font-bold text-white relative z-10 group-hover:scale-110 transition-transform duration-300">
                        3
                      </span>
                      {/* Sparkle effect */}
                      <div className="absolute top-2 right-2 w-2 h-2 bg-white/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-ping delay-200"></div>
                    </div>
                  </div>

                  <h3 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-6 group-hover:text-primary transition-colors duration-500 text-center">
                    Build & Track
                  </h3>
                  
                  <p className="text-slate-600 leading-relaxed text-center group-hover:text-slate-700 transition-colors duration-300 text-lg font-light">
                    Securely pay deposits, communicate directly with your contractor, and track project milestones through our comprehensive dashboard.
                  </p>

                  {/* Progress indicator */}
                  <div className="mt-8 flex justify-center">
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 bg-primary/30 rounded-full"></div>
                      <div className="w-3 h-3 bg-primary/30 rounded-full"></div>
                      <div className="w-3 h-3 bg-primary rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom decorative element */}
            <div className="text-center mt-16 animate-fade-in-up" style={{ animationDelay: "800ms" }}>
              <div className="inline-flex items-center gap-4 bg-gradient-to-r from-primary/10 via-white/50 to-primary/10 backdrop-blur-sm border border-primary/20 rounded-full px-8 py-4 shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-105">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                <span className="text-slate-600 font-medium">Trusted by 10,000+ homeowners</span>
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse delay-500"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gradient-to-br from-neutral-50 to-blue-50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-accent/5 rounded-full blur-3xl"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16 animate-fade-in-up">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-all duration-300 hover:scale-105">
              💬 Customer Love
            </Badge>
            <h2 className="text-3xl lg:text-4xl font-bold text-neutral-900 mb-4">
              <span className="bg-gradient-to-r from-neutral-900 to-primary bg-clip-text text-transparent">
                What Our Customers Say
              </span>
            </h2>
            <p className="text-xl text-neutral-600 opacity-90 hover:opacity-100 transition-opacity duration-300">
              Join thousands of satisfied homeowners and property managers
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className="border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 transform bg-white/90 backdrop-blur-sm hover:bg-white group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-6 relative">
                  <div className="flex items-center mb-4 group-hover:scale-105 transition-transform duration-300">
                    {renderStars(testimonial.rating)}
                  </div>
                  <p className="text-neutral-700 mb-4 leading-relaxed group-hover:text-neutral-800 transition-colors duration-300 relative z-10">
                    "{testimonial.content}"
                  </p>
                  <div className="group-hover:translate-x-1 transition-transform duration-300">
                    <p className="font-semibold text-neutral-900 group-hover:text-primary transition-colors duration-300">
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-neutral-600">
                      {testimonial.role}
                    </p>
                  </div>
                  <div className="absolute top-0 right-0 w-8 h-8 bg-primary/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute bottom-0 left-0 w-6 h-6 bg-accent/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50"></div>
        <div className="absolute top-10 left-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-accent/5 rounded-full blur-3xl animate-pulse delay-1000"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16 animate-fade-in-up">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-all duration-300 hover:scale-105">
              💰 Transparent Pricing
            </Badge>
            <h2 className="text-3xl lg:text-4xl font-bold text-neutral-900 mb-4">
              <span className="bg-gradient-to-r from-neutral-900 to-primary bg-clip-text text-transparent">
                Simple, Transparent Pricing
              </span>
            </h2>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto opacity-90 hover:opacity-100 transition-opacity duration-300">
              Choose the plan that fits your needs. All plans include our core
              features with no hidden fees.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <Card
                key={index}
                className={`relative border-2 transition-all duration-500 transform hover:-translate-y-3 bg-white/90 backdrop-blur-sm hover:bg-white group cursor-pointer ${
                  plan.popular
                    ? "border-primary shadow-2xl scale-105 bg-gradient-to-br from-white to-primary/5"
                    : hoveredPlan === plan.name
                      ? "border-primary/50 shadow-2xl scale-102"
                      : "border-neutral-200 shadow-lg hover:border-primary/30"
                }`}
                onMouseEnter={() => setHoveredPlan(plan.name)}
                onMouseLeave={() => setHoveredPlan(null)}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                    <Badge className="bg-gradient-to-r from-primary to-blue-600 text-white px-4 py-2 shadow-lg animate-pulse">
                      ⭐ Most Popular
                    </Badge>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg"></div>

                <CardHeader className="text-center pb-8 relative z-10">
                  <CardTitle className="text-2xl font-bold text-neutral-900 mb-2 group-hover:text-primary transition-colors duration-300">
                    {plan.name}
                  </CardTitle>
                  <div className="mb-4 group-hover:scale-105 transition-transform duration-300">
                    <span className="text-4xl font-bold text-neutral-900 group-hover:text-primary transition-colors duration-300">
                      ${plan.price}
                    </span>
                    <span className="text-neutral-600">/{plan.period}</span>
                  </div>
                  <p className="text-neutral-600 group-hover:text-neutral-700 transition-colors duration-300">
                    {plan.description}
                  </p>
                </CardHeader>
                <CardContent className="pt-0 relative z-10">
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li
                        key={featureIndex}
                        className="flex items-start group/item hover:translate-x-1 transition-transform duration-300"
                        style={{ animationDelay: `${featureIndex * 50}ms` }}
                      >
                        <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0 group-hover/item:scale-110 transition-transform duration-300" />
                        <span className="text-neutral-700 group-hover/item:text-neutral-900 transition-colors duration-300">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={
                      plan.name === "Enterprise"
                        ? "/contact"
                        : `/subscribe?plan=${plan.name.toLowerCase()}`
                    }
                  >
                    <Button
                      className={`w-full group/btn transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                        plan.popular
                          ? "bg-gradient-to-r from-primary to-blue-600 hover:from-blue-600 hover:to-primary text-white"
                          : "hover:bg-primary hover:text-white"
                      }`}
                      variant={plan.popular ? "default" : "outline"}
                    >
                      <span className="group-hover/btn:scale-105 transition-transform duration-300">
                        {plan.cta}
                      </span>
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
          <div
            className="text-center mt-12 animate-fade-in-up"
            style={{ animationDelay: "400ms" }}
          >
            <p className="text-neutral-600 mb-4 hover:text-neutral-700 transition-colors duration-300">
              Need a custom solution for your enterprise?
            </p>
            <Button
              variant="outline"
              size="lg"
              className="hover:bg-primary hover:text-white transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              Contact Sales Team
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary via-blue-600 to-purple-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/5 rounded-full blur-3xl animate-pulse delay-1000"></div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <div className="animate-fade-in-up">
            <Badge className="mb-4 bg-white/20 text-white border-white/30 hover:bg-white/30 transition-all duration-300 hover:scale-105">
              🎯 Ready to Start?
            </Badge>
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              <span className="inline-block hover:scale-105 transition-transform duration-300">
                Ready to Start Your
              </span>
              <br />
              <span className="gradient-text bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text">
                Next Project?
              </span>
            </h2>
            <p className="text-xl text-blue-100 mb-8 leading-relaxed opacity-90 hover:opacity-100 transition-opacity duration-300">
              Join thousands of homeowners who have successfully completed their
              renovation projects with RenovatePro.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/subscribe?plan=pro">
                <Button
                  size="lg"
                  variant="secondary"
                  className="w-full sm:w-auto group bg-white text-primary hover:bg-blue-50 transition-all duration-300 hover:scale-105 hover:shadow-2xl transform"
                >
                  <span className="group-hover:scale-105 transition-transform duration-300">
                    Get Started Today
                  </span>
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
              </Link>
              <a href="/api/auth/google">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto text-black border-white hover:bg-white hover:text-primary transition-all duration-300 hover:scale-105 hover:shadow-2xl transform group"
                >
                  <span className="group-hover:scale-105 transition-transform duration-300">
                    Sign in with Google
                  </span>
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-neutral-900 to-black text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-blue-600/5"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2 group">
              <div className="flex items-center space-x-2 mb-4">
                <Hammer className="h-8 w-8 text-primary group-hover:rotate-12 transition-transform duration-300" />
                <span className="text-2xl font-bold group-hover:text-primary transition-colors duration-300">
                  RenovatePro
                </span>
              </div>
              <p className="text-neutral-400 mb-6 leading-relaxed hover:text-neutral-300 transition-colors duration-300">
                The leading platform connecting homeowners and property managers
                with trusted, verified contractors for renovation projects of
                all sizes.
              </p>
              <div className="flex items-center space-x-4 group/secure hover:scale-105 transition-transform duration-300">
                <Shield className="h-5 w-5 text-green-400 group-hover/secure:scale-110 transition-transform duration-300" />
                <span className="text-sm text-neutral-400 group-hover/secure:text-green-300 transition-colors duration-300">
                  Secure & Trusted Platform
                </span>
              </div>
            </div>
            <div className="group">
              <h3 className="font-semibold mb-4 group-hover:text-primary transition-colors duration-300">
                Platform
              </h3>
              <ul className="space-y-2 text-neutral-400">
                <li>
                  <a
                    href="#features"
                    className="hover:text-primary transition-all duration-300 hover:translate-x-1 inline-block"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#pricing"
                    className="hover:text-primary transition-all duration-300 hover:translate-x-1 inline-block"
                  >
                    Pricing
                  </a>
                </li>
                <li>
                  <a
                    href="#about"
                    className="hover:text-primary transition-all duration-300 hover:translate-x-1 inline-block"
                  >
                    How it Works
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-primary transition-all duration-300 hover:translate-x-1 inline-block"
                  >
                    Security
                  </a>
                </li>
              </ul>
            </div>
            <div className="group">
              <h3 className="font-semibold mb-4 group-hover:text-primary transition-colors duration-300">
                Support
              </h3>
              <ul className="space-y-2 text-neutral-400">
                <li>
                  <a
                    href="#"
                    className="hover:text-primary transition-all duration-300 hover:translate-x-1 inline-block"
                  >
                    Help Center
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-primary transition-all duration-300 hover:translate-x-1 inline-block"
                  >
                    Contact Us
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-primary transition-all duration-300 hover:translate-x-1 inline-block"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-primary transition-all duration-300 hover:translate-x-1 inline-block"
                  >
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-neutral-800 mt-12 pt-8 text-center text-neutral-400">
            <p className="hover:text-neutral-300 transition-colors duration-300">
              &copy; 2024 RenovatePro. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
