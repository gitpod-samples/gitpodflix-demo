import React, { useState } from 'react';
import GameBoard from './components/GameBoard';
import Leaderboard from './components/Leaderboard';

function App() {
  const [currentGameState, setCurrentGameState] = useState(null);

  const handleGuess = (gameState) => {
    setCurrentGameState(gameState);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto py-8">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">Battleship Game</h1>
        <div className="grid grid-cols-2 gap-8">
          <div>
            <Leaderboard currentGameState={currentGameState} />
          </div>
          <div>
            <GameBoard onGuess={handleGuess} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App; 