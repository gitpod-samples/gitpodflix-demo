import React from 'react';

const Navbar = () => {
  return (
    <nav className="bg-black py-4 px-6 flex items-center justify-between">
      <div className="flex items-center">
        <h1 className="text-red-600 font-bold text-2xl">GITPODFLIX</h1>
        <ul className="flex ml-8 space-x-6">
          <li className="text-white hover:text-gray-300">Home</li>
          <li className="text-white hover:text-gray-300">TV Shows</li>
          <li className="text-white hover:text-gray-300">Movies</li>
          <li className="text-white hover:text-gray-300">New & Popular</li>
          <li className="text-white hover:text-gray-300">My List</li>
        </ul>
      </div>
      <div className="flex items-center space-x-4">
        <button className="text-white">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
        <button className="text-white">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </button>
        <img src="https://occ-0-1190-2774.1.nflxso.net/dnm/api/v6/K6hjPJd6cR6FpVELC5Pd6ovHRSk/AAAABbme8JMz4rEKFJhtzpOKWFJ_6qX-0y5wwWyYvBhWS0VKFLa289dZ5zvRBggmFVWVPL2AAYE8xevD4jjLZjWumNo.png?r=a41" alt="Profile" className="w-8 h-8 rounded" />
      </div>
    </nav>
  );
};

export default Navbar;
