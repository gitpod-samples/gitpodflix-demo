import request from 'supertest';
import { Pool } from 'pg';

// Mock the pg Pool
jest.mock('pg', () => {
  const mPool = {
    query: jest.fn(),
    end: jest.fn(),
    on: jest.fn(),
  };
  return { Pool: jest.fn(() => mPool) };
});

// Set test environment
process.env.NODE_ENV = 'test';

// Import after mocking
import app, { pool } from '../index';

describe('Catalog API', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('GET /api/movies', () => {
    it('should return movies from the database', async () => {
      // Mock the database response
      const mockMovies = [
        { id: 1, title: 'Test Movie 1', rating: 9.0 },
        { id: 2, title: 'Test Movie 2', rating: 8.5 }
      ];
      
      (pool.query as jest.Mock).mockResolvedValueOnce({ rows: mockMovies });
      
      // Make a request to the endpoint
      const response = await request(app)
        .get('/api/movies')
        .expect('Content-Type', /json/)
        .expect(200);
      
      // Verify the response
      expect(response.body).toEqual(mockMovies);
      
      // Verify that the correct query was executed
      expect(pool.query).toHaveBeenCalledWith('SELECT * FROM movies ORDER BY rating DESC');
    });

    it('should return 500 when database query fails', async () => {
      // Mock a database error
      const dbError = new Error('Database connection failed');
      (pool.query as jest.Mock).mockRejectedValueOnce(dbError);
      
      // Make a request to the endpoint
      const response = await request(app)
        .get('/api/movies')
        .expect('Content-Type', /json/)
        .expect(500);
      
      // Verify the error response
      expect(response.body).toEqual({ error: 'Internal server error' });
    });
  });
});
