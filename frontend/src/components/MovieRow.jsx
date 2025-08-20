import React from 'react'

function MovieRow({ title, movies, showTitle = true, onMovieClick }) {
  const handleMovieClick = (movie) => {
    if (onMovieClick) {
      onMovieClick(movie)
    }
  }

  const handlePlayClick = (e, movie) => {
    e.stopPropagation() // Prevent triggering the movie click
    handleMovieClick(movie)
  }

  return (
    <div className="w-full">
      {showTitle && <h2 className="text-2xl font-bold mb-4 px-4 md:px-8">{title}</h2>}
      <div className="relative">
        <div className="grid grid-cols-5 gap-3 pb-4 px-4 md:px-8">
          {movies.map((movie) => (
            <div 
              key={movie.id} 
              className="group cursor-pointer transform transition-all duration-300 hover:scale-105"
              onClick={() => handleMovieClick(movie)}
            >
              <div className="relative overflow-hidden rounded-lg aspect-[2/3]">
                <img
                  src={movie.image_url}
                  alt={movie.title}
                  className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-110"
                />

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-300 flex items-center justify-center">
                  <div className="transform scale-0 group-hover:scale-100 transition-transform duration-300">
                    <button 
                      onClick={(e) => handlePlayClick(e, movie)}
                      className="bg-red-600 hover:bg-red-700 text-white rounded-full p-4 shadow-lg transition-all duration-200 hover:scale-110"
                      title={`Play ${movie.title}`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Movie Info Overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-3 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="text-white font-semibold text-sm mb-1">{movie.title}</h3>
                  <div className="flex items-center space-x-2 text-xs text-gray-300">
                    <span>{movie.release_year}</span>
                    {movie.rating && (
                      <>
                        <span>•</span>
                        <div className="flex items-center">
                          <svg className="h-3 w-3 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <span>{movie.rating}</span>
                        </div>
                      </>
                    )}
                  </div>
                  {movie.description && (
                    <p className="text-gray-400 text-xs mt-1 line-clamp-2">
                      {movie.description.length > 80 
                        ? `${movie.description.substring(0, 80)}...` 
                        : movie.description
                      }
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default MovieRow 
