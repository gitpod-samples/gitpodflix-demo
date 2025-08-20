-- Add comprehensive movie metadata columns
ALTER TABLE movies ADD COLUMN IF NOT EXISTS genres TEXT[];
ALTER TABLE movies ADD COLUMN IF NOT EXISTS director VARCHAR(255);
ALTER TABLE movies ADD COLUMN IF NOT EXISTS cast TEXT[];
ALTER TABLE movies ADD COLUMN IF NOT EXISTS duration INTEGER; -- in minutes

-- Create indexes for better search performance
CREATE INDEX IF NOT EXISTS idx_movies_genres ON movies USING gin(genres);
CREATE INDEX IF NOT EXISTS idx_movies_director ON movies(director);
CREATE INDEX IF NOT EXISTS idx_movies_cast ON movies USING gin(cast);
CREATE INDEX IF NOT EXISTS idx_movies_duration ON movies(duration);

-- Update existing movies with some basic metadata
UPDATE movies SET 
    genres = ARRAY['Crime', 'Drama'],
    director = 'Francis Ford Coppola',
    cast = ARRAY['Marlon Brando', 'Al Pacino', 'James Caan', 'Robert Duvall'],
    duration = 175
WHERE title = 'The Godfather';

UPDATE movies SET 
    genres = ARRAY['Action', 'Sci-Fi'],
    director = 'The Wachowskis',
    cast = ARRAY['Keanu Reeves', 'Laurence Fishburne', 'Carrie-Anne Moss', 'Hugo Weaving'],
    duration = 136
WHERE title = 'The Matrix';

UPDATE movies SET 
    genres = ARRAY['Action', 'Crime', 'Drama'],
    director = 'Christopher Nolan',
    cast = ARRAY['Christian Bale', 'Heath Ledger', 'Aaron Eckhart', 'Michael Caine'],
    duration = 152
WHERE title = 'The Dark Knight';

UPDATE movies SET 
    genres = ARRAY['Action', 'Sci-Fi', 'Thriller'],
    director = 'Christopher Nolan',
    cast = ARRAY['Leonardo DiCaprio', 'Marion Cotillard', 'Tom Hardy', 'Ellen Page'],
    duration = 148
WHERE title = 'Inception';

UPDATE movies SET 
    genres = ARRAY['Crime', 'Drama'],
    director = 'Quentin Tarantino',
    cast = ARRAY['John Travolta', 'Uma Thurman', 'Samuel L. Jackson', 'Bruce Willis'],
    duration = 154
WHERE title = 'Pulp Fiction';

UPDATE movies SET 
    genres = ARRAY['Drama'],
    director = 'David Fincher',
    cast = ARRAY['Brad Pitt', 'Edward Norton', 'Helena Bonham Carter', 'Meat Loaf'],
    duration = 139
WHERE title = 'Fight Club';

UPDATE movies SET 
    genres = ARRAY['Crime', 'Drama'],
    director = 'Martin Scorsese',
    cast = ARRAY['Robert De Niro', 'Ray Liotta', 'Joe Pesci', 'Lorraine Bracco'],
    duration = 146
WHERE title = 'Goodfellas';

UPDATE movies SET 
    genres = ARRAY['Adventure', 'Drama', 'Sci-Fi'],
    director = 'Christopher Nolan',
    cast = ARRAY['Matthew McConaughey', 'Anne Hathaway', 'Jessica Chastain', 'Michael Caine'],
    duration = 169
WHERE title = 'Interstellar';

UPDATE movies SET 
    genres = ARRAY['Action', 'Drama', 'Sci-Fi'],
    director = 'Denis Villeneuve',
    cast = ARRAY['Ryan Gosling', 'Harrison Ford', 'Ana de Armas', 'Jared Leto'],
    duration = 164
WHERE title = 'Blade Runner 2049';

UPDATE movies SET 
    genres = ARRAY['Adventure', 'Drama', 'Sci-Fi'],
    director = 'Denis Villeneuve',
    cast = ARRAY['Timothée Chalamet', 'Rebecca Ferguson', 'Oscar Isaac', 'Josh Brolin'],
    duration = 155
WHERE title = 'Dune';

UPDATE movies SET 
    genres = ARRAY['Drama', 'Sci-Fi'],
    director = 'Denis Villeneuve',
    cast = ARRAY['Amy Adams', 'Jeremy Renner', 'Forest Whitaker', 'Michael Stuhlbarg'],
    duration = 116
WHERE title = 'Arrival';

UPDATE movies SET 
    genres = ARRAY['Drama', 'Sci-Fi', 'Thriller'],
    director = 'Alex Garland',
    cast = ARRAY['Domhnall Gleeson', 'Alicia Vikander', 'Oscar Isaac', 'Sonoya Mizuno'],
    duration = 108
WHERE title = 'Ex Machina';
