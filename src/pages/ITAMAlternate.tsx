import { Navigation } from "@/components/Navigation";
import { ITAMFooter } from "@/components/ITAMFooter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useLocalizedPath } from "@/hooks/useLocalizedPath";
import itamLogo from "@/assets/itam-logo.png";
import itam4Phases from "@/assets/itam-4-phases.png";
import itamDiscovery from "@/assets/itam-discovery.png";
import itamCmdb from "@/assets/itam-cmdb.png";
import itamDependencyMap from "@/assets/itam-dependency-map.png";
import itamLifecycle from "@/assets/itam-lifecycle.png";
import itamIntegration from "@/assets/itam-integration.png";
import itamDifferentiators from "@/assets/itam-differentiators.png";
import {
  Search,
  Database,
  Network,
  Package,
  Shield,
  Bot,
  ArrowRight,
  CheckCircle2,
  Scan,
  Server,
  Monitor,
  Cloud,
  Laptop,
  Smartphone,
  Lock,
  Eye,
  RefreshCw,
  FileCheck,
  BarChart3,
  Workflow,
  Layers,
  Globe,
  Zap,
  Clock,
  Users,
  DollarSign,
  AlertTriangle,
  TrendingUp,
  Headphones,
} from "lucide-react";

// Icon mappings for modules and other arrays
const problemIcons = [Eye, Database, Network, DollarSign];
const moduleIcons = [Search, Database, Network, Package];
const moduleColors = [
  "from-emerald-500 to-green-600",
  "from-teal-500 to-emerald-600",
  "from-green-500 to-teal-600",
  "from-emerald-600 to-green-700",
];
const moduleImages = [itamDiscovery, itamCmdb, itamDependencyMap, itamLifecycle];
const moduleFeatureIcons = [
  [Scan, Laptop, RefreshCw],
  [Workflow, Layers, FileCheck],
  [AlertTriangle, Eye, TrendingUp],
  [RefreshCw, BarChart3, FileCheck],
];
const differentiatorIcons = [Bot, Shield];
const businessValueIcons = [Zap, Users, Lock];
const businessValueColors = [
  "from-emerald-500 to-green-600",
  "from-teal-500 to-emerald-600",
  "from-green-600 to-teal-700",
];
const midMarketIcons = [Clock, DollarSign, Users];

