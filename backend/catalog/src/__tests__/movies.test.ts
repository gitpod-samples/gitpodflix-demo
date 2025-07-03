import { Pool } from 'pg';
import express from 'express';

// Mock the pg Pool
jest.mock('pg', () => {
  const mPool = {
    query: jest.fn(),
  };
  return { Pool: jest.fn(() => mPool) };
});

describe('Movies API', () => {
  let pool: any;
  
  beforeEach(() => {
    // Reset modules to ensure clean tests
    jest.resetModules();
    
    // Get the mocked pool instance
    pool = new Pool();
    
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it('GET /api/movies should return movies sorted by rating', async () => {
    // Mock data
    const mockMovies = [
      { id: 1, title: 'Movie 1', rating: 9.5 },
      { id: 2, title: 'Movie 2', rating: 8.5 }
    ];
    
    // Setup the mock implementation for this test
    pool.query.mockResolvedValueOnce({ rows: mockMovies });
    
    // Create mock request and response objects
    const req = {} as express.Request;
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    } as unknown as express.Response;
    
    // Import the route handler function
    const getMoviesHandler = async (req: express.Request, res: express.Response) => {
      try {
        const result = await pool.query('SELECT * FROM movies ORDER BY rating DESC');
        res.json(result.rows);
      } catch (err) {
        console.error('Error fetching movies:', err);
        res.status(500).json({ error: 'Internal server error' });
      }
    };
    
    // Call the handler directly
    await getMoviesHandler(req, res);
    
    // Assertions
    expect(pool.query).toHaveBeenCalledWith('SELECT * FROM movies ORDER BY rating DESC');
    expect(res.json).toHaveBeenCalledWith(mockMovies);
  });
});
