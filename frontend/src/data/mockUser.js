// Mock user data for demonstration
export const mockUserProfile = {
  name: "Alex Johnson",
  email: "alex.johnson@gitpodflix.com",
  plan: "Premium",
  watchedMovies: 127,
  watchlistCount: 23,
  hoursWatched: 342,
  preferences: {
    autoPlayPreviews: true,
    hdQuality: true,
    notifications: false
  },
  recentActivity: [
    { title: "The Matrix", watchedAt: "2024-01-15", progress: 100 },
    { title: "Inception", watchedAt: "2024-01-14", progress: 75 },
    { title: "The Dark Knight", watchedAt: "2024-01-13", progress: 100 }
  ],
  favoriteGenres: ["Action", "Sci-Fi", "Thriller", "Drama"],
  joinedDate: "2023-06-15",
  profileImage: "/images/profile-avatar.jpg"
}

// Simulate user preferences updates
export const updateUserPreference = (key, value) => {
  mockUserProfile.preferences[key] = value
  console.log(`Updated ${key} to ${value}`)
  // In a real app, this would make an API call
}

// Simulate user activity tracking
export const addToWatchHistory = (movieTitle) => {
  mockUserProfile.recentActivity.unshift({
    title: movieTitle,
    watchedAt: new Date().toISOString().split('T')[0],
    progress: Math.floor(Math.random() * 100) + 1
  })
  mockUserProfile.recentActivity = mockUserProfile.recentActivity.slice(0, 10) // Keep last 10
  mockUserProfile.watchedMovies += 1
}

// Get user stats
export const getUserStats = () => ({
  totalMovies: mockUserProfile.watchedMovies,
  totalHours: mockUserProfile.hoursWatched,
  averageRating: 4.2,
  favoriteGenre: mockUserProfile.favoriteGenres[0],
  memberSince: mockUserProfile.joinedDate
})
