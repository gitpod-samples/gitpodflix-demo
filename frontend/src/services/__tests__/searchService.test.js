import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import searchService from '../searchService'
import * as api from '../api'

// Mock the API module
vi.mock('../api', () => ({
  searchMovies: vi.fn(),
  getSearchSuggestions: vi.fn()
}))

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn()
}
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
})

describe('SearchService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    searchService.clearCache()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('search', () => {
    it('should search movies and enhance results', async () => {
      const mockResults = {
        results: [
          { id: 1, title: 'Batman', rating: 8.5, director: 'Christopher Nolan' },
          { id: 2, title: 'Superman', rating: 7.2, director: 'Zack Snyder' }
        ]
      }

      api.searchMovies.mockResolvedValueOnce(mockResults)

      const result = await searchService.search('Batman')

      expect(api.searchMovies).toHaveBeenCalledWith('Batman', {})
      expect(result.results).toBeDefined()
      expect(result.results[0]).toHaveProperty('relevanceScore')
    })

    it('should cache search results', async () => {
      const mockResults = { results: [{ id: 1, title: 'Batman' }] }
      api.searchMovies.mockResolvedValueOnce(mockResults)

      // First call
      await searchService.search('Batman')
      expect(api.searchMovies).toHaveBeenCalledTimes(1)

      // Second call should use cache
      await searchService.search('Batman')
      expect(api.searchMovies).toHaveBeenCalledTimes(1)
    })

    it('should handle search errors', async () => {
      api.searchMovies.mockRejectedValueOnce(new Error('API Error'))

      await expect(searchService.search('Batman')).rejects.toThrow('API Error')
    })

    it('should handle results without results property', async () => {
      const mockResults = [{ id: 1, title: 'Batman' }]
      api.searchMovies.mockResolvedValueOnce(mockResults)

      const result = await searchService.search('Batman')

      expect(result.results).toBeDefined()
      expect(Array.isArray(result.results)).toBe(true)
    })
  })

  describe('getSuggestions', () => {
    it('should get and process suggestions', async () => {
      const mockSuggestions = [
        { text: 'Batman', type: 'title', frequency: 10 },
        { text: 'Batman Begins', type: 'title', frequency: 5 }
      ]

      api.getSearchSuggestions.mockResolvedValueOnce(mockSuggestions)

      const result = await searchService.getSuggestions('Bat')

      expect(api.getSearchSuggestions).toHaveBeenCalledWith('Bat')
      expect(result).toEqual(['Batman', 'Batman Begins'])
    })

    it('should return empty array for short query', async () => {
      const result = await searchService.getSuggestions('B')
      expect(result).toEqual([])
      expect(api.getSearchSuggestions).not.toHaveBeenCalled()
    })

    it('should cache suggestions', async () => {
      const mockSuggestions = [{ text: 'Batman', type: 'title', frequency: 10 }]
      api.getSearchSuggestions.mockResolvedValueOnce(mockSuggestions)

      // First call
      await searchService.getSuggestions('Batman')
      expect(api.getSearchSuggestions).toHaveBeenCalledTimes(1)

      // Second call should use cache
      await searchService.getSuggestions('Batman')
      expect(api.getSearchSuggestions).toHaveBeenCalledTimes(1)
    })

    it('should handle suggestions errors gracefully', async () => {
      api.getSearchSuggestions.mockRejectedValueOnce(new Error('API Error'))

      const result = await searchService.getSuggestions('Batman')
      expect(result).toEqual([])
    })
  })

  describe('enhanceSearchResults', () => {
    it('should enhance results with relevance scores', () => {
      const movies = [
        { title: 'Batman', director: 'Tim Burton', rating: 7.5 },
        { title: 'The Dark Knight', director: 'Christopher Nolan', rating: 9.0 },
        { title: 'Superman', director: 'Richard Donner', rating: 7.3 }
      ]

      const enhanced = searchService.enhanceSearchResults(movies, 'Batman')

      expect(enhanced[0].relevanceScore).toBeGreaterThan(enhanced[1].relevanceScore)
      expect(enhanced[0].title).toBe('Batman') // Exact match should be first
    })

    it('should handle empty results', () => {
      const result = searchService.enhanceSearchResults([], 'Batman')
      expect(result).toEqual([])
    })

    it('should handle non-array input', () => {
      const result = searchService.enhanceSearchResults(null, 'Batman')
      expect(result).toBeNull()
    })

    it('should score title matches higher', () => {
      const movies = [
        { title: 'Superman', description: 'Batman appears in this movie', rating: 7.0 },
        { title: 'Batman', description: 'The Dark Knight', rating: 7.0 }
      ]

      const enhanced = searchService.enhanceSearchResults(movies, 'Batman')

      expect(enhanced[0].title).toBe('Batman')
      expect(enhanced[0].relevanceScore).toBeGreaterThan(enhanced[1].relevanceScore)
    })
  })

  describe('processSuggestions', () => {
    it('should process and rank suggestions', () => {
      const suggestions = [
        { text: 'Batman Begins', type: 'title', frequency: 5 },
        { text: 'Batman', type: 'title', frequency: 10 },
        { text: 'Christian Bale', type: 'actor', frequency: 3 }
      ]

      const processed = searchService.processSuggestions(suggestions, 'Batman')

      expect(processed[0]).toBe('Batman') // Exact match should be first
      expect(processed).toHaveLength(3)
    })

    it('should handle string suggestions', () => {
      const suggestions = ['Batman', 'Batman Begins', 'Superman']

      const processed = searchService.processSuggestions(suggestions, 'Batman')

      expect(processed[0]).toBe('Batman')
      expect(processed).toHaveLength(3)
    })

    it('should limit suggestions to 8', () => {
      const suggestions = Array.from({ length: 15 }, (_, i) => ({
        text: `Movie ${i}`,
        type: 'title',
        frequency: i
      }))

      const processed = searchService.processSuggestions(suggestions, 'Movie')

      expect(processed).toHaveLength(8)
    })

    it('should handle empty suggestions', () => {
      const processed = searchService.processSuggestions([], 'Batman')
      expect(processed).toEqual([])
    })

    it('should handle non-array input', () => {
      const processed = searchService.processSuggestions(null, 'Batman')
      expect(processed).toEqual([])
    })
  })

  describe('cache management', () => {
    it('should generate consistent cache keys', () => {
      const key1 = searchService.generateCacheKey('Batman', { genres: ['Action'] })
      const key2 = searchService.generateCacheKey('Batman', { genres: ['Action'] })
      const key3 = searchService.generateCacheKey('Superman', { genres: ['Action'] })

      expect(key1).toBe(key2)
      expect(key1).not.toBe(key3)
    })

    it('should clear all caches', () => {
      // Add some cached data
      searchService.searchCache.set('test', { data: 'test', timestamp: Date.now() })
      searchService.suggestionCache.set('test', { data: 'test', timestamp: Date.now() })

      expect(searchService.searchCache.size).toBe(1)
      expect(searchService.suggestionCache.size).toBe(1)

      searchService.clearCache()

      expect(searchService.searchCache.size).toBe(0)
      expect(searchService.suggestionCache.size).toBe(0)
    })
  })

  describe('popular searches', () => {
    it('should return popular search terms', () => {
      const popular = searchService.getPopularSearches()

      expect(Array.isArray(popular)).toBe(true)
      expect(popular.length).toBeGreaterThan(0)
      expect(popular).toContain('Action movies')
    })
  })

  describe('search history', () => {
    it('should get search history from localStorage', () => {
      const mockHistory = ['Batman', 'Superman', 'Spider-Man']
      localStorageMock.getItem.mockReturnValueOnce(JSON.stringify(mockHistory))

      const history = searchService.getSearchHistory()

      expect(localStorageMock.getItem).toHaveBeenCalledWith('gitpodflix_search_history')
      expect(history).toEqual(mockHistory)
    })

    it('should return empty array when no history exists', () => {
      localStorageMock.getItem.mockReturnValueOnce(null)

      const history = searchService.getSearchHistory()

      expect(history).toEqual([])
    })

    it('should handle localStorage errors gracefully', () => {
      localStorageMock.getItem.mockImplementationOnce(() => {
        throw new Error('localStorage error')
      })

      const history = searchService.getSearchHistory()

      expect(history).toEqual([])
    })

    it('should add query to search history', () => {
      localStorageMock.getItem.mockReturnValueOnce(JSON.stringify(['Superman']))

      searchService.addToSearchHistory('Batman')

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'gitpodflix_search_history',
        JSON.stringify(['Batman', 'Superman'])
      )
    })

    it('should not add short queries to history', () => {
      searchService.addToSearchHistory('B')

      expect(localStorageMock.setItem).not.toHaveBeenCalled()
    })

    it('should limit history to 10 items', () => {
      const longHistory = Array.from({ length: 12 }, (_, i) => `Movie ${i}`)
      localStorageMock.getItem.mockReturnValueOnce(JSON.stringify(longHistory))

      searchService.addToSearchHistory('New Movie')

      const savedHistory = JSON.parse(localStorageMock.setItem.mock.calls[0][1])
      expect(savedHistory).toHaveLength(10)
      expect(savedHistory[0]).toBe('New Movie')
    })

    it('should remove duplicate entries', () => {
      localStorageMock.getItem.mockReturnValueOnce(JSON.stringify(['Batman', 'Superman', 'Batman']))

      searchService.addToSearchHistory('Batman')

      const savedHistory = JSON.parse(localStorageMock.setItem.mock.calls[0][1])
      expect(savedHistory.filter(item => item === 'Batman')).toHaveLength(1)
      expect(savedHistory[0]).toBe('Batman')
    })

    it('should clear search history', () => {
      searchService.clearSearchHistory()

      expect(localStorageMock.removeItem).toHaveBeenCalledWith('gitpodflix_search_history')
    })

    it('should handle localStorage errors when clearing', () => {
      localStorageMock.removeItem.mockImplementationOnce(() => {
        throw new Error('localStorage error')
      })

      // Should not throw
      expect(() => searchService.clearSearchHistory()).not.toThrow()
    })
  })
})