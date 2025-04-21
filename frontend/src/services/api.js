const API_BASE_URL = 'http://localhost:3001/api';

export const fetchMovies = async () => {
  try {
    console.log('Fetching movies from:', `${API_BASE_URL}/movies`);
    const response = await fetch(`${API_BASE_URL}/movies`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Response not OK:', response.status, errorText);
      throw new Error(`Failed to fetch movies: ${response.status} ${errorText}`);
    }
    
    const movies = await response.json();
    console.log('Movies fetched successfully:', movies.length);
    return movies;
  } catch (error) {
    console.error('Error fetching movies:', error);
    throw error;
  }
};
