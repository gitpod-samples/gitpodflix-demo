import { Pool } from 'pg';
import { Movie } from '../utils/movieUtils';

export class CatalogService {
  private pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  async getAllMovies(): Promise<Movie[]> {
    const result = await this.pool.query('SELECT * FROM movies ORDER BY rating DESC');
    return result.rows;
  }

  async getMovieById(id: number): Promise<Movie | null> {
    const result = await this.pool.query('SELECT * FROM movies WHERE id = $1', [id]);
    return result.rows[0] || null;
  }

  async searchMovies(query: string): Promise<Movie[]> {
    const searchQuery = `%${query.toLowerCase()}%`;
    const result = await this.pool.query(
      'SELECT * FROM movies WHERE LOWER(title) LIKE $1 OR LOWER(description) LIKE $1',
      [searchQuery]
    );
    return result.rows;
  }

  async getTopRatedMovies(limit: number = 10): Promise<Movie[]> {
    const result = await this.pool.query(
      'SELECT * FROM movies ORDER BY rating DESC LIMIT $1',
      [limit]
    );
    return result.rows;
  }

  async getMoviesByYear(year: number): Promise<Movie[]> {
    const result = await this.pool.query(
      'SELECT * FROM movies WHERE release_year = $1 ORDER BY rating DESC',
      [year]
    );
    return result.rows;
  }
}
