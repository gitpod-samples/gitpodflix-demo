import React, { useState } from 'react';
import GameBoard from './components/GameBoard';
import Leaderboard from './components/Leaderboard';
import './styles/vintage.css'; // We'll create this file next

function App() {
  const [currentGameState, setCurrentGameState] = useState(null);

  const handleGuess = (gameState) => {
    setCurrentGameState(gameState);
  };

  return (
    <div className="min-h-screen vintage-bg">
      <div className="grid grid-cols-4 h-screen relative vintage-container">
        <div className="w-full h-full vintage-panel">
          <Leaderboard currentGameState={currentGameState} />
        </div>
        <div className="w-full h-full vintage-panel border-l border-vintage-border col-span-3">
          <GameBoard onGuess={handleGuess} />
        </div>
      </div>
    </div>
  );
}

export default App; 