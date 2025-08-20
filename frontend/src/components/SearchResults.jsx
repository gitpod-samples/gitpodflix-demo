import React from 'react'
import MovieRow from './MovieRow'

function SearchResults({ results, query, isLoading, onClearSearch }) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
        <span className="ml-4 text-white text-lg">Searching...</span>
      </div>
    )
  }

  if (!query) {
    return null
  }

  if (!results || results.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="mb-4">
          <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <h3 className="text-xl font-medium text-white mb-2">
          No results found for "{query}"
        </h3>
        <p className="text-gray-400 mb-6">
          Try adjusting your search or filters to find what you're looking for.
        </p>
        <div className="space-y-2 text-sm text-gray-400">
          <p>• Check your spelling</p>
          <p>• Try more general terms</p>
          <p>• Remove some filters</p>
        </div>
        <button
          onClick={onClearSearch}
          className="mt-6 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Clear Search
        </button>
      </div>
    )
  }

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-6 px-4 md:px-8">
        <h2 className="text-2xl font-bold text-white">
          Search Results for "{query}"
          <span className="text-lg font-normal text-gray-400 ml-2">
            ({results.length} {results.length === 1 ? 'result' : 'results'})
          </span>
        </h2>
        <button
          onClick={onClearSearch}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <MovieRow title="" movies={results} showTitle={false} />
      
      {results.length >= 20 && (
        <div className="text-center py-8">
          <p className="text-gray-400">
            Showing first {results.length} results. Try refining your search for more specific results.
          </p>
        </div>
      )}
    </div>
  )
}

export default SearchResults
