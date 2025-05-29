import React, { useState, useEffect } from 'react';
import { fetchGameHistory, fetchGameState } from '../services/api';

function Leaderboard({ currentGameState }) {
  const [scores, setScores] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadScores = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const games = await fetchGameHistory();
        const playerScores = new Map();

        // Process all games, including the current one
        for (const game of games) {
          const gameState = await fetchGameState(game.id);
          
          if (gameState && gameState.guesses) {
            gameState.guesses.forEach(guess => {
              if (guess && guess.playerName) {
                const currentScore = playerScores.get(guess.playerName) || 0;
                playerScores.set(guess.playerName, currentScore + (guess.isHit ? 1 : 0));
              }
            });
          }
        }

        // Add any current game state that hasn't been saved yet
        if (currentGameState && currentGameState.guesses) {
          currentGameState.guesses.forEach(guess => {
            if (guess && guess.playerName) {
              const currentScore = playerScores.get(guess.playerName) || 0;
              playerScores.set(guess.playerName, currentScore + (guess.isHit ? 1 : 0));
            }
          });
        }

        const sortedScores = Array.from(playerScores.entries())
          .map(([name, score]) => ({ name, score }))
          .sort((a, b) => b.score - a.score);

        setScores(sortedScores);
      } catch (err) {
        setError('Failed to load leaderboard');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadScores();
  }, [currentGameState]); // Re-run when currentGameState changes

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Leaderboard</h2>
      
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
              key={player.name}
              className="flex justify-between items-center p-2 bg-gray-50 rounded"
            >
              <div className="flex items-center">
                <span className="font-bold mr-2 text-gray-800">#{index + 1}</span>
                <span className="text-gray-700">{player.name}</span>
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