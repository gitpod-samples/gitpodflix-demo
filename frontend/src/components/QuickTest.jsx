import React, { useState } from 'react'
import VideoPlayer from './VideoPlayer'

function QuickTest() {
  const [showPlayer, setShowPlayer] = useState(false)

  const testMovie = {
    id: 1,
    title: "The Godfather",
    description: "Test movie with YouTube trailer",
    release_year: 1972,
    rating: 9.2,
    image_url: "https://image.tmdb.org/t/p/w500/rPdtLWNsZmAtoZl9PK7S2wE3qiS.jpg",
    trailer_url: "https://www.youtube.com/watch?v=UaVTIH8mujA",
    video_url: "https://www.youtube.com/watch?v=UaVTIH8mujA"
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-8">Quick YouTube Test</h1>
        <div className="mb-4">
          <p>Movie: {testMovie.title}</p>
          <p>Trailer URL: {testMovie.trailer_url}</p>
        </div>
        <button
          onClick={() => setShowPlayer(true)}
          className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-lg text-xl"
        >
          Test YouTube Player
        </button>
      </div>

      <VideoPlayer 
        movie={testMovie}
        isOpen={showPlayer}
        onClose={() => setShowPlayer(false)}
      />
    </div>
  )
}

export default QuickTest
