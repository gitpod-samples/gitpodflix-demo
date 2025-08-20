import React, { useState, useEffect, useRef } from 'react'
import { searchMovies, getSearchSuggestions } from '../services/api'

function SearchBar({ onSearchResults, onClose }) {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [filters, setFilters] = useState({
    genres: [],
    yearRange: { min: 1900, max: new Date().getFullYear() },
    ratingRange: { min: 0, max: 10 },
    durationRange: { min: 0, max: 300 }
  })
  const [showFilters, setShowFilters] = useState(false)
  const searchRef = useRef(null)
  const debounceRef = useRef(null)

  // Available filter options
  const genreOptions = [
    'Action', 'Adventure', 'Animation', 'Comedy', 'Crime', 'Documentary',
    'Drama', 'Family', 'Fantasy', 'Horror', 'Music', 'Mystery', 'Romance',
    'Science Fiction', 'Thriller', 'War', 'Western'
  ]

  // Debounced search function
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }

    if (query.length >= 2) {
      debounceRef.current = setTimeout(async () => {
        setIsLoading(true)
        try {
          const [searchResults, searchSuggestions] = await Promise.all([
            searchMovies(query, filters),
            getSearchSuggestions(query)
          ])
          onSearchResults(searchResults)
          setSuggestions(searchSuggestions)
        } catch (error) {
          console.error('Search error:', error)
          setSuggestions([])
        } finally {
          setIsLoading(false)
        }
      }, 300)
    } else {
      setSuggestions([])
      if (query.length === 0) {
        onSearchResults([])
      }
    }

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
    }
  }, [query, filters, onSearchResults])

  // Handle click outside to close suggestions
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleInputChange = (e) => {
    setQuery(e.target.value)
    setIsOpen(true)
  }

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion)
    setIsOpen(false)
    searchRef.current?.querySelector('input')?.focus()
  }

  const handleGenreToggle = (genre) => {
    setFilters(prev => ({
      ...prev,
      genres: prev.genres.includes(genre)
        ? prev.genres.filter(g => g !== genre)
        : [...prev.genres, genre]
    }))
  }

  const clearFilters = () => {
    setFilters({
      genres: [],
      yearRange: { min: 1900, max: new Date().getFullYear() },
      ratingRange: { min: 0, max: 10 },
      durationRange: { min: 0, max: 300 }
    })
  }

  const clearSearch = () => {
    setQuery('')
    setSuggestions([])
    onSearchResults([])
    onClose?.()
  }

  return (
    <div className="relative w-full max-w-2xl" ref={searchRef}>
      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          placeholder="Search movies, shows, actors..."
          className="block w-full pl-10 pr-12 py-3 border border-gray-600 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
        />
        <div className="absolute inset-y-0 right-0 flex items-center">
          {isLoading && (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
          )}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="p-2 text-gray-400 hover:text-white mr-1"
            title="Filters"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
            </svg>
          </button>
          {query && (
            <button
              onClick={clearSearch}
              className="p-2 text-gray-400 hover:text-white"
              title="Clear search"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Search Suggestions Dropdown */}
      {isOpen && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-gray-800 border border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              className="w-full px-4 py-2 text-left text-white hover:bg-gray-700 focus:bg-gray-700 focus:outline-none"
            >
              <div className="flex items-center">
                <svg className="h-4 w-4 text-gray-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                {suggestion}
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Advanced Filters Panel */}
      {showFilters && (
        <div className="absolute z-40 w-full mt-1 bg-gray-800 border border-gray-600 rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-white">Filters</h3>
            <button
              onClick={clearFilters}
              className="text-sm text-red-500 hover:text-red-400"
            >
              Clear All
            </button>
          </div>

          {/* Genres */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">Genres</label>
            <div className="flex flex-wrap gap-2">
              {genreOptions.map(genre => (
                <button
                  key={genre}
                  onClick={() => handleGenreToggle(genre)}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    filters.genres.includes(genre)
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {genre}
                </button>
              ))}
            </div>
          </div>

          {/* Year Range */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">Release Year</label>
            <div className="flex items-center space-x-4">
              <input
                type="number"
                min="1900"
                max={new Date().getFullYear()}
                value={filters.yearRange.min}
                onChange={(e) => setFilters(prev => ({
                  ...prev,
                  yearRange: { ...prev.yearRange, min: parseInt(e.target.value) }
                }))}
                className="w-20 px-2 py-1 bg-gray-700 text-white rounded border border-gray-600 focus:border-red-500 focus:outline-none"
              />
              <span className="text-gray-400">to</span>
              <input
                type="number"
                min="1900"
                max={new Date().getFullYear()}
                value={filters.yearRange.max}
                onChange={(e) => setFilters(prev => ({
                  ...prev,
                  yearRange: { ...prev.yearRange, max: parseInt(e.target.value) }
                }))}
                className="w-20 px-2 py-1 bg-gray-700 text-white rounded border border-gray-600 focus:border-red-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Rating Range */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Rating: {filters.ratingRange.min} - {filters.ratingRange.max}
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="range"
                min="0"
                max="10"
                step="0.1"
                value={filters.ratingRange.min}
                onChange={(e) => setFilters(prev => ({
                  ...prev,
                  ratingRange: { ...prev.ratingRange, min: parseFloat(e.target.value) }
                }))}
                className="flex-1"
              />
              <input
                type="range"
                min="0"
                max="10"
                step="0.1"
                value={filters.ratingRange.max}
                onChange={(e) => setFilters(prev => ({
                  ...prev,
                  ratingRange: { ...prev.ratingRange, max: parseFloat(e.target.value) }
                }))}
                className="flex-1"
              />
            </div>
          </div>

          {/* Duration Range */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Duration: {filters.durationRange.min} - {filters.durationRange.max} minutes
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="range"
                min="0"
                max="300"
                step="5"
                value={filters.durationRange.min}
                onChange={(e) => setFilters(prev => ({
                  ...prev,
                  durationRange: { ...prev.durationRange, min: parseInt(e.target.value) }
                }))}
                className="flex-1"
              />
              <input
                type="range"
                min="0"
                max="300"
                step="5"
                value={filters.durationRange.max}
                onChange={(e) => setFilters(prev => ({
                  ...prev,
                  durationRange: { ...prev.durationRange, max: parseInt(e.target.value) }
                }))}
                className="flex-1"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SearchBar
