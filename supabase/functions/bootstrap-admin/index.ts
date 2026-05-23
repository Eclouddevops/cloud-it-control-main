import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const ALLOWED_ORIGINS = [
  "https://www.aiobz.com",
  "https://aiobz.com",
];

function getCorsHeaders(req: Request) {
  const origin = req.headers.get("Origin") || "";
  const allowedOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : "";
  if (!allowedOrigin) {
    return {
      "Access-Control-Allow-Origin": ALLOWED_ORIGINS[0],
      "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    };
  }
  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  };
}

// Allowed admin emails whitelist - only these emails can become the first admin
// Set ALLOWED_ADMIN_EMAILS environment variable as comma-separated list
// Example: "admin@company.com,backup-admin@company.com"
function getAllowedAdminEmails(): string[] {
  const envEmails = Deno.env.get("ALLOWED_ADMIN_EMAILS");
  if (!envEmails) {
    return []; // If not set, no one can bootstrap (secure by default)
  }
  return envEmails.split(",").map(email => email.trim().toLowerCase()).filter(Boolean);
}

function isEmailAllowed(email: string | undefined): boolean {
  if (!email) return false;
  const allowedEmails = getAllowedAdminEmails();
  // If no whitelist configured, deny all (secure default)
  if (allowedEmails.length === 0) {
    console.log("No ALLOWED_ADMIN_EMAILS configured - bootstrap disabled for security");
    return false;
  }
  return allowedEmails.includes(email.toLowerCase());
}

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);

  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Bootstrap admin function called");

    // Create Supabase client with service role key to bypass RLS
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Check if any admin already exists FIRST (before any auth checks)
    const { data: existingAdmin, error: checkError } = await supabase
      .from("user_roles")
      .select("id")
      .eq("role", "admin")
      .limit(1);

    if (checkError) {
      console.error("Error checking existing admin:", checkError);
      return new Response(
        JSON.stringify({ error: "Failed to check admin status" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (existingAdmin && existingAdmin.length > 0) {
      console.log("Admin already exists, bootstrap not allowed");
      return new Response(
        JSON.stringify({ error: "Admin already exists. Bootstrap is only allowed when no admin exists." }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get the authorization header from the request
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      console.log("No authorization header provided");
      return new Response(
        JSON.stringify({ error: "Authorization required. Please sign in first." }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Verify the user's JWT token
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);

    if (userError || !user) {
      console.error("Error verifying user:", userError);
      return new Response(
        JSON.stringify({ error: "Invalid or expired authentication token" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // SECURITY: Verify user's email is in the allowed admin emails whitelist
    if (!isEmailAllowed(user.email)) {
      console.warn(`Bootstrap attempt denied for email: ${user.email} - not in whitelist`);
      return new Response(
        JSON.stringify({ error: "Your email is not authorized to become an admin." }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // SECURITY: Verify email is confirmed (prevents unverified account attacks)
    if (!user.email_confirmed_at) {
      console.warn(`Bootstrap attempt denied for unconfirmed email: ${user.email}`);
      return new Response(
        JSON.stringify({ error: "Please verify your email before becoming an admin." }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Creating admin role for user:", user.id, "email:", user.email);

    // Insert admin role using service role client (bypasses RLS)
    const { error: insertError } = await supabase
      .from("user_roles")
      .insert({ user_id: user.id, role: "admin" });

    if (insertError) {
      console.error("Error inserting admin role:", insertError);
      return new Response(
        JSON.stringify({ error: "Failed to create admin role. Please try again." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("First admin created successfully for user:", user.id);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "First admin created successfully",
        user_id: user.id 
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Unexpected error in bootstrap-admin:", error);
    return new Response(
      JSON.stringify({ error: "An unexpected error occurred" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
