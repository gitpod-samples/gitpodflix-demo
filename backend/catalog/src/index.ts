import express from 'express';
import cors from 'cors';
import { Pool } from 'pg';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import { SHIPS, Ship, GameBoard, Position } from './config/ships';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Database configuration
const pool = new Pool({
  user: process.env.DB_USER || 'gitpod',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'gitpodflix',
  password: process.env.DB_PASSWORD || 'gitpod',
  port: parseInt(process.env.DB_PORT || '5432'),
});

// Middleware
app.use(cors());
app.use(express.json());

// Helper function to generate random ship positions
function generateShipPositions(): Ship[] {
  const ships = SHIPS.map(ship => ({ ...ship, positions: [] as Position[] }));
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

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Get game state
app.get('/api/game/:gameId', async (req, res) => {
  try {
    const { gameId } = req.params;
    const result = await pool.query(
      'SELECT * FROM game_state WHERE game_id = $1 ORDER BY created_at ASC',
      [gameId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching game state:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get game history
app.get('/api/games', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT DISTINCT game_id, game_timestamp FROM game_state ORDER BY game_timestamp DESC'
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching game history:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Make a guess
app.post('/api/game/guess', async (req, res) => {
  try {
    const { gameId, playerName, x, y } = req.body;
    
    // Generate ships if this is the first guess
    const existingGuesses = await pool.query(
      'SELECT * FROM game_state WHERE game_id = $1',
      [gameId]
    );
    
    let ships: Ship[];
    if (existingGuesses.rows.length === 0) {
      ships = generateShipPositions();
    } else {
      // In a real app, we'd store ship positions in the database
      // For this demo, we'll regenerate them the same way each time
      ships = generateShipPositions();
    }
    
    // Check if the guess is a hit
    const isHit = ships.some(ship => 
      ship.positions?.some(pos => pos.x === x && pos.y === y)
    );
    
    // Store the guess
    await pool.query(
      'INSERT INTO game_state (game_id, player_name, x_coordinate, y_coordinate, is_hit) VALUES ($1, $2, $3, $4, $5)',
      [gameId, playerName, x, y, isHit]
    );
    
    res.json({ isHit });
  } catch (err) {
    console.error('Error processing guess:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); 