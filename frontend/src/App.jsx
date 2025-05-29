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
      <div className="grid grid-cols-4 h-screen relative">
        <div className="w-full h-full bg-white">
          <Leaderboard currentGameState={currentGameState} />
        </div>
        <div className="w-full h-full bg-white border-l border-gray-200 col-span-3">
          <GameBoard onGuess={handleGuess} />
        </div>
      </div>
    </div>
  );
}

export default App; 