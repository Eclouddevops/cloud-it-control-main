import { useEffect, useRef, useState } from "react";
import { Navigation } from "@/components/Navigation";
import { ITAMFooter } from "@/components/ITAMFooter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { useLocalizedPath } from "@/hooks/useLocalizedPath";
import {
  ArrowRight,
  Scan,
  Brain,
  Database,
  Shield,
  Eye,
  Layers,
  Zap,
  RefreshCw,
  AlertTriangle,
  FileCheck,
  Cloud,
  Network,
  Activity,
  Clock,
  BarChart3,
  Settings2,
  Bug,
  Timer,
} from "lucide-react";

/* ────────────────────────────────────────────
   Particle Canvas — mouse-reactive background
   ──────────────────────────────────────────── */
const ParticleCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const dpr = window.devicePixelRatio || 1;

    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener("resize", resize);

    const PARTICLE_COUNT = 80;
    const particles = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 2 + 1,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = window.innerWidth;
        if (p.x > window.innerWidth) p.x = 0;
        if (p.y < 0) p.y = window.innerHeight;
        if (p.y > window.innerHeight) p.y = 0;

        // mouse repel
        const dx = p.x - mouse.current.x;
        const dy = p.y - mouse.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          p.x += dx * 0.02;
          p.y += dy * 0.02;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(124,58,237,0.35)";
        ctx.fill();
      }

      // draw edges
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 140) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(59,130,246,${0.15 * (1 - dist / 140)})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }

      animId = requestAnimationFrame(draw);
    };
    draw();

    const onMouse = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", onMouse);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouse);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.6 }}
    />
  );
};

/* ────────────────────────────────────────────
   Sticky sub-navigation
   ──────────────────────────────────────────── */
const SUB_NAV = [
  { label: "Discovery", target: "discovery" },
  { label: "Mapping", target: "mapping" },
  { label: "Integrations", target: "integrations" },
  { label: "Governance", target: "governance" },
];

