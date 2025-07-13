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
  Globe,
  ChevronDown,
  Play,
  Menu,
  X,
  Star,
  Layers
} from "lucide-react";
import { useState, useEffect } from "react";

export default function Landing() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isMobileMenuOpen && !target.closest('.mobile-menu-container')) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobileMenuOpen]);

  // Scroll-triggered animations
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, observerOptions);

    // Observe all scroll-triggered elements
    const scrollElements = document.querySelectorAll('.scroll-fade-in, .scroll-slide-left, .scroll-slide-right, .scroll-scale');
    scrollElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  // Parallax effect for floating elements
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const parallaxElements = document.querySelectorAll('.parallax-float');
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;

      parallaxElements.forEach((element) => {
        const speed = parseFloat((element as HTMLElement).dataset.speed || '0.5');
        const xPos = (x - 0.5) * speed * 20;
        const yPos = (y - 0.5) * speed * 20;
        (element as HTMLElement).style.transform = `translate(${xPos}px, ${yPos}px)`;
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

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
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Minimal Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-white"></div>
      </div>

      {/* Sticky Navigation */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 mobile-menu-container ${
        isScrolled ? 'bg-white/95 backdrop-blur-xl shadow-lg' : 'bg-white/90 backdrop-blur-md'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3 group z-50 relative">
              <div className={`w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center transition-all duration-500 group-hover:scale-105 shadow-sm group-hover:rotate-12 ${
                isMobileMenuOpen ? 'rotate-180 scale-110' : ''
              }`}>
                <Building className="h-5 w-5 text-white transition-transform duration-300" />
              </div>
              <span className="text-xl font-semibold text-slate-900 transition-all duration-300">
                Puul AI
              </span>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-slate-600 hover:text-slate-900 transition-all duration-300 font-medium relative group hover:scale-105">
                Features
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-slate-900 transition-all duration-300 group-hover:w-full"></span>
              </a>
              <a href="#pricing" className="text-slate-600 hover:text-slate-900 transition-all duration-300 font-medium relative group hover:scale-105">
                Pricing
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-slate-900 transition-all duration-300 group-hover:w-full"></span>
              </a>
              <a href="#demo" className="text-slate-600 hover:text-slate-900 transition-all duration-300 font-medium relative group hover:scale-105">
                Demo
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-slate-900 transition-all duration-300 group-hover:w-full"></span>
              </a>
              <Link href="/login">
                <Button variant="outline" className="hover:shadow-lg hover:bg-slate-50 transition-all duration-300 hover:scale-105 border-slate-300 hover:border-slate-900">
                  Sign In
                </Button>
              </Link>
              <Link href="/login">
                <Button className="bg-slate-900 hover:bg-slate-700 text-white hover:shadow-xl transition-all duration-300 hover:scale-105 group shadow-lg">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden z-50 relative w-10 h-10 flex items-center justify-center transition-all duration-300 hover:scale-110 focus:outline-none group"
            >
              <div className="relative">
                <Menu 
                  className={`h-6 w-6 text-slate-900 transition-all duration-500 ${
                    isMobileMenuOpen ? 'opacity-0 rotate-180 scale-50' : 'opacity-100 rotate-0 scale-100'
                  }`} 
                />
                <X 
                  className={`h-6 w-6 text-slate-900 absolute top-0 left-0 transition-all duration-500 ${
                    isMobileMenuOpen ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 rotate-180 scale-50'
                  }`} 
                />
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        <div className={`md:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-xl shadow-2xl border-t border-slate-200/50 transition-all duration-700 ease-out ${
          isMobileMenuOpen 
            ? 'opacity-100 translate-y-0 pointer-events-auto' 
            : 'opacity-0 -translate-y-4 pointer-events-none'
        }`}>
          <div className="px-4 py-6 space-y-1">
            {/* Navigation Links */}
            {[
              { href: '#features', label: 'Features', icon: Layers },
              { href: '#pricing', label: 'Pricing', icon: Star },
              { href: '#demo', label: 'Demo', icon: Play }
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-4 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all duration-300 group border border-transparent hover:border-slate-200 hover:shadow-md ${
                    isMobileMenuOpen ? 'animate-fade-in-up' : ''
                  }`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <Icon className="h-5 w-5 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12" />
                  <span className="font-medium">{item.label}</span>
                  <ArrowRight className="h-4 w-4 ml-auto opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1" />
                </a>
              );
            })}

            {/* Separator */}
            <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent my-4" />

            {/* Action Buttons */}
            <div className="space-y-3 pt-2">
              <Link href="/login">
                <Button 
                  variant="outline" 
                  className="w-full justify-center hover:shadow-lg hover:bg-slate-50 transition-all duration-300 hover:scale-105 border-slate-300 hover:border-slate-900 animate-fade-in-up"
                  style={{ animationDelay: '300ms' }}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign In
                </Button>
              </Link>
              <Link href="/login">
                <Button 
                  className="w-full justify-center bg-slate-900 hover:bg-slate-700 text-white hover:shadow-xl transition-all duration-300 hover:scale-105 group shadow-lg animate-fade-in-up"
                  style={{ animationDelay: '400ms' }}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        <div className={`md:hidden fixed inset-0 bg-slate-900/20 backdrop-blur-sm transition-all duration-500 ${
          isMobileMenuOpen ? 'opacity-100 pointer-events-auto z-40' : 'opacity-0 pointer-events-none z-40'
        }`} />
      </header>

      {/* Hero Section with Enhanced Animations */}
      <section className="relative pt-20 pb-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Floating background elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="parallax-float absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-br from-blue-100/30 to-purple-100/30 rounded-full blur-3xl" data-speed="0.3"></div>
          <div className="parallax-float absolute top-1/3 right-1/4 w-96 h-96 bg-gradient-to-br from-slate-100/40 to-gray-100/40 rounded-full blur-3xl" data-speed="0.5"></div>
          <div className="parallax-float absolute bottom-1/4 left-1/3 w-80 h-80 bg-gradient-to-br from-slate-50/50 to-white/50 rounded-full blur-3xl" data-speed="0.4"></div>
        </div>

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="scroll-fade-in">
            <Badge className="mb-6 px-4 py-2 bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-900 hover:text-white transition-all duration-500 hover:scale-105 shadow-sm hover:shadow-lg cursor-pointer glass-card">
              <Sparkles className="w-4 h-4 mr-2 transition-transform duration-300 group-hover:rotate-12" />
              AI-Native Property Management Platform
            </Badge>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-bold text-slate-900 mb-6 tracking-tight scroll-scale drop-shadow-sm hover:drop-shadow-lg transition-all duration-500 cursor-default">
            <span className="inline-block hover-lift-gentle">AI for Property Managers</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-600 mb-8 max-w-3xl mx-auto leading-relaxed scroll-fade-in stagger-2">
            Revolutionize your property portfolio with AI-powered insights, predictive maintenance, 
            and intelligent automation designed for enterprise property managers.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center scroll-fade-in stagger-3">
            <Link href="/login">
              <Button size="lg" className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-4 text-lg shadow-lg hover:shadow-2xl transition-all duration-500 hover-lift-gentle group layer-float">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1 group-hover:scale-110" />
              </Button>
            </Link>
            <Button 
              variant="outline" 
              size="lg" 
              className="px-8 py-4 text-lg shadow-md hover:shadow-xl hover:bg-slate-900 hover:text-white transition-all duration-500 hover-lift-gentle group glass-card border-slate-300 hover:border-slate-900"
            >
              <Play className="mr-2 h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
              Watch Demo
            </Button>
          </div>

          {/* Enhanced floating animation indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
            <div className="animate-bounce cursor-pointer hover:scale-110 transition-transform duration-300">
              <ChevronDown className="h-6 w-6 text-slate-400 hover:text-slate-600 transition-colors duration-300" />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-slate-900 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div 
                key={stat.label} 
                className="text-center group animate-fade-in-up cursor-pointer hover:bg-white/5 p-4 rounded-xl transition-all duration-300"
                style={{ animationDelay: `${index * 100 + 800}ms` }}
              >
                <div className="text-4xl md:text-5xl font-bold text-white mb-2 transition-all duration-300 group-hover:scale-125 group-hover:text-slate-100">
                  {stat.value}
                </div>
                <div className="text-slate-300 font-medium group-hover:text-slate-200 transition-colors duration-300">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section with Enhanced Animations */}
      <section id="features" className="py-24 bg-white relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 -left-32 w-64 h-64 bg-gradient-to-r from-blue-50/50 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 -right-32 w-64 h-64 bg-gradient-to-l from-slate-50/50 to-transparent rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16 scroll-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 hover-lift-gentle">
              AI-Powered Features
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto scroll-fade-in stagger-1">
              Transform your property management with cutting-edge artificial intelligence 
              designed specifically for enterprise portfolios.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              const animationClass = index % 3 === 0 ? 'scroll-slide-left' : index % 3 === 1 ? 'scroll-fade-in' : 'scroll-slide-right';
              return (
                <Card 
                  key={feature.title} 
                  className={`group hover:shadow-2xl transition-all duration-500 hover-lift-gentle border-0 shadow-md ${animationClass} glass-card relative overflow-hidden cursor-pointer layer-float`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1200 ease-out opacity-0 group-hover:opacity-100"></div>
                  <CardContent className="p-8 relative">
                    <div className="w-16 h-16 rounded-2xl bg-slate-900 flex items-center justify-center mb-6 transition-all duration-500 group-hover:scale-110 group-hover:bg-slate-700 shadow-lg group-hover:shadow-2xl group-hover:rotate-6">
                      <Icon className="h-8 w-8 text-white transition-transform duration-500 group-hover:scale-110" />
                    </div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-4 group-hover:text-slate-700 transition-colors duration-300">
                      {feature.title}
                    </h3>
                    <p className="text-slate-600 leading-relaxed group-hover:text-slate-800 transition-colors duration-300">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing Section with Interactive Cards */}
      <section id="pricing" className="py-24 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Choose the perfect plan for your property portfolio. All plans include 
              a 30-day free trial with full access to AI features.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricing.map((plan, index) => (
              <Card 
                key={plan.name} 
                className={`relative group transition-all duration-300 hover:scale-105 hover:-translate-y-3 border-0 shadow-lg hover:shadow-2xl animate-fade-in-up bg-white/90 backdrop-blur-sm cursor-pointer ${
                  plan.popular 
                    ? 'ring-2 ring-slate-900 shadow-slate-200 hover:ring-slate-700' 
                    : 'hover:ring-2 hover:ring-slate-300'
                }`}
                style={{ animationDelay: `${index * 200 + 1200}ms` }}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-slate-900 text-white px-4 py-1 shadow-lg">
                      Most Popular
                    </Badge>
                  </div>
                )}
                
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold text-slate-900 mb-2 group-hover:text-slate-700 transition-colors duration-300">{plan.name}</h3>
                  <p className="text-slate-600 mb-6 group-hover:text-slate-800 transition-colors duration-300">{plan.description}</p>
                  
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-slate-900 group-hover:scale-105 transition-transform duration-300 inline-block">{plan.price}</span>
                    {plan.price !== "Custom" && (
                      <span className="text-slate-500 ml-2 group-hover:text-slate-700 transition-colors duration-300">/{plan.period}</span>
                    )}
                  </div>
                  
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center group/item hover:bg-slate-50 p-2 rounded-md transition-colors duration-200">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 group-hover/item:text-green-600 group-hover/item:scale-110 transition-all duration-200" />
                        <span className="text-slate-600 group-hover/item:text-slate-900 transition-colors duration-200">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    className={`w-full py-3 transition-all duration-300 hover:scale-105 group shadow-md hover:shadow-xl hover:-translate-y-1 ${
                      plan.popular 
                        ? 'bg-slate-900 hover:bg-slate-700 text-white' 
                        : 'bg-slate-900 hover:bg-slate-700 text-white'
                    }`}
                  >
                    {plan.cta}
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-slate-900 relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 animate-fade-in-up">
            Ready to Transform Your Property Management?
          </h2>
          <p className="text-xl text-slate-300 mb-8 animate-fade-in-up animation-delay-200">
            Join thousands of property managers who have revolutionized their operations with Puul AI.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up animation-delay-400">
            <Link href="/login">
              <Button size="lg" className="bg-white text-slate-900 hover:bg-slate-100 hover:text-slate-700 px-8 py-4 text-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 group shadow-lg">
                Start Your Free Trial
                <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1 group-hover:scale-110" />
              </Button>
            </Link>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-white text-slate-900 bg-white hover:bg-slate-100 hover:text-slate-700 px-8 py-4 text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl group"
            >
              <span className="transition-transform duration-300 group-hover:scale-105">Schedule Demo</span>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-neutral-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
                <Building className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-semibold text-slate-900">Puul AI</span>
            </div>
            <div className="flex space-x-8 text-slate-600">
              <a href="#" className="hover:text-slate-900 hover:scale-105 transition-all duration-300 relative group">
                Privacy
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-slate-900 transition-all duration-300 group-hover:w-full"></span>
              </a>
              <a href="#" className="hover:text-slate-900 hover:scale-105 transition-all duration-300 relative group">
                Terms
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-slate-900 transition-all duration-300 group-hover:w-full"></span>
              </a>
              <a href="#" className="hover:text-slate-900 hover:scale-105 transition-all duration-300 relative group">
                Support
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-slate-900 transition-all duration-300 group-hover:w-full"></span>
              </a>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-neutral-200 text-center text-slate-500">
            <p>&copy; 2025 Puul AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}