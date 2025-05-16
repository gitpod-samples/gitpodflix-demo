import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route, createBrowserRouter, RouterProvider } from 'react-router-dom'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import MovieRow from './components/MovieRow'
import { fetchMovies } from './services/api'

function Home() {
  const [movies, setMovies] = useState({
    trending: [],
    popular: [],
    scifi: []
  });

  useEffect(() => {
    const loadMovies = async () => {
      try {
        const allMovies = await fetchMovies();
        // Organize movies into categories based on rating
        const trending = allMovies.slice(0, 4);
        const popular = allMovies.slice(4, 8);
        const scifi = allMovies.slice(8, 12);
        
        setMovies({ trending, popular, scifi });
      } catch (error) {
        console.error('Error loading movies:', error);
      }
    };

    loadMovies();
  }, []);

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
  return <RouterProvider router={router} />
}

export default App
