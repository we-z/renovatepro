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
  Check
} from "lucide-react";

export default function Landing() {
  const [hoveredPlan, setHoveredPlan] = useState<string | null>(null);

  const features = [
    {
      icon: FileText,
      title: "Smart Project Posting",
      description: "Create detailed project listings with budgets, timelines, and requirements to attract the right contractors."
    },
    {
      icon: Users,
      title: "Verified Contractor Profiles",
      description: "Browse vetted contractors with ratings, portfolios, and verified credentials for peace of mind."
    },
    {
      icon: CheckCircle2,
      title: "Intelligent Bid Management",
      description: "Compare proposals side-by-side with automated matching based on your project requirements."
    },
    {
      icon: MessageSquare,
      title: "Secure Communication",
      description: "Built-in messaging system keeps all project communication organized and accessible."
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Homeowner",
      content: "Found the perfect contractor for my kitchen renovation. The whole process was seamless!",
      rating: 5
    },
    {
      name: "Mike Chen",
      role: "Property Manager",
      content: "Managing multiple properties is so much easier now. Great contractor network and fair pricing.",
      rating: 5
    },
    {
      name: "Lisa Rodriguez",
      role: "Homeowner",
      content: "The bid comparison feature saved me thousands. Highly recommend RenovatePro!",
      rating: 5
    }
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
        "Secure messaging"
      ],
      popular: false,
      cta: "Start Basic Plan"
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
        "Bulk project management"
      ],
      popular: true,
      cta: "Start Pro Plan"
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
        "White-label options"
      ],
      popular: false,
      cta: "Contact Sales"
    }
  ];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`h-4 w-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
    ));
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white border-b border-neutral-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Hammer className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold text-neutral-900">RenovatePro</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-neutral-600 hover:text-primary transition-colors">Features</a>
              <a href="#pricing" className="text-neutral-600 hover:text-primary transition-colors">Pricing</a>
              <a href="#about" className="text-neutral-600 hover:text-primary transition-colors">How it Works</a>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/app">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link href="/subscribe?plan=pro">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
                Trusted by 10,000+ Property Owners
              </Badge>
              <h1 className="text-4xl lg:text-6xl font-bold text-neutral-900 mb-6 leading-tight">
                Connect with
                <span className="text-primary"> Trusted Contractors</span>
                <br />for Your Next Project
              </h1>
              <p className="text-xl text-neutral-600 mb-8 leading-relaxed">
                RenovatePro makes it easy to find, compare, and hire qualified contractors for your home renovation projects. Get competitive bids and manage everything in one place.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/subscribe?plan=pro">
                  <Button size="lg" className="w-full sm:w-auto">
                    Start Your Project
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/app">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    Try Demo
                  </Button>
                </Link>
              </div>
              <div className="flex items-center space-x-6 mt-8 text-sm text-neutral-600">
                <div className="flex items-center">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                  Free to get started
                </div>
                <div className="flex items-center">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                  No hidden fees
                </div>
                <div className="flex items-center">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                  Cancel anytime
                </div>
              </div>
            </div>
            <div className="lg:pl-12">
              <div className="relative">
                <div className="bg-white rounded-2xl shadow-2xl p-8">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                      <Hammer className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Kitchen Renovation</h3>
                      <p className="text-sm text-neutral-600">San Francisco, CA</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-neutral-50 rounded-lg">
                      <span className="text-sm font-medium">Budget Range</span>
                      <span className="font-semibold">$25,000 - $40,000</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                      <span className="text-sm font-medium">Bids Received</span>
                      <span className="font-semibold text-green-600">5 Qualified</span>
                    </div>
                    <Button className="w-full">
                      Review Bids
                    </Button>
                  </div>
                </div>
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-accent rounded-full opacity-20"></div>
                <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-primary rounded-full opacity-10"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-neutral-900 mb-4">
              Everything You Need to Manage Projects
            </h2>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
              From posting your first project to managing multiple renovations, RenovatePro provides all the tools you need for successful project completion.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Icon className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold text-neutral-900 mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-neutral-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="about" className="py-20 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-neutral-900 mb-4">
              How RenovatePro Works
            </h2>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
              Get your renovation project started in just three simple steps
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-2xl font-semibold text-neutral-900 mb-4">Post Your Project</h3>
              <p className="text-neutral-600 leading-relaxed">
                Describe your renovation project with details about scope, budget, timeline, and preferences. Our smart matching system will find the right contractors.
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-2xl font-semibold text-neutral-900 mb-4">Compare Proposals</h3>
              <p className="text-neutral-600 leading-relaxed">
                Receive competitive bids from verified contractors. Review their profiles, past work, and ratings to make an informed decision.
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-2xl font-semibold text-neutral-900 mb-4">Manage & Communicate</h3>
              <p className="text-neutral-600 leading-relaxed">
                Award the project to your chosen contractor and use our built-in tools to track progress, communicate, and ensure successful completion.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-neutral-900 mb-4">
              What Our Customers Say
            </h2>
            <p className="text-xl text-neutral-600">
              Join thousands of satisfied homeowners and property managers
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {renderStars(testimonial.rating)}
                  </div>
                  <p className="text-neutral-700 mb-4 leading-relaxed">
                    "{testimonial.content}"
                  </p>
                  <div>
                    <p className="font-semibold text-neutral-900">{testimonial.name}</p>
                    <p className="text-sm text-neutral-600">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-neutral-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
              Choose the plan that fits your needs. All plans include our core features with no hidden fees.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <Card 
                key={index} 
                className={`relative border-2 transition-all duration-300 ${
                  plan.popular 
                    ? 'border-primary shadow-xl scale-105' 
                    : hoveredPlan === plan.name 
                      ? 'border-primary/50 shadow-lg' 
                      : 'border-neutral-200 shadow-md'
                }`}
                onMouseEnter={() => setHoveredPlan(plan.name)}
                onMouseLeave={() => setHoveredPlan(null)}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-primary text-white px-4 py-1">
                      Most Popular
                    </Badge>
                  </div>
                )}
                <CardHeader className="text-center pb-8">
                  <CardTitle className="text-2xl font-bold text-neutral-900 mb-2">
                    {plan.name}
                  </CardTitle>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-neutral-900">${plan.price}</span>
                    <span className="text-neutral-600">/{plan.period}</span>
                  </div>
                  <p className="text-neutral-600">{plan.description}</p>
                </CardHeader>
                <CardContent className="pt-0">
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-neutral-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href={plan.name === "Enterprise" ? "/contact" : `/subscribe?plan=${plan.name.toLowerCase()}`}>
                    <Button 
                      className={`w-full ${
                        plan.popular 
                          ? 'bg-primary hover:bg-primary/90' 
                          : ''
                      }`}
                      variant={plan.popular ? "default" : "outline"}
                    >
                      {plan.cta}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-12">
            <p className="text-neutral-600 mb-4">
              Need a custom solution for your enterprise?
            </p>
            <Button variant="outline" size="lg">
              Contact Sales Team
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Ready to Start Your Next Project?
          </h2>
          <p className="text-xl text-blue-100 mb-8 leading-relaxed">
            Join thousands of homeowners who have successfully completed their renovation projects with RenovatePro.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/subscribe?plan=pro">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                Get Started Today
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/app">
              <Button size="lg" variant="outline" className="w-full sm:w-auto text-white border-white hover:bg-white hover:text-primary">
                Try Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-neutral-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <Hammer className="h-8 w-8 text-primary" />
                <span className="text-2xl font-bold">RenovatePro</span>
              </div>
              <p className="text-neutral-400 mb-6 leading-relaxed">
                The leading platform connecting homeowners and property managers with trusted, verified contractors for renovation projects of all sizes.
              </p>
              <div className="flex items-center space-x-4">
                <Shield className="h-5 w-5 text-green-400" />
                <span className="text-sm text-neutral-400">Secure & Trusted Platform</span>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Platform</h3>
              <ul className="space-y-2 text-neutral-400">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#about" className="hover:text-white transition-colors">How it Works</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-neutral-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-neutral-800 mt-12 pt-8 text-center text-neutral-400">
            <p>&copy; 2024 RenovatePro. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}