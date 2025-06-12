import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import MovieRow from '../MovieRow';

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
];

describe('MovieRow', () => {
  it('renders the title correctly', () => {
    render(<MovieRow title="Trending Now" movies={mockMovies} />);
    expect(screen.getByText('Trending Now')).toBeInTheDocument();
  });

  it('renders all movies in the list', () => {
    render(<MovieRow title="Trending Now" movies={mockMovies} />);
    mockMovies.forEach(movie => {
      expect(screen.getByText(movie.title)).toBeInTheDocument();
      expect(screen.getByAltText(movie.title)).toHaveAttribute('src', movie.image_url);
    });
  });

  it('renders play buttons for each movie', () => {
    render(<MovieRow title="Trending Now" movies={mockMovies} />);
    const playButtons = screen.getAllByRole('button');
    expect(playButtons).toHaveLength(mockMovies.length);
  });

  it('handles empty movie list', () => {
    render(<MovieRow title="Trending Now" movies={[]} />);
    expect(screen.getByText('Trending Now')).toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
}); 