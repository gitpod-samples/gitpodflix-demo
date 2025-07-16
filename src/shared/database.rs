use sqlx::{PgPool, Row};
use anyhow::Result;
use crate::shared::models::Movie;

pub async fn create_pool() -> Result<PgPool> {
    let database_url = std::env::var("DATABASE_URL")
        .unwrap_or_else(|_| "postgresql://gitpod:gitpod@localhost:5432/gitpodflix".to_string());
    
    let pool = PgPool::connect(&database_url).await?;
    Ok(pool)
}

pub async fn get_all_movies(pool: &PgPool) -> Result<Vec<Movie>> {
    let movies = sqlx::query_as::<_, Movie>(
        "SELECT id, title, description, release_year, rating, image_url, created_at, updated_at 
         FROM movies ORDER BY rating DESC"
    )
    .fetch_all(pool)
    .await?;
    
    Ok(movies)
}

pub async fn seed_movies(pool: &PgPool) -> Result<()> {
    sqlx::query("TRUNCATE TABLE movies").execute(pool).await?;
    
    sqlx::query(
        r#"
        INSERT INTO movies (title, description, release_year, rating, image_url) VALUES
        ('The Shawshank Redemption', 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.', 1994, 9.3, 'https://m.media-amazon.com/images/M/MV5BNDE3ODcxYzMtY2YzZC00NmNlLWJiNDMtZDViZWM2MzIxZDYwXkEyXkFqcGdeQXVyNjAwNDUxODI@._V1_.jpg'),
        ('The Godfather', 'The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.', 1972, 9.2, 'https://m.media-amazon.com/images/M/MV5BM2MyNjYxNmUtYTAwNi00MTYxLWJmNWYtYzZlODY3ZTk3OTFlXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg'),
        ('The Dark Knight', 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.', 2008, 9.0, 'https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_.jpg'),
        ('Pulp Fiction', 'The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.', 1994, 8.9, 'https://m.media-amazon.com/images/M/MV5BNGNhMDIzZTUtNTBlZi00MTRlLWFjM2ItYzViMjE3YzI5MjljXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg'),
        ('Fight Club', 'An insomniac office worker and a devil-may-care soapmaker form an underground fight club that evolves into something much, much more.', 1999, 8.8, 'https://m.media-amazon.com/images/M/MV5BNDIzNDU0YzEtYzE5Ni00ZjlkLTk5ZjgtNjM3NWE4YzA3Nzk3XkEyXkFqcGdeQXVyMjUzOTY1NTc@._V1_.jpg')
        "#
    )
    .execute(pool)
    .await?;
    
    Ok(())
}

pub async fn clear_movies(pool: &PgPool) -> Result<()> {
    sqlx::query("TRUNCATE TABLE movies").execute(pool).await?;
    Ok(())
}
