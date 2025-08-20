import React, { useState, useRef, useEffect } from 'react'
import { extractYouTubeVideoId, getYouTubeEmbedUrl, isYouTubeUrl } from '../utils/youtubeUtils'

function YouTubePlayer({ movie, isOpen, onClose }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const iframeRef = useRef(null)
  const containerRef = useRef(null)
  const controlsTimeoutRef = useRef(null)

  // Extract YouTube video ID from trailer URL
  const trailerUrl = movie?.trailer_url || movie?.video_url
  const videoId = extractYouTubeVideoId(trailerUrl)
  const embedUrl = videoId ? getYouTubeEmbedUrl(videoId, {
    autoplay: 1,
    mute: 0, // Enable sound - note: some browsers may still start muted due to autoplay policies
    controls: 1, // Show YouTube's native controls for full functionality including volume
    showinfo: 0,
    rel: 0,
    modestbranding: 1,
    playsinline: 1,
    fs: 1, // Allow fullscreen
    cc_load_policy: 1, // Show closed captions if available
    iv_load_policy: 3, // Hide video annotations
    disablekb: 0, // Enable keyboard controls
    start: 0 // Start from beginning
  }) : null

  // Debug logging
  console.log('YouTubePlayer Debug:', {
    movie: movie?.title,
    trailerUrl,
    videoId,
    embedUrl,
    isOpen
  })

  // Auto-hide controls after 3 seconds of inactivity
  useEffect(() => {
    if (showControls && isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false)
      }, 3000)
    }

    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current)
      }
    }
  }, [showControls, isPlaying])

  // Handle mouse movement to show controls
  const handleMouseMove = () => {
    setShowControls(true)
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current)
    }
  }

  // Close on escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  // Handle iframe load
  const handleIframeLoad = () => {
    setIsLoading(false)
    setIsPlaying(true)
  }

  if (!isOpen || !movie) return null
  
  // If no video ID, show error message
  if (!videoId) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
        <div className="relative w-full max-w-6xl mx-4 bg-black rounded-lg overflow-hidden p-8">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 bg-black bg-opacity-50 hover:bg-opacity-75 text-white rounded-full p-2 transition-all"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div className="text-center text-white">
            <svg className="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <p className="text-xl mb-2">YouTube trailer not available</p>
            <p className="text-sm text-gray-400">Could not extract video ID from: {trailerUrl}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
      <div 
        ref={containerRef}
        className="relative w-full max-w-6xl mx-4 bg-black rounded-lg"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setShowControls(false)}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-black bg-opacity-50 hover:bg-opacity-75 text-white rounded-full p-2 transition-all"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* YouTube Embed */}
        <div className="relative w-full bg-black rounded-lg overflow-hidden" style={{ paddingBottom: '56.25%' /* 16:9 aspect ratio */ }}>
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black z-10">
              <div className="text-center text-white">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
                <p>Loading trailer...</p>
              </div>
            </div>
          )}
          
          <iframe
            ref={iframeRef}
            src={embedUrl}
            title={`${movie.title} Trailer`}
            className="absolute top-0 left-0 w-full h-full"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            onLoad={handleIframeLoad}
          />
        </div>

        {/* Minimal Custom Overlay - Only show movie info, don't interfere with YouTube controls */}
        <div 
          className={`absolute top-0 left-0 right-0 bg-gradient-to-b from-black via-transparent to-transparent transition-opacity duration-300 pointer-events-none ${
            showControls ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {/* Top Info Bar */}
          <div className="absolute top-0 left-0 right-0 p-4 pointer-events-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {/* Movie Info */}
                <div className="text-white">
                  <h3 className="font-semibold text-lg">{movie.title} - Official Trailer</h3>
                  <p className="text-sm text-gray-300">{movie.release_year}</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                {/* YouTube Logo/Link */}
                <a
                  href={movie.trailer_url || movie.video_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded transition-colors"
                  title="Watch on YouTube"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                  <span className="text-sm">YouTube</span>
                </a>

                {/* Add to List Button */}
                <button 
                  className="bg-gray-600 bg-opacity-70 text-white p-2 rounded-full hover:bg-opacity-50 transition-all"
                  title="Add to My List"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* No Video Available */}
        {!videoId && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75">
            <div className="text-center text-white">
              <svg className="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <p className="text-xl mb-2">No trailer available</p>
              <p className="text-sm text-gray-400">This movie doesn't have a YouTube trailer</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default YouTubePlayer
