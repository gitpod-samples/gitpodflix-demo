import { searchMovies, getSearchSuggestions } from './api'

class SearchService {
  constructor() {
    this.searchCache = new Map()
    this.suggestionCache = new Map()
    this.cacheTimeout = 5 * 60 * 1000 // 5 minutes
  }

  // Enhanced search with caching and ranking
  async search(query, filters = {}, options = {}) {
    const cacheKey = this.generateCacheKey(query, filters)
    const cached = this.searchCache.get(cacheKey)
    
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data
    }

    try {
      const results = await searchMovies(query, filters)
      
      // Enhance results with search relevance scoring
      const enhancedResults = this.enhanceSearchResults(results.results || results, query)
      
      const finalResults = {
        ...results,
        results: enhancedResults
      }

      // Cache the results
      this.searchCache.set(cacheKey, {
        data: finalResults,
        timestamp: Date.now()
      })

      return finalResults
    } catch (error) {
      console.error('Search service error:', error)
      throw error
    }
  }

  // Get intelligent search suggestions
  async getSuggestions(query) {
    if (!query || query.length < 2) {
      return []
    }

    const cacheKey = `suggestions_${query.toLowerCase()}`
    const cached = this.suggestionCache.get(cacheKey)
    
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data
    }

    try {
      const suggestions = await getSearchSuggestions(query)
      
      // Process and rank suggestions
      const processedSuggestions = this.processSuggestions(suggestions, query)
      
      // Cache the suggestions
      this.suggestionCache.set(cacheKey, {
        data: processedSuggestions,
        timestamp: Date.now()
      })

      return processedSuggestions
    } catch (error) {
      console.error('Suggestions service error:', error)
      return []
    }
  }

  // Enhanced search results with relevance scoring
  enhanceSearchResults(results, query) {
    if (!Array.isArray(results) || !query) {
      return results
    }

    const queryLower = query.toLowerCase()
    
    return results.map(movie => {
      let relevanceScore = 0
      
      // Title match scoring
      if (movie.title) {
        const titleLower = movie.title.toLowerCase()
        if (titleLower === queryLower) {
          relevanceScore += 100 // Exact match
        } else if (titleLower.startsWith(queryLower)) {
          relevanceScore += 80 // Starts with query
        } else if (titleLower.includes(queryLower)) {
          relevanceScore += 60 // Contains query
        }
      }

      // Director match scoring
      if (movie.director && movie.director.toLowerCase().includes(queryLower)) {
        relevanceScore += 40
      }

      // Genre match scoring
      if (movie.genres && Array.isArray(movie.genres)) {
        const genreMatch = movie.genres.some(genre => 
          genre.toLowerCase().includes(queryLower)
        )
        if (genreMatch) {
          relevanceScore += 30
        }
      }

      // Cast match scoring
      if (movie.cast && Array.isArray(movie.cast)) {
        const castMatch = movie.cast.some(actor => 
          actor.toLowerCase().includes(queryLower)
        )
        if (castMatch) {
          relevanceScore += 35
        }
      }

      // Description match scoring
      if (movie.description && movie.description.toLowerCase().includes(queryLower)) {
        relevanceScore += 20
      }

      // Boost popular movies slightly
      if (movie.rating && movie.rating > 8.0) {
        relevanceScore += 10
      }

      return {
        ...movie,
        relevanceScore
      }
    }).sort((a, b) => {
      // Sort by relevance score first, then by rating
      if (b.relevanceScore !== a.relevanceScore) {
        return b.relevanceScore - a.relevanceScore
      }
      return (b.rating || 0) - (a.rating || 0)
    })
  }

  // Process and rank search suggestions
  processSuggestions(suggestions, query) {
    if (!Array.isArray(suggestions)) {
      return []
    }

    const queryLower = query.toLowerCase()
    
    return suggestions
      .map(suggestion => {
        const text = typeof suggestion === 'string' ? suggestion : suggestion.text
        const type = typeof suggestion === 'object' ? suggestion.type : 'unknown'
        const frequency = typeof suggestion === 'object' ? suggestion.frequency : 1
        
        let score = frequency || 1
        
        // Boost exact matches
        if (text.toLowerCase() === queryLower) {
          score += 1000
        }
        // Boost starts with matches
        else if (text.toLowerCase().startsWith(queryLower)) {
          score += 500
        }
        // Boost word boundary matches
        else if (text.toLowerCase().includes(` ${queryLower}`)) {
          score += 200
        }
        
        // Type-based scoring
        const typeScores = {
          title: 100,
          director: 80,
          actor: 70,
          genre: 60
        }
        score += typeScores[type] || 50
        
        return {
          text,
          type,
          score,
          frequency
        }
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 8) // Limit to top 8 suggestions
      .map(s => s.text) // Return just the text for simplicity
  }

  // Generate cache key for search results
  generateCacheKey(query, filters) {
    const filterString = JSON.stringify(filters)
    return `search_${query}_${filterString}`.replace(/\s+/g, '_').toLowerCase()
  }

  // Clear caches
  clearCache() {
    this.searchCache.clear()
    this.suggestionCache.clear()
  }

  // Get popular search terms (could be enhanced with analytics)
  getPopularSearches() {
    return [
      'Action movies',
      'Comedy',
      'Sci-Fi',
      'Drama',
      'Thriller',
      'Romance',
      'Horror',
      'Animation'
    ]
  }

  // Search history management (localStorage-based)
  getSearchHistory() {
    try {
      const history = localStorage.getItem('gitpodflix_search_history')
      return history ? JSON.parse(history) : []
    } catch (error) {
      console.error('Error reading search history:', error)
      return []
    }
  }

  addToSearchHistory(query) {
    if (!query || query.length < 2) return
    
    try {
      const history = this.getSearchHistory()
      const filteredHistory = history.filter(item => item !== query)
      const newHistory = [query, ...filteredHistory].slice(0, 10) // Keep last 10 searches
      
      localStorage.setItem('gitpodflix_search_history', JSON.stringify(newHistory))
    } catch (error) {
      console.error('Error saving search history:', error)
    }
  }

  clearSearchHistory() {
    try {
      localStorage.removeItem('gitpodflix_search_history')
    } catch (error) {
      console.error('Error clearing search history:', error)
    }
  }
}

// Export singleton instance
export default new SearchService()
