import React, { useState } from 'react'
import VideoPlayer from './VideoPlayer'

function MovieModal({ movie, isOpen, onClose }) {
  const [showVideoPlayer, setShowVideoPlayer] = useState(false)

  if (!isOpen || !movie) return null

  const handlePlayTrailer = () => {
    setShowVideoPlayer(true)
  }

  const handleCloseVideo = () => {
    setShowVideoPlayer(false)
  }

  const handleAddToList = () => {
    // TODO: Implement add to watchlist functionality
    console.log('Added to list:', movie.title)
  }

  const handleLike = () => {
    // TODO: Implement like functionality
    console.log('Liked:', movie.title)
  }

  const handleBackdropClick = (e) => {
    // Close modal if clicking on backdrop (not on modal content)
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const handleModalContentClick = (e) => {
    // Prevent clicks inside modal content from bubbling up to backdrop
    e.stopPropagation()
  }

  return (
    <>
      {/* Movie Info Modal */}
      {!showVideoPlayer && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4"
          onClick={handleBackdropClick}
        >
          <div 
            className="bg-gray-900 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={handleModalContentClick}
          >
            {/* Header with backdrop image */}
            <div className="relative h-96 bg-gradient-to-t from-gray-900 to-transparent">
              <img 
                src={movie.image_url} 
                alt={movie.title}
                className="w-full h-full object-cover rounded-t-lg"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent"></div>
              
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 bg-black bg-opacity-50 hover:bg-opacity-75 text-white rounded-full p-2 transition-all"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Movie info overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <h1 className="text-4xl font-bold text-white mb-2">{movie.title}</h1>
                <div className="flex items-center space-x-4 mb-4">
                  <span className="text-green-500 font-semibold">
                    {Math.round(movie.rating * 10)}% Match
                  </span>
                  <span className="text-gray-300">{movie.release_year}</span>
                  {movie.rating && (
                    <div className="flex items-center">
                      <svg className="h-4 w-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="text-gray-300">{movie.rating}</span>
                    </div>
                  )}
                </div>

                {/* Action buttons */}
                <div className="flex items-center space-x-4">
                  <button
                    onClick={handlePlayTrailer}
                    className="bg-white text-black px-8 py-3 rounded flex items-center space-x-2 hover:bg-opacity-80 transition-all font-semibold"
                  >
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    </svg>
                    <span>Play</span>
                  </button>
                  
                  <button
                    onClick={handleAddToList}
                    className="bg-gray-600 bg-opacity-70 text-white p-3 rounded-full hover:bg-opacity-50 transition-all"
                    title="Add to My List"
                  >
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                  
                  <button
                    onClick={handleLike}
                    className="bg-gray-600 bg-opacity-70 text-white p-3 rounded-full hover:bg-opacity-50 transition-all"
                    title="Like"
                  >
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Movie details */}
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Main content */}
                <div className="md:col-span-2">
                  <h3 className="text-xl font-semibold text-white mb-4">About {movie.title}</h3>
                  <p className="text-gray-300 leading-relaxed mb-6">
                    {movie.description || 'No description available for this movie.'}
                  </p>
                  
                  {/* Cast and crew (mock data) */}
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-white mb-2">Cast</h4>
                    <p className="text-gray-400 text-sm">
                      {movie.cast?.join(', ') || 'Cast information not available'}
                    </p>
                  </div>
                  
                  {movie.director && (
                    <div className="mb-6">
                      <h4 className="text-lg font-semibold text-white mb-2">Director</h4>
                      <p className="text-gray-400 text-sm">{movie.director}</p>
                    </div>
                  )}
                </div>

                {/* Sidebar */}
                <div>
                  <div className="space-y-4">
                    {movie.genres && (
                      <div>
                        <h4 className="text-sm font-semibold text-gray-400 mb-2">Genres</h4>
                        <div className="flex flex-wrap gap-2">
                          {movie.genres.map((genre, index) => (
                            <span 
                              key={index}
                              className="bg-gray-700 text-gray-300 px-2 py-1 rounded text-xs"
                            >
                              {genre}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div>
                      <h4 className="text-sm font-semibold text-gray-400 mb-2">Release Year</h4>
                      <p className="text-gray-300 text-sm">{movie.release_year}</p>
                    </div>
                    
                    {movie.duration && (
                      <div>
                        <h4 className="text-sm font-semibold text-gray-400 mb-2">Duration</h4>
                        <p className="text-gray-300 text-sm">{movie.duration} minutes</p>
                      </div>
                    )}
                    
                    {movie.rating && (
                      <div>
                        <h4 className="text-sm font-semibold text-gray-400 mb-2">Rating</h4>
                        <div className="flex items-center">
                          <svg className="h-4 w-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <span className="text-gray-300 text-sm">{movie.rating}/10</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Video Player */}
      <VideoPlayer 
        movie={movie}
        isOpen={showVideoPlayer}
        onClose={handleCloseVideo}
      />
    </>
  )
}

export default MovieModal
