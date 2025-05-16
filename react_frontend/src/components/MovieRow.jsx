import React from 'react';

const MovieRow = ({ title, movies = [] }) => {
  return (
    <div className="px-12 mb-8">
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      <div className="flex space-x-4 overflow-x-auto pb-4">
        {movies.length > 0 ? (
          movies.map((movie) => (
            <div key={movie.id} className="flex-none w-48 transition-transform duration-300 hover:scale-110">
              <img
                src={movie.image_url}
                alt={movie.title}
                className="w-full h-64 object-cover rounded"
              />
              <div className="mt-2">
                <h3 className="text-sm font-semibold">{movie.title}</h3>
                <p className="text-xs text-gray-400">{movie.release_year} • {movie.rating}/10</p>
              </div>
            </div>
          ))
        ) : (
          <div className="flex justify-center w-full">
            <p className="text-gray-500">No movies available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieRow;
