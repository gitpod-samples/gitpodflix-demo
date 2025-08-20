import React, { useState } from 'react'
import SearchBar from './SearchBar'
import UserProfileDropdown from './UserProfileDropdown'
import { mockUserProfile } from '../data/mockUser'

function Navbar({ onSearchResults, onSearchToggle, isSearchActive }) {
  const [showSearch, setShowSearch] = useState(false)
  const [showProfileDropdown, setShowProfileDropdown] = useState(false)

  const handleSearchToggle = () => {
    const newSearchState = !showSearch
    setShowSearch(newSearchState)
    onSearchToggle?.(newSearchState)
  }

  const handleSearchResults = (results) => {
    onSearchResults?.(results)
  }

  const handleSearchClose = () => {
    setShowSearch(false)
    onSearchToggle?.(false)
    onSearchResults?.([])
  }

  const handleProfileClick = () => {
    setShowProfileDropdown(!showProfileDropdown)
  }

  const handleProfileClose = () => {
    setShowProfileDropdown(false)
  }

  return (
    <nav className="fixed top-0 w-full z-50 bg-gradient-to-b from-black to-transparent">
      <div className="p-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-8">
            <h1 className="text-red-600 text-2xl font-bold">GITPOD FLIX</h1>
            <div className="hidden md:flex space-x-4">
              <a href="#" className="text-white hover:text-gray-300 transition-colors">Home</a>
              <a href="#" className="text-white hover:text-gray-300 transition-colors">TV Shows</a>
              <a href="#" className="text-white hover:text-gray-300 transition-colors">Movies</a>
              <a href="#" className="text-white hover:text-gray-300 transition-colors">New & Popular</a>
              <a href="#" className="text-white hover:text-gray-300 transition-colors">My List</a>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button 
              onClick={handleSearchToggle}
              className={`text-white transition-colors ${showSearch ? 'text-red-500' : 'hover:text-gray-300'}`}
              title="Search"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            
            <button className="text-white hover:text-gray-300 transition-colors" title="Notifications">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
            
            <div className="relative">
              <img 
                src="/images/profile-avatar.jpg" 
                alt="Profile" 
                onClick={handleProfileClick}
                className={`w-8 h-8 rounded-full cursor-pointer hover:ring-2 hover:ring-red-500 transition-all duration-200 object-cover ${
                  showProfileDropdown ? 'ring-2 ring-red-500' : ''
                }`}
                title="Profile"
              />
              <UserProfileDropdown 
                isOpen={showProfileDropdown}
                onClose={handleProfileClose}
                userProfile={mockUserProfile}
              />
            </div>
          </div>
        </div>
      </div>

      {showSearch && (
        <div className="bg-black bg-opacity-95 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="max-w-2xl mx-auto">
              <SearchBar 
                onSearchResults={handleSearchResults}
                onClose={handleSearchClose}
              />
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar 
