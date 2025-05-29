import express from 'express';
import cors from 'cors';
import { Pool } from 'pg';
import dotenv from 'dotenv';

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

// Get all player scores
app.get('/api/scores', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT player_name, COUNT(*) as score 
       FROM game_state 
       WHERE is_hit = true 
       GROUP BY player_name 
       ORDER BY score DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching scores:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Make a guess
app.post('/api/game/guess', async (req, res) => {
  try {
    const { gameId, playerName, x, y, isHit } = req.body;
    
    // Store the guess
    await pool.query(
      'INSERT INTO game_state (game_id, player_name, x_coordinate, y_coordinate, is_hit) VALUES ($1, $2, $3, $4, $5)',
      [gameId, playerName, x, y, isHit]
    );
    
    res.json({ success: true });
  } catch (err) {
    console.error('Error processing guess:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); 