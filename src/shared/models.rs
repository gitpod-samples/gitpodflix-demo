use serde::{Deserialize, Serialize};
use chrono::{DateTime, Utc, NaiveDateTime};

#[derive(Debug, Serialize, Deserialize, sqlx::FromRow)]
pub struct Movie {
    pub id: i32,
    pub title: String,
    pub description: Option<String>,
    pub release_year: Option<i32>,
    #[serde(serialize_with = "serialize_decimal", deserialize_with = "deserialize_decimal")]
    pub rating: Option<sqlx::types::BigDecimal>,
    pub image_url: Option<String>,
    pub created_at: Option<chrono::NaiveDateTime>,
    pub updated_at: Option<chrono::NaiveDateTime>,
}

fn serialize_decimal<S>(value: &Option<sqlx::types::BigDecimal>, serializer: S) -> Result<S::Ok, S::Error>
where
    S: serde::Serializer,
{
    match value {
        Some(decimal) => {
            let float_val: f64 = decimal.to_string().parse().unwrap_or(0.0);
            serializer.serialize_some(&float_val)
        }
        None => serializer.serialize_none(),
    }
}

fn deserialize_decimal<'de, D>(deserializer: D) -> Result<Option<sqlx::types::BigDecimal>, D::Error>
where
    D: serde::Deserializer<'de>,
{
    use serde::de::Error;
    use std::str::FromStr;
    
    let opt: Option<f64> = Option::deserialize(deserializer)?;
    match opt {
        Some(f) => {
            sqlx::types::BigDecimal::from_str(&f.to_string())
                .map(Some)
                .map_err(D::Error::custom)
        }
        None => Ok(None),
    }
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
