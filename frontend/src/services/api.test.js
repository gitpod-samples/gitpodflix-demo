import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import * as apiModule from './api'

// Mock fetch globally
global.fetch = vi.fn()

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
        { id: 1, title: 'Test Movie 1', rating: 8.5 },
        { id: 2, title: 'Test Movie 2', rating: 7.8 }
      ]

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockMovies
      })

      const result = await apiModule.fetchMovies()

      expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/api/movies'))
      expect(result).toEqual(mockMovies)
    })

    it('should handle fetch errors', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 500
      })

      await expect(apiModule.fetchMovies()).rejects.toThrow('Failed to fetch movies')
    })

    it('should handle network errors', async () => {
      fetch.mockRejectedValueOnce(new Error('Network error'))

      await expect(apiModule.fetchMovies()).rejects.toThrow('Network error')
    })

    it('should use correct API URL based on hostname', async () => {
      // Test both URL construction branches
      
      // Test localhost URL
      Object.defineProperty(window, 'location', {
        value: { hostname: 'localhost' },
        configurable: true
      })
      
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => []
      })
      
      await apiModule.fetchMovies()
      expect(fetch).toHaveBeenCalledWith('http://localhost:3001/api/movies')
      
      // Test Gitpod URL
      Object.defineProperty(window, 'location', {
        value: { hostname: '3000-username-projectname-abc123.gitpod.dev' },
        configurable: true
      })
      
      // We need to re-import the module to re-evaluate the API_BASE_URL
      vi.resetModules()
      const refreshedModule = await import('./api')
      
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => []
      })
      
      await refreshedModule.fetchMovies()
      
      // The second call should use the Gitpod URL format
      expect(fetch).toHaveBeenNthCalledWith(2, expect.stringMatching(/https:\/\/3001.*gitpod\.dev\/api\/movies/))
    })
  })
})
