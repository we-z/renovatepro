import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Building, 
  Brain, 
  TrendingUp, 
  Shield, 
  Zap, 
  Users, 
  BarChart3, 
  ArrowRight, 
  CheckCircle, 
  Sparkles,
  Eye,
  Target,
  Globe
} from "lucide-react";

export default function Landing() {
  const features = [
    {
      icon: Brain,
      title: "AI-Powered Insights",
      description: "Predictive analytics for maintenance, tenant risk assessment, and market trends"
    },
    {
      icon: TrendingUp,
      title: "Predictive Maintenance",
      description: "Prevent costly repairs with AI-driven maintenance forecasting and scheduling"
    },
    {
      icon: Shield,
      title: "Intelligent Risk Analysis",
      description: "Advanced tenant screening and property risk assessment using machine learning"
    },
    {
      icon: Zap,
      title: "Automated Operations",
      description: "Streamline workflows with intelligent automation for routine tasks"
    },
    {
      icon: Users,
      title: "Tenant Intelligence",
      description: "Deep insights into tenant behavior and satisfaction patterns"
    },
    {
      icon: BarChart3,
      title: "Performance Analytics",
      description: "Real-time dashboards with actionable insights for portfolio optimization"
    }
  ];

  const stats = [
    { value: "40%", label: "Maintenance Cost Reduction" },
    { value: "2.5x", label: "Faster Issue Resolution" },
    { value: "95%", label: "Tenant Satisfaction Rate" },
    { value: "25%", label: "Operational Efficiency Gain" }
  ];

  const pricing = [
    {
      name: "Starter",
      price: "$99",
      period: "per property/month",
      description: "Perfect for small property portfolios",
      features: [
        "Up to 50 units",
        "Basic AI insights",
        "Maintenance tracking",
        "Tenant portal",
        "Email support"
      ],
      cta: "Start Free Trial",
      popular: false
    },
    {
      name: "Professional",
      price: "$249",
      period: "per property/month",
      description: "Advanced features for growing portfolios",
      features: [
        "Up to 500 units",
        "Advanced AI analytics",
        "Predictive maintenance",
        "Risk assessment",
        "Priority support"
      ],
      cta: "Start Free Trial",
      popular: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "contact sales",
      description: "Unlimited scale with enterprise features",
      features: [
        "Unlimited units",
        "Custom AI models",
        "White-label solution",
        "Dedicated success manager",
        "24/7 phone support"
      ],
      cta: "Contact Sales",
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-neutral-100 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
                <Building className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-semibold text-slate-900">Puul AI</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <Link href="#features" className="text-slate-600 hover:text-slate-900 transition-colors font-medium">Features</Link>
              <Link href="#pricing" className="text-slate-600 hover:text-slate-900 transition-colors font-medium">Pricing</Link>
              <Link href="#about" className="text-slate-600 hover:text-slate-900 transition-colors font-medium">About</Link>
            </div>

            <div className="flex items-center space-x-4">
              <Link href="/app">
                <Button variant="ghost" className="text-slate-600 hover:text-slate-900">
                  Sign In
                </Button>
              </Link>
              <Link href="/subscribe">
                <Button className="bg-slate-900 hover:bg-slate-800 text-white">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-white"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge className="mb-6 bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200 px-4 py-2">
              <Sparkles className="h-4 w-4 mr-2" />
              The First AI-Native Property Management Platform
            </Badge>
            
            <h1 className="text-5xl md:text-7xl font-bold text-slate-900 mb-8 tracking-tight">
              Intelligence-First
              <br />
              <span className="text-slate-600">Property Management</span>
            </h1>
            
            <p className="text-xl text-slate-600 mb-12 max-w-3xl mx-auto leading-relaxed">
              Transform your property portfolio with AI-powered insights, predictive maintenance, 
              and automated operations designed for enterprise property managers.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/subscribe">
                <Button size="lg" className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-4 text-lg">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/app">
                <Button variant="outline" size="lg" className="border-slate-200 text-slate-700 hover:bg-slate-50 px-8 py-4 text-lg">
                  View Demo
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-slate-300 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              Built for the Future of Property Management
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Every feature designed with AI at its core, delivering unprecedented 
              insights and automation for modern property managers.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="border-0 shadow-sm hover:shadow-lg transition-all duration-300 group">
                  <CardContent className="p-8">
                    <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-slate-900 transition-colors">
                      <Icon className="h-6 w-6 text-slate-600 group-hover:text-white transition-colors" />
                    </div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-slate-600 leading-relaxed">
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
      <section className="py-32 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              AI That Actually Works
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Our AI doesn't just analyze data—it predicts problems, suggests solutions, 
              and automates actions to keep your properties running smoothly.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Eye className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-slate-900 mb-4">Observe</h3>
              <p className="text-slate-600">
                Our AI continuously monitors your properties, analyzing patterns 
                in maintenance, tenant behavior, and operational efficiency.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Target className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-slate-900 mb-4">Predict</h3>
              <p className="text-slate-600">
                Advanced algorithms predict maintenance needs, tenant risks, 
                and market opportunities before they become problems.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-slate-900 mb-4">Act</h3>
              <p className="text-slate-600">
                Automated workflows execute preventive actions, schedule maintenance, 
                and optimize operations without manual intervention.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              Scale with Confidence
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Transparent pricing that grows with your portfolio. 
              Start with a free trial and upgrade as you expand.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricing.map((plan, index) => (
              <Card key={index} className={`relative ${
                plan.popular 
                  ? 'border-slate-900 shadow-lg scale-105' 
                  : 'border-slate-200 hover:border-slate-300'
              } transition-all duration-300`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-slate-900 text-white px-4 py-1">Most Popular</Badge>
                  </div>
                )}
                <CardContent className="p-8">
                  <h3 className="text-2xl font-semibold text-slate-900 mb-2">{plan.name}</h3>
                  <p className="text-slate-600 mb-6">{plan.description}</p>
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-slate-900">{plan.price}</span>
                    <span className="text-slate-600 ml-2">{plan.period}</span>
                  </div>
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                        <span className="text-slate-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className={`w-full ${
                      plan.popular 
                        ? 'bg-slate-900 hover:bg-slate-800 text-white' 
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-900'
                    }`}
                  >
                    {plan.cta}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-slate-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Transform Your Properties?
          </h2>
          <p className="text-xl text-slate-300 mb-12">
            Join forward-thinking property managers who are already using AI 
            to optimize their operations and maximize their returns.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/subscribe">
              <Button size="lg" className="bg-white text-slate-900 hover:bg-slate-100 px-8 py-4 text-lg">
                Start Your Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-slate-600 text-white hover:bg-slate-800 px-8 py-4 text-lg"
            >
              <Globe className="mr-2 h-5 w-5" />
              Schedule Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
                <Building className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-semibold text-slate-900">Puul AI</span>
            </div>
            <p className="text-slate-600">
              © 2024 Puul AI. The future of property management.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}