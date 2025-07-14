import { formatMovieTitle, calculateAverageRating } from '../utils/movieUtils';

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
});
