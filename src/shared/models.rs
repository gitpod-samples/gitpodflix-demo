use serde::{Deserialize, Serialize};
use chrono::{DateTime, Utc};

#[derive(Debug, Serialize, Deserialize, sqlx::FromRow)]
pub struct Movie {
    pub id: i32,
    pub title: String,
    pub description: Option<String>,
    pub release_year: Option<i32>,
    pub rating: Option<f32>,
    pub image_url: Option<String>,
    pub created_at: Option<DateTime<Utc>>,
    pub updated_at: Option<DateTime<Utc>>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ApiResponse<T> {
    pub data: Option<T>,
    pub message: Option<String>,
    pub error: Option<String>,
}

impl<T> ApiResponse<T> {
    pub fn success(data: T) -> Self {
        Self {
            data: Some(data),
            message: None,
            error: None,
        }
    }

    pub fn message(msg: String) -> Self {
        Self {
            data: None,
            message: Some(msg),
            error: None,
        }
    }

    pub fn error(err: String) -> Self {
        Self {
            data: None,
            message: None,
            error: Some(err),
        }
    }
}
