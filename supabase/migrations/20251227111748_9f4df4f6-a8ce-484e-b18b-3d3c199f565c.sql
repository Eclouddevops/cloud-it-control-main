-- Make the media bucket public so videos can be displayed on the website
UPDATE storage.buckets SET public = true WHERE id = 'media';

-- Add policy for public read access to media files
CREATE POLICY "Public read access for media files"
ON storage.objects
FOR SELECT
USING (bucket_id = 'media');