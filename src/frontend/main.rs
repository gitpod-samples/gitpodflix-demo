use axum::{
    http::StatusCode,
    response::Html,
    routing::get,
    Router,
};
use tower_http::cors::CorsLayer;
use tracing::{info};
use tracing_subscriber;

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    dotenv::dotenv().ok();
    tracing_subscriber::init();

    let app = Router::new()
        .route("/", get(serve_index))
        .route("/assets/*file", get(serve_static))
        .layer(CorsLayer::permissive());

    let port = std::env::var("FRONTEND_PORT").unwrap_or_else(|_| "3000".to_string());
    let listener = tokio::net::TcpListener::bind(format!("0.0.0.0:{}", port)).await?;
    
    info!("Frontend server running on port {}", port);
    axum::serve(listener, app).await?;

    Ok(())
}

async fn serve_index() -> Html<&'static str> {
    Html(include_str!("../../frontend_dist/index.html"))
}

async fn serve_static() -> Result<&'static str, StatusCode> {
    // For now, return a placeholder
    // In a full implementation, this would serve static files
    Err(StatusCode::NOT_FOUND)
}
