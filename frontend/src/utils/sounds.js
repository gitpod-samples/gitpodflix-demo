// Sound effects for the game
const sounds = {
  hit: new Audio('/sounds/hit.mp3'),
  miss: new Audio('/sounds/miss.mp3'),
  shipSunk: new Audio('/sounds/ship-sunk.mp3'),
  gameOver: new Audio('/sounds/game-over.mp3'),
};

// Preload all sounds
Object.values(sounds).forEach(sound => {
  sound.load();
});

export const playSound = (soundName) => {
  const sound = sounds[soundName];
  if (sound) {
    // Reset the sound to the beginning
    sound.currentTime = 0;
    // Play the sound
    sound.play().catch(error => {
      console.error('Error playing sound:', error);
    });
  }
}; 