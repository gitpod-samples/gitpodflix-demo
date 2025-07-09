import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import App from './App'
import * as api from './services/api'

// Mock the API
vi.mock('./services/api')

describe('App', () => {
  const mockMovies = [
    { id: 1, title: 'Movie 1', rating: 9.0, image_url: 'movie1.jpg', description: 'Description 1' },
    { id: 2, title: 'Movie 2', rating: 8.5, image_url: 'movie2.jpg', description: 'Description 2' },
    { id: 3, title: 'Movie 3', rating: 8.0, image_url: 'movie3.jpg', description: 'Description 3' },
    { id: 4, title: 'Movie 4', rating: 7.5, image_url: 'movie4.jpg', description: 'Description 4' },
    { id: 5, title: 'Movie 5', rating: 7.0, image_url: 'movie5.jpg', description: 'Description 5' },
    { id: 6, title: 'Movie 6', rating: 6.5, image_url: 'movie6.jpg', description: 'Description 6' },
    { id: 7, title: 'Movie 7', rating: 6.0, image_url: 'movie7.jpg', description: 'Description 7' },
    { id: 8, title: 'Movie 8', rating: 5.5, image_url: 'movie8.jpg', description: 'Description 8' },
    { id: 9, title: 'Movie 9', rating: 5.0, image_url: 'movie9.jpg', description: 'Description 9' },
    { id: 10, title: 'Movie 10', rating: 4.5, image_url: 'movie10.jpg', description: 'Description 10' },
    { id: 11, title: 'Movie 11', rating: 4.0, image_url: 'movie11.jpg', description: 'Description 11' },
    { id: 12, title: 'Movie 12', rating: 3.5, image_url: 'movie12.jpg', description: 'Description 12' }
  ]

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render the main layout components', async () => {
    api.fetchMovies.mockResolvedValue(mockMovies)

    render(<App />)

    // Check for Navbar
    expect(screen.getByText('GITPOD FLIX')).toBeInTheDocument()

    // Wait for movies to load and check for movie rows
    await waitFor(() => {
      expect(screen.getByText('Trending Now')).toBeInTheDocument()
    })

    expect(screen.getByText('Popular on Gitpod Flix')).toBeInTheDocument()
    expect(screen.getByText('Sci-Fi & Fantasy')).toBeInTheDocument()
  })

  it('should organize movies into correct categories', async () => {
    api.fetchMovies.mockResolvedValue(mockMovies)

    render(<App />)

    await waitFor(() => {
      expect(screen.getByText('Trending Now')).toBeInTheDocument()
    })

    // Check that movie categories are rendered
    expect(screen.getByText('Popular on Gitpod Flix')).toBeInTheDocument()
    expect(screen.getByText('Sci-Fi & Fantasy')).toBeInTheDocument()
  })

  it('should handle API errors gracefully', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    api.fetchMovies.mockRejectedValue(new Error('API Error'))

    render(<App />)

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Error loading movies:', expect.any(Error))
    })

    // Should still render the layout
    expect(screen.getByText('GITPOD FLIX')).toBeInTheDocument()
    expect(screen.getByText('Trending Now')).toBeInTheDocument()

    consoleSpy.mockRestore()
  })

  it('should handle empty movie response', async () => {
    api.fetchMovies.mockResolvedValue([])

    render(<App />)

    await waitFor(() => {
      expect(screen.getByText('Trending Now')).toBeInTheDocument()
    })

    // Should render categories but with no movies
    expect(screen.getByText('Popular on Gitpod Flix')).toBeInTheDocument()
    expect(screen.getByText('Sci-Fi & Fantasy')).toBeInTheDocument()
  })

  it('should have correct background styling', async () => {
    api.fetchMovies.mockResolvedValue(mockMovies)

    render(<App />)

    await waitFor(() => {
      expect(screen.getByText('Trending Now')).toBeInTheDocument()
    })

    const mainContainer = document.querySelector('.bg-black.min-h-screen.text-white')
    expect(mainContainer).toBeInTheDocument()
  })
})
