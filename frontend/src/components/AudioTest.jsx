import React, { useState } from 'react'
import YouTubePlayer from './YouTubePlayer'

function AudioTest() {
  const [showPlayer, setShowPlayer] = useState(false)

  const testMovie = {
    id: 1,
    title: "The Godfather - Audio Test",
    description: "Testing YouTube audio functionality",
    release_year: 1972,
    rating: 9.2,
    image_url: "https://image.tmdb.org/t/p/w500/rPdtLWNsZmAtoZl9PK7S2wE3qiS.jpg",
    trailer_url: "https://www.youtube.com/watch?v=UaVTIH8mujA",
    video_url: "https://www.youtube.com/watch?v=UaVTIH8mujA"
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center max-w-2xl mx-auto p-8">
        <h1 className="text-4xl font-bold mb-8">YouTube Audio Test</h1>
        
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Audio Features Enabled</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
            <div>
              <h3 className="text-lg font-medium mb-2 text-green-400">✅ Fixed Issues</h3>
              <ul className="space-y-1 text-sm text-gray-300">
                <li>• Sound enabled (mute: 0)</li>
                <li>• YouTube controls visible (controls: 1)</li>
                <li>• Proper iframe dimensions</li>
                <li>• No control cropping</li>
                <li>• Volume controls accessible</li>
                <li>• Fullscreen enabled</li>
                <li>• Keyboard controls enabled</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2 text-blue-400">🎵 Audio Features</h3>
              <ul className="space-y-1 text-sm text-gray-300">
                <li>• Volume slider in YouTube controls</li>
                <li>• Mute/unmute button</li>
                <li>• Closed captions available</li>
                <li>• Full audio quality</li>
                <li>• Keyboard volume controls (↑↓)</li>
                <li>• Right-click context menu</li>
                <li>• Audio settings in YouTube menu</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-yellow-900 border border-yellow-600 rounded-lg p-4 mb-8">
          <h3 className="text-lg font-semibold mb-2 text-yellow-300">⚠️ Browser Autoplay Policy</h3>
          <p className="text-sm text-yellow-200">
            Some browsers may still start videos muted due to autoplay policies. 
            If the video starts without sound, click the volume button in the YouTube controls to unmute.
          </p>
        </div>

        <div className="mb-4">
          <p className="text-gray-300 mb-2">Testing with: <strong>The Godfather (1972) Official Trailer</strong></p>
          <p className="text-sm text-gray-400">This trailer has clear dialogue and music to test audio quality.</p>
        </div>

        <button
          onClick={() => setShowPlayer(true)}
          className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-lg text-xl font-semibold transition-colors"
        >
          🎬 Test YouTube Audio Player
        </button>

        <div className="mt-8 text-sm text-gray-400">
          <p>Expected behavior:</p>
          <p>1. Video opens with YouTube controls visible at bottom</p>
          <p>2. Volume controls are accessible and functional</p>
          <p>3. Audio plays clearly (may start muted due to browser policy)</p>
          <p>4. All YouTube controls work including fullscreen</p>
        </div>
      </div>

      <YouTubePlayer 
        movie={testMovie}
        isOpen={showPlayer}
        onClose={() => setShowPlayer(false)}
      />
    </div>
  )
}

export default AudioTest
