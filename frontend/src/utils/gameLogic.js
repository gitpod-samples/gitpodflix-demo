import { SHIPS } from '../config/ships';

// Helper function to generate random ship positions
export function generateShipPositions() {
  const ships = SHIPS.map(ship => ({ ...ship, positions: [] }));
  const board = Array(10).fill(null).map(() => Array(10).fill(false));
  
  for (const ship of ships) {
    let placed = false;
    while (!placed) {
      const horizontal = Math.random() < 0.5;
      const x = Math.floor(Math.random() * 10);
      const y = Math.floor(Math.random() * 10);
      
      if (horizontal && x + ship.size <= 10) {
        let canPlace = true;
        for (let i = 0; i < ship.size; i++) {
          if (board[y][x + i]) {
            canPlace = false;
            break;
          }
        }
        if (canPlace) {
          for (let i = 0; i < ship.size; i++) {
            board[y][x + i] = true;
            ship.positions.push({ x: x + i, y });
          }
          placed = true;
        }
      } else if (!horizontal && y + ship.size <= 10) {
        let canPlace = true;
        for (let i = 0; i < ship.size; i++) {
          if (board[y + i][x]) {
            canPlace = false;
            break;
          }
        }
        if (canPlace) {
          for (let i = 0; i < ship.size; i++) {
            board[y + i][x] = true;
            ship.positions.push({ x, y: y + i });
          }
          placed = true;
        }
      }
    }
  }
  return ships;
}

// Check if a guess is a hit
export function checkHit(ships, x, y) {
  return ships.some(ship => 
    ship.positions.some(pos => pos.x === x && pos.y === y)
  );
}

// Check if a ship is sunk
export function isShipSunk(ship, guesses) {
  return ship.positions.every(pos =>
    guesses.some(guess =>
      guess.x === pos.x && guess.y === pos.y && guess.isHit
    )
  );
}

// Check if all ships are sunk
export function areAllShipsSunk(ships, guesses) {
  return ships.every(ship => isShipSunk(ship, guesses));
} 