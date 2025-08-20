import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route, createBrowserRouter, RouterProvider } from 'react-router-dom'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import MovieRow from './components/MovieRow'
import SearchResults from './components/SearchResults'
import MovieModal from './components/MovieModal'
import { fetchMovies } from './services/api'

function Home() {
  const [movies, setMovies] = useState({
    trending: [],
    popular: [],
    scifi: [],
    awardWinners: [],
    modernBlockbusters: []
  });
  const [searchResults, setSearchResults] = useState([])
  const [isSearchActive, setIsSearchActive] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedMovie, setSelectedMovie] = useState(null)
  const [showMovieModal, setShowMovieModal] = useState(false)

  useEffect(() => {
    const loadMovies = async () => {
      try {
        const allMovies = await fetchMovies();
        
        // Organize movies into categories using the new categories column
        const trending = allMovies.filter(movie => 
          movie.categories && movie.categories.includes('trending')
        ).slice(0, 5);
        
        const popular = allMovies.filter(movie => 
          movie.categories && movie.categories.includes('popular')
        ).slice(0, 5);
        
        const scifi = allMovies.filter(movie => 
          movie.categories && movie.categories.includes('scifi')
        ).slice(0, 5);
        
        const awardWinners = allMovies.filter(movie => 
          movie.categories && movie.categories.includes('awardWinners')
        ).slice(0, 5);
        
        const modernBlockbusters = allMovies.filter(movie => 
          movie.categories && movie.categories.includes('modernBlockbusters')
        ).slice(0, 5);

        setMovies({ trending, popular, scifi, awardWinners, modernBlockbusters });
      } catch (error) {
        console.error('Error loading movies:', error);
      }
    };

    loadMovies();
  }, []);

  const handleSearchResults = (results) => {
    setSearchResults(results)
    setIsSearchActive(results.length > 0)
  }

  const handleSearchToggle = (isActive) => {
    setIsSearchActive(isActive)
    if (!isActive) {
      setSearchResults([])
      setSearchQuery('')
    }
  }

  const handleClearSearch = () => {
    setSearchResults([])
    setIsSearchActive(false)
    setSearchQuery('')
  }

  const handleMovieClick = (movie) => {
    setSelectedMovie(movie)
    setShowMovieModal(true)
  }

  const handleCloseModal = () => {
    setShowMovieModal(false)
    setSelectedMovie(null)
  }

  return (
    <div className="bg-black min-h-screen text-white">
      <Navbar 
        onSearchResults={handleSearchResults}
        onSearchToggle={handleSearchToggle}
        isSearchActive={isSearchActive}
      />
      
      {isSearchActive && searchResults.length > 0 ? (
        <div className="pt-32">
          <SearchResults
            results={searchResults}
            query={searchQuery}
            isLoading={false}
            onClearSearch={handleClearSearch}
          />
        </div>
      ) : (
        <>
          <Hero />
          <div className="mt-8 space-y-8">
            <MovieRow 
              title="Trending Now" 
              movies={movies.trending} 
              onMovieClick={handleMovieClick}
            />
            <MovieRow 
              title="Popular on Gitpod Flix" 
              movies={movies.popular} 
              onMovieClick={handleMovieClick}
            />
            <MovieRow 
              title="Sci-Fi & Fantasy" 
              movies={movies.scifi} 
              onMovieClick={handleMovieClick}
            />
            <MovieRow 
              title="Award Winners" 
              movies={movies.awardWinners} 
              onMovieClick={handleMovieClick}
            />
            <MovieRow 
              title="Modern Blockbusters" 
              movies={movies.modernBlockbusters} 
              onMovieClick={handleMovieClick}
            />
          </div>
        </>
      )}

      {/* Movie Modal */}
      <MovieModal 
        movie={selectedMovie}
        isOpen={showMovieModal}
        onClose={handleCloseModal}
      />
    </div>
  )
}

// Import test components
import VideoPlayerDebug from './components/VideoPlayerDebug'
import QuickTest from './components/QuickTest'
import AudioTest from './components/AudioTest'
import CategoryTest from './components/CategoryTest'

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/debug",
    element: <VideoPlayerDebug />,
  },
  {
    path: "/test",
    element: <QuickTest />,
  },
  {
    path: "/audio",
    element: <AudioTest />,
  },
  {
    path: "/categories",
    element: <CategoryTest />,
  }
], {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true
  }
})

function App() {
  return <RouterProvider router={router} />
}

export default App 
