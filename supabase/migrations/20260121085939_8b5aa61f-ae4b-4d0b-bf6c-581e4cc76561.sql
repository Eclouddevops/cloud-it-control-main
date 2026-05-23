-- Create table for assessment submissions
CREATE TABLE public.assessment_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- User info
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  
  -- Organization parameters
  identities INTEGER NOT NULL DEFAULT 1000,
  license_cost NUMERIC NOT NULL DEFAULT 100,
  hourly_rate NUMERIC NOT NULL DEFAULT 50,
  
  -- Selected scopes (array of scope ids)
  selected_scopes TEXT[] NOT NULL DEFAULT ARRAY['o365', 'device', 'identity', 'enterprise'],
  
  -- Answers stored as JSONB (question_id -> answer)
  answers JSONB NOT NULL DEFAULT '{}',
  
  -- Calculated results stored as JSONB
  results JSONB,
  
  -- Email sent flag
  email_sent BOOLEAN DEFAULT false
);

-- Enable RLS
ALTER TABLE public.assessment_submissions ENABLE ROW LEVEL SECURITY;

-- Allow anyone to submit assessments (public form)
CREATE POLICY "Anyone can submit assessments"
ON public.assessment_submissions
FOR INSERT
WITH CHECK (true);

-- Only admins can view/update/delete submissions
CREATE POLICY "Only admins can view assessments"
ON public.assessment_submissions
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can update assessments"
ON public.assessment_submissions
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can delete assessments"
ON public.assessment_submissions
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Rate limiting trigger
CREATE OR REPLACE FUNCTION public.check_assessment_rate_limit()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
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

  -- Count submissions from same email in last hour
  SELECT COUNT(*)
  INTO recent_count
  FROM public.assessment_submissions
  WHERE email = NEW.email
    AND created_at > NOW() - INTERVAL '1 hour';
  
  IF recent_count >= 5 THEN
    RAISE EXCEPTION 'Rate limit exceeded. Please try again later.';
  END IF;
  
  RETURN NEW;
END;
$$;

-- Attach trigger
CREATE TRIGGER check_assessment_rate_limit_trigger
BEFORE INSERT ON public.assessment_submissions
FOR EACH ROW
EXECUTE FUNCTION public.check_assessment_rate_limit();