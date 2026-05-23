import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

// Allowed origins for CORS - restrict to your actual domains
const ALLOWED_ORIGINS = [
  "https://www.aiobz.com",
  "https://aiobz.com",
  "https://id-preview--fe317559-06b7-4cc3-8b45-b0aff2a1f058.lovable.app",
  "https://fe317559-06b7-4cc3-8b45-b0aff2a1f058.lovableproject.com",
  "http://localhost:5173",
  "http://localhost:8080"
];

// Check if origin matches allowed list (supports exact match and wildcard patterns)
function isOriginAllowed(origin: string | null): boolean {
  if (!origin) return false;
  // Check exact matches
  if (ALLOWED_ORIGINS.includes(origin)) return true;
  // Check for lovable preview/project domains pattern
  if (origin.match(/^https:\/\/.*\.lovable\.app$/) || 
      origin.match(/^https:\/\/.*\.lovableproject\.com$/)) {
    return true;
  }
  return false;
}

function getCorsHeaders(origin: string | null): Record<string, string> {
  // Check if origin is in allowed list
  const allowedOrigin = isOriginAllowed(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    "Access-Control-Allow-Origin": allowedOrigin!,
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };
}

interface ContactEmailRequest {
  name: string;
  email: string;
  phone?: string;
  organisation?: string;
  source: string;
  leadId?: string;
  datasheetUrl?: string; // For datasheet downloads
  assessmentSummary?: { // For assessment results
    effortHours: number;
    licenseSavingsPct: number;
    uxScore: number;
    securityScore: number;
  };
}

// Input validation
function validateInput(data: ContactEmailRequest): { valid: boolean; error?: string } {
  // Check required fields
  if (!data.name || typeof data.name !== 'string' || data.name.trim().length === 0) {
    return { valid: false, error: "Name is required" };
  }
  if (!data.email || typeof data.email !== 'string') {
    return { valid: false, error: "Email is required" };
  }
  if (!data.source || typeof data.source !== 'string') {
    return { valid: false, error: "Source is required" };
  }

  // Length validation
  if (data.name.length > 100) {
    return { valid: false, error: "Name too long (max 100 characters)" };
  }
  if (data.email.length > 255) {
    return { valid: false, error: "Email too long (max 255 characters)" };
  }
  if (data.phone && data.phone.length > 20) {
    return { valid: false, error: "Phone too long (max 20 characters)" };
  }
  if (data.organisation && data.organisation.length > 100) {
    return { valid: false, error: "Organisation too long (max 100 characters)" };
  }
  if (data.source.length > 100) {
    return { valid: false, error: "Source too long (max 100 characters)" };
  }

  // Email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email)) {
    return { valid: false, error: "Invalid email format" };
  }

  // UUID validation for leadId if provided
  if (data.leadId) {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(data.leadId)) {
      return { valid: false, error: "Invalid lead ID format" };
    }
  }

  // Validate assessmentSummary fields are numbers if provided
  if (data.assessmentSummary) {
    const s = data.assessmentSummary;
    if (typeof s.effortHours !== 'number' || typeof s.licenseSavingsPct !== 'number' ||
        typeof s.uxScore !== 'number' || typeof s.securityScore !== 'number') {
      return { valid: false, error: "Invalid assessment summary format" };
    }
  }

  return { valid: true };
}

// Rate limiting check - max 5 email sends per email address per hour
async function checkRateLimit(supabase: any, email: string): Promise<{ allowed: boolean; error?: string }> {
  try {
    // Check recent email sends for this address in contact_leads
    const { count: contactCount, error: contactError } = await supabase
      .from("contact_leads")
      .select("*", { count: "exact", head: true })
      .eq("email", email)
      .eq("email_sent", true)
      .gte("created_at", new Date(Date.now() - 60 * 60 * 1000).toISOString());

    if (contactError) {
      console.error("Error checking contact rate limit:", contactError);
      // Don't block on rate limit check errors, but log them
      return { allowed: true };
    }

    // Check recent email sends in datasheet_leads
    const { count: datasheetCount, error: datasheetError } = await supabase
      .from("datasheet_leads")
      .select("*", { count: "exact", head: true })
      .eq("email", email)
      .eq("email_sent", true)
      .gte("created_at", new Date(Date.now() - 60 * 60 * 1000).toISOString());

    if (datasheetError) {
      console.error("Error checking datasheet rate limit:", datasheetError);
      return { allowed: true };
    }

    const totalSent = (contactCount || 0) + (datasheetCount || 0);
    
    if (totalSent >= 5) {
      return { allowed: false, error: "Too many email requests. Please try again later." };
    }

    return { allowed: true };
  } catch (error) {
    console.error("Rate limit check error:", error);
    return { allowed: true }; // Don't block on errors
  }
}

