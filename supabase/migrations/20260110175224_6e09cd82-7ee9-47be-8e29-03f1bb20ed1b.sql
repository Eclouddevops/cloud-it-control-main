-- Create contact_leads table for storing contact form submissions
CREATE TABLE public.contact_leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  organisation TEXT,
  source TEXT NOT NULL DEFAULT 'contact_form',
  email_sent BOOLEAN DEFAULT false
);

-- Enable Row Level Security
ALTER TABLE public.contact_leads ENABLE ROW LEVEL SECURITY;

-- Create policy for public insert (anyone can submit)
CREATE POLICY "Anyone can submit contact info" 
ON public.contact_leads 
FOR INSERT 
WITH CHECK (true);

-- Create policy for admin select
CREATE POLICY "Only admins can view contacts" 
ON public.contact_leads 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create policy for admin update
CREATE POLICY "Only admins can update contacts" 
ON public.contact_leads 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Create policy for admin delete
CREATE POLICY "Only admins can delete contacts" 
ON public.contact_leads 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create rate limit trigger for contact form
CREATE OR REPLACE FUNCTION public.check_contact_rate_limit()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  recent_count INTEGER;
BEGIN
  -- Validate input lengths
  IF length(NEW.name) > 100 THEN
    RAISE EXCEPTION 'Name too long (max 100 characters)';
  END IF;
  IF length(NEW.email) > 255 THEN
    RAISE EXCEPTION 'Email too long (max 255 characters)';
  END IF;
  IF NEW.phone IS NOT NULL AND length(NEW.phone) > 20 THEN
    RAISE EXCEPTION 'Phone too long (max 20 characters)';
  END IF;
  IF NEW.organisation IS NOT NULL AND length(NEW.organisation) > 100 THEN
    RAISE EXCEPTION 'Organisation too long (max 100 characters)';
  END IF;

  -- Count submissions from same email in last hour
  SELECT COUNT(*)
  INTO recent_count
  FROM public.contact_leads
  WHERE email = NEW.email
    AND created_at > NOW() - INTERVAL '1 hour';
  
  IF recent_count >= 3 THEN
    RAISE EXCEPTION 'Rate limit exceeded. Please try again later.';
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger for rate limiting
CREATE TRIGGER check_contact_rate_limit_trigger
BEFORE INSERT ON public.contact_leads
FOR EACH ROW
EXECUTE FUNCTION public.check_contact_rate_limit();