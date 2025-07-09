import request from 'supertest';
import { Pool } from 'pg';

const mockQuery = jest.fn();
jest.mock('pg', () => ({
  Pool: jest.fn().mockImplementation(() => ({
    query: mockQuery,
  })),
}));

jest.mock('dotenv', () => ({
  config: jest.fn(),
}));

import app from './index';

describe('Catalog Service API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/movies', () => {
    it('should return movies successfully', async () => {
      const mockMovies = [
        { id: 1, title: 'Test Movie', rating: 8.5 },
        { id: 2, title: 'Another Movie', rating: 7.8 },
      ];

      mockQuery.mockResolvedValue({ rows: mockMovies });

      const response = await request(app)
        .get('/api/movies')
        .expect(200);

      expect(response.body).toEqual(mockMovies);
      expect(mockQuery).toHaveBeenCalledWith('SELECT * FROM movies ORDER BY rating DESC');
    });

    it('should return empty array when no movies found', async () => {
      mockQuery.mockResolvedValue({ rows: [] });

      const response = await request(app)
        .get('/api/movies')
        .expect(200);

      expect(response.body).toEqual([]);
    });

    it('should handle database errors', async () => {
      mockQuery.mockRejectedValue(new Error('Database connection failed'));

      const response = await request(app)
        .get('/api/movies')
        .expect(500);

      expect(response.body).toEqual({ error: 'Internal server error' });
    });
  });

  describe('POST /api/movies/seed', () => {
    it('should seed database successfully', async () => {
      mockQuery.mockResolvedValue({});

      const response = await request(app)
        .post('/api/movies/seed')
        .expect(200);

      expect(response.body).toEqual({ message: 'Database seeded successfully' });
      expect(mockQuery).toHaveBeenCalledWith(expect.stringContaining('TRUNCATE TABLE movies'));
    });

    it('should handle seeding errors', async () => {
      mockQuery.mockRejectedValue(new Error('Seeding failed'));

      const response = await request(app)
        .post('/api/movies/seed')
        .expect(500);

      expect(response.body).toEqual({ error: 'Internal server error' });
    });
  });

  describe('POST /api/movies/clear', () => {
    it('should clear database successfully', async () => {
      mockQuery.mockResolvedValue({});

      const response = await request(app)
        .post('/api/movies/clear')
        .expect(200);

      expect(response.body).toEqual({ message: 'Database cleared successfully' });
      expect(mockQuery).toHaveBeenCalledWith('TRUNCATE TABLE movies');
    });

    it('should handle clearing errors', async () => {
      mockQuery.mockRejectedValue(new Error('Clearing failed'));

      const response = await request(app)
        .post('/api/movies/clear')
        .expect(500);

      expect(response.body).toEqual({ error: 'Internal server error' });
    });
  });

  describe('Middleware', () => {
    it('should handle CORS middleware', async () => {
      const response = await request(app)
        .options('/api/movies')
        .expect(204);

      expect(response.headers['access-control-allow-origin']).toBe('*');
    });

    it('should handle invalid routes', async () => {
      const response = await request(app)
        .get('/api/invalid')
        .expect(404);
    });
  });
});
