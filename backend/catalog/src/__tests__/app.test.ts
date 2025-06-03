import request from 'supertest';
import { createApp } from '../app';

describe('Catalog API', () => {
  let app: any;
  let mockPool: any;

  beforeEach(() => {
    // Create a mock pool instance
    mockPool = {
      query: jest.fn(),
      end: jest.fn(),
    };

    // Create app with mocked pool
    app = createApp(mockPool);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/movies', () => {
    it('should return movies ordered by rating', async () => {
      const mockMovies = [
        { id: 1, title: 'Movie 1', rating: 9.0 },
        { id: 2, title: 'Movie 2', rating: 8.5 },
      ];

      mockPool.query.mockResolvedValue({ rows: mockMovies });

      const response = await request(app)
        .get('/api/movies')
        .expect(200);

      expect(response.body).toEqual(mockMovies);
      expect(mockPool.query).toHaveBeenCalledWith('SELECT * FROM movies ORDER BY rating DESC');
    });

    it('should handle database errors', async () => {
      mockPool.query.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .get('/api/movies')
        .expect(500);

      expect(response.body).toEqual({ error: 'Internal server error' });
    });
  });

  describe('POST /api/movies/seed', () => {
    it('should seed the database successfully', async () => {
      mockPool.query.mockResolvedValue({});

      const response = await request(app)
        .post('/api/movies/seed')
        .expect(200);

      expect(response.body).toEqual({ message: 'Database seeded successfully' });
      expect(mockPool.query).toHaveBeenCalledWith(expect.stringContaining('TRUNCATE TABLE movies'));
    });

    it('should handle seeding errors', async () => {
      mockPool.query.mockRejectedValue(new Error('Seeding error'));

      const response = await request(app)
        .post('/api/movies/seed')
        .expect(500);

      expect(response.body).toEqual({ error: 'Internal server error' });
    });
  });

  describe('POST /api/movies/clear', () => {
    it('should clear the database successfully', async () => {
      mockPool.query.mockResolvedValue({});

      const response = await request(app)
        .post('/api/movies/clear')
        .expect(200);

      expect(response.body).toEqual({ message: 'Database cleared successfully' });
      expect(mockPool.query).toHaveBeenCalledWith('TRUNCATE TABLE movies');
    });

    it('should handle clearing errors', async () => {
      mockPool.query.mockRejectedValue(new Error('Clearing error'));

      const response = await request(app)
        .post('/api/movies/clear')
        .expect(500);

      expect(response.body).toEqual({ error: 'Internal server error' });
    });
  });
});
