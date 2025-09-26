import { CatalogService } from '../services/catalogService';
import { Movie } from '../utils/movieUtils';

// Create a mock pool
const mockPool = {
  query: jest.fn()
};

describe('CatalogService', () => {
  let catalogService: CatalogService;

  beforeEach(() => {
    catalogService = new CatalogService(mockPool as any);
    jest.clearAllMocks();
  });

  describe('getAllMovies', () => {
    it('should return all movies ordered by rating', async () => {
      const mockMovies: Movie[] = [
        { id: 1, title: 'Movie 1', description: 'Desc 1', release_year: 2020, rating: 9.0, image_url: 'url1' },
        { id: 2, title: 'Movie 2', description: 'Desc 2', release_year: 2021, rating: 8.5, image_url: 'url2' }
      ];

      mockPool.query.mockResolvedValue({ rows: mockMovies });

      const result = await catalogService.getAllMovies();

      expect(mockPool.query).toHaveBeenCalledWith('SELECT * FROM movies ORDER BY rating DESC');
      expect(result).toEqual(mockMovies);
    });

    it('should handle empty result', async () => {
      mockPool.query.mockResolvedValue({ rows: [] });

      const result = await catalogService.getAllMovies();

      expect(result).toEqual([]);
    });
  });

  describe('getMovieById', () => {
    it('should return movie when found', async () => {
      const mockMovie: Movie = {
        id: 1,
        title: 'Test Movie',
        description: 'Test Description',
        release_year: 2020,
        rating: 8.5,
        image_url: 'test-url'
      };

      mockPool.query.mockResolvedValue({ rows: [mockMovie] });

      const result = await catalogService.getMovieById(1);

      expect(mockPool.query).toHaveBeenCalledWith('SELECT * FROM movies WHERE id = $1', [1]);
      expect(result).toEqual(mockMovie);
    });

    it('should return null when movie not found', async () => {
      mockPool.query.mockResolvedValue({ rows: [] });

      const result = await catalogService.getMovieById(999);

      expect(result).toBeNull();
    });
  });

  describe('searchMovies', () => {
    it('should search movies by title and description', async () => {
      const mockMovies: Movie[] = [
        { id: 1, title: 'Dark Knight', description: 'Batman movie', release_year: 2008, rating: 9.0, image_url: 'url1' }
      ];

      mockPool.query.mockResolvedValue({ rows: mockMovies });

      const result = await catalogService.searchMovies('Dark');

      expect(mockPool.query).toHaveBeenCalledWith(
        'SELECT * FROM movies WHERE LOWER(title) LIKE $1 OR LOWER(description) LIKE $1',
        ['%dark%']
      );
      expect(result).toEqual(mockMovies);
    });

    it('should handle empty search results', async () => {
      mockPool.query.mockResolvedValue({ rows: [] });

      const result = await catalogService.searchMovies('nonexistent');

      expect(result).toEqual([]);
    });
  });

  describe('getTopRatedMovies', () => {
    it('should return top rated movies with default limit', async () => {
      const mockMovies: Movie[] = [
        { id: 1, title: 'Movie 1', description: 'Desc 1', release_year: 2020, rating: 9.5, image_url: 'url1' },
        { id: 2, title: 'Movie 2', description: 'Desc 2', release_year: 2021, rating: 9.0, image_url: 'url2' }
      ];

      mockPool.query.mockResolvedValue({ rows: mockMovies });

      const result = await catalogService.getTopRatedMovies();

      expect(mockPool.query).toHaveBeenCalledWith(
        'SELECT * FROM movies ORDER BY rating DESC LIMIT $1',
        [10]
      );
      expect(result).toEqual(mockMovies);
    });

    it('should return top rated movies with custom limit', async () => {
      const mockMovies: Movie[] = [
        { id: 1, title: 'Movie 1', description: 'Desc 1', release_year: 2020, rating: 9.5, image_url: 'url1' }
      ];

      mockPool.query.mockResolvedValue({ rows: mockMovies });

      const result = await catalogService.getTopRatedMovies(5);

      expect(mockPool.query).toHaveBeenCalledWith(
        'SELECT * FROM movies ORDER BY rating DESC LIMIT $1',
        [5]
      );
      expect(result).toEqual(mockMovies);
    });
  });

  describe('getMoviesByYear', () => {
    it('should return movies from specific year', async () => {
      const mockMovies: Movie[] = [
        { id: 1, title: 'Movie 2020', description: 'Desc', release_year: 2020, rating: 8.5, image_url: 'url1' },
        { id: 2, title: 'Another 2020', description: 'Desc', release_year: 2020, rating: 7.5, image_url: 'url2' }
      ];

      mockPool.query.mockResolvedValue({ rows: mockMovies });

      const result = await catalogService.getMoviesByYear(2020);

      expect(mockPool.query).toHaveBeenCalledWith(
        'SELECT * FROM movies WHERE release_year = $1 ORDER BY rating DESC',
        [2020]
      );
      expect(result).toEqual(mockMovies);
    });

    it('should handle year with no movies', async () => {
      mockPool.query.mockResolvedValue({ rows: [] });

      const result = await catalogService.getMoviesByYear(1900);

      expect(result).toEqual([]);
    });
  });
});