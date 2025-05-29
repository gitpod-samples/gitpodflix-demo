const API_BASE_URL = 'http://localhost:3001/api';

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

export const fetchGameState = async (gameId) => {
  const response = await fetch(`${API_BASE_URL}/game/${gameId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch game state');
  }
  return response.json();
};

export const fetchGameHistory = async () => {
  const response = await fetch(`${API_BASE_URL}/games`);
  if (!response.ok) {
    throw new Error('Failed to fetch game history');
  }
  return response.json();
};

export const submitGuess = async (gameId, playerName, x, y, isHit) => {
  const response = await fetch(`${API_BASE_URL}/game/guess`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      gameId,
      playerName,
      x,
      y,
      isHit,
    }),
  });
  if (!response.ok) {
    throw new Error('Failed to submit guess');
  }
  return response.json();
};
