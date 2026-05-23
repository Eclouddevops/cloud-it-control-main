import { useState } from "react";
import { CONTACT_FORM_TOKEN } from "@/lib/domainConfig";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { assessmentQuestions, categories, scopeCategories } from "@/data/assessmentQuestions";
import { AssessmentResults } from "./AssessmentResults";
import { ChevronRight, Calculator } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useTranslation } from "react-i18next";
import { PrivacyPolicyCheckbox } from "@/components/PrivacyPolicyCheckbox";

/**
 * Assessment Form Component
 * 
 * CALCULATION FORMULAS:
 * 
 * 1. EFFORT HOURS SAVINGS:
 *    - Formula: Sum of (minutesPerRequest × volume) for low-maturity answers / 60
 *    - Volume derived from answer patterns (percentages → identity count, fixed counts → direct)
 *    - Default volume: 10% of identities for unmatched patterns (conservative estimate)
 * 
 * 2. LICENSE COST SAVINGS:
 *    - Ratings map to estimated percentage savings:
 *      - "very high": 25-35% savings potential
 *      - "high": 15-25% savings potential
 *      - "mid": 8-15% savings potential
 *      - "low": 2-8% savings potential
 *    - Final percentage capped at 35% (industry benchmark for optimization ceiling)
 * 
 * 3. UX IMPROVEMENT SCORE:
 *    - Formula: (lowMaturityUXItems / totalUXItems) × 60 + 20
 *    - Range: 20-80, representing improvement opportunity percentage
 *    - Based on Digital Employee Experience (DEX) benchmarks
 * 
 * 4. SECURITY SCORE:
 *    - Formula: (lowMaturitySecurityItems / totalSecurityItems) × 50 + 25
 *    - Range: 25-75, representing security posture improvement potential
 *    - Aligned with NIST/CMMI security maturity frameworks
 * 
 * 5. MATURITY SCORING:
 *    - Current: Percentage of questions with high-maturity answers
 *    - Improved: Current + (improvementItems / total) × 35 + 10
 *    - Capped at 95% (no organization achieves 100% maturity)
 * 
 * DEFAULT VALUES (industry benchmarks):
 *    - License cost: €40/user/month (M365 E3/E5 blended average)
 *    - Hourly rate: €75/hour (Western market IT support rate)
 */
