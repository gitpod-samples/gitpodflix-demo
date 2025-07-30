use axum::{
    routing::{get, post},
    Router,
};
use sqlx::PgPool;
use tower_http::cors::CorsLayer;

mod models;
mod handlers;
mod services;
mod utils;

use services::catalog_service::CatalogService;

#[derive(Clone)]
pub struct AppState {
    pub catalog_service: CatalogService,
}

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    dotenv::dotenv().ok();

    let database_url = std::env::var("DATABASE_URL")
        .unwrap_or_else(|_| "postgresql://gitpod:gitpod@localhost:5432/gitpodflix".to_string());

    let pool = PgPool::connect(&database_url).await?;
    let catalog_service = CatalogService::new(pool);
    let app_state = AppState { catalog_service };

    let app = Router::new()
        .route("/api/movies", get(handlers::movie_handlers::get_movies))
        .route("/api/movies/seed", post(handlers::movie_handlers::seed_movies))
        .route("/api/movies/clear", post(handlers::movie_handlers::clear_movies))
        .layer(CorsLayer::permissive())
        .with_state(app_state);

    let port = std::env::var("PORT")
        .unwrap_or_else(|_| "3001".to_string())
        .parse::<u16>()
        .unwrap_or(3001);

    let listener = tokio::net::TcpListener::bind(format!("0.0.0.0:{}", port)).await?;
    println!("Catalog service running on port {}", port);

    axum::serve(listener, app).await?;
    Ok(())
}
