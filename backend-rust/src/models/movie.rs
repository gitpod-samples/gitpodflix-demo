use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use chrono::Datelike;

#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
pub struct Movie {
    pub id: Option<i32>,
    pub title: String,
    pub description: String,
    pub release_year: i32,
    pub rating: f64,
    pub image_url: String,
}

impl Movie {
    pub fn validate(&self) -> Vec<String> {
        let mut errors = Vec::new();
        
        if self.title.trim().is_empty() {
            errors.push("Title is required".to_string());
        }
        
        if self.description.trim().is_empty() {
            errors.push("Description is required".to_string());
        }
        
        let current_year = chrono::Utc::now().year();
        if self.release_year < 1900 || self.release_year > current_year {
            errors.push("Release year must be between 1900 and current year".to_string());
        }
        
        if self.rating < 0.0 || self.rating > 10.0 {
            errors.push("Rating must be between 0 and 10".to_string());
        }
        
        if !is_valid_url(&self.image_url) {
            errors.push("Valid image URL is required".to_string());
        }
        
        errors
    }
}

fn is_valid_url(url: &str) -> bool {
    url::Url::parse(url).is_ok()
}
