use axum::{
    extract::State,
    http::StatusCode,
    response::Json,
};
use serde_json::{json, Value};

use crate::AppState;

pub async fn get_movies(State(state): State<AppState>) -> Result<Json<Value>, StatusCode> {
    match state.catalog_service.get_all_movies().await {
        Ok(movies) => Ok(Json(json!(movies))),
        Err(err) => {
            eprintln!("Error fetching movies: {}", err);
            Err(StatusCode::INTERNAL_SERVER_ERROR)
        }
    }
}

pub async fn seed_movies(State(state): State<AppState>) -> Result<Json<Value>, StatusCode> {
    match state.catalog_service.seed_movies().await {
        Ok(_) => Ok(Json(json!({"message": "Database seeded successfully"}))),
        Err(err) => {
            eprintln!("Error seeding database: {}", err);
            Err(StatusCode::INTERNAL_SERVER_ERROR)
        }
    }
}

pub async fn clear_movies(State(state): State<AppState>) -> Result<Json<Value>, StatusCode> {
    match state.catalog_service.clear_movies().await {
        Ok(_) => Ok(Json(json!({"message": "Database cleared successfully"}))),
        Err(err) => {
            eprintln!("Error clearing database: {}", err);
            Err(StatusCode::INTERNAL_SERVER_ERROR)
        }
    }
}
