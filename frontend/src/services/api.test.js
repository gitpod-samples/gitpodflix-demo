import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { fetchMovies } from './api'

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

      const result = await fetchMovies()

      expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/api/movies'))
      expect(result).toEqual(mockMovies)
    })

    it('should handle fetch errors', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 500
      })

      await expect(fetchMovies()).rejects.toThrow('Failed to fetch movies')
    })

    it('should handle network errors', async () => {
      fetch.mockRejectedValueOnce(new Error('Network error'))

      await expect(fetchMovies()).rejects.toThrow('Network error')
    })

    it('should use localhost URL for local development', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => []
      })

      await fetchMovies()

      expect(fetch).toHaveBeenCalledWith('http://localhost:3001/api/movies')
    })
  })
})
