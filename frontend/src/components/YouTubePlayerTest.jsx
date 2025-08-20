import React, { useState } from 'react'
import YouTubePlayer from './YouTubePlayer'
import { extractYouTubeVideoId, getYouTubeEmbedUrl, getYouTubeThumbnail } from '../utils/youtubeUtils'

function YouTubePlayerTest() {
  const [showPlayer, setShowPlayer] = useState(false)
  const [selectedMovie, setSelectedMovie] = useState(null)

  const testMovies = [
    {
      id: 1,
      title: "The Godfather",
      description: "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.",
      release_year: 1972,
      rating: 9.2,
      image_url: "https://m.media-amazon.com/images/M/MV5BM2MyNjYxNmUtYTAwNi00MTYxLWJmNWYtYzZlODY3ZTk3OTFlXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg",
      trailer_url: "https://www.youtube.com/watch?v=UaVTIH8mujA",
      youtube_trailer_id: "UaVTIH8mujA"
    },
    {
      id: 2,
      title: "The Matrix",
      description: "A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.",
      release_year: 1999,
      rating: 8.7,
      image_url: "https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg",
      trailer_url: "https://www.youtube.com/watch?v=vKQi3bBA1y8",
      youtube_trailer_id: "vKQi3bBA1y8"
    },
    {
      id: 3,
      title: "The Dark Knight",
      description: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests.",
      release_year: 2008,
      rating: 9.0,
      image_url: "https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_.jpg",
      trailer_url: "https://www.youtube.com/watch?v=EXeTwQWrcwY",
      youtube_trailer_id: "EXeTwQWrcwY"
    },
    {
      id: 4,
      title: "Inception",
      description: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
      release_year: 2010,
      rating: 8.8,
      image_url: "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_.jpg",
      trailer_url: "https://www.youtube.com/watch?v=YoHD9XEInc0",
      youtube_trailer_id: "YoHD9XEInc0"
    }
  ]

  const handlePlayTrailer = (movie) => {
    setSelectedMovie(movie)
    setShowPlayer(true)
  }

  const handleClosePlayer = () => {
    setShowPlayer(false)
    setSelectedMovie(null)
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">YouTube Player Test</h1>
        
        {/* Utility Functions Test */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">YouTube Utility Functions Test</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium mb-2 text-blue-400">URL Parsing Test</h3>
              <div className="space-y-2 text-sm">
                {testMovies.map(movie => {
                  const videoId = extractYouTubeVideoId(movie.trailer_url)
                  const embedUrl = getYouTubeEmbedUrl(videoId)
                  const thumbnail = getYouTubeThumbnail(videoId)
                  
                  return (
                    <div key={movie.id} className="bg-gray-700 p-3 rounded">
                      <p className="text-white font-medium">{movie.title}</p>
                      <p className="text-gray-300">Original: {movie.trailer_url}</p>
                      <p className="text-green-400">Video ID: {videoId}</p>
                      <p className="text-blue-400">Embed URL: {embedUrl?.substring(0, 60)}...</p>
                      <p className="text-yellow-400">Thumbnail: {thumbnail}</p>
                    </div>
                  )
                })}
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2 text-red-400">Thumbnail Preview</h3>
              <div className="grid grid-cols-2 gap-2">
                {testMovies.map(movie => {
                  const videoId = extractYouTubeVideoId(movie.trailer_url)
                  const thumbnail = getYouTubeThumbnail(videoId)
                  
                  return (
                    <div key={movie.id} className="text-center">
                      <img 
                        src={thumbnail} 
                        alt={`${movie.title} thumbnail`}
                        className="w-full h-20 object-cover rounded mb-1"
                      />
                      <p className="text-xs text-gray-400">{movie.title}</p>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Movie Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {testMovies.map(movie => (
            <div key={movie.id} className="bg-gray-800 rounded-lg overflow-hidden hover:transform hover:scale-105 transition-all duration-300">
              <div className="relative">
                <img 
                  src={movie.image_url} 
                  alt={movie.title}
                  className="w-full h-64 object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-60 transition-all duration-300 flex items-center justify-center">
                  <button
                    onClick={() => handlePlayTrailer(movie)}
                    className="bg-red-600 hover:bg-red-700 text-white rounded-full p-4 transform scale-0 hover:scale-100 transition-all duration-300 opacity-0 hover:opacity-100"
                  >
                    <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2">{movie.title}</h3>
                <div className="flex items-center space-x-2 text-sm text-gray-400 mb-2">
                  <span>{movie.release_year}</span>
                  <span>•</span>
                  <div className="flex items-center">
                    <svg className="h-4 w-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span>{movie.rating}</span>
                  </div>
                </div>
                <p className="text-gray-300 text-sm line-clamp-3">{movie.description}</p>
                <button
                  onClick={() => handlePlayTrailer(movie)}
                  className="w-full mt-4 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded transition-colors flex items-center justify-center space-x-2"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  </svg>
                  <span>Play Trailer</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Features List */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">YouTube Integration Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium mb-2 text-red-400">YouTube Player Features</h3>
              <ul className="space-y-1 text-sm text-gray-300">
                <li>• Automatic YouTube URL detection</li>
                <li>• Embedded YouTube player with custom controls</li>
                <li>• Auto-play with muted start</li>
                <li>• Custom overlay with movie information</li>
                <li>• Direct link to watch on YouTube</li>
                <li>• Responsive iframe embedding</li>
                <li>• Loading states and error handling</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2 text-blue-400">URL Parsing Capabilities</h3>
              <ul className="space-y-1 text-sm text-gray-300">
                <li>• youtube.com/watch?v=VIDEO_ID</li>
                <li>• youtu.be/VIDEO_ID</li>
                <li>• youtube.com/embed/VIDEO_ID</li>
                <li>• youtube.com/v/VIDEO_ID</li>
                <li>• Automatic thumbnail generation</li>
                <li>• Video ID extraction and validation</li>
                <li>• Embed URL generation with parameters</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 text-center text-gray-400">
          <p>Click on any movie poster or "Play Trailer" button to test YouTube video embedding.</p>
          <p className="text-sm mt-2">The player will automatically detect YouTube URLs and embed them properly.</p>
        </div>
      </div>

      {/* YouTube Player */}
      <YouTubePlayer 
        movie={selectedMovie}
        isOpen={showPlayer}
        onClose={handleClosePlayer}
      />
    </div>
  )
}

export default YouTubePlayerTest
