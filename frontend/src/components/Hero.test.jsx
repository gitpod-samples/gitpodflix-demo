import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import Hero from './Hero'
import * as api from '../services/api'

// Mock the API
vi.mock('../services/api')

describe('Hero', () => {
  const mockMovie = {
    id: 1,
    title: 'Featured Movie',
    description: 'This is a great movie description.',
    image_url: 'https://example.com/featured.jpg'
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render featured movie when loaded', async () => {
    api.fetchMovies.mockResolvedValue([mockMovie])

    render(<Hero />)

    await waitFor(() => {
      expect(screen.getByText('Featured Movie')).toBeInTheDocument()
    })

    expect(screen.getByText('This is a great movie description.')).toBeInTheDocument()
    expect(screen.getByRole('img')).toHaveAttribute('src', 'https://example.com/featured.jpg')
    expect(screen.getByRole('img')).toHaveAttribute('alt', 'Featured Movie')
  })

  it('should render Play and More Info buttons', async () => {
    api.fetchMovies.mockResolvedValue([mockMovie])

    render(<Hero />)

    await waitFor(() => {
      expect(screen.getByText('Play')).toBeInTheDocument()
    })

    expect(screen.getByText('More Info')).toBeInTheDocument()
  })

  it('should not render anything when no movies are available', async () => {
    api.fetchMovies.mockResolvedValue([])

    render(<Hero />)

    await waitFor(() => {
      expect(screen.queryByText('Play')).not.toBeInTheDocument()
    })
  })

  it('should handle API errors gracefully', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    api.fetchMovies.mockRejectedValue(new Error('API Error'))

    render(<Hero />)

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Error loading featured movie:', expect.any(Error))
    })

    expect(screen.queryByText('Play')).not.toBeInTheDocument()

    consoleSpy.mockRestore()
  })

  it('should use first movie as featured movie', async () => {
    const movies = [
      { id: 1, title: 'First Movie', description: 'First', image_url: 'first.jpg' },
      { id: 2, title: 'Second Movie', description: 'Second', image_url: 'second.jpg' }
    ]
    api.fetchMovies.mockResolvedValue(movies)

    render(<Hero />)

    await waitFor(() => {
      expect(screen.getByText('First Movie')).toBeInTheDocument()
    })

    expect(screen.queryByText('Second Movie')).not.toBeInTheDocument()
  })

  it('should have correct styling classes', async () => {
    api.fetchMovies.mockResolvedValue([mockMovie])

    render(<Hero />)

    await waitFor(() => {
      expect(screen.getByText('Featured Movie')).toBeInTheDocument()
    })

    const container = document.querySelector('.relative.h-screen')
    expect(container).toBeInTheDocument()
  })
})
