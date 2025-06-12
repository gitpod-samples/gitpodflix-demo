import React from 'react'

function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 bg-gradient-to-b from-black to-transparent p-4">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center space-x-8">
          <h1 className="text-red-600 text-2xl font-bold">GITPOD FLIX</h1>
          <div className="hidden md:flex space-x-4">
            <a href="#" className="text-white hover:text-gray-300">Home</a>
            <a href="#" className="text-white hover:text-gray-300">TV Shows</a>
            <a href="#" className="text-white hover:text-gray-300">Movies</a>
            <a href="#" className="text-white hover:text-gray-300">New & Popular</a>
            <a href="#" className="text-white hover:text-gray-300">My List</a>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <button className="text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
          <button className="text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </button>
          <div data-testid="profile-avatar" className="w-8 h-8 rounded bg-gray-600"></div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar 