use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct ProcessingResult<T> {
    pub data: Vec<T>,
    pub processed: usize,
    pub errors: Vec<String>,
}

pub fn process_movie_data<T, F>(items: Vec<T>, processor: F) -> ProcessingResult<T>
where
    F: Fn(T) -> Option<T>,
{
    let mut result = ProcessingResult {
        data: Vec::new(),
        processed: 0,
        errors: Vec::new(),
    };

    for item in items {
        match std::panic::catch_unwind(std::panic::AssertUnwindSafe(|| processor(item))) {
            Ok(Some(processed)) => {
                result.data.push(processed);
                result.processed += 1;
            }
            Ok(None) => {}
            Err(_) => {
                result.errors.push("Processing error occurred".to_string());
            }
        }
    }

    result
}

pub async fn batch_process<T, R, F, Fut>(
    items: Vec<T>,
    batch_size: usize,
    processor: F,
) -> Vec<R>
where
    T: Clone,
    F: Fn(Vec<T>) -> Fut,
    Fut: std::future::Future<Output = Vec<R>>,
{
    let mut results = Vec::new();
    
    for chunk in items.chunks(batch_size) {
        let batch_result = processor(chunk.to_vec()).await;
        results.extend(batch_result);
    }
    
    results
}

pub fn sanitize_input(input: &str) -> String {
    input
        .trim()
        .chars()
        .filter(|c| !c.is_control() || c.is_whitespace())
        .collect::<String>()
        .replace("<script", "")
        .replace("</script>", "")
        .chars()
        .take(1000)
        .collect()
}

pub fn parse_rating(rating: &str) -> f64 {
    match rating.parse::<f64>() {
        Ok(parsed) => parsed.max(0.0).min(10.0),
        Err(_) => 0.0,
    }
}

pub fn parse_rating_from_number(rating: f64) -> f64 {
    rating.max(0.0).min(10.0)
}
