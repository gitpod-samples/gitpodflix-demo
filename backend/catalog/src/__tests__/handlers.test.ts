import { Request, Response } from 'express';
import { Pool } from 'pg';
import { getMovies, seedMovies, clearMovies } from '../handlers';

// Mock the pg Pool
jest.mock('pg', () => {
  const mPool = {
    query: jest.fn(),
  };
  return { Pool: jest.fn(() => mPool) };
});

describe('API Handlers', () => {
  let pool: any;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  
  beforeEach(() => {
    // Get the mocked pool instance
    pool = new Pool();
    
    // Setup mock request and response
    mockRequest = {};
    mockResponse = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    };
    
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('getMovies', () => {
    it('should return movies sorted by rating', async () => {
      // Mock data
      const mockMovies = [
        { id: 1, title: 'Movie 1', rating: 9.5 },
        { id: 2, title: 'Movie 2', rating: 8.5 }
      ];
      
      // Setup the mock implementation for this test
      pool.query.mockResolvedValueOnce({ rows: mockMovies });
      
      // Call the handler
      await getMovies(mockRequest as Request, mockResponse as Response);
      
      // Assertions
      expect(pool.query).toHaveBeenCalledWith('SELECT * FROM movies ORDER BY rating DESC');
      expect(mockResponse.json).toHaveBeenCalledWith(mockMovies);
    });
    
    it('should handle database errors', async () => {
      // Setup the mock implementation to throw an error
      const dbError = new Error('Database connection failed');
      pool.query.mockRejectedValueOnce(dbError);
      
      // Spy on console.error
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      
      // Call the handler
      await getMovies(mockRequest as Request, mockResponse as Response);
      
      // Assertions
      expect(pool.query).toHaveBeenCalledWith('SELECT * FROM movies ORDER BY rating DESC');
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error fetching movies:', dbError);
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Internal server error' });
      
      // Restore console.error
      consoleErrorSpy.mockRestore();
    });
  });

  describe('seedMovies', () => {
    it('should seed the database with movies', async () => {
      // Setup the mock implementation for this test
      pool.query.mockResolvedValueOnce({});
      
      // Call the handler
      await seedMovies(mockRequest as Request, mockResponse as Response);
      
      // Assertions
      expect(pool.query).toHaveBeenCalledWith(expect.stringContaining('TRUNCATE TABLE movies'));
      expect(pool.query).toHaveBeenCalledWith(expect.stringContaining('INSERT INTO movies'));
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Database seeded successfully' });
    });
    
    it('should handle database errors', async () => {
      // Setup the mock implementation to throw an error
      const dbError = new Error('Database connection failed');
      pool.query.mockRejectedValueOnce(dbError);
      
      // Spy on console.error
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      
      // Call the handler
      await seedMovies(mockRequest as Request, mockResponse as Response);
      
      // Assertions
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error seeding database:', dbError);
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Internal server error' });
      
      // Restore console.error
      consoleErrorSpy.mockRestore();
    });
  });

  describe('clearMovies', () => {
    it('should clear all movies from the database', async () => {
      // Setup the mock implementation for this test
      pool.query.mockResolvedValueOnce({});
      
      // Call the handler
      await clearMovies(mockRequest as Request, mockResponse as Response);
      
      // Assertions
      expect(pool.query).toHaveBeenCalledWith('TRUNCATE TABLE movies');
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Database cleared successfully' });
    });
    
    it('should handle database errors', async () => {
      // Setup the mock implementation to throw an error
      const dbError = new Error('Database connection failed');
      pool.query.mockRejectedValueOnce(dbError);
      
      // Spy on console.error
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      
      // Call the handler
      await clearMovies(mockRequest as Request, mockResponse as Response);
      
      // Assertions
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error clearing database:', dbError);
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Internal server error' });
      
      // Restore console.error
      consoleErrorSpy.mockRestore();
    });
  });
});
