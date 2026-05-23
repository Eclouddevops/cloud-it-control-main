-- Add email_sent column to datasheet_leads table
ALTER TABLE public.datasheet_leads ADD COLUMN IF NOT EXISTS email_sent BOOLEAN DEFAULT false;