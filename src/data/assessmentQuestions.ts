export interface AssessmentQuestion {
  id: number;
  question: string;
  options: string[];
  category: string;
  effortsSaved: string;
  licenseSavings: string;
  uxImproved: boolean;
  securityImproved: boolean;
  solutionHelp: string;
}

export const assessmentQuestions: AssessmentQuestion[] = [
  {
    id: 1,
    question: "Do you have persona based O365 licenses allocation?",
    options: ["Yes", "No"],
    category: "O365 Automation",
    effortsSaved: "30 min",
    licenseSavings: "very high",
    uxImproved: true,
    securityImproved: true,
    solutionHelp: "O365 Persona vs license monitoring based on business personas."
  },
  {
    id: 2,
    question: "As per you, how many users have higher 365 subscription than they actually use or need?",
    options: ["Less than 5%", "5 - 15%", "More than 15%", "Unknown"],
    category: "O365 Automation",
    effortsSaved: "15 min",
    licenseSavings: "very high",
    uxImproved: true,
    securityImproved: true,
    solutionHelp: "E2 activation automation for EMS Team and/or Site IT."
  },
  {
    id: 3,
    question: "Is your HR / L&D Team empowered to control the violations of HR or L&D policies or KPIs?",
    options: ["Yes", "No"],
    category: "O365 Automation",
    effortsSaved: "15 min",
    licenseSavings: "",
    uxImproved: false,
    securityImproved: true,
    solutionHelp: "Allows HR Team to block Outlook Access of any user who does not perform company mandatory trainings."
  },
  {
    id: 4,
    question: "What is the lead time to decommission or downgrade the users temp license?",
    options: ["Less than 1 week", "1-4 weeks", "Manual or occasional"],
    category: "O365 Automation",
    effortsSaved: "20 min",
    licenseSavings: "very high",
    uxImproved: false,
    securityImproved: true,
    solutionHelp: "Optimize licenses assignment for short term usage. Licenses revocation on the scheduled date."
  },
  {
    id: 5,
    question: "Do you monitor actual O365 consumptions vs license allocation?",
    options: ["Yes", "No"],
    category: "O365 Automation",
    effortsSaved: "10 min",
    licenseSavings: "very high",
    uxImproved: true,
    securityImproved: true,
    solutionHelp: "Assigns the Office365 Licenses like E1, E3, F3, PowerBi Pro etc."
  },
  {
    id: 6,
    question: "Are you aware of the exceptions such as USB access, group memberships aligned to the persona changes?",
    options: ["Yes", "No"],
    category: "Device Management",
    effortsSaved: "15 min",
    licenseSavings: "",
    uxImproved: true,
    securityImproved: true,
    solutionHelp: "Update the Azure Group Memberships with exception management and audit trail."
  },
  {
    id: 7,
    question: "Are your sr IT Leads busy in end user management complex tasks such as encryption, bit locker, group policy?",
    options: ["No, completely managed by Jr team", "Less than 10 tickets per month", "More than 10 tickets per month"],
    category: "Device Management",
    effortsSaved: "15 min",
    licenseSavings: "",
    uxImproved: true,
    securityImproved: true,
    solutionHelp: "Update the Azure Group Membership. The Groups must be preconfigured to allow these tasks in Intune."
  },
  {
    id: 8,
    question: "Do you have end point protection rollout automation?",
    options: ["Yes", "No"],
    category: "Device Management",
    effortsSaved: "5 min",
    licenseSavings: "mid",
    uxImproved: false,
    securityImproved: true,
    solutionHelp: "Endpoint device protection - Zscaler mass deployment automation - compliance."
  },
  {
    id: 9,
    question: "Do you track # of devices per user?",
    options: ["Yes", "No"],
    category: "Device Management",
    effortsSaved: "10 min",
    licenseSavings: "mid",
    uxImproved: true,
    securityImproved: false,
    solutionHelp: "Retrieves the list of devices registered under specified user account."
  },
  {
    id: 10,
    question: "How do you manage geo fencing for the roaming users and exceptions?",
    options: ["We don't manage", "Low request - less than 30 per month", "More than 30 requests"],
    category: "Device Management",
    effortsSaved: "15 min",
    licenseSavings: "",
    uxImproved: true,
    securityImproved: true,
    solutionHelp: "Allows temporary access from different geographies and bypass the Geo Fencing Policies."
  },
  {
    id: 11,
    question: "How many BitLocker incidents / requests do you get per month needing manual intervention?",
    options: ["Unknown", "Less than 20", "20 - 50", "50+"],
    category: "Device Management",
    effortsSaved: "15 min",
    licenseSavings: "",
    uxImproved: true,
    securityImproved: true,
    solutionHelp: "Allows L1 support to retrieve the BitLocker recovery key from AD or Azure AD."
  },
  {
    id: 12,
    question: "How many requests do you receive per month to remove, change mobile device or policy?",
    options: ["Less than 20", "20-100", "100+"],
    category: "Device Management",
    effortsSaved: "15 min",
    licenseSavings: "high",
    uxImproved: true,
    securityImproved: true,
    solutionHelp: "Allows to upload the hardware hash to Intune for windows 10/11."
  },
  {
    id: 13,
    question: "How many users have local admin access?",
    options: ["Unknown", "Less than 10%", "More than 10%", "None"],
    category: "Device Management",
    effortsSaved: "10 min",
    licenseSavings: "",
    uxImproved: true,
    securityImproved: true,
    solutionHelp: "L1 support can retrieve the LAPs password with option to search at AD, Azure or both."
  },
  {
    id: 14,
    question: "What's your device compliance ratio?",
    options: ["Unknown", "Less than 50%", "50-85%", "More than 85%"],
    category: "Device Management",
    effortsSaved: "10 min",
    licenseSavings: "",
    uxImproved: false,
    securityImproved: true,
    solutionHelp: "Check the status of device compliance of Azure AD / Intune."
  },
  {
    id: 15,
    question: "Do IT manager or security manager get the easy to action reports about exceptions?",
    options: ["Yes", "No"],
    category: "Identity Operations",
    effortsSaved: "30 min",
    licenseSavings: "high",
    uxImproved: false,
    securityImproved: true,
    solutionHelp: "Report on Active Mailbox Count, Users onboarding/Deboarding."
  },
  {
    id: 16,
    question: "Do you have Identity Quarantine automation across multiple platforms and apps?",
    options: ["Yes", "No", "TAT less than 1 hour", "TAT 1-6 hours", "TAT more than 6 hours"],
    category: "Identity Operations",
    effortsSaved: "5 min",
    licenseSavings: "",
    uxImproved: false,
    securityImproved: true,
    solutionHelp: "Disables the ID in the AD, Azure and apps immediately due to emergency situation."
  },
  {
    id: 17,
    question: "Do you have multiple teams to manage AD, Azure, Intune? Are there gaps causing sync issues?",
    options: ["Multiple teams - Yes", "Multiple teams - No", "Hostname reuse - Yes", "Hostname reuse - No"],
    category: "Identity Operations",
    effortsSaved: "15 min",
    licenseSavings: "high",
    uxImproved: true,
    securityImproved: true,
    solutionHelp: "Automate the hostname reuse with multiple steps across AD, Azure AD, Intune."
  },
  {
    id: 18,
    question: "Do you have secured automation in certificate management?",
    options: ["Yes", "No"],
    category: "Identity Operations",
    effortsSaved: "30 min",
    licenseSavings: "",
    uxImproved: false,
    securityImproved: true,
    solutionHelp: "Convert PFX certificate into 7 different certificate formats."
  },
  {
    id: 19,
    question: "Do you know how many users reuse the same passwords, or non-compliant passwords?",
    options: ["Less than 10%", "10-40%", "Unknown or more than 40%"],
    category: "Identity Operations",
    effortsSaved: "30 min",
    licenseSavings: "",
    uxImproved: true,
    securityImproved: true,
    solutionHelp: "Report of password reuse, password hardcoding, non-compliant password storage."
  },
  {
    id: 20,
    question: "Do your users use password reset self service? How much time your IT support spend monthly on these requests?",
    options: ["Less than 10% Self service", "10-25% Self service", "25-60% Self service", "Unknown"],
    category: "Identity Operations",
    effortsSaved: "5 min",
    licenseSavings: "",
    uxImproved: true,
    securityImproved: true,
    solutionHelp: "IT support to reset end user password with built-in secure password generation."
  },
  {
    id: 21,
    question: "How frequently the HR updates related to role, division, location, etc are synchronized with AD?",
    options: ["Automated sync", "Manual sync"],
    category: "Identity Operations",
    effortsSaved: "5 min",
    licenseSavings: "",
    uxImproved: true,
    securityImproved: true,
    solutionHelp: "Allows IT support to update various frequently required attribute updates in AD."
  },
  {
    id: 22,
    question: "How many local admin access you have provided? For how long?",
    options: ["Less than 5%", "5 - 15%", "More than 15%", "Unknown"],
    category: "Identity Operations",
    effortsSaved: "10 min",
    licenseSavings: "",
    uxImproved: true,
    securityImproved: true,
    solutionHelp: "Enhanced with live dashboard & easy to use for Site IT."
  },
  {
    id: 23,
    question: "How many shared licenses are allocated based on function or usage by multiple personal or services?",
    options: ["Unknown", "Less than 50", "50 - 200", "200+"],
    category: "Identity Operations",
    effortsSaved: "30 min",
    licenseSavings: "very high",
    uxImproved: true,
    securityImproved: true,
    solutionHelp: "Allows to create faceless, guest & service accounts."
  },
  {
    id: 24,
    question: "Is there automation to create IT support teams accounts?",
    options: ["Yes", "No"],
    category: "Identity Operations",
    effortsSaved: "30 min",
    licenseSavings: "",
    uxImproved: false,
    securityImproved: true,
    solutionHelp: "Create the IT support privilege account based on the user's current normal account."
  },
  {
    id: 25,
    question: "What are the % of tickets escalated by L1 to L2 for troubleshooting?",
    options: ["Less than 5%", "5 - 15%", "More than 15%", "Unknown"],
    category: "Identity Operations",
    effortsSaved: "20 min",
    licenseSavings: "",
    uxImproved: false,
    securityImproved: true,
    solutionHelp: "System allows you to find from which device the user account is getting locked."
  },
  {
    id: 26,
    question: "What is the % of end user failed in mock phishing?",
    options: ["Less than 15%", "15-45%", "We do not run it"],
    category: "Identity Operations",
    effortsSaved: "30 min",
    licenseSavings: "",
    uxImproved: false,
    securityImproved: true,
    solutionHelp: "Password leakage monitoring through partner tools."
  },
  {
    id: 27,
    question: "What is the % of end user password reset, MFA reset tickets resolved by self service or automation?",
    options: ["Less than 20%", "20-70%", "More than 70%"],
    category: "Identity Operations",
    effortsSaved: "10 min",
    licenseSavings: "",
    uxImproved: true,
    securityImproved: true,
    solutionHelp: "Allows IT support to reset the MFA of Azure AD."
  },
  {
    id: 28,
    question: "Are your approvers enabled to understand impact of cost or security while approving requests?",
    options: ["Yes", "No"],
    category: "Enterprise Identity Management",
    effortsSaved: "",
    licenseSavings: "high",
    uxImproved: true,
    securityImproved: true,
    solutionHelp: "Enable approvers with cost impact of the request while making approval decisions."
  },
  {
    id: 29,
    question: "Are your IT manager / leads enabled with the tools for quick audit and forensics of IDAM?",
    options: ["None - more than 2 weeks", "1-5 days", "Less than 8 hours", "1-2 hours"],
    category: "Enterprise Identity Management",
    effortsSaved: "",
    licenseSavings: "",
    uxImproved: false,
    securityImproved: true,
    solutionHelp: "Real time Identity and Access logging and retrieval for audit and forensics."
  },
  {
    id: 30,
    question: "Did you have any service disruptions due to certification expiry?",
    options: ["Yes", "No"],
    category: "Enterprise Identity Management",
    effortsSaved: "",
    licenseSavings: "",
    uxImproved: false,
    securityImproved: true,
    solutionHelp: "Application Recertification control and automation based on Policy or authorization."
  },
  {
    id: 31,
    question: "Do you have audit reports to track access during entire lifecycle or time duration?",
    options: ["Yes", "No"],
    category: "Enterprise Identity Management",
    effortsSaved: "",
    licenseSavings: "",
    uxImproved: false,
    securityImproved: true,
    solutionHelp: "Access lifecycle tracking and reporting to audit access per Identity or personas."
  },
  {
    id: 32,
    question: "Do you have automated control of the access changes based on changes in role?",
    options: ["Yes", "No"],
    category: "Enterprise Identity Management",
    effortsSaved: "",
    licenseSavings: "low",
    uxImproved: false,
    securityImproved: true,
    solutionHelp: "Partial access revocation based on persona changes."
  },
  {
    id: 33,
    question: "Do you have automation for mass onboarding / deboarding?",
    options: ["Yes", "No"],
    category: "Enterprise Identity Management",
    effortsSaved: "",
    licenseSavings: "high",
    uxImproved: true,
    securityImproved: true,
    solutionHelp: "Onboarding or deboarding of employees / vendor accounts based on HRMS and policies."
  },
  {
    id: 34,
    question: "Do your team or supplier track new threats to identity and access especially in the application landscape?",
    options: ["Yes", "No"],
    category: "Enterprise Identity Management",
    effortsSaved: "",
    licenseSavings: "",
    uxImproved: false,
    securityImproved: true,
    solutionHelp: "Continuous evolution of Application access security and exploits."
  },
  {
    id: 35,
    question: "How frequently do you track excess access (continued access when people change roles)?",
    options: ["Less than 10% people may have excess access", "10-30% might have extra access", "We don't track or control"],
    category: "Enterprise Identity Management",
    effortsSaved: "",
    licenseSavings: "",
    uxImproved: false,
    securityImproved: true,
    solutionHelp: "Identify excess access based on automated audit."
  }
];

export const categories = [
  "O365 Automation",
  "Device Management", 
  "Identity Operations",
  "Enterprise Identity Management"
];

export const scopeCategories = [
  { id: "o365", label: "O365 Automation", category: "O365 Automation" },
  { id: "device", label: "Device Management", category: "Device Management" },
  { id: "identity", label: "Identity Operations", category: "Identity Operations" },
  { id: "enterprise", label: "Enterprise Identity Management", category: "Enterprise Identity Management" }
];
