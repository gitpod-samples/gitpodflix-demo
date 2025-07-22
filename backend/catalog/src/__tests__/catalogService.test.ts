import { Pool } from 'pg';
import { CatalogService } from '../services/catalogService';
import { Movie } from '../utils/movieUtils';

describe('CatalogService', () => {
  let catalogService: CatalogService;
  let mockPool: jest.Mocked<Pool>;

  beforeEach(() => {
    mockPool = {
      query: jest.fn()
    } as any;
    catalogService = new CatalogService(mockPool);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const mockMovies: Movie[] = [
    {
      id: 1,
      title: 'The Dark Knight',
      description: 'Batman fights crime',
      release_year: 2008,
      rating: 9.0,
      image_url: 'https://example.com/dark-knight.jpg'
    },
    {
      id: 2,
      title: 'Pulp Fiction',
      description: 'Tarantino masterpiece',
      release_year: 1994,
      rating: 8.9,
      image_url: 'https://example.com/pulp-fiction.jpg'
    }
  ];

    describe('getAllMovies', () => {
    it('should return all movies ordered by rating DESC', async () => {
      (mockPool.query as jest.Mock).mockResolvedValue({ rows: mockMovies });

      const result = await catalogService.getAllMovies();

      expect(mockPool.query).toHaveBeenCalledWith('SELECT * FROM movies ORDER BY rating DESC');
      expect(result).toEqual(mockMovies);
    });

    it('should return empty array when no movies found', async () => {
      (mockPool.query as jest.Mock).mockResolvedValue({ rows: [] });

      const result = await catalogService.getAllMovies();

      expect(result).toEqual([]);
    });
  });

  describe('getMovieById', () => {
    it('should return movie when found', async () => {
      (mockPool.query as jest.Mock).mockResolvedValue({ rows: [mockMovies[0]] });

      const result = await catalogService.getMovieById(1);

      expect(mockPool.query).toHaveBeenCalledWith('SELECT * FROM movies WHERE id = $1', [1]);
      expect(result).toEqual(mockMovies[0]);
    });

    it('should return null when movie not found', async () => {
      (mockPool.query as jest.Mock).mockResolvedValue({ rows: [] });

      const result = await catalogService.getMovieById(999);

      expect(mockPool.query).toHaveBeenCalledWith('SELECT * FROM movies WHERE id = $1', [999]);
      expect(result).toBeNull();
    });
  });

  describe('searchMovies', () => {
    it('should search movies by title and description', async () => {
      const searchQuery = 'dark';
      (mockPool.query as jest.Mock).mockResolvedValue({ rows: [mockMovies[0]] });

      const result = await catalogService.searchMovies(searchQuery);

      expect(mockPool.query).toHaveBeenCalledWith(
        'SELECT * FROM movies WHERE LOWER(title) LIKE $1 OR LOWER(description) LIKE $1',
        ['%dark%']
      );
      expect(result).toEqual([mockMovies[0]]);
    });

    it('should handle empty search results', async () => {
      (mockPool.query as jest.Mock).mockResolvedValue({ rows: [] });

      const result = await catalogService.searchMovies('nonexistent');

      expect(result).toEqual([]);
    });

    it('should convert search query to lowercase with wildcards', async () => {
      const searchQuery = 'BATMAN';
      (mockPool.query as jest.Mock).mockResolvedValue({ rows: [] });

      await catalogService.searchMovies(searchQuery);

      expect(mockPool.query).toHaveBeenCalledWith(
        'SELECT * FROM movies WHERE LOWER(title) LIKE $1 OR LOWER(description) LIKE $1',
        ['%batman%']
      );
    });
  });

  describe('getTopRatedMovies', () => {
    it('should return top rated movies with default limit', async () => {
      (mockPool.query as jest.Mock).mockResolvedValue({ rows: mockMovies });

      const result = await catalogService.getTopRatedMovies();

      expect(mockPool.query).toHaveBeenCalledWith(
        'SELECT * FROM movies ORDER BY rating DESC LIMIT $1',
        [10]
      );
      expect(result).toEqual(mockMovies);
    });

    it('should return top rated movies with custom limit', async () => {
      (mockPool.query as jest.Mock).mockResolvedValue({ rows: [mockMovies[0]] });

      const result = await catalogService.getTopRatedMovies(5);

      expect(mockPool.query).toHaveBeenCalledWith(
        'SELECT * FROM movies ORDER BY rating DESC LIMIT $1',
        [5]
      );
      expect(result).toEqual([mockMovies[0]]);
    });

    it('should handle empty results', async () => {
      (mockPool.query as jest.Mock).mockResolvedValue({ rows: [] });

      const result = await catalogService.getTopRatedMovies(5);

      expect(result).toEqual([]);
    });
  });

  describe('getMoviesByYear', () => {
    it('should return movies from specific year', async () => {
      const year = 2008;
      (mockPool.query as jest.Mock).mockResolvedValue({ rows: [mockMovies[0]] });

      const result = await catalogService.getMoviesByYear(year);

      expect(mockPool.query).toHaveBeenCalledWith(
        'SELECT * FROM movies WHERE release_year = $1 ORDER BY rating DESC',
        [year]
      );
      expect(result).toEqual([mockMovies[0]]);
    });

    it('should return empty array when no movies found for year', async () => {
      (mockPool.query as jest.Mock).mockResolvedValue({ rows: [] });

      const result = await catalogService.getMoviesByYear(1900);

      expect(result).toEqual([]);
    });
  });

  describe('error handling', () => {
    it('should propagate database errors', async () => {
      const dbError = new Error('Database connection failed');
      (mockPool.query as jest.Mock).mockRejectedValue(dbError);

      await expect(catalogService.getAllMovies()).rejects.toThrow('Database connection failed');
    });

    it('should propagate errors in getMovieById', async () => {
      const dbError = new Error('Query failed');
      (mockPool.query as jest.Mock).mockRejectedValue(dbError);

      await expect(catalogService.getMovieById(1)).rejects.toThrow('Query failed');
    });

    it('should propagate errors in searchMovies', async () => {
      const dbError = new Error('Search failed');
      (mockPool.query as jest.Mock).mockRejectedValue(dbError);

      await expect(catalogService.searchMovies('test')).rejects.toThrow('Search failed');
    });

    it('should propagate errors in getTopRatedMovies', async () => {
      const dbError = new Error('Top rated query failed');
      (mockPool.query as jest.Mock).mockRejectedValue(dbError);

      await expect(catalogService.getTopRatedMovies()).rejects.toThrow('Top rated query failed');
    });

    it('should propagate errors in getMoviesByYear', async () => {
      const dbError = new Error('Year query failed');
      (mockPool.query as jest.Mock).mockRejectedValue(dbError);

      await expect(catalogService.getMoviesByYear(2020)).rejects.toThrow('Year query failed');
    });
  });
});
