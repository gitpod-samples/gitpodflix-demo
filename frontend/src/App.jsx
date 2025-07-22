import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route, createBrowserRouter, RouterProvider } from 'react-router-dom'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import MovieRow from './components/MovieRow'
import ErrorBoundary from './components/ErrorBoundary'
import { fetchMovies } from './services/api'

function Home() {
  const [movies, setMovies] = useState({
    trending: [],
    popular: [],
    scifi: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadMovies = async () => {
      try {
        setLoading(true);
        setError(null);
        const allMovies = await fetchMovies();
        // Organize movies into categories based on rating
        const trending = allMovies.slice(0, 4);
        const popular = allMovies.slice(4, 8);
        const scifi = allMovies.slice(8, 12);
        
        setMovies({ trending, popular, scifi });
      } catch (error) {
        console.error('Error loading movies:', error);
        setError('Failed to load movies. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadMovies();
  }, []);

  if (loading) {
    return (
      <div className="bg-black min-h-screen text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading movies...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-black min-h-screen text-white">
        <Navbar />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center max-w-md mx-auto p-8">
            <h2 className="text-2xl font-bold text-red-500 mb-4">Unable to Load Content</h2>
            <p className="text-gray-400 mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen text-white">
      <Navbar />
      <Hero />
      <div className="mt-8 space-y-8">
        <MovieRow title="Trending Now" movies={movies.trending} />
        <MovieRow title="Popular on Gitpod Flix" movies={movies.popular} />
        <MovieRow title="Sci-Fi & Fantasy" movies={movies.scifi} />
      </div>
    </div>
  )
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  }
], {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true
  }
})

function App() {
  return (
    <ErrorBoundary>
      <RouterProvider router={router} />
    </ErrorBoundary>
  )
}

export default App 
