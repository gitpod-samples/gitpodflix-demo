const API_TIMEOUT = import.meta.env.VITE_API_TIMEOUT || 10000;

const getApiBaseUrl = () => {
  // Use environment variable if available
  if (import.meta.env.VITE_API_BASE_URL) {
    return `${import.meta.env.VITE_API_BASE_URL}/api`;
  }
  
  // Fallback to dynamic detection for Gitpod
  if (window.location.hostname.endsWith('.gitpod.dev')) {
    return `https://3001--${window.location.hostname.replace(/\d{1,4}--/, '')}/api`;
  }
  
  // Default for local development
  return 'http://localhost:3001/api';
};

const API_BASE_URL = getApiBaseUrl();

const fetchWithTimeout = async (url, options = {}) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error('Request timeout');
    }
    throw error;
  }
};

export const fetchMovies = async () => {
  try {
    const response = await fetchWithTimeout(`${API_BASE_URL}/movies`);
    if (!response.ok) {
      throw new Error(`Failed to fetch movies: ${response.status} ${response.statusText}`);
    }
    const movies = await response.json();
    return movies;
  } catch (error) {
    console.error('Error fetching movies:', error);
    throw error;
  }
};
