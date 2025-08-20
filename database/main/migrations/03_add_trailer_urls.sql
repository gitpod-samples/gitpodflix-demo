-- Add trailer and video URL columns to movies table
ALTER TABLE movies ADD COLUMN IF NOT EXISTS trailer_url VARCHAR(500);
ALTER TABLE movies ADD COLUMN IF NOT EXISTS video_url VARCHAR(500);

-- Add indexes for video content
CREATE INDEX IF NOT EXISTS idx_movies_trailer_url ON movies(trailer_url) WHERE trailer_url IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_movies_video_url ON movies(video_url) WHERE video_url IS NOT NULL;

-- Update existing movies with sample trailer URLs (using Big Buck Bunny as demo content)
UPDATE movies SET 
  trailer_url = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  video_url = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
WHERE trailer_url IS NULL;

-- Add some variety with different demo videos for different movies
UPDATE movies SET 
  trailer_url = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
  video_url = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4'
WHERE id % 3 = 1;

UPDATE movies SET 
  trailer_url = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  video_url = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
WHERE id % 3 = 2;

UPDATE movies SET 
  trailer_url = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
  video_url = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4'
WHERE id % 3 = 0;
