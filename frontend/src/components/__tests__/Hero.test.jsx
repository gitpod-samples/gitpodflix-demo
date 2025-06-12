import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import Hero from '../Hero';
import { fetchMovies } from '../../services/api';

// Mock the API service
vi.mock('../../services/api', () => ({
  fetchMovies: vi.fn()
}));

const mockMovie = {
  id: 1,
  title: 'Test Movie',
  description: 'Test Description',
  image_url: 'https://example.com/movie.jpg'
};

describe('Hero', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders nothing when no featured movie is available', () => {
    fetchMovies.mockResolvedValue([]);
    const { container } = render(<Hero />);
    expect(container.firstChild).toBeNull();
  });

  it('renders the featured movie when data is loaded', async () => {
    fetchMovies.mockResolvedValue([mockMovie]);
    
    render(<Hero />);
    
    await waitFor(() => {
      expect(screen.getByText(mockMovie.title)).toBeInTheDocument();
      expect(screen.getByText(mockMovie.description)).toBeInTheDocument();
      expect(screen.getByAltText(mockMovie.title)).toHaveAttribute('src', mockMovie.image_url);
    });
  });

  it('renders play and more info buttons', async () => {
    fetchMovies.mockResolvedValue([mockMovie]);
    
    render(<Hero />);
    
    await waitFor(() => {
      expect(screen.getByText('Play')).toBeInTheDocument();
      expect(screen.getByText('More Info')).toBeInTheDocument();
    });
  });

  it('handles API error gracefully', async () => {
    fetchMovies.mockRejectedValue(new Error('API Error'));
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    render(<Hero />);
    
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Error loading featured movie:', expect.any(Error));
    });
    
    consoleSpy.mockRestore();
  });
}); 