export const AssessmentForm = () => {
  const { t } = useTranslation();
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [identities, setIdentities] = useState(1000);
  const [licenseCost, setLicenseCost] = useState(40);  // M365 blended average
  const [hourlyRate, setHourlyRate] = useState(75);    // Western market IT rate
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<any>(null);
  
  // New fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [selectedScopes, setSelectedScopes] = useState<string[]>([
    "o365", "device", "identity", "enterprise"
  ]);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);

  const handleAnswerChange = (questionId: number, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleScopeChange = (scopeId: string, checked: boolean) => {
    setSelectedScopes((prev) => 
      checked 
        ? [...prev, scopeId]
        : prev.filter((id) => id !== scopeId)
    );
  };

  // Get active categories based on selected scopes
  const getActiveCategories = () => {
    return scopeCategories
      .filter((scope) => selectedScopes.includes(scope.id))
      .map((scope) => scope.category);
  };

  // Extract volume/percentage from answer
  // Uses conservative 10% default for unmatched patterns (industry recommendation)
  const getVolumeFromAnswer = (answer: string | undefined, totalIdentities: number): number => {
    if (!answer) return totalIdentities * 0.10; // Conservative 10% default
    
    // Percentage-based answers
    if (answer.includes("Less than 5%")) return totalIdentities * 0.025;
    if (answer.includes("5 - 15%") || answer.includes("5-15%")) return totalIdentities * 0.10; // median
    if (answer.includes("More than 15%")) return totalIdentities * 0.20;
    if (answer.includes("Less than 10%")) return totalIdentities * 0.05;
    if (answer.includes("10-40%")) return totalIdentities * 0.25; // median
    if (answer.includes("more than 40%")) return totalIdentities * 0.50;
    if (answer.includes("Less than 15%")) return totalIdentities * 0.075;
    if (answer.includes("15-45%")) return totalIdentities * 0.30; // median
    if (answer.includes("Less than 20%")) return totalIdentities * 0.10;
    if (answer.includes("20-70%")) return totalIdentities * 0.45; // median
    if (answer.includes("More than 70%")) return totalIdentities * 0.80;
    if (answer.includes("10-25%")) return totalIdentities * 0.175; // median
    if (answer.includes("25-60%")) return totalIdentities * 0.425; // median
    if (answer.includes("10-30%")) return totalIdentities * 0.20; // median
    
    // Volume-based answers (monthly requests)
    if (answer.includes("Less than 20")) return 10; // median
    if (answer.includes("20-100") || answer.includes("20 - 50")) return 35; // median of 20-50
    if (answer.includes("50+")) return 75;
    if (answer.includes("100+")) return 150;
    if (answer.includes("200+")) return 300;
    if (answer.includes("Less than 30")) return 15;
    if (answer.includes("More than 30")) return 50;
    if (answer.includes("50 - 200")) return 125; // median
    if (answer.includes("Less than 50")) return 25;
    if (answer.includes("Less than 10 tickets")) return 5;
    if (answer.includes("More than 10 tickets")) return 20;
    
    // Conservative 10% default for unmatched patterns
    return totalIdentities * 0.10;
  };

  // Map questions to the 6 key pillars
  const getPillarMapping = (q: typeof assessmentQuestions[0]): string[] => {
    const pillars: string[] = [];
    
    // Automation - questions about automated processes
    if (q.category.includes("Lifecycle") || q.category.includes("O365") || 
        q.question.toLowerCase().includes("automat") || q.question.toLowerCase().includes("manual")) {
      pillars.push("Automation");
    }
    
    // Security & Compliance
    if (q.securityImproved || q.category.includes("Security") || q.category.includes("Governance") ||
        q.question.toLowerCase().includes("security") || q.question.toLowerCase().includes("compliance") ||
        q.question.toLowerCase().includes("audit") || q.question.toLowerCase().includes("risk")) {
      pillars.push("Security & Compliance");
    }
    
    // Efficiency - effort savings related
    if (q.effortsSaved && q.effortsSaved !== "0" && q.effortsSaved !== "N/A") {
      pillars.push("Efficiency");
    }
    
    // End user experience
    if (q.uxImproved || q.question.toLowerCase().includes("user") || 
        q.question.toLowerCase().includes("self-service") || q.question.toLowerCase().includes("request")) {
      pillars.push("End User Experience");
    }
    
    // Licenses cost optimization
    if (q.licenseSavings && q.licenseSavings !== "none" && q.licenseSavings !== "N/A") {
      pillars.push("License Cost Optimization");
    }
    
    // IT enablement - general IT capabilities
    if (q.category.includes("IT Asset") || q.category.includes("Device") || 
        q.question.toLowerCase().includes("inventory") || q.question.toLowerCase().includes("track")) {
      pillars.push("IT Enablement");
    }
    
    // Default to Efficiency if no mapping found
    if (pillars.length === 0) pillars.push("Efficiency");
    
    return pillars;
  };

  // Determine if answer indicates HIGH maturity (true) or LOW maturity (false)
  const isHighMaturity = (questionId: number, answer: string | undefined): boolean => {
    if (!answer) return false; // Unanswered = low maturity
    
    // Generic low maturity indicators
    const lowMaturityKeywords = ["Unknown", "No", "We don't", "We do not", "don't track", "don't manage"];
    if (lowMaturityKeywords.some(kw => answer.includes(kw))) {
      // Exception: Q30 "Did you have any service disruptions" - "No" = HIGH maturity
      if (questionId === 30 && answer === "No") return true;
      return false;
    }
    
    // Question-specific scoring
    switch (questionId) {
      case 1: // Persona based O365 licenses - Yes = HIGH
      case 3: // HR/L&D empowered - Yes = HIGH
      case 5: // Monitor O365 consumption - Yes = HIGH
      case 6: // Aware of exceptions - Yes = HIGH
      case 8: // Endpoint protection automation - Yes = HIGH
      case 9: // Track devices per user - Yes = HIGH
      case 15: // IT/Security manager reports - Yes = HIGH
      case 18: // Certificate management automation - Yes = HIGH
      case 24: // IT support account automation - Yes = HIGH
      case 28: // Approvers understand impact - Yes = HIGH
      case 31: // Audit reports lifecycle - Yes = HIGH
      case 32: // Automated access control - Yes = HIGH
      case 33: // Mass onboarding automation - Yes = HIGH
      case 34: // Track new threats - Yes = HIGH
        return answer === "Yes";
      
      case 2: // Users with higher subscription - Less = better
        return answer === "Less than 5%" || answer === "5 - 15%";
      
      case 4: // Lead time to decommission - faster = better
        return answer === "Less than 1 week" || answer === "1-4 weeks";
      
      case 7: // Sr IT Leads busy with complex tasks - "No, completely managed" = HIGH
        return answer === "No, completely managed by Jr team" || answer === "Less than 10 tickets per month";
      
      case 10: // Geo fencing management - managing it = better (even if high volume)
        return answer !== "We don't manage";
      
      case 11: // BitLocker incidents - fewer = better
        return answer === "Less than 20" || answer === "20 - 50";
      
      case 12: // Mobile device requests - fewer = better managed
        return answer === "Less than 20" || answer === "20-100";
      
      case 13: // Local admin access - None or controlled = HIGH
        return answer === "None" || answer === "Less than 10%";
      
      case 14: // Device compliance ratio - higher = better
        return answer === "More than 85%" || answer === "50-85%";
      
      case 16: // Identity Quarantine - Yes or fast TAT = HIGH
        return answer === "Yes" || answer === "TAT less than 1 hour" || answer === "TAT 1-6 hours";
      
      case 17: // Multiple teams managing AD/Azure - Multiple teams Yes = LOW maturity
        return answer === "Multiple teams - No" || answer === "Hostname reuse - No";
      
      case 19: // Password reuse - lower % = better
        return answer === "Less than 10%" || answer === "10-40%";
      
      case 20: // Self service password reset usage - higher % = better
        return answer === "25-60% Self service" || answer === "10-25% Self service";
      
      case 21: // HR sync - Automated = HIGH
        return answer === "Automated sync";
      
      case 22: // Local admin access provided - lower = better
        return answer === "Less than 5%" || answer === "5 - 15%";
      
      case 23: // Shared licenses - controlled/known = better
        return answer === "Less than 50" || answer === "50 - 200";
      
      case 25: // L1 to L2 escalation - lower = better
        return answer === "Less than 5%" || answer === "5 - 15%";
      
      case 26: // Mock phishing failure - lower = better, running it = better than not
        return answer === "Less than 15%" || answer === "15-45%";
      
      case 27: // Self service resolution - higher % = better
        return answer === "More than 70%" || answer === "20-70%";
      
      case 29: // Audit/forensics tools speed - faster = better
        return answer === "1-2 hours" || answer === "Less than 8 hours" || answer === "1-5 days";
      
      case 30: // Service disruptions from cert expiry - No = HIGH (handled above)
        return answer === "No";
      
      case 35: // Track excess access - less excess = better
        return answer === "Less than 10% people may have excess access" || answer === "10-30% might have extra access";
      
      default:
        // For any unhandled: "Yes" is generally good, percentage-based favor lower values
        return answer === "Yes";
    }
  };

  const calculateResults = async () => {
    const activeCategories = getActiveCategories();
    const activeQuestions = assessmentQuestions.filter(q => activeCategories.includes(q.category));
    
    // Filter only answered questions for calculations
    const answeredActiveQuestions = activeQuestions.filter(q => answers[q.id] !== undefined);
    
    // Check if there are any answered questions - if not, show error
    if (answeredActiveQuestions.length === 0) {
      toast.error(t('assessment.insufficientInfo'), {
        description: t('assessment.pleaseAnswerOne')
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    
    // Only use answered questions
    const finalAnswers = { ...answers };

    let totalEffortMinutes = 0;
    let licenseSavingsScore = 0;
    let uxImprovements = 0;
    let securityImprovements = 0;
    let uxTotal = 0;
    let securityTotal = 0;

    // Define pillars that map to selected scopes
    const scopeToPillars: Record<string, string[]> = {
      o365: ["License Cost Optimization", "Efficiency"],
      device: ["IT Enablement", "Security & Compliance"],
      identity: ["Automation", "End User Experience"],
      enterprise: ["Security & Compliance", "Efficiency", "Automation"]
    };
    
    // Get active pillars based on selected scopes
    const activePillarsSet = new Set<string>();
    selectedScopes.forEach(scope => {
      scopeToPillars[scope]?.forEach(pillar => activePillarsSet.add(pillar));
    });
    const pillars = Array.from(activePillarsSet);

    const pillarScores: Record<string, { current: number; total: number; improvements: number }> = {};
    
    pillars.forEach((pillar) => {
      pillarScores[pillar] = { current: 0, total: 0, improvements: 0 };
    });

    // Only process answered questions
    answeredActiveQuestions.forEach((q) => {
      const answer = finalAnswers[q.id];
      const hasHighMaturity = isHighMaturity(q.id, answer);
      const hasLowMaturity = !hasHighMaturity;
      
      // Map question to pillars and update scores (only for active pillars)
      const questionPillars = getPillarMapping(q);
      questionPillars.forEach((pillar) => {
        // Only update pillars that are active based on selected scopes
        if (pillarScores[pillar]) {
          pillarScores[pillar].total += 1;
          
          // High maturity = add to current score
          if (hasHighMaturity) {
            pillarScores[pillar].current += 1;
          }
          
          // Low maturity = room for improvement
          if (hasLowMaturity) {
            pillarScores[pillar].improvements += 1;
          }
        }
      });
      
      // Calculate savings potential (only for low maturity areas)
      if (hasLowMaturity) {
        // Calculate effort savings: minutes per request × volume (from answer)
        const effortMatch = q.effortsSaved.match(/(\d+)/);
        if (effortMatch) {
          const minutesPerRequest = parseInt(effortMatch[1]);
          const volume = getVolumeFromAnswer(answer, identities);
          totalEffortMinutes += minutesPerRequest * volume;
        }
        
        // Calculate license savings (percentage-based, industry benchmarks)
        // Very high: 25-35% potential, High: 15-25%, Mid: 8-15%, Low: 2-8%
        if (q.licenseSavings === "very high") licenseSavingsScore += 8;  // ~30% savings potential
        else if (q.licenseSavings === "high") licenseSavingsScore += 5;  // ~20% savings potential
        else if (q.licenseSavings === "mid") licenseSavingsScore += 3;   // ~12% savings potential
        else if (q.licenseSavings === "low") licenseSavingsScore += 1;   // ~5% savings potential
      }

      // UX and Security improvement tracking
      if (q.uxImproved) uxTotal++;
      if (q.securityImproved) securityTotal++;
      
      // Low maturity areas have improvement potential
      if (hasLowMaturity && q.uxImproved) uxImprovements++;
      if (hasLowMaturity && q.securityImproved) securityImprovements++;
    });

    const maturityData = pillars.map((pillar) => {
      const score = pillarScores[pillar];
      // Current maturity: percentage of questions with high maturity answers
      const currentPct = score.total > 0 ? (score.current / score.total) * 100 : 50;
      // Improvement potential: based on low maturity areas that can be improved
      const improvementPct = score.total > 0 ? (score.improvements / score.total) * 35 : 15;
      
      return {
        category: pillar,
        current: Math.round(currentPct),
        improved: Math.min(95, Math.round(currentPct + improvementPct + 10)),
      };
    });

    const totalHours = totalEffortMinutes / 60;
    const licenseSavingsPct = Math.min(35, licenseSavingsScore);
    
    // UX/Security scores: Higher score = more potential for improvement
    const uxScore = uxTotal > 0 ? (uxImprovements / uxTotal) * 60 + 20 : 40;
    const securityScore = securityTotal > 0 ? (securityImprovements / securityTotal) * 50 + 25 : 50;

    const calculatedResults = {
      maturityData,
      savings: {
        effortHours: totalHours,
        licenseCost: licenseSavingsPct,
        uxScore,
        securityScore,
      },
      inputs: {
        identities,
        licenseCost,
        hourlyRate,
      },
      answers: finalAnswers,
      userInfo: {
        name,
        email,
      },
      selectedScopes,
    };

    // Save to database
    try {
      // Save to database (no .select() - RLS only allows INSERT for anonymous)
      const { error } = await supabase
        .from('assessment_submissions')
        .insert({
          name: name.trim(),
          email: email.trim(),
          identities,
          license_cost: licenseCost,
          hourly_rate: hourlyRate,
          selected_scopes: selectedScopes,
          answers: finalAnswers,
          results: calculatedResults,
        });

      if (error) {
        console.error('Error saving assessment:', error);
        // Don't block showing results if save fails
        toast.error("Could not save assessment", {
          description: "Your results are still available below."
        });
      } else {
        // Send thank you email with assessment summary
        const { error: emailError } = await supabase.functions.invoke("send-contact-email", {
          body: {
            name: name.trim(),
            email: email.trim(),
            source: "IT Control Box Assessment",
            assessmentSummary: {
              effortHours: totalHours,
              licenseSavingsPct: licenseSavingsPct,
              uxScore: uxScore,
              securityScore: securityScore,
            },
          },
          headers: { "x-contact-form-secret": CONTACT_FORM_TOKEN },
        });

        if (emailError) {
          console.error("Email sending failed:", emailError);
          // Don't block results if email fails
        }
      }
    } catch (err) {
      console.error('Error saving assessment:', err);
    }

    setResults(calculatedResults);
    setShowResults(true);
    window.scrollTo(0, 0);
  };

  const activeCategories = getActiveCategories();
  const questionsByCategory = categories
    .filter((cat) => activeCategories.includes(cat))
    .map((cat) => ({
      category: cat,
      questions: assessmentQuestions.filter((q) => q.category === cat),
    }));

  const activeQuestions = assessmentQuestions.filter(q => activeCategories.includes(q.category));
  const answeredCount = Object.keys(answers).filter(key => 
    activeQuestions.some(q => q.id === parseInt(key))
  ).length;
  const totalQuestions = activeQuestions.length;
  const progress = totalQuestions > 0 ? (answeredCount / totalQuestions) * 100 : 0;

  if (showResults && results) {
    return (
      <div className="space-y-6">
        <AssessmentResults {...results} />
        
        {/* Disclaimer for download/print */}
        <div className="bg-muted/50 rounded-lg p-4 border border-border print:block">
          <p className="text-xs text-muted-foreground text-center">
            <strong>Disclaimer:</strong> All statements in this page and report are indicative and subject to terms, conditions, and contractual agreement. No obligation exists unless expressly agreed in a legally binding contract.
          </p>
        </div>
        
        <div className="text-center print:hidden">
          <Button
            variant="outline"
            onClick={() => setShowResults(false)}
            className="mr-4"
          >
            {t('assessment.backToAssessment', 'Back to Assessment')}
          </Button>
          <Button onClick={() => window.print()}>
            {t('assessment.downloadResults', 'Download Results')}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Progress Bar */}
      <div className="sticky top-0 bg-background/95 backdrop-blur z-10 pb-4 pt-2">
        <div className="flex justify-between text-sm text-muted-foreground mb-2">
          <span>{t('assessment.progress', 'Progress')}</span>
          <span>{answeredCount} {t('assessment.of', 'of')} {totalQuestions} {t('assessment.questionsAnswered', 'questions answered')}</span>
        </div>
        <div className="h-2 bg-secondary rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* User Information */}
      <div className="bg-card rounded-lg p-6 border border-border">
        <h3 className="text-lg font-semibold text-foreground mb-4">{t('assessment.formTitle')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="name" className="text-foreground">{t('common.name')}</Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('contact.namePlaceholder', 'Enter your name')}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="email" className="text-foreground">{t('common.email')}</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('contact.emailPlaceholder', 'Enter your email')}
              className="mt-1"
            />
          </div>
        </div>
      </div>

      {/* Assessment Scope Selection */}
      <div className="bg-card rounded-lg p-6 border border-border">
        <h3 className="text-lg font-semibold text-foreground mb-4">{t('assessment.scopeTitle')}</h3>
        <p className="text-sm text-muted-foreground mb-4">
          {t('assessment.scopeDescription')}:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {scopeCategories.map((scope) => (
            <div key={scope.id} className="flex items-center space-x-3">
              <Checkbox
                id={scope.id}
                checked={selectedScopes.includes(scope.id)}
                onCheckedChange={(checked) => handleScopeChange(scope.id, checked as boolean)}
              />
              <Label 
                htmlFor={scope.id} 
                className="text-foreground cursor-pointer text-sm font-medium"
              >
                {t(`assessment.scopes.${scope.id}`)}
              </Label>
            </div>
          ))}
        </div>
        {selectedScopes.length === 0 && (
          <p className="text-sm text-destructive mt-3">
            {t('assessment.selectScope')}
          </p>
        )}
      </div>

      {/* Input Parameters */}
      <div className="bg-card rounded-lg p-6 border border-border">
        <h3 className="text-lg font-semibold text-foreground mb-4">{t('assessment.inputsTitle')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <Label htmlFor="identities" className="text-foreground">{t('assessment.identitiesLabel')}</Label>
            <Input
              id="identities"
              type="number"
              min={1}
              value={identities}
              onChange={(e) => setIdentities(Math.max(1, parseInt(e.target.value) || 1000))}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="licenseCost" className="text-foreground">{t('assessment.licenseCostLabel')}</Label>
            <Input
              id="licenseCost"
              type="number"
              min={1}
              value={licenseCost}
              onChange={(e) => setLicenseCost(Math.max(1, parseInt(e.target.value) || 40))}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="hourlyRate" className="text-foreground">{t('assessment.hourlyRateLabel')}</Label>
            <Input
              id="hourlyRate"
              type="number"
              min={1}
              value={hourlyRate}
              onChange={(e) => setHourlyRate(Math.max(1, parseInt(e.target.value) || 75))}
              className="mt-1"
            />
          </div>
        </div>
      </div>

      {/* Questions by Category */}
      {questionsByCategory.map(({ category, questions }) => (
        <div key={category} className="bg-card rounded-lg p-6 border border-border">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <ChevronRight className="w-5 h-5 text-primary" />
            {t(`assessment.categories.${category}`, category)}
          </h3>
          <div className="space-y-5">
            {questions.map((q, idx) => (
              <div key={q.id} className="border-b border-border pb-4 last:border-0 last:pb-0">
                <Label className="text-foreground block mb-2">
                  {idx + 1}. {t(`assessment.q${q.id}.question`, q.question)}
                </Label>
                <Select
                  value={answers[q.id] || ""}
                  onValueChange={(value) => handleAnswerChange(q.id, value)}
                >
                  <SelectTrigger className="w-full md:w-[400px] bg-background">
                    <SelectValue placeholder={t('assessment.selectAnswer')} />
                  </SelectTrigger>
                  <SelectContent className="bg-popover">
                    {q.options.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Privacy Policy & Submit */}
      <div className="flex flex-col items-center gap-4">
        <PrivacyPolicyCheckbox checked={privacyAccepted} onCheckedChange={setPrivacyAccepted} />
        <Button
          size="lg"
          onClick={calculateResults}
          disabled={selectedScopes.length === 0 || !privacyAccepted || !email.trim()}
          className="gap-2"
        >
          <Calculator className="w-5 h-5" />
          {t('assessment.calculateResults')}
        </Button>
      </div>
    </div>
  );
};
