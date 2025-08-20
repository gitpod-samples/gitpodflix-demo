import React, { useState } from 'react'
import UserProfileDropdown from './UserProfileDropdown'
import { mockUserProfile } from '../data/mockUser'

function ProfileTest() {
  const [showDropdown, setShowDropdown] = useState(false)

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Profile Dropdown Test</h1>
        
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">User Profile Data</h2>
          <pre className="text-sm text-gray-300 bg-gray-900 p-4 rounded overflow-auto">
            {JSON.stringify(mockUserProfile, null, 2)}
          </pre>
        </div>

        <div className="relative inline-block">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-colors"
          >
            <img 
              src="/images/profile-avatar.jpg" 
              alt="Profile" 
              className="w-8 h-8 rounded-full object-cover"
            />
            <span>Toggle Profile Dropdown</span>
          </button>
          
          <UserProfileDropdown 
            isOpen={showDropdown}
            onClose={() => setShowDropdown(false)}
            userProfile={mockUserProfile}
          />
        </div>

        <div className="mt-8 text-sm text-gray-400">
          <p>Click the button above to test the profile dropdown functionality.</p>
          <p>The dropdown should show user information, stats, preferences, and actions.</p>
        </div>
      </div>
    </div>
  )
}

export default ProfileTest