const handler = async (req: Request): Promise<Response> => {
  const origin = req.headers.get("Origin");
  const corsHeaders = getCorsHeaders(origin);

  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Only allow POST requests
  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      { status: 405, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }

  // Validate shared secret
  const formSecret = req.headers.get("x-contact-form-secret");
  const expectedSecret = Deno.env.get("CONTACT_FORM_SECRET");
  if (!expectedSecret || formSecret !== expectedSecret) {
    console.warn("Invalid or missing CONTACT_FORM_SECRET");
    return new Response(
      JSON.stringify({ error: "Unauthorized" }),
      { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }

  // Validate origin - allow Lovable domains and listed origins
  if (origin && !isOriginAllowed(origin)) {
    console.warn(`Request from unauthorized origin: ${origin}`);
    return new Response(
      JSON.stringify({ error: "Unauthorized origin" }),
      { status: 403, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }

  try {
    // Parse and validate input
    let requestData: ContactEmailRequest;
    try {
      requestData = await req.json();
    } catch {
      return new Response(
        JSON.stringify({ error: "Invalid JSON body" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const validation = validateInput(requestData);
    if (!validation.valid) {
      return new Response(
        JSON.stringify({ error: validation.error }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const { name, email, phone, organisation, source, leadId, datasheetUrl, assessmentSummary } = requestData;

    // Create Supabase client for rate limiting and database updates
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Check rate limit
    const rateLimitResult = await checkRateLimit(supabase, email);
    if (!rateLimitResult.allowed) {
      return new Response(
        JSON.stringify({ error: rateLimitResult.error }),
        { status: 429, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log(`Processing contact email for ${email} from source: ${source}`);

    // Sanitize inputs for HTML email (prevent HTML injection)
    const sanitize = (str: string | undefined | null): string => {
      if (!str) return '';
      return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;');
    };

    // Send notification email to info@itcontrolbox.com
    const notificationResult = await resend.emails.send({
      from: "IT Control Box <info@itcontrolbox.com>",
      to: ["info@itcontrolbox.com"],
      subject: `New Contact: ${sanitize(source)} - ${sanitize(name)}`,
      html: `
        <h1>New Contact Form Submission</h1>
        <p><strong>Source:</strong> ${sanitize(source)}</p>
        <p><strong>Name:</strong> ${sanitize(name)}</p>
        <p><strong>Email:</strong> ${sanitize(email)}</p>
        <p><strong>Phone:</strong> ${sanitize(phone) || 'Not provided'}</p>
        <p><strong>Organisation:</strong> ${sanitize(organisation) || 'Not provided'}</p>
        <p><strong>Submitted at:</strong> ${new Date().toISOString()}</p>
        ${assessmentSummary ? `
        <h2>Assessment Results</h2>
        <p><strong>Effort Savings:</strong> ${sanitize(String(assessmentSummary.effortHours.toFixed(0)))} hours/month</p>
        <p><strong>License Savings:</strong> ${sanitize(String(assessmentSummary.licenseSavingsPct))}%</p>
        <p><strong>UX Improvement:</strong> ${sanitize(String(assessmentSummary.uxScore.toFixed(0)))}%</p>
        <p><strong>Security Score:</strong> ${sanitize(String(assessmentSummary.securityScore.toFixed(0)))}%</p>
        ` : ''}
      `,
    });

    console.log("Notification email sent:", notificationResult);

    // Build thank you email based on source type
    let thankYouSubject = "Thank you for contacting IT Control Box!";
    let thankYouBody = "";
    
    const bookingUrl = "https://outlook.office.com/book/MeetingwithITControlBox@VINITCS.COM/?ismsaljsauthenabled";
    
    if (datasheetUrl) {
      // Datasheet download email
      thankYouSubject = "Your IT Control Box Technical Datasheet";
      thankYouBody = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333;">Thank You, ${sanitize(name)}!</h1>
          <p>Thank you for your interest in IT Control Box. Your technical datasheet is ready for download.</p>
          <p style="margin: 24px 0;">
            <a href="${sanitize(datasheetUrl)}" style="background-color: #0ea5e9; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Download Datasheet</a>
            <a href="${bookingUrl}" style="background-color: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin-left: 12px;">Book Meeting</a>
          </p>
          <p>Our team will reach out to discuss how IT Control Box can help optimize your IT operations.</p>
          <p>Best regards,<br>The IT Control Box Team</p>
          <p style="font-size: 9px; color: #666; margin-top: 24px;">Disclaimer: All statements in this page and report are indicative and subject to terms, conditions, and contractual agreement. No obligation exists unless expressly agreed in a legally binding contract.</p>
        </div>
      `;
    } else if (assessmentSummary) {
      // Assessment completion email
      thankYouSubject = "Your IT Control Box Maturity Assessment Results";
      thankYouBody = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333;">Thank You, ${sanitize(name)}!</h1>
          <p>Thank you for completing the IT Control Box Maturity Assessment. Here's a summary of your results:</p>
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="color: #333; margin-top: 0;">Your Assessment Summary</h2>
            <p><strong>Potential Effort Savings:</strong> ${assessmentSummary.effortHours.toFixed(0)} hours/month</p>
            <p><strong>License Optimization Potential:</strong> ${assessmentSummary.licenseSavingsPct}%</p>
            <p><strong>User Experience Improvement:</strong> ${assessmentSummary.uxScore.toFixed(0)}%</p>
            <p><strong>Security Enhancement Potential:</strong> ${assessmentSummary.securityScore.toFixed(0)}%</p>
          </div>
          <p>Our team will reach out to discuss these findings and how IT Control Box can help you achieve these improvements.</p>
          <p style="margin: 24px 0;">
            <a href="https://www.aiobz.com" style="background-color: #0ea5e9; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Learn More About IT Control Box</a>
            <a href="${bookingUrl}" style="background-color: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin-left: 12px;">Book Meeting</a>
          </p>
          <p>Best regards,<br>The IT Control Box Team</p>
          <p style="font-size: 9px; color: #666; margin-top: 24px;">Disclaimer: All statements in this page and report are indicative and subject to terms, conditions, and contractual agreement. No obligation exists unless expressly agreed in a legally binding contract.</p>
        </div>
      `;
    } else {
      // Standard contact form email
      thankYouBody = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333;">Thank You, ${sanitize(name)}!</h1>
          <p>Thank you for your interest in IT Control Box. We've received your inquiry and our team will get back to you shortly.</p>
          <p>In the meantime, feel free to explore more about our solutions:</p>
          <p style="margin: 24px 0;">
            <a href="https://www.aiobz.com" style="background-color: #0ea5e9; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Visit Our Website</a>
            <a href="${bookingUrl}" style="background-color: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin-left: 12px;">Book Meeting</a>
          </p>
          <p>Best regards,<br>The IT Control Box Team</p>
        </div>
      `;
    }

    // Send thank you email to the visitor
    const thankYouResult = await resend.emails.send({
      from: "IT Control Box <info@itcontrolbox.com>",
      to: [email],
      subject: thankYouSubject,
      html: thankYouBody,
    });

    console.log("Thank you email sent:", thankYouResult);

    // Update email_sent flag in database if leadId is provided
    if (leadId) {
      // Determine which table to update based on source
      const tableName = source === "IT Control Box Datasheet" ? "datasheet_leads" : "contact_leads";
      
      const { error: updateError } = await supabase
        .from(tableName)
        .update({ email_sent: true })
        .eq("id", leadId);

      if (updateError) {
        console.error("Error updating email_sent flag:", updateError);
      } else {
        console.log(`Updated email_sent flag for lead ${leadId} in ${tableName}`);
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        notification: notificationResult, 
        thankYou: thankYouResult 
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in send-contact-email function:", error);
    // Return generic error message to avoid leaking internal details
    return new Response(
      JSON.stringify({ error: "An error occurred while processing your request" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
