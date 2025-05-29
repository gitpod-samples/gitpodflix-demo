import React, { useState, useEffect } from 'react';
import { fetchAllScores, fetchGameScores } from '../services/api';

function Leaderboard({ currentGameState }) {
  const [scores, setScores] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadScores = async () => {
    setIsLoading(true);
    setError(null);

    try {
      let scoresData;
      if (currentGameState?.id) {
        scoresData = await fetchGameScores(currentGameState.id);
      } else {
        scoresData = await fetchAllScores();
      }
      setScores(scoresData);
    } catch (err) {
      setError('Failed to load leaderboard');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Load scores initially and when game state changes
  useEffect(() => {
    loadScores();
  }, [currentGameState]);

  // Refresh scores every 5 seconds
  useEffect(() => {
    const intervalId = setInterval(loadScores, 5000);
    return () => clearInterval(intervalId);
  }, [currentGameState]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        {currentGameState?.id ? 'Game Leaderboard' : 'Global Leaderboard'}
      </h2>
      
      {error && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}
      
      {isLoading ? (
        <div className="text-center py-4 text-gray-600">Loading...</div>
      ) : (
        <div className="space-y-2">
          {scores.map((player, index) => (
            <div
              key={`${player.player_name}-${index}`}
              className="flex justify-between items-center p-2 bg-gray-50 rounded"
            >
              <div className="flex items-center">
                <span className="font-bold mr-2 text-gray-800">#{index + 1}</span>
                <span className="text-gray-700">{player.player_name}</span>
              </div>
              <span className="font-bold text-gray-800">{player.score} hits</span>
            </div>
          ))}
          
          {scores.length === 0 && (
            <div className="text-center py-4 text-gray-500">
              No games played yet
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Leaderboard; 