const SubNav = () => {
  const [active, setActive] = useState("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    SUB_NAV.forEach((n) => {
      const el = document.getElementById(n.target);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <nav className="sticky top-16 z-30 bg-[hsl(240,15%,8%)]/90 backdrop-blur-md border-b border-[hsl(260,30%,20%,0.4)]">
      <div className="container mx-auto px-4 flex gap-1 overflow-x-auto py-2">
        {SUB_NAV.map((n) => (
          <button
            key={n.target}
            onClick={() =>
              document
                .getElementById(n.target)
                ?.scrollIntoView({ behavior: "smooth", block: "start" })
            }
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
              active === n.target
                ? "bg-[hsl(263,70%,50%,0.2)] text-[hsl(263,90%,75%)]"
                : "text-[hsl(240,10%,55%)] hover:text-[hsl(240,10%,80%)]"
            }`}
          >
            {n.label}
          </button>
        ))}
      </div>
    </nav>
  );
};

/* ────────────────────────────────────────────
   Hero "Cognitia Lens" graphic
   ──────────────────────────────────────────── */
const LensGraphic = () => (
  <div className="relative w-full max-w-2xl mx-auto mt-12 mb-4">
    {/* Messy infra layer */}
    <div className="relative rounded-xl border border-[hsl(0,0%,25%,0.5)] bg-[hsl(240,12%,12%)] p-5 text-xs text-[hsl(240,10%,50%)]">
      <div className="flex flex-wrap gap-2 justify-center">
        {["VMs", "K8s Pods", "Switches", "DBs", "SaaS", "Firewalls", "Storage", "APIs"].map(
          (t) => (
            <span
              key={t}
              className="px-2 py-1 rounded bg-[hsl(240,15%,18%)] border border-[hsl(240,10%,25%)]"
            >
              {t}
            </span>
          )
        )}
      </div>
      <p className="text-center mt-2 text-[hsl(240,10%,40%)] text-[10px] uppercase tracking-widest">
        Raw Infrastructure Data
      </p>
    </div>

    {/* Lens divider */}
    <div className="flex items-center justify-center -my-3 relative z-10">
      <div className="w-48 h-8 rounded-full bg-gradient-to-r from-[hsl(263,70%,50%)] to-[hsl(217,90%,55%)] flex items-center justify-center shadow-[0_0_30px_hsl(263,70%,50%,0.4)]">
        <span className="text-[11px] font-bold tracking-widest text-white uppercase">
          Cognitia Lens
        </span>
      </div>
    </div>

    {/* Clean business layer */}
    <div className="relative rounded-xl border border-[hsl(263,40%,30%,0.5)] bg-[hsl(240,15%,10%)] p-5 text-xs">
      <div className="flex flex-wrap gap-2 justify-center">
        {["Global Logistics", "Client Portal", "Payment Gateway", "HR Platform"].map((t) => (
          <span
            key={t}
            className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-[hsl(263,60%,25%,0.4)] to-[hsl(217,70%,30%,0.4)] border border-[hsl(263,50%,40%,0.3)] text-[hsl(263,80%,80%)] font-medium"
          >
            {t}
          </span>
        ))}
      </div>
      <p className="text-center mt-2 text-[hsl(263,60%,60%)] text-[10px] uppercase tracking-widest">
        Business Service Dashboard
      </p>
    </div>
  </div>
);

/* ────────────────────────────────────────────
   Feature section data
   ──────────────────────────────────────────── */
const sections = [
  {
    id: "discovery",
    icon: Eye,
    accent: "from-[hsl(263,70%,55%)] to-[hsl(217,90%,55%)]",
    label: "Environmental Awareness",
    title: "Continuous Environmental Awareness",
    copy: "Eliminate the blind spots in your hybrid-cloud ecosystem. Cognitia leverages high-velocity, agentless discovery to identify every component—from on-premise hardware to ephemeral containerized workloads.",
    features: [
      {
        icon: Scan,
        title: "Universal Ingestion",
        desc: "Seamlessly aggregate data from multiple discovery engines—Virima, Device42, Lansweeper, and more.",
      },
      {
        icon: Brain,
        title: "Heuristic Identification",
        desc: "Automatically classify devices and applications by their functional role, not just their hostname.",
      },
      {
        icon: Activity,
        title: "Dynamic Inventory",
        desc: "A live-updating view of your IT estate that evolves at the speed of your business.",
      },
    ],
  },
  {
    id: "mapping",
    icon: Layers,
    accent: "from-[hsl(217,90%,55%)] to-[hsl(190,80%,50%)]",
    label: "Service Context",
    title: "Dynamic Service Context & Topology",
    copy: "Infrastructure doesn't exist in a vacuum. Cognitia maps the invisible threads connecting your hardware to your bottom line.",
    features: [
      {
        icon: Network,
        title: "Technical Layer",
        desc: "The physical and virtual connections—Switches, VMs, Databases—mapped in real-time.",
      },
      {
        icon: Layers,
        title: "Logic Layer",
        desc: "The application stack and software dependencies that power your services.",
      },
      {
        icon: BarChart3,
        title: "Process Layer",
        desc: "The business service view—\"Global Logistics\" or \"Client Banking Portal\"—tied to infrastructure.",
      },
      {
        icon: AlertTriangle,
        title: "Impact Visualization",
        desc: "Instantly visualize the \"blast radius\" of any infrastructure fluctuation on critical business processes.",
      },
    ],
  },
  {
    id: "integrations",
    icon: Database,
    accent: "from-[hsl(263,70%,50%)] to-[hsl(280,60%,55%)]",
    label: "System of Truth",
    title: "The Unified System of Truth",
    copy: "Stop wrestling with fragmented data. Cognitia synchronizes your live discovery data with your primary service management platforms to ensure your system of record is always accurate and \"audit-ready.\"",
    features: [
      {
        icon: RefreshCw,
        title: "Platform Orchestration",
        desc: "Bi-directional synchronization with ServiceNow, Jira Service Management, and your enterprise workflows.",
      },
      {
        icon: Settings2,
        title: "Automated Reconciliation",
        desc: "AI-driven conflict resolution that merges data from various sources into a single \"Golden Record.\"",
      },
      {
        icon: Cloud,
        title: "Data Health Monitoring",
        desc: "Proactive alerts when your system of record falls out of sync with reality.",
      },
    ],
  },
  {
    id: "governance",
    icon: Shield,
    accent: "from-[hsl(217,90%,55%)] to-[hsl(263,70%,55%)]",
    label: "Lifecycle Integrity",
    title: "Lifecycle Integrity & Configuration Governance",
    copy: "Ensure your environment stays within the lines. Cognitia monitors the entire lifecycle of your configuration items, alerting you the moment your actual state drifts from your \"Gold Standard.\"",
    features: [
      {
        icon: AlertTriangle,
        title: "Configuration Drift Alerts",
        desc: "Real-time notification of unauthorized or unexpected changes to your infrastructure.",
      },
      {
        icon: Bug,
        title: "Vulnerability Correlation",
        desc: "Automatically map security risks to the specific business services they impact.",
      },
      {
        icon: Timer,
        title: "End-of-Life Planning",
        desc: "Proactively manage technical debt by identifying aging infrastructure before it affects service delivery.",
      },
    ],
  },
];

/* ────────────────────────────────────────────
   "Old Way vs. Cognitia Way" data
   ──────────────────────────────────────────── */
const contrasts = [
  {
    icon: Clock,
    old: "Months-long implementations with costly consultants.",
    newWay: "Rapid deployment through pre-built connectors—value in days, not quarters.",
  },
  {
    icon: BarChart3,
    old: "Overly technical spreadsheets only specialists can read.",
    newWay: "A business-first visualization layer anyone can understand and act on.",
  },
  {
    icon: Settings2,
    old: "Rigid, high-overhead enterprise platforms that resist change.",
    newWay: "Flexible architecture that scales and adapts to your specific needs.",
  },
];

/* ════════════════════════════════════════════
   PAGE COMPONENT
   ════════════════════════════════════════════ */
const Cognitia = () => {
  const { localizedPath } = useLocalizedPath();

  return (
    <div className="min-h-screen flex flex-col bg-[hsl(240,15%,6%)] text-[hsl(240,10%,90%)]">
      <Navigation />
      <ParticleCanvas />

      {/* ── HERO ── */}
      <section className="relative pt-28 pb-20 overflow-hidden z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,hsl(263,60%,25%,0.25),transparent_60%),radial-gradient(ellipse_at_70%_80%,hsl(217,70%,25%,0.2),transparent_60%)]" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto text-center animate-fade-in">
            <Badge className="mb-6 bg-[hsl(263,60%,50%,0.12)] text-[hsl(263,80%,70%)] border-[hsl(263,60%,50%,0.3)] text-sm tracking-wide">
              Intelligence Wrapper
            </Badge>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
              Cognitia:{" "}
              <span className="bg-gradient-to-r from-[hsl(263,80%,65%)] to-[hsl(217,90%,60%)] bg-clip-text text-transparent">
                Align IT Infrastructure
              </span>
              <br className="hidden sm:block" />
              with Business Reality.
            </h1>

            <p className="text-base md:text-lg text-[hsl(240,10%,55%)] max-w-3xl mx-auto leading-relaxed mb-8">
              Transform raw infrastructure data into a clear, process-driven map of your enterprise.
              Cognitia provides the intuitive intelligence layer that turns complex technical
              dependencies into actionable business insights.
            </p>

            <Button
              size="lg"
              className="gap-2 bg-gradient-to-r from-[hsl(263,70%,55%)] to-[hsl(217,90%,55%)] hover:from-[hsl(263,70%,48%)] hover:to-[hsl(217,90%,48%)] text-white shadow-[0_0_30px_hsl(263,70%,50%,0.3)]"
              asChild
            >
              <Link to={localizedPath("/contact?source=Cognitia Walkthrough")}>
                Request a Personalized Walkthrough <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>

            <LensGraphic />
          </div>
        </div>
      </section>

      {/* ── SUB NAV ── */}
      <SubNav />

      {/* ── FEATURE SECTIONS ── */}
      {sections.map((sec, si) => {
        const SectionIcon = sec.icon;
        const dark = si % 2 === 0;
        return (
          <section
            key={sec.id}
            id={sec.id}
            className={`relative py-20 z-10 ${
              dark ? "bg-[hsl(240,15%,6%,0.92)]" : "bg-[hsl(240,14%,9%,0.92)]"
            }`}
          >
            <div className="container mx-auto px-4">
              <div className="max-w-6xl mx-auto">
                <div className="flex items-center gap-4 mb-4">
                  <div
                    className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${sec.accent} flex items-center justify-center shadow-lg`}
                  >
                    <SectionIcon className="w-6 h-6 text-white" />
                  </div>
                  <Badge
                    variant="outline"
                    className="border-[hsl(263,50%,45%,0.4)] text-[hsl(263,70%,70%)] text-xs"
                  >
                    {sec.label}
                  </Badge>
                </div>

                <h2 className="text-3xl md:text-4xl font-bold mb-3 text-[hsl(240,10%,93%)]">
                  {sec.title}
                </h2>
                <p className="text-base md:text-lg text-[hsl(240,10%,55%)] max-w-3xl mb-10 leading-relaxed">
                  {sec.copy}
                </p>

                <div
                  className={`grid grid-cols-1 ${
                    sec.features.length === 4 ? "sm:grid-cols-2 lg:grid-cols-4" : "md:grid-cols-3"
                  } gap-6`}
                >
                  {sec.features.map((f, fi) => {
                    const FIcon = f.icon;
                    return (
                      <Card
                        key={fi}
                        className="relative p-6 rounded-2xl border border-[hsl(260,30%,22%,0.5)] bg-[hsl(240,15%,10%,0.7)] backdrop-blur-lg hover:border-[hsl(263,60%,50%,0.4)] hover:shadow-[0_0_24px_hsl(263,60%,50%,0.12)] transition-all duration-300 animate-fade-in"
                        style={{ animationDelay: `${fi * 100}ms` }}
                      >
                        <div
                          className={`w-10 h-10 rounded-xl bg-gradient-to-br ${sec.accent} flex items-center justify-center mb-4`}
                        >
                          <FIcon className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2 text-[hsl(240,10%,93%)]">
                          {f.title}
                        </h3>
                        <p className="text-sm text-[hsl(240,10%,55%)] leading-relaxed">{f.desc}</p>
                      </Card>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>
        );
      })}

      {/* ── COMPETITIVE — Old Way vs Cognitia Way ── */}
      <section className="relative py-20 z-10 bg-[hsl(240,14%,9%,0.92)]">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-3 text-[hsl(240,10%,93%)]">
              Why Agile Enterprises Choose Cognitia
            </h2>
            <p className="text-center text-[hsl(240,10%,55%)] mb-12 max-w-2xl mx-auto">
              Move from legacy complexity to intelligent simplicity.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {contrasts.map((c, i) => {
                const CIcon = c.icon;
                return (
                  <Card
                    key={i}
                    className="rounded-2xl border border-[hsl(260,30%,22%,0.5)] bg-[hsl(240,15%,10%,0.7)] backdrop-blur-lg p-6 animate-fade-in"
                    style={{ animationDelay: `${i * 120}ms` }}
                  >
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[hsl(263,70%,55%)] to-[hsl(217,90%,55%)] flex items-center justify-center mb-5">
                      <CIcon className="w-5 h-5 text-white" />
                    </div>

                    <div className="mb-4">
                      <span className="text-[10px] uppercase tracking-widest text-[hsl(0,60%,60%)] font-semibold">
                        The Old Way
                      </span>
                      <p className="text-sm text-[hsl(240,10%,50%)] mt-1 leading-relaxed line-through decoration-[hsl(0,50%,45%,0.5)]">
                        {c.old}
                      </p>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase tracking-widest text-[hsl(263,70%,65%)] font-semibold">
                        The Cognitia Way
                      </span>
                      <p className="text-sm text-[hsl(240,10%,75%)] mt-1 leading-relaxed font-medium">
                        {c.newWay}
                      </p>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── CLOSING CTA ── */}
      <section className="relative py-24 overflow-hidden z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-[hsl(263,50%,18%)] to-[hsl(240,20%,10%)]" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <Zap className="w-12 h-12 text-[hsl(263,80%,70%)] mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[hsl(240,10%,93%)]">
              Ready to bridge the gap between IT Ops and Business Value?
            </h2>
            <p className="text-lg text-[hsl(240,10%,55%)] mb-8">
              See how Cognitia maps your entire infrastructure to the services that matter.
            </p>
            <Button
              size="lg"
              className="gap-2 bg-gradient-to-r from-[hsl(263,70%,55%)] to-[hsl(217,90%,55%)] hover:from-[hsl(263,70%,48%)] hover:to-[hsl(217,90%,48%)] text-white shadow-[0_0_30px_hsl(263,70%,50%,0.3)]"
              asChild
            >
              <Link to={localizedPath("/contact?source=Cognitia POC")}>
                Start Your Free Proof of Concept <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <ITAMFooter />
    </div>
  );
};

export default Cognitia;
