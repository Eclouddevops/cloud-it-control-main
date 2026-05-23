import { MaturityRadarChart } from "./MaturityRadarChart";
import { TrendingUp, Clock, CreditCard, Users, Shield, ChevronRight } from "lucide-react";
import { assessmentQuestions, scopeCategories } from "@/data/assessmentQuestions";
import { useTranslation } from "react-i18next";

interface ResultsProps {
  maturityData: {
    category: string;
    current: number;
    improved: number;
  }[];
  savings: {
    effortHours: number;
    licenseCost: number;
    uxScore: number;
    securityScore: number;
  };
  inputs: {
    identities: number;
    licenseCost: number;
    hourlyRate: number;
  };
  answers: Record<number, string>;
  selectedScopes?: string[];
}

export const AssessmentResults = ({ maturityData, savings, inputs, answers, selectedScopes = [] }: ResultsProps) => {
  const { t } = useTranslation();

  const getActiveCategories = () => {
    return scopeCategories
      .filter((scope) => selectedScopes.includes(scope.id))
      .map((scope) => scope.category);
  };
  
  const activeCategories = getActiveCategories();
  
  const annualEffortSavings = savings.effortHours * 12 * inputs.hourlyRate;
  const annualLicenseSavings = savings.licenseCost * inputs.identities * inputs.licenseCost / 100;

  const benefits = [
    {
      icon: Clock,
      title: t('assessment.effortSavings'),
      value: t('assessment.effortSavingsValue', { hours: savings.effortHours.toFixed(0) }),
      annual: t('assessment.effortSavingsAnnual', { amount: annualEffortSavings.toLocaleString() }),
      description: t('assessment.effortSavingsDesc'),
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      icon: CreditCard,
      title: t('assessment.licenseCostOptimization'),
      value: t('assessment.licenseCostValue', { pct: savings.licenseCost.toFixed(0) }),
      annual: t('assessment.licenseCostAnnual', { amount: annualLicenseSavings.toLocaleString() }),
      description: t('assessment.licenseCostDesc'),
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      icon: Users,
      title: t('assessment.userExperience'),
      value: t('assessment.uxValue', { pct: savings.uxScore.toFixed(0) }),
      annual: t('assessment.selfServiceEnabled'),
      description: t('assessment.uxDesc'),
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
    {
      icon: Shield,
      title: t('assessment.securityGovernance'),
      value: t('assessment.securityValue', { pct: savings.securityScore.toFixed(0) }),
      annual: t('assessment.complianceEnhanced'),
      description: t('assessment.securityDesc'),
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2">{t('assessment.resultsTitle')}</h2>
        <p className="text-muted-foreground">{t('assessment.resultsDescription')}</p>
      </div>

      {/* Benefits Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {benefits.map((benefit, index) => (
          <div key={index} className="bg-card rounded-lg p-5 border border-border hover:shadow-lg transition-shadow">
            <div className={`w-12 h-12 rounded-lg ${benefit.bgColor} flex items-center justify-center mb-4`}>
              <benefit.icon className={`w-6 h-6 ${benefit.color}`} />
            </div>
            <h3 className="font-semibold text-foreground mb-1">{benefit.title}</h3>
            <p className={`text-xl font-bold ${benefit.color} mb-1`}>{benefit.value}</p>
            <p className="text-sm font-medium text-primary mb-2">{benefit.annual}</p>
            <p className="text-sm text-muted-foreground">{benefit.description}</p>
          </div>
        ))}
      </div>

      {/* Total Savings Banner */}
      <div className="bg-primary/10 rounded-lg p-6 border border-primary/20">
        <div className="flex items-center justify-center gap-3 mb-3">
          <TrendingUp className="w-8 h-8 text-primary" />
          <h3 className="text-xl font-bold text-foreground">{t('assessment.estimatedAnnualValue')}</h3>
        </div>
        <p className="text-4xl font-bold text-primary text-center">
          €{(annualEffortSavings + annualLicenseSavings).toLocaleString()}
        </p>
        <p className="text-center text-muted-foreground mt-2">
          {String(t('assessment.combinedSavings', { count: inputs.identities }))}
        </p>
      </div>

      {/* Radar Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MaturityRadarChart
          data={maturityData}
          title={t('assessment.currentVsImproved')}
          showImproved={true}
        />
        <div className="bg-card rounded-lg p-6 border border-border">
          <h3 className="text-lg font-semibold text-foreground mb-4">{t('assessment.maturitySummary')}</h3>
          <div className="space-y-4">
            {maturityData.map((item, index) => (
              <div key={index}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-foreground font-medium">{item.category}</span>
                  <span className="text-muted-foreground">
                    {item.current}% → <span className="text-primary font-semibold">{item.improved}%</span>
                  </span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full flex">
                    <div className="bg-destructive/50 transition-all" style={{ width: `${item.current}%` }} />
                    <div className="bg-primary transition-all" style={{ width: `${item.improved - item.current}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-4 border-t border-border">
            <div className="flex justify-between items-center">
              <span className="text-foreground font-semibold">{t('assessment.overallMaturity')}</span>
              <div className="text-right">
                <span className="text-destructive font-bold">
                  {Math.round(maturityData.reduce((a, b) => a + b.current, 0) / maturityData.length)}%
                </span>
                <span className="text-muted-foreground mx-2">→</span>
                <span className="text-primary font-bold">
                  {Math.round(maturityData.reduce((a, b) => a + b.improved, 0) / maturityData.length)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Questions and Answers Summary */}
      <div className="bg-card rounded-lg p-6 border border-border">
        <h3 className="text-lg font-semibold text-foreground mb-6">{t('assessment.responsesTitle')}</h3>
        {activeCategories.map((category) => {
          const categoryQuestions = assessmentQuestions.filter((q) => q.category === category);
          const answeredQuestions = categoryQuestions.filter((q) => answers[q.id] !== undefined);
          
          if (answeredQuestions.length === 0) return null;
          
          return (
            <div key={category} className="mb-6 last:mb-0">
              <h4 className="text-md font-semibold text-foreground mb-3 flex items-center gap-2">
                <ChevronRight className="w-4 h-4 text-primary" />
                {t(`assessment.categories.${category}`, category)}
              </h4>
              <div className="space-y-2 pl-6">
                {answeredQuestions.map((q, idx) => (
                  <div key={q.id} className="border-b border-border/50 pb-2 last:border-0">
                    <p className="text-sm text-muted-foreground">{idx + 1}. {t(`assessment.q${q.id}.question`, q.question)}</p>
                    <p className="text-sm font-medium text-foreground">{answers[q.id]}</p>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