const ITAMAlternate = () => {
  const { t } = useTranslation();
  const { localizedPath } = useLocalizedPath();

  const problems = t("itamAlt.problems", { returnObjects: true }) as Array<{ problem: string; solution: string }>;
  const modules = t("itamAlt.modules", { returnObjects: true }) as Array<{ title: string; tagline: string; features: Array<{ title: string; desc: string }> }>;
  const differentiators = t("itamAlt.differentiators", { returnObjects: true }) as Array<{ title: string; desc: string }>;
  const businessValue = t("itamAlt.businessValue", { returnObjects: true }) as Array<{ title: string; metric: string; desc: string }>;
  const integrations = t("itamAlt.integrations", { returnObjects: true }) as Array<{ category: string; items: string[] }>;
  const midMarket = t("itamAlt.midMarket", { returnObjects: true }) as Array<{ title: string; desc: string }>;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />

      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/20 via-background to-background" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,hsl(150_60%_40%/0.12),transparent_60%)]" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto text-center animate-fade-in">
            <img src={itamLogo} alt="ITAM Logo" className="h-36 w-auto mx-auto mb-8" />
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-tight">
              {t("itamAlt.heroTitle1")}{" "}
              <span className="bg-gradient-to-r from-emerald-500 to-green-600 bg-clip-text text-transparent">
                {t("itamAlt.heroTitle2")}
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed max-w-3xl mx-auto">
              {t("itamAlt.heroDesc")}
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button size="lg" className="gap-2 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white" asChild>
                <Link to={localizedPath("/contact?source=ITAM Get Started")}>
                  {t("common.getStarted")} <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="gap-2 border-emerald-600/30 hover:bg-emerald-500/10" asChild>
                <Link to={localizedPath("/contact?source=ITAM Contact Sales")}>
                  {t("common.contactSales")} <Headphones className="w-4 h-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* The Problem */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {t("itamAlt.frictionTitle")}
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {t("itamAlt.frictionDesc")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
            {problems.map((ps, i) => {
              const Icon = problemIcons[i];
              return (
                <Card key={i} className="p-6 border-border hover:border-emerald-500/40 transition-all duration-300 animate-slide-up" style={{ animationDelay: `${i * 80}ms` }}>
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-red-500 dark:text-red-400 mb-1">{ps.problem}</p>
                      <p className="text-sm text-foreground font-medium">{ps.solution}</p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Modular Blueprint Overview */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {t("itamAlt.blueprintTitle")}
            </h2>
            <p className="text-lg text-muted-foreground">
              {t("itamAlt.blueprintDesc")}
            </p>
          </div>
          <div className="max-w-5xl mx-auto mb-16">
            <img src={itam4Phases} alt="ITAM 4-Phase Blueprint" className="w-full rounded-2xl shadow-lg" />
          </div>
        </div>
      </section>

      {/* Module Detail Cards */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto space-y-10">
            {modules.map((mod, index) => {
              const ModIcon = moduleIcons[index];
              return (
                <Card
                  key={mod.title}
                  className="p-8 border-border hover:shadow-xl transition-all duration-300 animate-fade-in overflow-hidden"
                  style={{ animationDelay: `${index * 100}ms` }}>
                  <div className="flex flex-col md:flex-row md:items-start gap-6 mb-8">
                    <div className="flex items-center gap-4">
                      <span className="text-4xl font-black text-emerald-500/20">{String(index + 1).padStart(2, "0")}</span>
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${moduleColors[index]} flex items-center justify-center shadow-lg`}>
                        <ModIcon className="w-7 h-7 text-white" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-foreground mb-2">{mod.title}</h3>
                      <p className="text-muted-foreground">{mod.tagline}</p>
                    </div>
                  </div>

                  <div className="flex flex-col lg:flex-row gap-8">
                    <div className="lg:w-3/5 grid grid-cols-1 gap-4">
                      {mod.features.map((f, fi) => {
                        const FIcon = moduleFeatureIcons[index]?.[fi] || Scan;
                        return (
                          <div key={f.title} className="p-4 rounded-xl bg-muted/40 hover:bg-muted/60 transition-all border border-transparent hover:border-emerald-500/20">
                            <div className="flex items-center gap-3 mb-2">
                              <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${moduleColors[index]} bg-opacity-10 flex items-center justify-center`}>
                                <FIcon className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                              </div>
                              <h4 className="font-semibold text-foreground text-sm">{f.title}</h4>
                            </div>
                            <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                          </div>
                        );
                      })}
                    </div>
                    <div className="lg:w-2/5 flex items-center justify-center">
                      <img src={moduleImages[index]} alt={mod.title} className="rounded-xl shadow-md max-h-72 w-auto object-contain" />
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Business Value */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {t("itamAlt.businessValueTitle")}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {businessValue.map((bv, i) => {
              const BvIcon = businessValueIcons[i];
              return (
                <Card key={i} className="p-8 border-border text-center hover:shadow-lg transition-all duration-300 animate-slide-up" style={{ animationDelay: `${i * 100}ms` }}>
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${businessValueColors[i]} flex items-center justify-center mx-auto mb-6 shadow-lg`}>
                    <BvIcon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-2">{bv.title}</h3>
                  <Badge variant="outline" className="mb-3 border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs">
                    {bv.metric}
                  </Badge>
                  <p className="text-sm text-muted-foreground leading-relaxed">{bv.desc}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Integrations */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col lg:flex-row items-center gap-10">
              <div className="lg:w-1/2">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  {t("itamAlt.integrationsTitle")}
                </h2>
                <p className="text-lg text-muted-foreground mb-8">
                  {t("itamAlt.integrationsDesc")}
                </p>
                {integrations.map((group) => (
                  <div key={group.category} className="mb-4">
                    <h3 className="text-lg font-bold text-foreground mb-2 flex items-center gap-2">
                      <Globe className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                      {group.category}
                    </h3>
                    <div className="flex flex-wrap gap-2 ml-7">
                      {group.items.map((item) => (
                        <div key={item} className="flex items-center gap-1.5 text-sm text-foreground/90">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="lg:w-1/2 flex items-center justify-center">
                <img src={itamIntegration} alt="ITAM Integration Ecosystem" className="rounded-2xl shadow-lg max-h-96 w-auto object-contain" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mid-Market Advantage */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {t("itamAlt.kvpTitle")}
            </h2>
            <p className="text-lg text-muted-foreground mb-10">
              {t("itamAlt.kvpDesc")}
            </p>
            <img src={itamDifferentiators} alt="ITAM Differentiators" className="w-full rounded-2xl shadow-lg" />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-emerald-600 to-green-700 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t("itamAlt.ctaTitle")}
            </h2>
            <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
              {t("itamAlt.ctaDesc")}
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button size="lg" variant="outline" className="gap-2 bg-white/10 border-white/20 text-white hover:bg-white/20" asChild>
                <Link to={localizedPath("/contact?source=ITAM Contact")}>
                  {t("common.contactUs")} <Headphones className="w-4 h-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <ITAMFooter />
    </div>
  );
};

export default ITAMAlternate;
