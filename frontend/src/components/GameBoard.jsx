import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { fetchGameState, fetchGameHistory, submitGuess } from '../services/api';
import { playSound } from '../utils/sounds';

const GRID_SIZE = 10;

function GameBoard({ onGuess }) {
  const [gameBoard, setGameBoard] = useState(() => 
    Array(GRID_SIZE).fill().map(() => Array(GRID_SIZE).fill(null))
  );
  const [playerName, setPlayerName] = useState('');
  const [gameHistory, setGameHistory] = useState([]);
  const [selectedGameId, setSelectedGameId] = useState(uuidv4());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sunkShips, setSunkShips] = useState([]);
  const [isGameOver, setIsGameOver] = useState(false);
  const [lastHit, setLastHit] = useState(null);

  useEffect(() => {
    const loadGameHistory = async () => {
      try {
        const history = await fetchGameHistory();
        setGameHistory(history);
      } catch (err) {
        setError('Failed to load game history');
        console.error(err);
      }
    };

    loadGameHistory();
  }, []);

  useEffect(() => {
    const loadGameState = async () => {
      if (!selectedGameId) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const gameState = await fetchGameState(selectedGameId);
        if (!gameState) {
          throw new Error('No game state received');
        }
        
        const newBoard = Array(GRID_SIZE).fill().map(() => Array(GRID_SIZE).fill(null));
        
        if (gameState.guesses) {
          gameState.guesses.forEach(guess => {
            if (guess && typeof guess.x === 'number' && typeof guess.y === 'number') {
              newBoard[guess.y][guess.x] = guess.isHit ? 'hit' : 'miss';
            }
          });
        }
        
        setGameBoard(newBoard);
        
        // Check for sunk ships
        if (gameState.ships) {
          const newSunkShips = gameState.ships.filter(ship => 
            ship.positions.every(pos => 
              gameState.guesses.some(guess => 
                guess.x === pos.x && guess.y === pos.y && guess.isHit
              )
            )
          );
          setSunkShips(newSunkShips);
          
          // Check for game over
          const allShipsSunk = gameState.ships.every(ship =>
            ship.positions.every(pos =>
              gameState.guesses.some(guess =>
                guess.x === pos.x && guess.y === pos.y && guess.isHit
              )
            )
          );
          setIsGameOver(allShipsSunk);
        }
      } catch (err) {
        setError('Failed to load game state');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadGameState();
  }, [selectedGameId]);

  const handleCellClick = async (x, y) => {
    if (!playerName || isLoading || isGameOver) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await submitGuess(selectedGameId, playerName, x, y);
      const newBoard = [...gameBoard];
      newBoard[y][x] = result.isHit ? 'hit' : 'miss';
      setGameBoard(newBoard);
      
      // Play appropriate sound
      if (result.isHit) {
        playSound('hit');
        setLastHit({ x, y });
        
        // Check if any ship was sunk
        const newSunkShips = result.ships.filter(ship =>
          ship.positions.every(pos =>
            result.guesses.some(guess =>
              guess.x === pos.x && guess.y === pos.y && guess.isHit
            )
          )
        );
        
        // If there are new sunk ships, play the ship sunk sound
        if (newSunkShips.length > sunkShips.length) {
          playSound('shipSunk');
        }
        
        setSunkShips(newSunkShips);
        
        // Check if game is over
        const allShipsSunk = result.ships.every(ship =>
          ship.positions.every(pos =>
            result.guesses.some(guess =>
              guess.x === pos.x && guess.y === pos.y && guess.isHit
            )
          )
        );
        
        if (allShipsSunk) {
          playSound('gameOver');
        }
        
        setIsGameOver(allShipsSunk);
      } else {
        playSound('miss');
      }
      
      if (onGuess) {
        onGuess(result.isHit);
      }
    } catch (err) {
      setError('Failed to submit guess');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewGame = () => {
    setSelectedGameId(uuidv4());
    setGameBoard(Array(GRID_SIZE).fill(Array(GRID_SIZE).fill(null)));
    setSunkShips([]);
    setIsGameOver(false);
    setLastHit(null);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <div className="mb-4">
        <input
          type="text"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          placeholder="Enter your name"
          className="w-full p-2 border rounded transition-all duration-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          disabled={isGameOver}
        />
      </div>
      
      <div className="mb-4">
        <select
          value={selectedGameId}
          onChange={(e) => setSelectedGameId(e.target.value)}
          className="w-full p-2 border rounded transition-all duration-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          disabled={isGameOver}
        >
          <option value={selectedGameId}>Current Game</option>
          {gameHistory.filter(game => game && game.id).map((game) => (
            <option key={game.id} value={game.id}>
              Game {game.id.slice(0, 8)} - {game.created_at ? new Date(game.created_at).toLocaleString() : 'Unknown date'}
            </option>
          ))}
        </select>
      </div>
      
      {error && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded animate-fade-in">
          {error}
        </div>
      )}
      
      {sunkShips.length > 0 && (
        <div className="mb-4 animate-slide-in">
          <h3 className="font-bold mb-2">Sunk Ships:</h3>
          <div className="flex flex-wrap gap-2">
            {sunkShips.map((ship) => (
              <span
                key={ship.name}
                className="px-2 py-1 bg-red-100 text-red-800 rounded animate-bounce"
              >
                {ship.name}
              </span>
            ))}
          </div>
        </div>
      )}
      
      {isGameOver && (
        <div className="mb-4 p-4 bg-green-100 text-green-800 rounded text-center animate-scale-in">
          <h3 className="font-bold text-xl mb-2">Game Over!</h3>
          <p>Congratulations! You've sunk all the ships!</p>
        </div>
      )}
      
      <div className="grid grid-cols-10 gap-1 mb-4">
        {gameBoard.map((row, y) =>
          row.map((cell, x) => (
            <button
              key={`${x}-${y}`}
              onClick={() => handleCellClick(x, y)}
              disabled={isLoading || cell !== null || isGameOver}
              className={`
                w-8 h-8 border rounded transition-all duration-300
                ${cell === 'hit' ? 'bg-red-500 scale-110' : ''}
                ${cell === 'miss' ? 'bg-gray-300' : ''}
                ${!cell ? 'bg-blue-100 hover:bg-blue-200 hover:scale-105' : ''}
                ${(isLoading || isGameOver) ? 'opacity-50 cursor-not-allowed' : ''}
                ${lastHit && lastHit.x === x && lastHit.y === y ? 'animate-pulse' : ''}
              `}
            />
          ))
        )}
      </div>
      
      <button
        onClick={handleNewGame}
        disabled={isLoading}
        className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 transition-all duration-300 hover:scale-105"
      >
        New Game
      </button>
    </div>
  );
}

export default GameBoard; 