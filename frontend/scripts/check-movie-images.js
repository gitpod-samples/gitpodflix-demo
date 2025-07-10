// Export for testing
export const movies = {
  trending: [
    { id: 1, title: 'The Matrix', image: 'https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg' },
    { id: 2, title: 'Inception', image: 'https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg' },
    { id: 3, title: 'Interstellar', image: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg' },
    { id: 4, title: 'The Dark Knight', image: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg' },
  ],
  popular: [
    { id: 5, title: 'Pulp Fiction', image: 'https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg' },
    { id: 6, title: 'Fight Club', image: 'https://image.tmdb.org/t/p/w500/a26cQPRhJPX6GbWfQbvZdrrp9j9.jpg' },
    { id: 7, title: 'Goodfellas', image: 'https://image.tmdb.org/t/p/w500/aKuFiU82s5ISJpGZp7YkIr3kCUd.jpg' },
    { id: 8, title: 'The Godfather', image: 'https://image.tmdb.org/t/p/w500/rPdtLWNsZmAtoZl9PK7S2wE3qiS.jpg' },
  ],
  scifi: [
    { id: 9, title: 'Blade Runner 2049', image: 'https://image.tmdb.org/t/p/w500/aMpyrCizvSdc0UIMblJ1srVgAEF.jpg' },
    { id: 10, title: 'Dune', image: 'https://image.tmdb.org/t/p/w500/d5NXSklXo0qyIYkgV94XAgMIckC.jpg' },
    { id: 11, title: 'Arrival', image: 'https://image.tmdb.org/t/p/w500/x2FJsf1ElAgr63Y3PNPtJrcmpoe.jpg' },
    { id: 12, title: 'Ex Machina', image: 'https://image.tmdb.org/t/p/original/dmJW8IAKHKxFNiUnoDR7JfsK7Rp.jpg' },
  ]
};

export async function checkImage(url) {
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

export async function checkAllImages() {
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

// Only run if this is the main module (not imported for testing)
if (typeof require !== 'undefined' && require.main === module) {
  checkAllImages();
}
