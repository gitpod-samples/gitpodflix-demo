export interface Movie {
  id?: number;
  title: string;
  description: string;
  release_year: number;
  rating: number;
  image_url: string;
}

export function validateMovie(movie: Partial<Movie>): string[] {
  const errors: string[] = [];
  
  if (!movie.title || movie.title.trim().length === 0) {
    errors.push('Title is required');
  }
  
  if (!movie.description || movie.description.trim().length === 0) {
    errors.push('Description is required');
  }
  
  if (!movie.release_year || movie.release_year < 1900 || movie.release_year > new Date().getFullYear()) {
    errors.push('Release year must be between 1900 and current year');
  }
  
  if (!movie.rating || movie.rating < 0 || movie.rating > 10) {
    errors.push('Rating must be between 0 and 10');
  }
  
  if (!movie.image_url || !isValidUrl(movie.image_url)) {
    errors.push('Valid image URL is required');
  }
  
  return errors;
}

export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function formatMovieTitle(title: string): string {
  return title
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

export function calculateAverageRating(movies: Movie[]): number {
  if (movies.length === 0) return 0;
  
  const sum = movies.reduce((acc, movie) => acc + movie.rating, 0);
  return Math.round((sum / movies.length) * 10) / 10;
}

export function filterMoviesByDecade(movies: Movie[], decade: number): Movie[] {
  const startYear = decade;
  const endYear = decade + 9;
  
  return movies.filter(movie => 
    movie.release_year >= startYear && movie.release_year <= endYear
  );
}
