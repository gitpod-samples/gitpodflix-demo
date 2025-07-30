use crate::models::movie::Movie;

pub fn format_movie_title(title: &str) -> String {
    title
        .split_whitespace()
        .map(|word| {
            let mut chars = word.chars();
            match chars.next() {
                None => String::new(),
                Some(first) => first.to_uppercase().collect::<String>() + &chars.as_str().to_lowercase(),
            }
        })
        .collect::<Vec<_>>()
        .join(" ")
}

pub fn calculate_average_rating(movies: &[Movie]) -> f64 {
    if movies.is_empty() {
        return 0.0;
    }
    
    let sum: f64 = movies.iter().map(|movie| movie.rating).sum();
    (sum / movies.len() as f64 * 10.0).round() / 10.0
}

pub fn filter_movies_by_decade(movies: &[Movie], decade: i32) -> Vec<Movie> {
    let start_year = decade;
    let end_year = decade + 9;
    
    movies
        .iter()
        .filter(|movie| movie.release_year >= start_year && movie.release_year <= end_year)
        .cloned()
        .collect()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_format_movie_title() {
        assert_eq!(format_movie_title("the dark knight"), "The Dark Knight");
        assert_eq!(format_movie_title("PULP FICTION"), "Pulp Fiction");
        assert_eq!(format_movie_title("fight club"), "Fight Club");
        assert_eq!(format_movie_title(""), "");
        assert_eq!(format_movie_title("matrix"), "Matrix");
        assert_eq!(format_movie_title("MATRIX"), "Matrix");
    }

    #[test]
    fn test_calculate_average_rating() {
        let movies = vec![
            Movie {
                id: Some(1),
                title: "Movie 1".to_string(),
                description: "Desc 1".to_string(),
                release_year: 2000,
                rating: 8.0,
                image_url: "url1".to_string(),
            },
            Movie {
                id: Some(2),
                title: "Movie 2".to_string(),
                description: "Desc 2".to_string(),
                release_year: 2001,
                rating: 9.0,
                image_url: "url2".to_string(),
            },
            Movie {
                id: Some(3),
                title: "Movie 3".to_string(),
                description: "Desc 3".to_string(),
                release_year: 2002,
                rating: 7.0,
                image_url: "url3".to_string(),
            },
        ];

        assert_eq!(calculate_average_rating(&movies), 8.0);
        assert_eq!(calculate_average_rating(&[]), 0.0);

        let single_movie = vec![Movie {
            id: Some(1),
            title: "Solo Movie".to_string(),
            description: "Desc".to_string(),
            release_year: 2000,
            rating: 7.5,
            image_url: "url".to_string(),
        }];

        assert_eq!(calculate_average_rating(&single_movie), 7.5);
    }
}
