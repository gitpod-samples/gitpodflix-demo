import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock the movies data
const movies = {
  trending: [
    { id: 1, title: 'The Matrix', image: 'https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg' },
    { id: 2, title: 'Inception', image: 'https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg' },
  ],
  popular: [
    { id: 5, title: 'Pulp Fiction', image: 'https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg' },
    { id: 6, title: 'Fight Club', image: 'https://image.tmdb.org/t/p/w500/a26cQPRhJPX6GbWfQbvZdrrp9j9.jpg' },
  ]
};

// Define the functions to test
async function checkImage(url) {
  try {
    const response = await fetch(url);
    if (response.ok) {
      return { status: 'OK', statusCode: response.status };
    } else {
      return { status: 'ERROR', statusCode: response.status };
    }
  } catch (error) {
    return { status: 'ERROR', error: error.message };
  }
}

async function checkAllImages() {
  console.log('Checking all movie images...\n');
  
  for (const [category, movieList] of Object.entries(movies)) {
    console.log(`Category: ${category}`);
    for (const movie of movieList) {
      const result = await checkImage(movie.image);
      console.log(`${movie.title} (ID: ${movie.id}): ${result.status} - ${result.statusCode || result.error}`);
    }
    console.log('');
  }
}

describe('check-movie-images.js', () => {
  beforeEach(() => {
    // Mock console.log
    vi.spyOn(console, 'log').mockImplementation(() => {});
    
    // Mock fetch
    global.fetch = vi.fn();
  });

  it('checkImage returns OK status for successful responses', async () => {
    // Mock a successful fetch response
    global.fetch.mockResolvedValueOnce({
      ok: true,
      status: 200
    });

    const result = await checkImage('https://example.com/image.jpg');
    
    expect(result).toEqual({
      status: 'OK',
      statusCode: 200
    });
    expect(global.fetch).toHaveBeenCalledWith('https://example.com/image.jpg');
  });

  it('checkImage returns ERROR status for failed responses', async () => {
    // Mock a failed fetch response
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 404
    });

    const result = await checkImage('https://example.com/not-found.jpg');
    
    expect(result).toEqual({
      status: 'ERROR',
      statusCode: 404
    });
  });

  it('checkImage handles network errors', async () => {
    // Mock a network error
    global.fetch.mockRejectedValueOnce(new Error('Network error'));

    const result = await checkImage('https://example.com/error.jpg');
    
    expect(result).toEqual({
      status: 'ERROR',
      error: 'Network error'
    });
  });

  it('checkAllImages processes all movies in all categories', async () => {
    // Mock successful responses for all images
    global.fetch.mockResolvedValue({
      ok: true,
      status: 200
    });

    await checkAllImages();
    
    // Should call fetch for each movie
    expect(global.fetch).toHaveBeenCalledTimes(4); // 2 trending + 2 popular
    
    // Verify console.log was called with the expected messages
    expect(console.log).toHaveBeenCalledWith('Checking all movie images...\n');
    expect(console.log).toHaveBeenCalledWith('Category: trending');
    expect(console.log).toHaveBeenCalledWith('Category: popular');
  });
});
