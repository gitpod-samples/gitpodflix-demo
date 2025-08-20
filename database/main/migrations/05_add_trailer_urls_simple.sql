-- Simple migration to add trailer URLs to existing movies table
ALTER TABLE movies ADD COLUMN IF NOT EXISTS trailer_url VARCHAR(500);
ALTER TABLE movies ADD COLUMN IF NOT EXISTS video_url VARCHAR(500);

-- Update existing movies with YouTube trailer URLs
UPDATE movies SET trailer_url = 'https://www.youtube.com/watch?v=UaVTIH8mujA' WHERE title = 'The Godfather';
UPDATE movies SET trailer_url = 'https://www.youtube.com/watch?v=vKQi3bBA1y8' WHERE title = 'The Matrix';
UPDATE movies SET trailer_url = 'https://www.youtube.com/watch?v=EXeTwQWrcwY' WHERE title = 'The Dark Knight';
UPDATE movies SET trailer_url = 'https://www.youtube.com/watch?v=YoHD9XEInc0' WHERE title = 'Inception';
UPDATE movies SET trailer_url = 'https://www.youtube.com/watch?v=s7EdQ4FqbhY' WHERE title = 'Pulp Fiction';
UPDATE movies SET trailer_url = 'https://www.youtube.com/watch?v=qtRKdVHc-cE' WHERE title = 'Fight Club';
UPDATE movies SET trailer_url = 'https://www.youtube.com/watch?v=6hB3S9bIaco' WHERE title = 'The Shawshank Redemption';
UPDATE movies SET trailer_url = 'https://www.youtube.com/watch?v=R2_Mn-qRKjA' WHERE title = 'Goodfellas';
UPDATE movies SET trailer_url = 'https://www.youtube.com/watch?v=zSWdZVtXT7E' WHERE title = 'Interstellar';
UPDATE movies SET trailer_url = 'https://www.youtube.com/watch?v=gCcx85zbxz4' WHERE title = 'Blade Runner 2049';
UPDATE movies SET trailer_url = 'https://www.youtube.com/watch?v=n9xhJrPXop4' WHERE title = 'Dune';
UPDATE movies SET trailer_url = 'https://www.youtube.com/watch?v=tFMo3UJ4B4g' WHERE title = 'Arrival';
UPDATE movies SET trailer_url = 'https://www.youtube.com/watch?v=XYGzRB4Pnq8' WHERE title = 'Ex Machina';

-- Set video_url same as trailer_url for now
UPDATE movies SET video_url = trailer_url WHERE trailer_url IS NOT NULL;
