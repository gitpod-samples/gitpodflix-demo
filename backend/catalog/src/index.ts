import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { getMovies, seedMovies, clearMovies } from './handlers';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/api/movies', getMovies);
app.post('/api/movies/seed', seedMovies);
app.post('/api/movies/clear', clearMovies);

// Only start the server if this file is run directly (not imported for testing)
if (require.main === module) {
  app.listen(port, () => {
    console.log(`Catalog service running on port ${port}`);
  });
}

// Export app for testing
export default app;
