import React from 'react';

const Hero = () => {
  return (
    <div className="relative h-[80vh] w-full">
      <div className="absolute inset-0 bg-gradient-to-r from-black to-transparent z-10"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10"></div>
      <img 
        src="https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_.jpg" 
        alt="Featured Movie" 
        className="w-full h-full object-cover"
      />
      <div className="absolute bottom-0 left-0 p-12 z-20 w-1/2">
        <h1 className="text-5xl font-bold mb-4">The Dark Knight</h1>
        <p className="text-lg mb-6">
          When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.
        </p>
        <div className="flex space-x-4">
          <button className="bg-white text-black px-6 py-2 rounded flex items-center hover:bg-opacity-80">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
            Play
          </button>
          <button className="bg-gray-600 text-white px-6 py-2 rounded flex items-center hover:bg-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            More Info
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hero;
