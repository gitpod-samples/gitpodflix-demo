-- Drop the old movies table
DROP TABLE IF EXISTS movies;
-- Create the new game_state table
CREATE TABLE game_state (
    id SERIAL PRIMARY KEY,
    game_id VARCHAR(50) NOT NULL,
    game_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    player_name VARCHAR(255) NOT NULL,
    x_coordinate INTEGER NOT NULL,
    y_coordinate INTEGER NOT NULL,
    is_hit BOOLEAN NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- Create indexes for better query performance
CREATE INDEX idx_game_state_game_id ON game_state(game_id);
CREATE INDEX idx_game_state_player_name ON game_state(player_name);
CREATE INDEX idx_game_state_created_at ON game_state(created_at);