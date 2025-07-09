import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Navbar from './Navbar'

describe('Navbar', () => {
  it('should render the Gitpod Flix logo', () => {
    render(<Navbar />)
    
    expect(screen.getByText('GITPOD FLIX')).toBeInTheDocument()
  })

  it('should render navigation links', () => {
    render(<Navbar />)
    
    expect(screen.getByText('Home')).toBeInTheDocument()
    expect(screen.getByText('TV Shows')).toBeInTheDocument()
    expect(screen.getByText('Movies')).toBeInTheDocument()
    expect(screen.getByText('New & Popular')).toBeInTheDocument()
    expect(screen.getByText('My List')).toBeInTheDocument()
  })

  it('should render search and notification buttons', () => {
    render(<Navbar />)
    
    const buttons = screen.getAllByRole('button')
    expect(buttons).toHaveLength(2) // Search and notification buttons
  })

  it('should have correct styling classes', () => {
    render(<Navbar />)
    
    const nav = screen.getByRole('navigation')
    expect(nav).toHaveClass('fixed', 'top-0', 'w-full', 'z-50')
  })

  it('should render user avatar placeholder', () => {
    render(<Navbar />)
    
    const avatar = document.querySelector('.w-8.h-8.rounded.bg-gray-600')
    expect(avatar).toBeInTheDocument()
  })
})
