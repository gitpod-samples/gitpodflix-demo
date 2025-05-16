const API_BASE_URL = window.location.hostname.endsWith('.gitpod.dev')
  ? `https://3001--${window.location.hostname.replace(/\d{1,4}--/, '')}/api`
  : 'http://localhost:3001/api';

export const fetchMovies = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/movies/`);
    if (!response.ok) {
      throw new Error('Failed to fetch movies');
    }
    const movies = await response.json();
    return movies;
  } catch (error) {
    console.error('Error fetching movies:', error);
    throw error;
  }
};
