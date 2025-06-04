const dotenv = require('dotenv');
const path = require('path');
const fetch = require('node-fetch');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '.env') });

const API_BASE_URL = 'http://localhost:3001/api';

async function addScore(playerName, x, y) {
  const gameId = process.env.GAME_ID;
  
  if (!gameId) {
    console.error('No game ID found in .env file. Please run create_game.js first.');
    process.exit(1);
  }

  try {
    const response = await fetch(`${API_BASE_URL}/game/guess`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        gameId,
        playerName,
        x,
        y,
        isHit: false // This will be determined by the server
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('Score added successfully!');
    console.log('Response:', result);
  } catch (error) {
    console.error('Error adding score:', error.message);
    process.exit(1);
  }
}

// Get command line arguments
const args = process.argv.slice(2);
if (args.length !== 3) {
  console.error('Usage: node add_score.js <playerName> <x> <y>');
  console.error('Example: node add_score.js "John" 5 7');
  process.exit(1);
}

const [playerName, x, y] = args;

// Validate coordinates
if (isNaN(x) || isNaN(y) || x < 0 || x > 9 || y < 0 || y > 9) {
  console.error('Coordinates must be numbers between 0 and 9');
  process.exit(1);
}

addScore(playerName, parseInt(x), parseInt(y)); 