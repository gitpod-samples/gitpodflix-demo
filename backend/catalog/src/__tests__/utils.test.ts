import { 
  formatMovieTitle, 
  calculateAverageRating, 
  validateMovie, 
  isValidUrl, 
  filterMoviesByDecade,
  Movie 
} from '../utils/movieUtils';

describe('Movie Utilities', () => {
  describe('formatMovieTitle', () => {
    it('should format title with proper capitalization', () => {
      expect(formatMovieTitle('the dark knight')).toBe('The Dark Knight');
      expect(formatMovieTitle('PULP FICTION')).toBe('Pulp Fiction');
      expect(formatMovieTitle('fight club')).toBe('Fight Club');
    });

    it('should handle empty strings', () => {
      expect(formatMovieTitle('')).toBe('');
    });

    it('should handle single words', () => {
      expect(formatMovieTitle('matrix')).toBe('Matrix');
      expect(formatMovieTitle('MATRIX')).toBe('Matrix');
    });
  });

  describe('calculateAverageRating', () => {
    it('should calculate correct average rating', () => {
      const movies = [
        { title: 'Movie 1', description: 'Desc 1', release_year: 2000, rating: 8.0, image_url: 'url1' },
        { title: 'Movie 2', description: 'Desc 2', release_year: 2001, rating: 9.0, image_url: 'url2' },
        { title: 'Movie 3', description: 'Desc 3', release_year: 2002, rating: 7.0, image_url: 'url3' }
      ];

      expect(calculateAverageRating(movies)).toBe(8.0);
    });

    it('should return 0 for empty array', () => {
      expect(calculateAverageRating([])).toBe(0);
    });

    it('should handle single movie', () => {
      const movies = [
        { title: 'Solo Movie', description: 'Desc', release_year: 2000, rating: 7.5, image_url: 'url' }
      ];

      expect(calculateAverageRating(movies)).toBe(7.5);
    });
  });

  describe('validateMovie', () => {
    const validMovie: Partial<Movie> = {
      title: 'Test Movie',
      description: 'A test movie description',
      release_year: 2020,
      rating: 8.5,
      image_url: 'https://example.com/image.jpg'
    };

    it('should return empty array for valid movie', () => {
      expect(validateMovie(validMovie)).toEqual([]);
    });

    it('should return error for missing title', () => {
      const movie = { ...validMovie, title: '' };
      expect(validateMovie(movie)).toContain('Title is required');
    });

    it('should return error for missing description', () => {
      const movie = { ...validMovie, description: '' };
      expect(validateMovie(movie)).toContain('Description is required');
    });

    it('should return error for invalid release year', () => {
      const movie = { ...validMovie, release_year: 1800 };
      expect(validateMovie(movie)).toContain('Release year must be between 1900 and current year');
    });

    it('should return error for future release year', () => {
      const movie = { ...validMovie, release_year: new Date().getFullYear() + 1 };
      expect(validateMovie(movie)).toContain('Release year must be between 1900 and current year');
    });

    it('should return error for invalid rating', () => {
      const movie = { ...validMovie, rating: 15 };
      expect(validateMovie(movie)).toContain('Rating must be between 0 and 10');
    });

    it('should return error for negative rating', () => {
      const movie = { ...validMovie, rating: -1 };
      expect(validateMovie(movie)).toContain('Rating must be between 0 and 10');
    });

    it('should return error for invalid image URL', () => {
      const movie = { ...validMovie, image_url: 'not-a-url' };
      expect(validateMovie(movie)).toContain('Valid image URL is required');
    });

    it('should return multiple errors for multiple invalid fields', () => {
      const movie = {
        title: '',
        description: '',
        release_year: 1800,
        rating: 15,
        image_url: 'invalid'
      };
      const errors = validateMovie(movie);
      expect(errors).toHaveLength(5);
    });
  });

  describe('isValidUrl', () => {
    it('should return true for valid URLs', () => {
      expect(isValidUrl('https://example.com')).toBe(true);
      expect(isValidUrl('http://example.com')).toBe(true);
      expect(isValidUrl('https://example.com/path/to/image.jpg')).toBe(true);
    });

    it('should return false for invalid URLs', () => {
      expect(isValidUrl('not-a-url')).toBe(false);
      expect(isValidUrl('')).toBe(false);
      expect(isValidUrl('example.com')).toBe(false);
    });
  });

  describe('filterMoviesByDecade', () => {
    const movies: Movie[] = [
      { title: 'Movie 1980', description: 'Desc', release_year: 1985, rating: 8.0, image_url: 'url1' },
      { title: 'Movie 1990', description: 'Desc', release_year: 1995, rating: 7.5, image_url: 'url2' },
      { title: 'Movie 2000', description: 'Desc', release_year: 2005, rating: 9.0, image_url: 'url3' },
      { title: 'Movie 2010', description: 'Desc', release_year: 2015, rating: 8.5, image_url: 'url4' }
    ];

    it('should filter movies by decade correctly', () => {
      const result = filterMoviesByDecade(movies, 1990);
      expect(result).toHaveLength(1);
      expect(result[0].title).toBe('Movie 1990');
    });

    it('should return empty array for decade with no movies', () => {
      const result = filterMoviesByDecade(movies, 1970);
      expect(result).toHaveLength(0);
    });

    it('should include movies at decade boundaries', () => {
      const result = filterMoviesByDecade(movies, 1980);
      expect(result).toHaveLength(1);
      expect(result[0].release_year).toBe(1985);
    });
  });
});
