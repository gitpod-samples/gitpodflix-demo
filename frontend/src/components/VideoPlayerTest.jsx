import React, { useState } from 'react'
import VideoPlayer from './VideoPlayer'
import MovieModal from './MovieModal'

function VideoPlayerTest() {
  const [showVideoPlayer, setShowVideoPlayer] = useState(false)
  const [showMovieModal, setShowMovieModal] = useState(false)

  const testMovie = {
    id: 1,
    title: "Test Movie",
    description: "This is a test movie with a sample video to demonstrate the video player functionality. The video player includes Netflix-like controls, progress tracking, volume control, and fullscreen support.",
    release_year: 2024,
    rating: 8.5,
    image_url: "https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg",
    trailer_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    video_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    genres: ["Action", "Sci-Fi", "Thriller"],
    director: "Test Director",
    cast: ["Actor One", "Actor Two", "Actor Three"],
    duration: 120
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">Video Player Test</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Test Controls */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Test Controls</h2>
            <div className="space-y-4">
              <button
                onClick={() => setShowVideoPlayer(true)}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                </svg>
                <span>Test Video Player</span>
              </button>
              
              <button
                onClick={() => setShowMovieModal(true)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Test Movie Modal</span>
              </button>
            </div>
          </div>

          {/* Movie Info */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Test Movie Info</h2>
            <div className="space-y-2 text-sm">
              <p><span className="text-gray-400">Title:</span> {testMovie.title}</p>
              <p><span className="text-gray-400">Year:</span> {testMovie.release_year}</p>
              <p><span className="text-gray-400">Rating:</span> {testMovie.rating}/10</p>
              <p><span className="text-gray-400">Duration:</span> {testMovie.duration} minutes</p>
              <p><span className="text-gray-400">Genres:</span> {testMovie.genres.join(', ')}</p>
              <p><span className="text-gray-400">Director:</span> {testMovie.director}</p>
              <p><span className="text-gray-400">Video URL:</span> 
                <a href={testMovie.trailer_url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 ml-1">
                  Sample Video
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Features List */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Video Player Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-lg font-medium mb-2 text-red-400">Player Controls</h3>
              <ul className="space-y-1 text-sm text-gray-300">
                <li>• Play/Pause toggle</li>
                <li>• Progress bar with seeking</li>
                <li>• Volume control with mute</li>
                <li>• Fullscreen support</li>
                <li>• Auto-hide controls</li>
                <li>• Keyboard shortcuts (Space, Escape)</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2 text-blue-400">Netflix-like Features</h3>
              <ul className="space-y-1 text-sm text-gray-300">
                <li>• Auto-play on open</li>
                <li>• Muted by default</li>
                <li>• Smooth animations</li>
                <li>• Movie info overlay</li>
                <li>• Professional styling</li>
                <li>• Responsive design</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 text-center text-gray-400">
          <p>Click the buttons above to test the video player functionality.</p>
          <p className="text-sm mt-2">Use Space to play/pause, Escape to close, and mouse to show/hide controls.</p>
        </div>
      </div>

      {/* Video Player */}
      <VideoPlayer 
        movie={testMovie}
        isOpen={showVideoPlayer}
        onClose={() => setShowVideoPlayer(false)}
      />

      {/* Movie Modal */}
      <MovieModal 
        movie={testMovie}
        isOpen={showMovieModal}
        onClose={() => setShowMovieModal(false)}
      />
    </div>
  )
}

export default VideoPlayerTest
