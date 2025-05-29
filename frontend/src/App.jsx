import React, { useState } from 'react';
import GameBoard from './components/GameBoard';
import Leaderboard from './components/Leaderboard';

function App() {
  const [score, setScore] = useState(0);

  const handleGuess = (isHit) => {
    if (isHit) {
      setScore(prev => prev + 1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto py-8">
        <h1 className="text-4xl font-bold text-center mb-8">Battleship Game</h1>
        <div className="grid grid-cols-2 gap-8">
          <div>
            <Leaderboard />
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