import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import MovieRow from './MovieRow'

describe('MovieRow', () => {
  const mockMovies = [
    {
      id: 1,
      title: 'Test Movie 1',
      image_url: 'https://example.com/movie1.jpg'
    },
    {
      id: 2,
      title: 'Test Movie 2',
      image_url: 'https://example.com/movie2.jpg'
    }
  ]

  it('should render the title', () => {
    render(<MovieRow title="Test Category" movies={mockMovies} />)
    
    expect(screen.getByText('Test Category')).toBeInTheDocument()
  })

  it('should render all movies', () => {
    render(<MovieRow title="Test Category" movies={mockMovies} />)
    
    expect(screen.getByText('Test Movie 1')).toBeInTheDocument()
    expect(screen.getByText('Test Movie 2')).toBeInTheDocument()
  })

  it('should render movie images with correct attributes', () => {
    render(<MovieRow title="Test Category" movies={mockMovies} />)
    
    const images = screen.getAllByRole('img')
    expect(images).toHaveLength(2)
    
    expect(images[0]).toHaveAttribute('src', 'https://example.com/movie1.jpg')
    expect(images[0]).toHaveAttribute('alt', 'Test Movie 1')
    
    expect(images[1]).toHaveAttribute('src', 'https://example.com/movie2.jpg')
    expect(images[1]).toHaveAttribute('alt', 'Test Movie 2')
  })

  it('should render play buttons for each movie', () => {
    render(<MovieRow title="Test Category" movies={mockMovies} />)
    
    const playButtons = document.querySelectorAll('.play-button')
    expect(playButtons).toHaveLength(2)
  })

  it('should handle empty movies array', () => {
    render(<MovieRow title="Empty Category" movies={[]} />)
    
    expect(screen.getByText('Empty Category')).toBeInTheDocument()
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
  })

  it('should have correct grid layout', () => {
    render(<MovieRow title="Test Category" movies={mockMovies} />)
    
    const grid = document.querySelector('.grid-cols-4')
    expect(grid).toBeInTheDocument()
  })
})
