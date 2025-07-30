use crate::models::movie::Movie;
use sqlx::PgPool;

#[derive(Clone)]
pub struct CatalogService {
    pool: PgPool,
}

impl CatalogService {
    pub fn new(pool: PgPool) -> Self {
        Self { pool }
    }

    pub async fn get_all_movies(&self) -> Result<Vec<Movie>, sqlx::Error> {
        let movies = sqlx::query_as::<_, Movie>(
            "SELECT * FROM movies ORDER BY rating DESC"
        )
        .fetch_all(&self.pool)
        .await?;
        
        Ok(movies)
    }

    pub async fn get_movie_by_id(&self, id: i32) -> Result<Option<Movie>, sqlx::Error> {
        let movie = sqlx::query_as::<_, Movie>(
            "SELECT * FROM movies WHERE id = $1"
        )
        .bind(id)
        .fetch_optional(&self.pool)
        .await?;
        
        Ok(movie)
    }

    pub async fn search_movies(&self, query: &str) -> Result<Vec<Movie>, sqlx::Error> {
        let search_query = format!("%{}%", query.to_lowercase());
        let movies = sqlx::query_as::<_, Movie>(
            "SELECT * FROM movies WHERE LOWER(title) LIKE $1 OR LOWER(description) LIKE $1"
        )
        .bind(&search_query)
        .fetch_all(&self.pool)
        .await?;
        
        Ok(movies)
    }

    pub async fn get_top_rated_movies(&self, limit: i32) -> Result<Vec<Movie>, sqlx::Error> {
        let movies = sqlx::query_as::<_, Movie>(
            "SELECT * FROM movies ORDER BY rating DESC LIMIT $1"
        )
        .bind(limit)
        .fetch_all(&self.pool)
        .await?;
        
        Ok(movies)
    }

    pub async fn get_movies_by_year(&self, year: i32) -> Result<Vec<Movie>, sqlx::Error> {
        let movies = sqlx::query_as::<_, Movie>(
            "SELECT * FROM movies WHERE release_year = $1 ORDER BY rating DESC"
        )
        .bind(year)
        .fetch_all(&self.pool)
        .await?;
        
        Ok(movies)
    }

    pub async fn seed_movies(&self) -> Result<(), sqlx::Error> {
        sqlx::query("TRUNCATE TABLE movies").execute(&self.pool).await?;
        
        sqlx::query(r#"
            INSERT INTO movies (title, description, release_year, rating, image_url) VALUES
            ('The Shawshank Redemption', 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.', 1994, 9.3, 'https://m.media-amazon.com/images/M/MV5BNDE3ODcxYzMtY2YzZC00NmNlLWJiNDMtZDViZWM2MzIxZDYwXkEyXkFqcGdeQXVyNjAwNDUxODI@._V1_.jpg'),
            ('The Godfather', 'The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.', 1972, 9.2, 'https://m.media-amazon.com/images/M/MV5BM2MyNjYxNmUtYTAwNi00MTYxLWJmNWYtYzZlODY3ZTk3OTFlXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg'),
            ('The Dark Knight', 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.', 2008, 9.0, 'https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_.jpg'),
            ('Pulp Fiction', 'The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.', 1994, 8.9, 'https://m.media-amazon.com/images/M/MV5BNGNhMDIzZTUtNTBlZi00MTRlLWFjM2ItYzViMjE3YzI5MjljXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg'),
            ('Fight Club', 'An insomniac office worker and a devil-may-care soapmaker form an underground fight club that evolves into something much, much more.', 1999, 8.8, 'https://m.media-amazon.com/images/M/MV5BNDIzNDU0YzEtYzE5Ni00ZjlkLTk5ZjgtNjM3NWE4YzA3Nzk3XkEyXkFqcGdeQXVyMjUzOTY1NTc@._V1_.jpg')
        "#).execute(&self.pool).await?;
        
        Ok(())
    }

    pub async fn clear_movies(&self) -> Result<(), sqlx::Error> {
        sqlx::query("TRUNCATE TABLE movies").execute(&self.pool).await?;
        Ok(())
    }
}
