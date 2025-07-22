import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Navbar from '../Navbar'

describe('Navbar', () => {
  it('renders the GITPOD FLIX logo', () => {
    render(<Navbar />)
    
    expect(screen.getByText('GITPOD FLIX')).toBeInTheDocument()
  })

  it('has proper styling classes', () => {
    render(<Navbar />)
    
    const navbar = screen.getByRole('navigation')
    expect(navbar).toHaveClass('fixed', 'top-0', 'w-full')
  })

  it('renders navigation links', () => {
    render(<Navbar />)
    
    expect(screen.getByText('Home')).toBeInTheDocument()
    expect(screen.getByText('Movies')).toBeInTheDocument()
    expect(screen.getByText('TV Shows')).toBeInTheDocument()
  })
})
