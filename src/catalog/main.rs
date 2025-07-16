use axum::{
    extract::State,
    http::StatusCode,
    response::Json,
    routing::{get, post},
    Router,
};
use tower_http::cors::CorsLayer;
use sqlx::PgPool;
use std::sync::Arc;
use tracing::{info, error};
use tracing_subscriber;

mod shared;
use shared::{database, models::ApiResponse};

#[derive(Clone)]
struct AppState {
    pool: PgPool,
}

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    dotenv::dotenv().ok();
    tracing_subscriber::init();

    let pool = database::create_pool().await?;
    let state = AppState { pool };

    let app = Router::new()
        .route("/api/movies", get(get_movies))
        .route("/api/movies/seed", post(seed_movies))
        .route("/api/movies/clear", post(clear_movies))
        .layer(CorsLayer::permissive())
        .with_state(Arc::new(state));

    let port = std::env::var("PORT").unwrap_or_else(|_| "3001".to_string());
    let listener = tokio::net::TcpListener::bind(format!("0.0.0.0:{}", port)).await?;
    
    info!("Catalog service running on port {}", port);
    axum::serve(listener, app).await?;

    Ok(())
}

async fn get_movies(
    State(state): State<Arc<AppState>>,
) -> Result<Json<Vec<shared::models::Movie>>, StatusCode> {
    match database::get_all_movies(&state.pool).await {
        Ok(movies) => Ok(Json(movies)),
        Err(err) => {
            error!("Error fetching movies: {}", err);
            Err(StatusCode::INTERNAL_SERVER_ERROR)
                }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use axum_test::TestServer;
    use serde_json::Value;
    
    #[tokio::test]
    async fn test_get_movies_endpoint() {
        let pool = shared::database::create_pool().await.unwrap();
        let state = AppState { pool };
        
        let app = Router::new()
            .route("/api/movies", get(get_movies))
            .with_state(Arc::new(state));
        
        let server = TestServer::new(app).unwrap();
        let response = server.get("/api/movies").await;
        
        assert_eq!(response.status_code(), 200);
    }
    
    #[tokio::test]
    async fn test_seed_movies_endpoint() {
        let pool = shared::database::create_pool().await.unwrap();
        let state = AppState { pool };
        
        let app = Router::new()
            .route("/api/movies/seed", post(seed_movies))
            .with_state(Arc::new(state));
        
        let server = TestServer::new(app).unwrap();
        let response = server.post("/api/movies/seed").await;
        
        assert_eq!(response.status_code(), 200);
        
        let body: Value = response.json();
        assert!(body["message"].as_str().unwrap().contains("successfully"));
    }
}

async fn seed_movies(
    State(state): State<Arc<AppState>>,
) -> Result<Json<ApiResponse<()>>, StatusCode> {
    match database::seed_movies(&state.pool).await {
        Ok(_) => Ok(Json(ApiResponse::message("Database seeded successfully".to_string()))),
        Err(err) => {
            error!("Error seeding database: {}", err);
            Err(StatusCode::INTERNAL_SERVER_ERROR)
        }
    }
}

async fn clear_movies(
    State(state): State<Arc<AppState>>,
) -> Result<Json<ApiResponse<()>>, StatusCode> {
    match database::clear_movies(&state.pool).await {
        Ok(_) => Ok(Json(ApiResponse::message("Database cleared successfully".to_string()))),
        Err(err) => {
            error!("Error clearing database: {}", err);
            Err(StatusCode::INTERNAL_SERVER_ERROR)
        }
    }
}
