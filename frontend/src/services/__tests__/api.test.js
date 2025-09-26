import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { fetchMovies, searchMovies, getSearchSuggestions, debounce } from '../api'

// Mock fetch globally
global.fetch = vi.fn()

// Mock window.location
Object.defineProperty(window, 'location', {
  value: {
    hostname: 'localhost'
  },
  writable: true
})

describe('API Service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('fetchMovies', () => {
    it('should fetch movies successfully', async () => {
      const mockMovies = [
        { id: 1, title: 'Test Movie', rating: 8.5 },
        { id: 2, title: 'Another Movie', rating: 7.2 }
      ]

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockMovies
      })

      const result = await fetchMovies()

      expect(fetch).toHaveBeenCalledWith('http://localhost:3001/api/movies')
      expect(result).toEqual(mockMovies)
    })

    it('should handle fetch error', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 500
      })

      await expect(fetchMovies()).rejects.toThrow('Failed to fetch movies')
    })

    it('should handle network error', async () => {
      fetch.mockRejectedValueOnce(new Error('Network error'))

      await expect(fetchMovies()).rejects.toThrow('Network error')
    })

    it('should use localhost API URL for non-Gitpod environment', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => []
      })

      await fetchMovies()

      expect(fetch).toHaveBeenCalledWith('http://localhost:3001/api/movies')
    })
  })

  describe('searchMovies', () => {
    it('should search movies with query only', async () => {
      const mockResults = {
        results: [{ id: 1, title: 'Batman' }],
        pagination: { total: 1 }
      }

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResults
      })

      const result = await searchMovies('Batman')

      expect(fetch).toHaveBeenCalledWith('http://localhost:3001/api/search?q=Batman')
      expect(result).toEqual(mockResults)
    })

    it('should search movies with query and filters', async () => {
      const filters = {
        genres: ['Action', 'Drama'],
        yearRange: { min: 2000, max: 2020 },
        ratingRange: { min: 7.0, max: 10.0 },
        durationRange: { min: 90, max: 180 }
      }

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ results: [] })
      })

      await searchMovies('Batman', filters)

      const expectedUrl = 'http://localhost:3001/api/search?q=Batman&genres=Action%2CDrama&yearMin=2000&yearMax=2020&ratingMin=7&ratingMax=10&durationMin=90&durationMax=180'
      expect(fetch).toHaveBeenCalledWith(expectedUrl)
    })

    it('should handle empty filters', async () => {
      const filters = {
        genres: [],
        yearRange: null,
        ratingRange: null,
        durationRange: null
      }

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ results: [] })
      })

      await searchMovies('Batman', filters)

      expect(fetch).toHaveBeenCalledWith('http://localhost:3001/api/search?q=Batman')
    })

    it('should handle search without query', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ results: [] })
      })

      await searchMovies('', { genres: ['Action'] })

      expect(fetch).toHaveBeenCalledWith('http://localhost:3001/api/search?genres=Action')
    })

    it('should handle search error', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 500
      })

      await expect(searchMovies('Batman')).rejects.toThrow('Failed to search movies')
    })
  })

  describe('getSearchSuggestions', () => {
    it('should fetch suggestions for valid query', async () => {
      const mockSuggestions = [
        { text: 'Batman', type: 'title' },
        { text: 'Batman Begins', type: 'title' }
      ]

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockSuggestions
      })

      const result = await getSearchSuggestions('Bat')

      expect(fetch).toHaveBeenCalledWith('http://localhost:3001/api/suggestions?q=Bat')
      expect(result).toEqual(mockSuggestions)
    })

    it('should return empty array for short query', async () => {
      const result = await getSearchSuggestions('B')
      expect(result).toEqual([])
      expect(fetch).not.toHaveBeenCalled()
    })

    it('should return empty array for empty query', async () => {
      const result = await getSearchSuggestions('')
      expect(result).toEqual([])
      expect(fetch).not.toHaveBeenCalled()
    })

    it('should return empty array for null query', async () => {
      const result = await getSearchSuggestions(null)
      expect(result).toEqual([])
      expect(fetch).not.toHaveBeenCalled()
    })

    it('should handle suggestions error gracefully', async () => {
      fetch.mockRejectedValueOnce(new Error('Network error'))

      const result = await getSearchSuggestions('Batman')
      expect(result).toEqual([])
    })

    it('should handle HTTP error gracefully', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 500
      })

      const result = await getSearchSuggestions('Batman')
      expect(result).toEqual([])
    })

    it('should encode query parameters', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => []
      })

      await getSearchSuggestions('Batman & Robin')

      expect(fetch).toHaveBeenCalledWith('http://localhost:3001/api/suggestions?q=Batman%20%26%20Robin')
    })
  })

  describe('debounce', () => {
    it('should debounce function calls', async () => {
      const mockFn = vi.fn()
      const debouncedFn = debounce(mockFn, 100)

      debouncedFn('call1')
      debouncedFn('call2')
      debouncedFn('call3')

      expect(mockFn).not.toHaveBeenCalled()

      // Wait for debounce delay
      await new Promise(resolve => setTimeout(resolve, 150))

      expect(mockFn).toHaveBeenCalledTimes(1)
      expect(mockFn).toHaveBeenCalledWith('call3')
    })

    it('should handle multiple debounced calls', async () => {
      const mockFn = vi.fn()
      const debouncedFn = debounce(mockFn, 50)

      debouncedFn('first')
      await new Promise(resolve => setTimeout(resolve, 75))
      
      debouncedFn('second')
      await new Promise(resolve => setTimeout(resolve, 75))

      expect(mockFn).toHaveBeenCalledTimes(2)
      expect(mockFn).toHaveBeenNthCalledWith(1, 'first')
      expect(mockFn).toHaveBeenNthCalledWith(2, 'second')
    })

    it('should pass all arguments to debounced function', async () => {
      const mockFn = vi.fn()
      const debouncedFn = debounce(mockFn, 50)

      debouncedFn('arg1', 'arg2', 'arg3')

      await new Promise(resolve => setTimeout(resolve, 75))

      expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2', 'arg3')
    })
  })
})