import { Navigation } from "@/components/Navigation";
import { ITAMFooter } from "@/components/ITAMFooter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { useLocalizedPath } from "@/hooks/useLocalizedPath";
import {
  Shield,
  Smartphone,
  BarChart3,
  Network,
  CheckCircle2,
  FileCheck,
  Package,
  Workflow,
  Scan,
  Cloud,
  Bot,
  Headphones,
  ArrowRight,
  TrendingUp,
  Sparkles,
  Clock } from
"lucide-react";

const ITAssetManagement = () => {
  const { localizedPath } = useLocalizedPath();
  const features = [
  {
    icon: Package,
    title: "Complete Asset Lifecycle",
    description: "Track IT and Non-IT assets from procurement to disposal with comprehensive lifecycle management.",
    highlights: ["Barcoding & RFID", "Asset Tagging", "Depreciation Tracking"]
  },
  {
    icon: Network,
    title: "Auto Network Discovery",
    description: "Agent and agentless discovery of all network devices including Windows, Linux, Apple, IoT devices, and cloud resources.",
    highlights: ["Real-Time Discovery", "AD Integration", "Cloud Inventory"]
  },
  {
    icon: FileCheck,
    title: "License Management",
    description: "Optimize software licensing costs and track license compliance with automated monitoring and alerts.",
    highlights: ["Usage Tracking", "Expiry Alerts", "Cost Optimization"]
  },
  {
    icon: BarChart3,
    title: "Procurement Management",
    description: "Streamline purchase orders, vendor bidding, budget tracking, and approval workflows.",
    highlights: ["Vendor Management", "PO Creation", "Budget Control"]
  },
  {
    icon: Headphones,
    title: "Intelligent Service Desk",
    description: "ITIL-ready service desk with AI-powered ticket automation, SLA management, and multi-channel support.",
    highlights: ["BOT Integration", "Auto Allocation", "Mobile App"]
  },
  {
    icon: Workflow,
    title: "Configuration Management",
    description: "Maintain accurate CMDB with automated updates, change management, and impact analysis.",
    highlights: ["CMDB", "Change Tracking", "Impact Analysis"]
  }];


  const technicalFeatures = [
  {
    category: "Asset Management",
    items: [
    "IT & Non-IT Asset Tracking",
    "Barcoding & RFID Tagging",
    "Auto Discovery",
    "Location Mapping",
    "Temporary Asset Allocation",
    "Asset AMC & Maintenance",
    "Warranty Management",
    "Asset Audit & History",
    "Document Management",
    "Threshold Management"]

  },
  {
    category: "Network Discovery",
    items: [
    "Agent & Agentless Discovery",
    "Windows, Linux, Apple Systems",
    "Active Directory Integration",
    "Software Inventory",
    "Printers, Cameras, Routers",
    "IoT Devices & Smart TV",
    "Virtual Machines",
    "Cloud Inventory (Azure)",
    "USB & Pendrive Detection",
    "Remote Desktop (RDP)"]

  },
  {
    category: "Service Desk",
    items: [
    "Omni-Channel Ticketing",
    "Auto Ticket Generation",
    "SLA Management",
    "Knowledge Base (Public/Private)",
    "Feedback Management",
    "Work Flow Automation",
    "API Integration",
    "IVR Integration"]

  },
  {
    category: "Compliance & Security",
    items: [
    "ISO 27001 & ISO 55001",
    "ITIL Standards",
    "SOX & GDPR Compliant",
    "Audit Trail & History",
    "Role-Based Access Control",
    "Multi-Company Support",
    "Configuration Management DB",
    "Change Management"]

  }];


  const benefits = [
  { icon: Clock, label: "80% Faster Audits", color: "text-amber-600 dark:text-amber-400" },
  { icon: TrendingUp, label: "30% Cost Reduction", color: "text-green-600 dark:text-green-400" },
  { icon: Shield, label: "100% Compliance", color: "text-blue-600 dark:text-blue-400" },
  { icon: Sparkles, label: "AI-Powered Automation", color: "text-purple-600 dark:text-purple-400" }];


  const complianceStandards = [
  "CARO", "IT ACT", "ISO 27001", "ISO 55001", "ITIL", "SOX", "GDPR", "IFRS"];


  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 overflow-hidden bg-gradient-to-br from-background via-muted/30 to-background">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--primary)/0.1),transparent_50%)]"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto text-center animate-fade-in">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-tight">
              ITAM IT Asset Management
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
              Intelligent Asset Discovery & Lifecycle Management Platform
            </p>
            <div className="flex flex-wrap gap-3 justify-center mb-8">
              {benefits.map((benefit) =>
              <Badge
                key={benefit.label}
                variant="outline"
                className="flex items-center gap-2 px-4 py-2 text-sm border-border/50 bg-background/50">
                
                  <benefit.icon className={`w-4 h-4 ${benefit.color}`} />
                  <span className="font-medium">{benefit.label}</span>
                </Badge>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Key Features Grid */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Comprehensive Asset Management Suite
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              From automated discovery to intelligent service desk, manage your entire IT infrastructure with one unified platform
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {features.map((feature, index) =>
            <Card
              key={feature.title}
              className="p-6 hover:shadow-lg transition-all duration-300 border-border hover:border-primary/50 bg-card animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}>
              
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground mb-2">
                      {feature.title}
                    </h3>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                  {feature.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {feature.highlights.map((highlight) =>
                <Badge
                  key={highlight}
                  variant="outline"
                  className="text-xs border-red-500/20 bg-red-500/5 text-foreground">
                  
                      {highlight}
                    </Badge>
                )}
                </div>
              </Card>
            )}
          </div>
        </div>
      </section>

      {/* ITM 2.0 Features */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              

              
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Introducing ITAM 

              </h2>
              <p className="text-lg text-muted-foreground">
                Revolutionary leap forward in intelligent task management with advanced automation
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
              { icon: Cloud, label: "Seamless Software Deployment" },
              { icon: Shield, label: "Advanced Patch Management" },
              { icon: Workflow, label: "Dynamic Kanban Board" },
              { icon: Sparkles, label: "Announcement Module" },
              { icon: TrendingUp, label: "Vendor Bidding" },
              { icon: Bot, label: "Integrated Call Recording & Ticket Creation" }].
              map((feature, index) =>
              <div
                key={feature.label}
                className="flex items-center gap-3 p-4 rounded-lg border border-border bg-card hover:bg-muted/50 transition-colors animate-slide-up"
                style={{ animationDelay: `${index * 50}ms` }}>
                
                  <CheckCircle2 className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
                  <span className="font-medium text-foreground">{feature.label}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Technical Features */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Technical Capabilities
            </h2>
            <p className="text-lg text-muted-foreground">
              Enterprise-grade features for comprehensive IT operations management
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
            {technicalFeatures.map((section, index) =>
            <Card
              key={section.category}
              className="p-6 border-border bg-card animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}>
              
                <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <Scan className="w-5 h-5 text-red-600 dark:text-red-400" />
                  {section.category}
                </h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {section.items.map((item) =>
                <li key={item} className="flex items-start gap-2 text-sm text-foreground/90">
                      <ArrowRight className="w-3.5 h-3.5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                )}
                </ul>
              </Card>
            )}
          </div>
        </div>
      </section>

      {/* Compliance Standards */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Shield className="w-16 h-16 text-red-600 dark:text-red-400 mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Compliance Ready
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Built-in support for major compliance standards and regulatory frameworks
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              {complianceStandards.map((standard) => (
                <Badge
                  key={standard}
                  variant="outline"
                  className="px-4 py-2 text-sm font-medium border-border/50 bg-background/50">
                  {standard}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Mobile App CTA */}
      <section className="py-16 bg-gradient-to-br from-red-500 to-red-600 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Smartphone className="w-16 h-16 mx-auto mb-6 opacity-90" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Mobile App for On-the-Go Management
            </h2>
            <p className="text-xl mb-8 text-white/90">
              Track assets, raise tickets, and manage your IT infrastructure from anywhere with our powerful mobile application
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button size="lg" variant="secondary" className="gap-2" asChild>
                <Link to={localizedPath("/contact?source=Get Started with ITM")}>
                  Get Started <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="gap-2 bg-white/10 border-white/20 text-white hover:bg-white/20" asChild>
                <Link to={localizedPath("/contact?source=ITM Contact Sales")}>
                  Contact Sales <Headphones className="w-4 h-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <ITAMFooter />
    </div>);

};

export default ITAssetManagement;