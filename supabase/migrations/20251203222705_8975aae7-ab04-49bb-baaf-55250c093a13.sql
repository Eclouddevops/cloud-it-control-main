-- Create a table for datasheet download leads
CREATE TABLE public.datasheet_leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  organisation TEXT,
  datasheet_name TEXT NOT NULL DEFAULT 'IT Control Box',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.datasheet_leads ENABLE ROW LEVEL SECURITY;

-- Allow public inserts (no auth required for lead capture)
CREATE POLICY "Anyone can submit lead info" 
ON public.datasheet_leads 
FOR INSERT 
WITH CHECK (true);

-- Only authenticated admins can view leads (for now, no select policy = no public reads)
