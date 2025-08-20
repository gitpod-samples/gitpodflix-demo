-- Add YouTube-specific columns for better video handling
ALTER TABLE movies ADD COLUMN IF NOT EXISTS youtube_trailer_id VARCHAR(20);
ALTER TABLE movies ADD COLUMN IF NOT EXISTS youtube_video_id VARCHAR(20);

-- Add indexes for YouTube video IDs
CREATE INDEX IF NOT EXISTS idx_movies_youtube_trailer_id ON movies(youtube_trailer_id) WHERE youtube_trailer_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_movies_youtube_video_id ON movies(youtube_video_id) WHERE youtube_video_id IS NOT NULL;

-- Function to extract YouTube video ID from URL
CREATE OR REPLACE FUNCTION extract_youtube_id(url TEXT) 
RETURNS TEXT AS $$
BEGIN
    -- Handle various YouTube URL formats
    IF url ~ 'youtube\.com/watch\?v=([^&]+)' THEN
        RETURN substring(url from 'youtube\.com/watch\?v=([^&]+)');
    ELSIF url ~ 'youtu\.be/([^?]+)' THEN
        RETURN substring(url from 'youtu\.be/([^?]+)');
    ELSIF url ~ 'youtube\.com/embed/([^?]+)' THEN
        RETURN substring(url from 'youtube\.com/embed/([^?]+)');
    ELSIF url ~ 'youtube\.com/v/([^?]+)' THEN
        RETURN substring(url from 'youtube\.com/v/([^?]+)');
    END IF;
    
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Update existing records to extract YouTube IDs from URLs
UPDATE movies 
SET youtube_trailer_id = extract_youtube_id(trailer_url)
WHERE trailer_url IS NOT NULL 
  AND (trailer_url LIKE '%youtube.com%' OR trailer_url LIKE '%youtu.be%')
  AND youtube_trailer_id IS NULL;

UPDATE movies 
SET youtube_video_id = extract_youtube_id(video_url)
WHERE video_url IS NOT NULL 
  AND (video_url LIKE '%youtube.com%' OR video_url LIKE '%youtu.be%')
  AND youtube_video_id IS NULL;
