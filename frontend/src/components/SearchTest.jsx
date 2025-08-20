import React, { useState, useEffect } from 'react'
import SearchBar from './SearchBar'
import SearchResults from './SearchResults'
import searchService from '../services/searchService'

function SearchTest() {
  const [searchResults, setSearchResults] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [currentQuery, setCurrentQuery] = useState('')
  const [performanceMetrics, setPerformanceMetrics] = useState(null)

  const handleSearchResults = async (results) => {
    const startTime = performance.now()
    setIsLoading(true)
    
    try {
      // If results is a query string, perform search
      if (typeof results === 'string') {
        setCurrentQuery(results)
        const searchResults = await searchService.search(results)
        setSearchResults(searchResults.results || searchResults)
      } else {
        // Direct results from SearchBar component
        setSearchResults(results)
      }
      
      const endTime = performance.now()
      setPerformanceMetrics({
        searchTime: Math.round(endTime - startTime),
        resultCount: Array.isArray(results) ? results.length : 0,
        timestamp: new Date().toLocaleTimeString()
      })
    } catch (error) {
      console.error('Search test error:', error)
      setSearchResults([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleClearSearch = () => {
    setSearchResults([])
    setCurrentQuery('')
    setPerformanceMetrics(null)
  }

  // Test different search scenarios
  const runSearchTests = async () => {
    const testQueries = [
      'Matrix',
      'Action',
      'Christopher Nolan',
      '2008',
      'Sci-Fi Adventure'
    ]

    console.log('Running search performance tests...')
    
    for (const query of testQueries) {
      const startTime = performance.now()
      try {
        const results = await searchService.search(query)
        const endTime = performance.now()
        console.log(`Query: "${query}" - ${results.results?.length || 0} results in ${Math.round(endTime - startTime)}ms`)
      } catch (error) {
        console.error(`Test failed for query "${query}":`, error)
      }
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-center">Search Functionality Test</h1>
          
          {/* Search Bar */}
          <div className="mb-8">
            <SearchBar 
              onSearchResults={handleSearchResults}
              onClose={handleClearSearch}
            />
          </div>

          {/* Performance Metrics */}
          {performanceMetrics && (
            <div className="bg-gray-800 rounded-lg p-4 mb-6">
              <h3 className="text-lg font-semibold mb-2">Performance Metrics</h3>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Search Time:</span>
                  <span className="ml-2 text-green-400">{performanceMetrics.searchTime}ms</span>
                </div>
                <div>
                  <span className="text-gray-400">Results:</span>
                  <span className="ml-2 text-blue-400">{performanceMetrics.resultCount}</span>
                </div>
                <div>
                  <span className="text-gray-400">Time:</span>
                  <span className="ml-2 text-yellow-400">{performanceMetrics.timestamp}</span>
                </div>
              </div>
            </div>
          )}

          {/* Test Controls */}
          <div className="bg-gray-800 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-semibold mb-4">Test Controls</h3>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={runSearchTests}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                Run Performance Tests
              </button>
              <button
                onClick={() => searchService.clearCache()}
                className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition-colors"
              >
                Clear Cache
              </button>
              <button
                onClick={() => searchService.clearSearchHistory()}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              >
                Clear History
              </button>
            </div>
          </div>

          {/* Search History */}
          <div className="bg-gray-800 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-semibold mb-2">Recent Searches</h3>
            <div className="flex flex-wrap gap-2">
              {searchService.getSearchHistory().map((query, index) => (
                <button
                  key={index}
                  onClick={() => handleSearchResults(query)}
                  className="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-sm hover:bg-gray-600 transition-colors"
                >
                  {query}
                </button>
              ))}
            </div>
          </div>

          {/* Popular Searches */}
          <div className="bg-gray-800 rounded-lg p-4 mb-8">
            <h3 className="text-lg font-semibold mb-2">Popular Searches</h3>
            <div className="flex flex-wrap gap-2">
              {searchService.getPopularSearches().map((query, index) => (
                <button
                  key={index}
                  onClick={() => handleSearchResults(query)}
                  className="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-sm hover:bg-gray-600 transition-colors"
                >
                  {query}
                </button>
              ))}
            </div>
          </div>

          {/* Search Results */}
          <SearchResults
            results={searchResults}
            query={currentQuery}
            isLoading={isLoading}
            onClearSearch={handleClearSearch}
          />
        </div>
      </div>
    </div>
  )
}

export default SearchTest
