import { describe, it, expect, vi, beforeEach } from 'vitest';
import { checkImage, checkAllImages, movies } from './check-movie-images';

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
    
    // Should call fetch for each movie (12 total in the actual movies object)
    expect(global.fetch).toHaveBeenCalledTimes(12);
    
    // Verify console.log was called with the expected messages
    expect(console.log).toHaveBeenCalledWith('Checking all movie images...\n');
    expect(console.log).toHaveBeenCalledWith('Category: trending');
    expect(console.log).toHaveBeenCalledWith('Category: popular');
    expect(console.log).toHaveBeenCalledWith('Category: scifi');
  });
});
