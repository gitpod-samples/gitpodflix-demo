import request from 'supertest';
import express from 'express';
import cors from 'cors';
import { Pool } from 'pg';

// Mock pg Pool
const mockQuery = jest.fn();
jest.mock('pg', () => ({
  Pool: jest.fn().mockImplementation(() => ({
    query: mockQuery
  }))
}));

// Create a test app with the same routes as index.ts
const createTestApp = () => {
  const app = express();
  const pool = new Pool();

  app.use(cors());
  app.use(express.json());

  // Health check endpoint
  app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
  });

  // Movies endpoint
  app.get('/api/movies', async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM movies ORDER BY rating DESC');
      res.json(result.rows);
    } catch (err) {
      console.error('Error fetching movies:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Search endpoint (simplified version)
  app.get('/api/search', async (req, res) => {
    try {
      const { q } = req.query;
      let query = 'SELECT * FROM movies WHERE 1=1';
      const params: any[] = [];

      if (q && typeof q === 'string' && q.trim()) {
        query += ` AND (title ILIKE $1 OR description ILIKE $1)`;
        params.push(`%${q.trim()}%`);
      }

      query += ' ORDER BY rating DESC LIMIT 50';
      const result = await pool.query(query, params);
      
      res.json({
        results: result.rows,
        pagination: {
          total: result.rows.length,
          limit: 50,
          offset: 0,
          hasMore: false
        }
      });
    } catch (err) {
      console.error('Error searching movies:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Suggestions endpoint
  app.get('/api/suggestions', async (req, res) => {
    try {
      const { q } = req.query;
      
      if (!q || typeof q !== 'string' || q.trim().length < 2) {
        return res.json([]);
      }

      const result = await pool.query(
        'SELECT title as suggestion FROM movies WHERE title ILIKE $1 LIMIT 5',
        [`%${q.trim()}%`]
      );
      
      res.json(result.rows.map(row => ({ text: row.suggestion, type: 'title' })));
    } catch (err) {
      console.error('Error fetching suggestions:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  return app;
};

describe('API Routes', () => {
  let app: express.Application;

  beforeEach(() => {
    app = createTestApp();
    jest.clearAllMocks();
  });

  describe('GET /health', () => {
    it('should return health status', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body).toHaveProperty('status', 'OK');
      expect(response.body).toHaveProperty('timestamp');
    });
  });

  describe('GET /api/movies', () => {
    it('should return movies successfully', async () => {
      const mockMovies = [
        { id: 1, title: 'Test Movie', rating: 8.5 },
        { id: 2, title: 'Another Movie', rating: 7.2 }
      ];

      mockQuery.mockResolvedValueOnce({ rows: mockMovies });

      const response = await request(app)
        .get('/api/movies')
        .expect(200);

      expect(response.body).toEqual(mockMovies);
      expect(mockQuery).toHaveBeenCalledWith('SELECT * FROM movies ORDER BY rating DESC');
    });

    it('should handle database errors', async () => {
      mockQuery.mockRejectedValueOnce(new Error('Database error'));

      const response = await request(app)
        .get('/api/movies')
        .expect(500);

      expect(response.body).toEqual({ error: 'Internal server error' });
    });
  });

  describe('GET /api/search', () => {
    it('should search movies with query', async () => {
      const mockResults = [
        { id: 1, title: 'Batman', rating: 8.5 }
      ];

      mockQuery.mockResolvedValueOnce({ rows: mockResults });

      const response = await request(app)
        .get('/api/search?q=Batman')
        .expect(200);

      expect(response.body.results).toEqual(mockResults);
      expect(response.body.pagination).toBeDefined();
      expect(mockQuery).toHaveBeenCalledWith(
        'SELECT * FROM movies WHERE 1=1 AND (title ILIKE $1 OR description ILIKE $1) ORDER BY rating DESC LIMIT 50',
        ['%Batman%']
      );
    });

    it('should search without query', async () => {
      const mockResults = [
        { id: 1, title: 'Movie 1', rating: 8.5 },
        { id: 2, title: 'Movie 2', rating: 7.2 }
      ];

      mockQuery.mockResolvedValueOnce({ rows: mockResults });

      const response = await request(app)
        .get('/api/search')
        .expect(200);

      expect(response.body.results).toEqual(mockResults);
      expect(mockQuery).toHaveBeenCalledWith(
        'SELECT * FROM movies WHERE 1=1 ORDER BY rating DESC LIMIT 50',
        []
      );
    });

    it('should handle search errors', async () => {
      mockQuery.mockRejectedValueOnce(new Error('Search error'));

      const response = await request(app)
        .get('/api/search?q=Batman')
        .expect(500);

      expect(response.body).toEqual({ error: 'Internal server error' });
    });
  });

  describe('GET /api/suggestions', () => {
    it('should return suggestions for valid query', async () => {
      const mockSuggestions = [
        { suggestion: 'Batman' },
        { suggestion: 'Batman Begins' }
      ];

      mockQuery.mockResolvedValueOnce({ rows: mockSuggestions });

      const response = await request(app)
        .get('/api/suggestions?q=Bat')
        .expect(200);

      expect(response.body).toEqual([
        { text: 'Batman', type: 'title' },
        { text: 'Batman Begins', type: 'title' }
      ]);
    });

    it('should return empty array for short query', async () => {
      const response = await request(app)
        .get('/api/suggestions?q=B')
        .expect(200);

      expect(response.body).toEqual([]);
      expect(mockQuery).not.toHaveBeenCalled();
    });

    it('should return empty array for empty query', async () => {
      const response = await request(app)
        .get('/api/suggestions')
        .expect(200);

      expect(response.body).toEqual([]);
      expect(mockQuery).not.toHaveBeenCalled();
    });

    it('should handle suggestions errors', async () => {
      mockQuery.mockRejectedValueOnce(new Error('Suggestions error'));

      const response = await request(app)
        .get('/api/suggestions?q=Batman')
        .expect(500);

      expect(response.body).toEqual({ error: 'Internal server error' });
    });
  });
});