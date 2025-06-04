import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { fetchGameState, fetchGameHistory, submitGuess } from '../services/api';
import { playSound } from '../utils/sounds';
import { generateShipPositions, checkHit, isShipSunk, areAllShipsSunk } from '../utils/gameLogic';
import { SHIPS } from '../config/ships';

const GRID_SIZE = 10;

function GameBoard({ onGuess }) {
  const [gameBoard, setGameBoard] = useState(() => 
    Array(GRID_SIZE).fill().map(() => Array(GRID_SIZE).fill(null))
  );
  const [playerName, setPlayerName] = useState('');
  const [gameHistory, setGameHistory] = useState([]);
  const [selectedGameId, setSelectedGameId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sunkShips, setSunkShips] = useState([]);
  const [isGameOver, setIsGameOver] = useState(false);
  const [lastHit, setLastHit] = useState(null);
  const [ships, setShips] = useState(null);
  const [shipStatus, setShipStatus] = useState(() => 
    SHIPS.map(ship => ({ ...ship, isSunk: false }))
  );

  useEffect(() => {
    const loadGameHistory = async () => {
      try {
        const history = await fetchGameHistory();
        // Ensure unique game IDs by using a Map
        const uniqueHistory = Array.from(
          new Map(history.map(game => [game.game_id, game])).values()
        );
        setGameHistory(uniqueHistory);
        
        // If no game is selected and we have history, select the most recent game
        if (!selectedGameId && uniqueHistory.length > 0) {
          setSelectedGameId(uniqueHistory[0].game_id);
        }
      } catch (err) {
        setError('Failed to load game history');
        console.error(err);
      }
    };

    loadGameHistory();
  }, []);

  useEffect(() => {
        const loadGameState = async (showLoading = true) => {
      if (!selectedGameId) return;
      
      if (showLoading) {
        setIsLoading(true);
      }
      setError(null);
      
      try {
        const gameState = await fetchGameState(selectedGameId);
        if (!gameState || gameState.length === 0) {
          // Initialize new game with ships
          const newShips = generateShipPositions();
          setShips(newShips);
          setGameBoard(Array(GRID_SIZE).fill().map(() => Array(GRID_SIZE).fill(null)));
          setSunkShips([]);
          setIsGameOver(false);
          setLastHit(null);
          setShipStatus(SHIPS.map(ship => ({ ...ship, isSunk: false })));
          return;
        }
        
        const newBoard = Array(GRID_SIZE).fill().map(() => Array(GRID_SIZE).fill(null));
        
        gameState.forEach(guess => {
          if (guess && typeof guess.x_coordinate === 'number' && typeof guess.y_coordinate === 'number') {
            newBoard[guess.y_coordinate][guess.x_coordinate] = guess.is_hit ? 'hit' : 'miss';
          }
        });
        
        setGameBoard(newBoard);
        
        // Initialize ships if not already set
        if (!ships) {
          const newShips = generateShipPositions();
          setShips(newShips);
        }
        
        // Check for sunk ships
        if (ships) {
          const newSunkShips = ships.filter(ship => 
            isShipSunk(ship, gameState.map(guess => ({
              x: guess.x_coordinate,
              y: guess.y_coordinate,
              isHit: guess.is_hit
            })))
          );
          setSunkShips(newSunkShips);
          
          // Update ship status
          setShipStatus(prevStatus => 
            prevStatus.map(ship => ({
              ...ship,
              isSunk: newSunkShips.some(sunkShip => sunkShip.name === ship.name)
            }))
          );
          
          // Check for game over
          const allShipsSunk = areAllShipsSunk(ships, gameState.map(guess => ({
            x: guess.x_coordinate,
            y: guess.y_coordinate,
            isHit: guess.is_hit
          })));
          setIsGameOver(allShipsSunk);
        }
      } catch (err) {
        setError('Failed to load game state');
        console.error(err);
      } finally {
        if (showLoading) {
          setIsLoading(false);
        }
      }
    };

    // Initial load with loading indicator
    loadGameState(true);

    // Set up polling interval without loading indicator
    const pollInterval = setInterval(() => loadGameState(false), 2000);

    // Cleanup interval on unmount or when selectedGameId changes
    return () => clearInterval(pollInterval);
  }, [selectedGameId]);

  const handleCellClick = async (x, y) => {
    if (!playerName || isLoading || isGameOver || !ships) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Check if it's a hit on the client side
      const isHit = checkHit(ships, x, y);
      
      // Store the guess in the database
      await submitGuess(selectedGameId, playerName, x, y, isHit);
      
      // Update the board
      const newBoard = [...gameBoard];
      newBoard[y][x] = isHit ? 'hit' : 'miss';
      setGameBoard(newBoard);
      
      // Play appropriate sound
      if (isHit) {
        playSound('hit');
        setLastHit({ x, y });
        
        // Get all current hits including the new one
        const allHits = [
          ...gameBoard.flat().map((cell, index) => {
            if (cell === 'hit') {
              return {
                x: index % 10,
                y: Math.floor(index / 10),
                isHit: true
              };
            }
            return null;
          }).filter(Boolean),
          { x, y, isHit: true }
        ];
        
        // Check if any ship was sunk
        const newSunkShips = ships.filter(ship =>
          isShipSunk(ship, allHits)
        );
        
        // Update ship status
        setShipStatus(prevStatus => 
          prevStatus.map(ship => ({
            ...ship,
            isSunk: newSunkShips.some(sunkShip => sunkShip.name === ship.name)
          }))
        );
        
        // If there are new sunk ships, play the ship sunk sound
        if (newSunkShips.length > sunkShips.length) {
          playSound('shipSunk');
        }
        
        setSunkShips(newSunkShips);
        
        // Check if game is over
        const allShipsSunk = areAllShipsSunk(ships, allHits);
        
        if (allShipsSunk) {
          playSound('gameOver');
        }
        
        setIsGameOver(allShipsSunk);
      } else {
        playSound('miss');
      }
      
      // Create the current game state object
      const currentState = {
        id: selectedGameId,
        guesses: [
          ...gameBoard.flat().map((cell, index) => {
            if (cell === 'hit' || cell === 'miss') {
              return {
                x: index % 10,
                y: Math.floor(index / 10),
                isHit: cell === 'hit',
                playerName: playerName
              };
            }
            return null;
          }).filter(Boolean),
          { x, y, isHit, playerName }
        ]
      };
      
      if (onGuess) {
        onGuess(currentState);
      }
    } catch (err) {
      setError('Failed to submit guess');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewGame = () => {
    const newGameId = uuidv4();
    setSelectedGameId(newGameId);
    setGameBoard(Array(GRID_SIZE).fill().map(() => Array(GRID_SIZE).fill(null)));
    setSunkShips([]);
    setIsGameOver(false);
    setLastHit(null);
    setShips(generateShipPositions());
    setShipStatus(SHIPS.map(ship => ({ ...ship, isSunk: false })));
    
    // Update game history with proper structure
    const newGame = {
      game_id: newGameId,
      game_timestamp: new Date().toISOString()
    };
    
    setGameHistory(prevHistory => {
      const filteredHistory = prevHistory.filter(game => game && game.game_id);
      return [newGame, ...filteredHistory];
    });
  };

  return (
    <div className="bg-white p-6 h-full flex flex-col">
      {/* Player Name Banner */}
      <div className="mb-6">
        <div className="player-field">
          {playerName ? (
            <div>
              {playerName}'s Turn! 🎯
            </div>
          ) : (
            <div className="animate-pulse">
              Enter Your Name to Play!
            </div>
          )}
        </div>
      </div>

      {/* Game Board */}
      <div className="mb-6 flex-grow">
        <div className="grid grid-rows-[auto_1fr]">
          {/* Column headers and top-left empty cell */}
          <div className="grid grid-cols-11 border-b border-gray-300">
            <div className="w-10 h-10"></div>
            {Array.from({ length: 10 }, (_, i) => (
              <div key={`col-${i}`} className="w-10 h-10 flex items-center justify-center text-sm font-medium text-gray-600 border-r border-gray-300 last:border-r-0">
                {String.fromCharCode(65 + i)}
              </div>
            ))}
          </div>
          {/* Row numbers and main grid */}
          <div>
            {Array.from({ length: 10 }, (_, y) => (
              <div key={`row-${y}`} className="grid grid-cols-11">
                <div className="w-10 h-10 flex items-center justify-center text-sm font-medium text-gray-600 border-b border-gray-300">
                  {y + 1}
                </div>
                {Array.from({ length: 10 }, (_, x) => (
                  <button
                    key={`${x}-${y}`}
                    onClick={() => handleCellClick(x, y)}
                    disabled={isLoading || gameBoard[y][x] !== null || isGameOver || !selectedGameId}
                    className={`
                      w-full h-full border-r border-b border-gray-300 transition-all duration-300 relative overflow-hidden flex items-center justify-center
                      ${gameBoard[y][x] === 'hit' ? 'bg-red-500' : ''}
                      ${gameBoard[y][x] === 'miss' ? 'bg-gray-300' : ''}
                      ${!gameBoard[y][x] ? 'bg-blue-100 hover:bg-blue-200' : ''}
                      ${(isLoading || isGameOver || !selectedGameId) ? 'opacity-50 cursor-not-allowed' : ''}
                      ${lastHit && lastHit.x === x && lastHit.y === y ? 'animate-pulse' : ''}
                      ${x === 9 ? 'border-r-0' : ''}
                      ${y === 9 ? 'border-b-0' : ''}
                    `}
                  >
                    {gameBoard[y][x] === 'hit' && (
                      <div className="absolute inset-0 bg-red-500 transform scale-110" />
                    )}
                    {gameBoard[y][x] === 'hit' && <span className="relative z-10 text-lg">🔥</span>}
                    {gameBoard[y][x] === 'miss' && <span className="text-lg">💦</span>}
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Ship Status */}
      <div className="mb-6 border-2 border-vintage-border rounded-lg p-4">
        <div className="flex flex-wrap gap-2 justify-center items-center min-h-[60px]">
          {shipStatus.map((ship) => (
            <span
              key={ship.name}
              className={`px-2 py-1 rounded transition-all duration-300 ${
                ship.isSunk 
                  ? 'bg-red-100 text-red-800 animate-bounce' 
                  : 'bg-blue-100 text-blue-800'
              }`}
            >
              {ship.name} ({ship.size})
            </span>
          ))}
        </div>
      </div>

      {/* Controls Row */}
      <div className="flex gap-4 items-stretch">
        <input
          type="text"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          placeholder="Enter your name"
          className="w-1/3 p-3 border-2 border-vintage-border rounded-lg transition-all duration-300 focus:ring-2 focus:ring-vintage-accent focus:border-vintage-accent text-gray-800 placeholder-gray-400 font-vintage"
          disabled={isGameOver}
        />
        <select
          value={selectedGameId || ''}
          onChange={(e) => setSelectedGameId(e.target.value)}
          className="w-1/3 p-3 border-2 border-vintage-border rounded-lg transition-all duration-300 focus:ring-2 focus:ring-vintage-accent focus:border-vintage-accent text-gray-800"
          disabled={isGameOver}
        >
          <option value="">Select a game</option>
          {gameHistory
            .filter(game => game && game.game_id)
            .map((game, index) => (
              <option key={`${game.game_id}-${index}`} value={game.game_id}>
                Game {game.game_id.slice(0, 8)} - {game.game_timestamp ? new Date(game.game_timestamp).toLocaleString() : 'Unknown date'}
              </option>
            ))}
        </select>
        <button
          onClick={handleNewGame}
          disabled={isLoading}
          className="w-1/3 p-3 bg-[#e74c3c] text-white rounded-lg hover:bg-opacity-90 disabled:opacity-50 transition-all duration-300 hover:scale-105 font-vintage text-lg font-bold"
        >
          New Game
        </button>
      </div>

      {error && (
        <div className="mt-4 p-2 bg-red-100 text-red-700 rounded animate-fade-in">
          {error}
        </div>
      )}

      {isGameOver && (
        <div className="mt-4 p-4 bg-green-100 text-green-800 rounded text-center animate-scale-in">
          <h3 className="font-bold text-xl mb-2">Game Over!</h3>
          <p>Congratulations! You've sunk all the ships!</p>
        </div>
      )}
    </div>
  );
}

export default GameBoard; 
