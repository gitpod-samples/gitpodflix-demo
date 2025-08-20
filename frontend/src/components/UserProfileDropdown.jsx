import React, { useState, useEffect, useRef } from 'react'

function UserProfileDropdown({ isOpen, onClose, userProfile }) {
  const dropdownRef = useRef(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div 
      ref={dropdownRef}
      className="absolute right-0 top-12 w-80 bg-black bg-opacity-95 backdrop-blur-sm border border-gray-600 rounded-lg shadow-2xl z-50 transform transition-all duration-200 ease-out scale-100 opacity-100"
    >
      {/* Profile Header */}
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center space-x-4">
          <img 
            src="/images/profile-avatar.jpg" 
            alt="Profile" 
            className="w-16 h-16 rounded-full object-cover ring-2 ring-red-500"
          />
          <div>
            <h3 className="text-xl font-semibold text-white">{userProfile.name}</h3>
            <p className="text-gray-400">{userProfile.email}</p>
            <div className="flex items-center mt-1">
              <span className="text-xs bg-red-600 text-white px-2 py-1 rounded-full">
                {userProfile.plan}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Account Stats */}
      <div className="p-4 border-b border-gray-700">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-red-500">{userProfile.watchedMovies}</div>
            <div className="text-xs text-gray-400">Movies Watched</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-500">{userProfile.watchlistCount}</div>
            <div className="text-xs text-gray-400">In Watchlist</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-500">{userProfile.hoursWatched}</div>
            <div className="text-xs text-gray-400">Hours Watched</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="p-4 border-b border-gray-700">
        <h4 className="text-sm font-medium text-gray-300 mb-3">Quick Actions</h4>
        <div className="space-y-2">
          <button className="w-full flex items-center space-x-3 p-2 text-white hover:bg-gray-800 rounded-lg transition-colors">
            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <span className="text-sm">My List</span>
          </button>
          <button className="w-full flex items-center space-x-3 p-2 text-white hover:bg-gray-800 rounded-lg transition-colors">
            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm">Continue Watching</span>
          </button>
          <button className="w-full flex items-center space-x-3 p-2 text-white hover:bg-gray-800 rounded-lg transition-colors">
            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <span className="text-sm">Viewing Activity</span>
          </button>
        </div>
      </div>

      {/* Preferences */}
      <div className="p-4 border-b border-gray-700">
        <h4 className="text-sm font-medium text-gray-300 mb-3">Preferences</h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-white">Auto-play previews</span>
            <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-red-600 transition-colors">
              <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6"></span>
            </button>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-white">HD Quality</span>
            <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-red-600 transition-colors">
              <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6"></span>
            </button>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-white">Notifications</span>
            <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-600 transition-colors">
              <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-1"></span>
            </button>
          </div>
        </div>
      </div>

      {/* Account Management */}
      <div className="p-4">
        <div className="space-y-2">
          <button className="w-full flex items-center space-x-3 p-2 text-white hover:bg-gray-800 rounded-lg transition-colors">
            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="text-sm">Manage Profiles</span>
          </button>
          <button className="w-full flex items-center space-x-3 p-2 text-white hover:bg-gray-800 rounded-lg transition-colors">
            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-sm">Account Settings</span>
          </button>
          <button className="w-full flex items-center space-x-3 p-2 text-white hover:bg-gray-800 rounded-lg transition-colors">
            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm">Help Center</span>
          </button>
          <div className="border-t border-gray-700 pt-2 mt-2">
            <button className="w-full flex items-center space-x-3 p-2 text-red-400 hover:bg-gray-800 rounded-lg transition-colors">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span className="text-sm">Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserProfileDropdown
