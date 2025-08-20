import React, { useState, useEffect } from 'react'
import { fetchMovies } from '../services/api'
import MovieRow from './MovieRow'

function CategoryTest() {
  const [allMovies, setAllMovies] = useState([])
  const [categories, setCategories] = useState({})

  useEffect(() => {
    const loadMovies = async () => {
      try {
        const movies = await fetchMovies()
        setAllMovies(movies)
        
        // Organize movies into categories
        const trending = movies.filter(movie => movie.rating >= 8.5).slice(0, 4)
        const popular = movies.filter(movie => movie.rating >= 8.0 && movie.rating < 8.5).slice(0, 4)
        const scifi = movies.filter(movie => 
          movie.genres && movie.genres.some(genre => 
            genre.toLowerCase().includes('sci-fi') || 
            genre.toLowerCase().includes('science fiction')
          )
        ).slice(0, 4)
        
        const awardWinners = movies.filter(movie => 
          ['Parasite', 'Green Book', 'Moonlight', 'The Shape of Water'].includes(movie.title)
        ).slice(0, 4)
        
        const modernBlockbusters = movies.filter(movie => 
          ['Avatar: The Way of Water', 'Top Gun: Maverick', 'Spider-Man: No Way Home', 'Avengers: Endgame'].includes(movie.title)
        ).slice(0, 4)

        setCategories({ trending, popular, scifi, awardWinners, modernBlockbusters })
      } catch (error) {
        console.error('Error loading movies:', error)
      }
    }

    loadMovies()
  }, [])

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-center">Movie Categories Test</h1>
        
        {/* Category Statistics */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Category Statistics</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-red-500">{categories.trending?.length || 0}</div>
              <div className="text-sm text-gray-400">Trending Now</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-500">{categories.popular?.length || 0}</div>
              <div className="text-sm text-gray-400">Popular</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-500">{categories.scifi?.length || 0}</div>
              <div className="text-sm text-gray-400">Sci-Fi</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-500">{categories.awardWinners?.length || 0}</div>
              <div className="text-sm text-gray-400">Award Winners</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-500">{categories.modernBlockbusters?.length || 0}</div>
              <div className="text-sm text-gray-400">Modern Blockbusters</div>
            </div>
          </div>
          <div className="mt-4 text-center">
            <div className="text-2xl font-bold text-white">{allMovies.length}</div>
            <div className="text-sm text-gray-400">Total Movies</div>
          </div>
        </div>

        {/* Movie Categories */}
        <div className="space-y-8">
          {categories.trending && categories.trending.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-4 text-red-500">Trending Now (Rating ≥ 8.5)</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {categories.trending.map(movie => (
                  <div key={movie.id} className="bg-gray-800 rounded-lg p-4">
                    <img src={movie.image_url} alt={movie.title} className="w-full h-48 object-cover rounded mb-2" />
                    <h3 className="font-semibold">{movie.title}</h3>
                    <p className="text-sm text-gray-400">{movie.release_year} • ⭐ {movie.rating}</p>
                    <p className="text-xs text-gray-500">{movie.director}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {categories.awardWinners && categories.awardWinners.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-4 text-yellow-500">Award Winners (Oscar Best Picture)</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {categories.awardWinners.map(movie => (
                  <div key={movie.id} className="bg-gray-800 rounded-lg p-4">
                    <img src={movie.image_url} alt={movie.title} className="w-full h-48 object-cover rounded mb-2" />
                    <h3 className="font-semibold text-sm">{movie.title}</h3>
                    <p className="text-xs text-gray-400">{movie.release_year} • ⭐ {movie.rating}</p>
                    <p className="text-xs text-gray-500">{movie.director}</p>
                    <div className="mt-1">
                      {movie.genres && movie.genres.map(genre => (
                        <span key={genre} className="inline-block bg-yellow-600 text-white text-xs px-1 py-0.5 rounded mr-1 mb-1">
                          {genre}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {categories.modernBlockbusters && categories.modernBlockbusters.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-4 text-purple-500">Modern Blockbusters (2019-2022)</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {categories.modernBlockbusters.map(movie => (
                  <div key={movie.id} className="bg-gray-800 rounded-lg p-4">
                    <img src={movie.image_url} alt={movie.title} className="w-full h-48 object-cover rounded mb-2" />
                    <h3 className="font-semibold text-sm">{movie.title}</h3>
                    <p className="text-xs text-gray-400">{movie.release_year} • ⭐ {movie.rating}</p>
                    <p className="text-xs text-gray-500">{movie.director}</p>
                    <p className="text-xs text-gray-600">{movie.duration} min</p>
                    <div className="mt-1">
                      {movie.genres && movie.genres.map(genre => (
                        <span key={genre} className="inline-block bg-purple-600 text-white text-xs px-1 py-0.5 rounded mr-1 mb-1">
                          {genre}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {categories.scifi && categories.scifi.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-4 text-green-500">Sci-Fi & Fantasy</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {categories.scifi.map(movie => (
                  <div key={movie.id} className="bg-gray-800 rounded-lg p-4">
                    <img src={movie.image_url} alt={movie.title} className="w-full h-48 object-cover rounded mb-2" />
                    <h3 className="font-semibold">{movie.title}</h3>
                    <p className="text-sm text-gray-400">{movie.release_year} • ⭐ {movie.rating}</p>
                    <p className="text-xs text-gray-500">{movie.director}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 text-center text-gray-400">
          <p>Visit the main app to see these categories in Netflix-style rows!</p>
          <p className="text-sm mt-2">All movies include full metadata: genres, director, cast, duration, and YouTube trailers.</p>
        </div>
      </div>
    </div>
  )
}

export default CategoryTest
