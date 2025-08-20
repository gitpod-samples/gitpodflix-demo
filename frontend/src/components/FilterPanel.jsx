import React from 'react'

function FilterPanel({ filters, onFiltersChange, onClear, isVisible, onClose }) {
  const genreOptions = [
    'Action', 'Adventure', 'Animation', 'Comedy', 'Crime', 'Documentary',
    'Drama', 'Family', 'Fantasy', 'Horror', 'Music', 'Mystery', 'Romance',
    'Science Fiction', 'Thriller', 'War', 'Western'
  ]

  const handleGenreToggle = (genre) => {
    const newGenres = filters.genres.includes(genre)
      ? filters.genres.filter(g => g !== genre)
      : [...filters.genres, genre]
    
    onFiltersChange({
      ...filters,
      genres: newGenres
    })
  }

  const handleYearChange = (type, value) => {
    onFiltersChange({
      ...filters,
      yearRange: {
        ...filters.yearRange,
        [type]: parseInt(value)
      }
    })
  }

  const handleRatingChange = (type, value) => {
    onFiltersChange({
      ...filters,
      ratingRange: {
        ...filters.ratingRange,
        [type]: parseFloat(value)
      }
    })
  }

  const handleDurationChange = (type, value) => {
    onFiltersChange({
      ...filters,
      durationRange: {
        ...filters.durationRange,
        [type]: parseInt(value)
      }
    })
  }

  const getActiveFiltersCount = () => {
    let count = 0
    if (filters.genres.length > 0) count++
    if (filters.yearRange.min > 1900 || filters.yearRange.max < new Date().getFullYear()) count++
    if (filters.ratingRange.min > 0 || filters.ratingRange.max < 10) count++
    if (filters.durationRange.min > 0 || filters.durationRange.max < 300) count++
    return count
  }

  if (!isVisible) return null

  return (
    <div className="absolute z-40 w-full mt-1 bg-gray-800 border border-gray-600 rounded-lg shadow-lg">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b border-gray-600">
        <div className="flex items-center space-x-2">
          <h3 className="text-lg font-semibold text-white">Filters</h3>
          {getActiveFiltersCount() > 0 && (
            <span className="bg-red-600 text-white text-xs px-2 py-1 rounded-full">
              {getActiveFiltersCount()}
            </span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={onClear}
            className="text-sm text-red-500 hover:text-red-400 transition-colors"
          >
            Clear All
          </button>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <div className="p-4 max-h-96 overflow-y-auto">
        {/* Genres */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-3">
            Genres {filters.genres.length > 0 && (
              <span className="text-xs text-gray-400">({filters.genres.length} selected)</span>
            )}
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {genreOptions.map(genre => (
              <button
                key={genre}
                onClick={() => handleGenreToggle(genre)}
                className={`px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                  filters.genres.includes(genre)
                    ? 'bg-red-600 text-white shadow-lg transform scale-105'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white'
                }`}
              >
                {genre}
              </button>
            ))}
          </div>
        </div>

        {/* Year Range */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-3">
            Release Year ({filters.yearRange.min} - {filters.yearRange.max})
          </label>
          <div className="space-y-3">
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <label className="block text-xs text-gray-400 mb-1">From</label>
                <input
                  type="number"
                  min="1900"
                  max={new Date().getFullYear()}
                  value={filters.yearRange.min}
                  onChange={(e) => handleYearChange('min', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-red-500 focus:outline-none transition-colors"
                />
              </div>
              <div className="flex-1">
                <label className="block text-xs text-gray-400 mb-1">To</label>
                <input
                  type="number"
                  min="1900"
                  max={new Date().getFullYear()}
                  value={filters.yearRange.max}
                  onChange={(e) => handleYearChange('max', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-red-500 focus:outline-none transition-colors"
                />
              </div>
            </div>
            <input
              type="range"
              min="1900"
              max={new Date().getFullYear()}
              value={filters.yearRange.min}
              onChange={(e) => handleYearChange('min', e.target.value)}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
            />
          </div>
        </div>

        {/* Rating Range */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-3">
            Rating ({filters.ratingRange.min.toFixed(1)} - {filters.ratingRange.max.toFixed(1)})
          </label>
          <div className="space-y-3">
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <label className="block text-xs text-gray-400 mb-1">Minimum</label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  step="0.1"
                  value={filters.ratingRange.min}
                  onChange={(e) => handleRatingChange('min', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-red-500 focus:outline-none transition-colors"
                />
              </div>
              <div className="flex-1">
                <label className="block text-xs text-gray-400 mb-1">Maximum</label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  step="0.1"
                  value={filters.ratingRange.max}
                  onChange={(e) => handleRatingChange('max', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-red-500 focus:outline-none transition-colors"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-400">0</span>
              <input
                type="range"
                min="0"
                max="10"
                step="0.1"
                value={filters.ratingRange.min}
                onChange={(e) => handleRatingChange('min', e.target.value)}
                className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
              />
              <input
                type="range"
                min="0"
                max="10"
                step="0.1"
                value={filters.ratingRange.max}
                onChange={(e) => handleRatingChange('max', e.target.value)}
                className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
              />
              <span className="text-xs text-gray-400">10</span>
            </div>
          </div>
        </div>

        {/* Duration Range */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300 mb-3">
            Duration ({filters.durationRange.min} - {filters.durationRange.max} minutes)
          </label>
          <div className="space-y-3">
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <label className="block text-xs text-gray-400 mb-1">Minimum</label>
                <input
                  type="number"
                  min="0"
                  max="300"
                  step="5"
                  value={filters.durationRange.min}
                  onChange={(e) => handleDurationChange('min', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-red-500 focus:outline-none transition-colors"
                />
              </div>
              <div className="flex-1">
                <label className="block text-xs text-gray-400 mb-1">Maximum</label>
                <input
                  type="number"
                  min="0"
                  max="300"
                  step="5"
                  value={filters.durationRange.max}
                  onChange={(e) => handleDurationChange('max', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-red-500 focus:outline-none transition-colors"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-400">0m</span>
              <input
                type="range"
                min="0"
                max="300"
                step="5"
                value={filters.durationRange.min}
                onChange={(e) => handleDurationChange('min', e.target.value)}
                className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
              />
              <input
                type="range"
                min="0"
                max="300"
                step="5"
                value={filters.durationRange.max}
                onChange={(e) => handleDurationChange('max', e.target.value)}
                className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
              />
              <span className="text-xs text-gray-400">5h</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FilterPanel
