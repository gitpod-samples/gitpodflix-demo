-- Fix the cast column name issue (cast is a reserved word in PostgreSQL)
ALTER TABLE movies RENAME COLUMN cast TO movie_cast;

-- Update the index
DROP INDEX IF EXISTS idx_movies_cast;
CREATE INDEX IF NOT EXISTS idx_movies_movie_cast ON movies USING gin(movie_cast);
