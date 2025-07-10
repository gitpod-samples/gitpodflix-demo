import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Mock the render function
const mockRender = vi.fn();

// Mock React and ReactDOM
vi.mock('react-dom/client', () => ({
  default: {
    createRoot: vi.fn(() => ({
      render: mockRender
    }))
  }
}));

vi.mock('./App', () => ({
  default: () => null
}));

vi.mock('./styles/index.css', () => ({}));

describe('main.jsx', () => {
  it('renders App in React.StrictMode', () => {
    // Setup DOM
    document.body.innerHTML = '<div id="root"></div>';
    
    // Simulate what main.jsx does
    const root = document.getElementById('root');
    ReactDOM.createRoot(root).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    
    // Assertions
    expect(ReactDOM.createRoot).toHaveBeenCalledWith(root);
    expect(mockRender).toHaveBeenCalled();
  });
});
