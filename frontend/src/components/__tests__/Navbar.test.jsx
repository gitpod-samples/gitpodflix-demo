import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Navbar from '../Navbar';

describe('Navbar', () => {
  it('renders the Gitpod Flix logo', () => {
    render(<Navbar />);
    expect(screen.getByText('GITPOD FLIX')).toBeInTheDocument();
  });

  it('renders all navigation links', () => {
    render(<Navbar />);
    const expectedLinks = ['Home', 'TV Shows', 'Movies', 'New & Popular', 'My List'];
    expectedLinks.forEach(link => {
      expect(screen.getByText(link)).toBeInTheDocument();
    });
  });

  it('renders the search and notification buttons', () => {
    render(<Navbar />);
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(2);
  });

  it('renders the profile avatar', () => {
    render(<Navbar />);
    const avatar = screen.getByTestId('profile-avatar');
    expect(avatar).toBeInTheDocument();
  });
}); 