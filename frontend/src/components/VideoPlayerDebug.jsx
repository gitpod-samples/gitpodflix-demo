import React, { useState, useEffect } from 'react'
import { fetchMovies } from '../services/api'
import { isYouTubeUrl, extractYouTubeVideoId } from '../utils/youtubeUtils'
import VideoPlayer from './VideoPlayer'

function VideoPlayerDebug() {
  const [movies, setMovies] = useState([])
  const [selectedMovie, setSelectedMovie] = useState(null)
  const [showPlayer, setShowPlayer] = useState(false)
  const [debugInfo, setDebugInfo] = useState({})

  useEffect(() => {
    const loadMovies = async () => {
      try {
        const allMovies = await fetchMovies()
        setMovies(allMovies)
        
        // Debug each movie's video URLs
        const debug = {}
        allMovies.forEach(movie => {
          debug[movie.id] = {
            title: movie.title,
            trailer_url: movie.trailer_url,
            video_url: movie.video_url,
            isYouTube: isYouTubeUrl(movie.trailer_url || movie.video_url),
            videoId: extractYouTubeVideoId(movie.trailer_url || movie.video_url),
            hasTrailer: !!(movie.trailer_url || movie.video_url)
          }
        })
        setDebugInfo(debug)
      } catch (error) {
        console.error('Error loading movies:', error)
      }
    }

    loadMovies()
  }, [])

  const handlePlayMovie = (movie) => {
    console.log('Playing movie:', movie)
    console.log('Debug info:', debugInfo[movie.id])
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
        <h1 className="text-4xl font-bold mb-8 text-center">Video Player Debug</h1>
        
        {/* Debug Information */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Debug Information</h2>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {Object.values(debugInfo).map((info, index) => (
              <div key={index} className="bg-gray-700 p-4 rounded">
                <h3 className="text-lg font-medium text-white mb-2">{info.title}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-gray-300">
                      <span className="text-blue-400">Trailer URL:</span> 
                      {info.trailer_url ? (
                        <span className="ml-2 break-all">{info.trailer_url}</span>
                      ) : (
                        <span className="ml-2 text-red-400">None</span>
                      )}
                    </p>
                    <p className="text-gray-300">
                      <span className="text-blue-400">Video URL:</span> 
                      {info.video_url ? (
                        <span className="ml-2 break-all">{info.video_url}</span>
                      ) : (
                        <span className="ml-2 text-red-400">None</span>
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-300">
                      <span className="text-green-400">Is YouTube:</span> 
                      <span className={`ml-2 ${info.isYouTube ? 'text-green-400' : 'text-red-400'}`}>
                        {info.isYouTube ? 'Yes' : 'No'}
                      </span>
                    </p>
                    <p className="text-gray-300">
                      <span className="text-yellow-400">Video ID:</span> 
                      <span className="ml-2">{info.videoId || 'None'}</span>
                    </p>
                    <p className="text-gray-300">
                      <span className="text-purple-400">Has Trailer:</span> 
                      <span className={`ml-2 ${info.hasTrailer ? 'text-green-400' : 'text-red-400'}`}>
                        {info.hasTrailer ? 'Yes' : 'No'}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Movie Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {movies.map(movie => {
            const debug = debugInfo[movie.id] || {}
            return (
              <div key={movie.id} className="bg-gray-800 rounded-lg overflow-hidden">
                <div className="relative">
                  <img 
                    src={movie.image_url} 
                    alt={movie.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    {debug.isYouTube ? (
                      <span className="bg-red-600 text-white px-2 py-1 rounded text-xs">YouTube</span>
                    ) : debug.hasTrailer ? (
                      <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs">MP4</span>
                    ) : (
                      <span className="bg-gray-600 text-white px-2 py-1 rounded text-xs">No Video</span>
                    )}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-2">{movie.title}</h3>
                  <div className="text-sm text-gray-400 mb-3">
                    <p>Year: {movie.release_year}</p>
                    <p>Rating: {movie.rating}</p>
                  </div>
                  <button
                    onClick={() => handlePlayMovie(movie)}
                    disabled={!debug.hasTrailer}
                    className={`w-full py-2 px-4 rounded transition-colors ${
                      debug.hasTrailer 
                        ? 'bg-red-600 hover:bg-red-700 text-white' 
                        : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {debug.hasTrailer ? 'Play Trailer' : 'No Trailer'}
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        {/* Test YouTube URLs */}
        <div className="mt-8 bg-gray-800 rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Test YouTube URLs</h2>
          <div className="space-y-2">
            {[
              'https://www.youtube.com/watch?v=UaVTIH8mujA',
              'https://youtu.be/UaVTIH8mujA',
              'https://www.youtube.com/embed/UaVTIH8mujA',
              'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
            ].map((url, index) => (
              <div key={index} className="flex items-center space-x-4 text-sm">
                <span className="w-64 truncate">{url}</span>
                <span className={`px-2 py-1 rounded text-xs ${
                  isYouTubeUrl(url) ? 'bg-red-600 text-white' : 'bg-blue-600 text-white'
                }`}>
                  {isYouTubeUrl(url) ? 'YouTube' : 'Other'}
                </span>
                <span className="text-yellow-400">
                  ID: {extractYouTubeVideoId(url) || 'None'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Video Player */}
      <VideoPlayer 
        movie={selectedMovie}
        isOpen={showPlayer}
        onClose={handleClosePlayer}
      />
    </div>
  )
}

export default VideoPlayerDebug
