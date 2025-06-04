const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Generate a new game ID
const gameId = uuidv4();

// Create or update .env file
const envPath = path.join(__dirname, '.env');
let envContent = '';

// Read existing .env file if it exists
if (fs.existsSync(envPath)) {
  envContent = fs.readFileSync(envPath, 'utf8');
}

// Update or add GAME_ID
if (envContent.includes('GAME_ID=')) {
  envContent = envContent.replace(/GAME_ID=.*/, `GAME_ID=${gameId}`);
} else {
  envContent += `\nGAME_ID=${gameId}`;
}

// Write back to .env file
fs.writeFileSync(envPath, envContent.trim() + '\n');

console.log(`New game created with ID: ${gameId}`);
console.log('Game ID has been stored in .env file'); 