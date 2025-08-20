const API_BASE_URL = (window.location.hostname.endsWith('.gitpod.dev') || 
                     window.location.hostname.includes('.flex.doptig.cloud'))
  ? `https://3001--${window.location.hostname.replace(/\d{1,4}--/, '')}/api`
  : 'http://localhost:3001/api';

export const fetchMovies = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/movies`);
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

export const searchMovies = async (query, filters = {}) => {
  try {
    const params = new URLSearchParams();
    
    if (query) {
      params.append('q', query);
    }
    
    if (filters.genres && filters.genres.length > 0) {
      params.append('genres', filters.genres.join(','));
    }
    
    if (filters.yearRange) {
      params.append('yearMin', filters.yearRange.min);
      params.append('yearMax', filters.yearRange.max);
    }
    
    if (filters.ratingRange) {
      params.append('ratingMin', filters.ratingRange.min);
      params.append('ratingMax', filters.ratingRange.max);
    }
    
    if (filters.durationRange) {
      params.append('durationMin', filters.durationRange.min);
      params.append('durationMax', filters.durationRange.max);
    }

    const response = await fetch(`${API_BASE_URL}/search?${params.toString()}`);
    if (!response.ok) {
      throw new Error('Failed to search movies');
    }
    const results = await response.json();
    return results;
  } catch (error) {
    console.error('Error searching movies:', error);
    throw error;
  }
};

export const getSearchSuggestions = async (query) => {
  try {
    if (!query || query.length < 2) {
      return [];
    }

    const response = await fetch(`${API_BASE_URL}/suggestions?q=${encodeURIComponent(query)}`);
    if (!response.ok) {
      throw new Error('Failed to fetch suggestions');
    }
    const suggestions = await response.json();
    return suggestions;
  } catch (error) {
    console.error('Error fetching suggestions:', error);
    return [];
  }
};

// Debounce utility function for search optimization
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};
