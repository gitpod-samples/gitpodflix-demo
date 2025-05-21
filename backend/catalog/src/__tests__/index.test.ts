import express from 'express';
import { Pool } from 'pg';
import request from 'supertest';

// Mock the pg Pool
jest.mock('pg', () => {
  const mPool = {
    query: jest.fn(),
    end: jest.fn(),
    on: jest.fn(),
  };
  return { Pool: jest.fn(() => mPool) };
});

// Mock dotenv
jest.mock('dotenv', () => ({
  config: jest.fn(),
}));

describe('Catalog API', () => {
  let app: express.Application;
  let mockPool: any;

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    
    // Reset modules to get a fresh instance of the app
    jest.resetModules();
    
    // Import the app
    const indexModule = require('../index');
    app = indexModule.default;
    
    // Get the mocked pool instance
    mockPool = require('pg').Pool();
  });

  describe('GET /api/movies', () => {
    it('should return movies successfully', async () => {
      // Mock the query response
      const mockMovies = [
        { id: 1, title: 'Test Movie 1', rating: 9.5 },
        { id: 2, title: 'Test Movie 2', rating: 8.5 }
      ];
      
      mockPool.query.mockResolvedValueOnce({ rows: mockMovies });

      // Make the request
      const response = await request(app).get('/api/movies');
      
      // Assertions
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockMovies);
      expect(mockPool.query).toHaveBeenCalledWith('SELECT * FROM movies ORDER BY rating DESC');
    });

    it('should handle database errors', async () => {
      // Mock a database error
      mockPool.query.mockRejectedValueOnce(new Error('Database error'));

      // Make the request
      const response = await request(app).get('/api/movies');
      
      // Assertions
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Internal server error' });
    });
  });

  describe('POST /api/movies/seed', () => {
    it('should seed the database successfully', async () => {
      // Mock successful query execution
      mockPool.query.mockResolvedValueOnce({});
      
      // Make the request
      const response = await request(app).post('/api/movies/seed');
      
      // Assertions
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: 'Database seeded successfully' });
      expect(mockPool.query).toHaveBeenCalledTimes(1);
      expect(mockPool.query.mock.calls[0][0]).toContain('TRUNCATE TABLE movies');
      expect(mockPool.query.mock.calls[0][0]).toContain('INSERT INTO movies');
    });
    
    it('should handle database errors when seeding', async () => {
      // Mock a database error
      mockPool.query.mockRejectedValueOnce(new Error('Database error'));
      
      // Make the request
      const response = await request(app).post('/api/movies/seed');
      
      // Assertions
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Internal server error' });
    });
  });

  describe('POST /api/movies/clear', () => {
    it('should clear the database successfully', async () => {
      // Mock successful query execution
      mockPool.query.mockResolvedValueOnce({});
      
      // Make the request
      const response = await request(app).post('/api/movies/clear');
      
      // Assertions
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: 'Database cleared successfully' });
      expect(mockPool.query).toHaveBeenCalledWith('TRUNCATE TABLE movies');
    });
    
    it('should handle database errors when clearing', async () => {
      // Mock a database error
      mockPool.query.mockRejectedValueOnce(new Error('Database error'));
      
      // Make the request
      const response = await request(app).post('/api/movies/clear');
      
      // Assertions
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Internal server error' });
    });
  });

  describe('Database configuration', () => {
    it('should use environment variables for database configuration when available', () => {
      // Set environment variables
      process.env.DB_USER = 'testuser';
      process.env.DB_HOST = 'testhost';
      process.env.DB_NAME = 'testdb';
      process.env.DB_PASSWORD = 'testpass';
      process.env.DB_PORT = '5433';
      process.env.PORT = '3002';
      
      // Reset modules to get a fresh instance with new env vars
      jest.resetModules();
      
      // Re-import the Pool constructor to check it was called with correct params
      const Pool = require('pg').Pool;
      
      // Import the app again
      require('../index');
      
      // Check that Pool was constructed with the correct parameters
      expect(Pool).toHaveBeenCalledWith({
        user: 'testuser',
        host: 'testhost',
        database: 'testdb',
        password: 'testpass',
        port: 5433
      });
      
      // Clean up environment variables
      delete process.env.DB_USER;
      delete process.env.DB_HOST;
      delete process.env.DB_NAME;
      delete process.env.DB_PASSWORD;
      delete process.env.DB_PORT;
      delete process.env.PORT;
    });
  });
});
