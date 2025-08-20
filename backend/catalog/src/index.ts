import express from 'express';
import cors from 'cors';
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Database configuration
const pool = new Pool({
  user: process.env.DB_USER || 'gitpod',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'gitpodflix',
  password: process.env.DB_PASSWORD || 'gitpod',
  port: parseInt(process.env.DB_PORT || '5432'),
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/api/movies', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM movies ORDER BY rating DESC');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching movies:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Search endpoint with advanced filtering
app.get('/api/search', async (req, res) => {
  try {
    const { 
      q, 
      genres, 
      yearMin, 
      yearMax, 
      ratingMin, 
      ratingMax, 
      durationMin, 
      durationMax,
      limit = 50,
      offset = 0
    } = req.query;

    let query = 'SELECT * FROM movies WHERE 1=1';
    const params: any[] = [];
    let paramIndex = 1;

    // Full-text search
    if (q && typeof q === 'string' && q.trim()) {
      query += ` AND (
        to_tsvector('english', title || ' ' || COALESCE(description, '') || ' ' || COALESCE(director, '')) 
        @@ plainto_tsquery('english', $${paramIndex})
        OR title ILIKE $${paramIndex + 1}
        OR description ILIKE $${paramIndex + 1}
        OR director ILIKE $${paramIndex + 1}
      )`;
      params.push(q.trim(), `%${q.trim()}%`);
      paramIndex += 2;
    }

    // Genre filtering
    if (genres && typeof genres === 'string') {
      const genreList = genres.split(',').map(g => g.trim()).filter(g => g);
      if (genreList.length > 0) {
        query += ` AND genres && $${paramIndex}`;
        params.push(genreList);
        paramIndex++;
      }
    }

    // Year range filtering
    if (yearMin && !isNaN(Number(yearMin))) {
      query += ` AND release_year >= $${paramIndex}`;
      params.push(Number(yearMin));
      paramIndex++;
    }
    if (yearMax && !isNaN(Number(yearMax))) {
      query += ` AND release_year <= $${paramIndex}`;
      params.push(Number(yearMax));
      paramIndex++;
    }

    // Rating range filtering
    if (ratingMin && !isNaN(Number(ratingMin))) {
      query += ` AND rating >= $${paramIndex}`;
      params.push(Number(ratingMin));
      paramIndex++;
    }
    if (ratingMax && !isNaN(Number(ratingMax))) {
      query += ` AND rating <= $${paramIndex}`;
      params.push(Number(ratingMax));
      paramIndex++;
    }

    // Duration range filtering
    if (durationMin && !isNaN(Number(durationMin))) {
      query += ` AND duration >= $${paramIndex}`;
      params.push(Number(durationMin));
      paramIndex++;
    }
    if (durationMax && !isNaN(Number(durationMax))) {
      query += ` AND duration <= $${paramIndex}`;
      params.push(Number(durationMax));
      paramIndex++;
    }

    // Add ordering and pagination
    query += ` ORDER BY 
      CASE WHEN $1 IS NOT NULL THEN 
        ts_rank(to_tsvector('english', title || ' ' || COALESCE(description, '')), plainto_tsquery('english', $1))
      ELSE 0 END DESC,
      rating DESC, 
      release_year DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    
    params.push(Number(limit), Number(offset));

    const result = await pool.query(query, params);
    
    // Get total count for pagination
    let countQuery = 'SELECT COUNT(*) FROM movies WHERE 1=1';
    const countParams: any[] = [];
    let countParamIndex = 1;

    // Apply same filters for count
    if (q && typeof q === 'string' && q.trim()) {
      countQuery += ` AND (
        to_tsvector('english', title || ' ' || COALESCE(description, '') || ' ' || COALESCE(director, '')) 
        @@ plainto_tsquery('english', $${countParamIndex})
        OR title ILIKE $${countParamIndex + 1}
        OR description ILIKE $${countParamIndex + 1}
        OR director ILIKE $${countParamIndex + 1}
      )`;
      countParams.push(q.trim(), `%${q.trim()}%`);
      countParamIndex += 2;
    }

    if (genres && typeof genres === 'string') {
      const genreList = genres.split(',').map(g => g.trim()).filter(g => g);
      if (genreList.length > 0) {
        countQuery += ` AND genres && $${countParamIndex}`;
        countParams.push(genreList);
        countParamIndex++;
      }
    }

    if (yearMin && !isNaN(Number(yearMin))) {
      countQuery += ` AND release_year >= $${countParamIndex}`;
      countParams.push(Number(yearMin));
      countParamIndex++;
    }
    if (yearMax && !isNaN(Number(yearMax))) {
      countQuery += ` AND release_year <= $${countParamIndex}`;
      countParams.push(Number(yearMax));
      countParamIndex++;
    }

    if (ratingMin && !isNaN(Number(ratingMin))) {
      countQuery += ` AND rating >= $${countParamIndex}`;
      countParams.push(Number(ratingMin));
      countParamIndex++;
    }
    if (ratingMax && !isNaN(Number(ratingMax))) {
      countQuery += ` AND rating <= $${countParamIndex}`;
      countParams.push(Number(ratingMax));
      countParamIndex++;
    }

    if (durationMin && !isNaN(Number(durationMin))) {
      countQuery += ` AND duration >= $${countParamIndex}`;
      countParams.push(Number(durationMin));
      countParamIndex++;
    }
    if (durationMax && !isNaN(Number(durationMax))) {
      countQuery += ` AND duration <= $${countParamIndex}`;
      countParams.push(Number(durationMax));
      countParamIndex++;
    }

    const countResult = await pool.query(countQuery, countParams);
    const totalCount = parseInt(countResult.rows[0].count);

    res.json({
      results: result.rows,
      pagination: {
        total: totalCount,
        limit: Number(limit),
        offset: Number(offset),
        hasMore: Number(offset) + Number(limit) < totalCount
      }
    });
  } catch (err) {
    console.error('Error searching movies:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Search suggestions endpoint
app.get('/api/suggestions', async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q || typeof q !== 'string' || q.trim().length < 2) {
      return res.json([]);
    }

    const searchTerm = q.trim();
    
    // Get suggestions from titles, directors, and cast
    const query = `
      SELECT DISTINCT suggestion, type, COUNT(*) as frequency
      FROM (
        SELECT title as suggestion, 'title' as type FROM movies 
        WHERE title ILIKE $1
        UNION ALL
        SELECT director as suggestion, 'director' as type FROM movies 
        WHERE director ILIKE $1 AND director IS NOT NULL
        UNION ALL
        SELECT unnest(cast) as suggestion, 'actor' as type FROM movies 
        WHERE cast IS NOT NULL AND EXISTS (
          SELECT 1 FROM unnest(cast) as actor WHERE actor ILIKE $1
        )
        UNION ALL
        SELECT unnest(genres) as suggestion, 'genre' as type FROM movies 
        WHERE genres IS NOT NULL AND EXISTS (
          SELECT 1 FROM unnest(genres) as genre WHERE genre ILIKE $1
        )
      ) suggestions
      GROUP BY suggestion, type
      ORDER BY frequency DESC, suggestion ASC
      LIMIT 10
    `;

    const result = await pool.query(query, [`%${searchTerm}%`]);
    
    const suggestions = result.rows.map(row => ({
      text: row.suggestion,
      type: row.type,
      frequency: parseInt(row.frequency)
    }));

    res.json(suggestions);
  } catch (err) {
    console.error('Error fetching suggestions:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.post('/api/movies/seed', async (req, res) => {
  try {
    // Execute the seed script
    await pool.query(`
      TRUNCATE TABLE movies;
      INSERT INTO movies (title, description, release_year, rating, image_url) VALUES
      ('The Shawshank Redemption', 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.', 1994, 9.3, 'https://m.media-amazon.com/images/M/MV5BNDE3ODcxYzMtY2YzZC00NmNlLWJiNDMtZDViZWM2MzIxZDYwXkEyXkFqcGdeQXVyNjAwNDUxODI@._V1_.jpg'),
      ('The Godfather', 'The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.', 1972, 9.2, 'https://m.media-amazon.com/images/M/MV5BM2MyNjYxNmUtYTAwNi00MTYxLWJmNWYtYzZlODY3ZTk3OTFlXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg'),
      ('The Dark Knight', 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.', 2008, 9.0, 'https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_.jpg'),
      ('Pulp Fiction', 'The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.', 1994, 8.9, 'https://m.media-amazon.com/images/M/MV5BNGNhMDIzZTUtNTBlZi00MTRlLWFjM2ItYzViMjE3YzI5MjljXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg'),
      ('Fight Club', 'An insomniac office worker and a devil-may-care soapmaker form an underground fight club that evolves into something much, much more.', 1999, 8.8, 'https://m.media-amazon.com/images/M/MV5BNDIzNDU0YzEtYzE5Ni00ZjlkLTk5ZjgtNjM3NWE4YzA3Nzk3XkEyXkFqcGdeQXVyMjUzOTY1NTc@._V1_.jpg')
    `);
    res.json({ message: 'Database seeded successfully' });
  } catch (err) {
    console.error('Error seeding database:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/movies/clear', async (req, res) => {
  try {
    await pool.query('TRUNCATE TABLE movies');
    res.json({ message: 'Database cleared successfully' });
  } catch (err) {
    console.error('Error clearing database:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Catalog service running on port ${port}`);
}); 
