-- Add validation trigger for input length limits and rate limiting
-- This replaces CHECK constraints with a trigger for more flexibility

CREATE OR REPLACE FUNCTION public.check_lead_rate_limit()
RETURNS TRIGGER AS $$
DECLARE
  recent_count INTEGER;
BEGIN
  -- Validate input lengths server-side as defense in depth
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

  -- Count submissions from same email in last hour for rate limiting
  SELECT COUNT(*)
  INTO recent_count
  FROM public.datasheet_leads
  WHERE email = NEW.email
    AND created_at > NOW() - INTERVAL '1 hour';
  
  IF recent_count >= 3 THEN
    RAISE EXCEPTION 'Rate limit exceeded. Please try again later.';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for validation and rate limiting on insert
CREATE TRIGGER enforce_lead_rate_limit
BEFORE INSERT ON public.datasheet_leads
FOR EACH ROW EXECUTE FUNCTION public.check_lead_rate_limit();