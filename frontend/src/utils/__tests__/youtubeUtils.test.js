import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  extractYouTubeVideoId,
  getYouTubeEmbedUrl,
  getYouTubeThumbnail,
  isYouTubeUrl,
  getYouTubeDuration,
  createYouTubePlayerConfig
} from '../youtubeUtils'

// Mock window.location
Object.defineProperty(window, 'location', {
  value: {
    origin: 'https://example.com'
  },
  writable: true
})

describe('YouTube Utils', () => {
  describe('extractYouTubeVideoId', () => {
    it('should extract video ID from standard YouTube URL', () => {
      const url = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
      expect(extractYouTubeVideoId(url)).toBe('dQw4w9WgXcQ')
    })

    it('should extract video ID from short YouTube URL', () => {
      const url = 'https://youtu.be/dQw4w9WgXcQ'
      expect(extractYouTubeVideoId(url)).toBe('dQw4w9WgXcQ')
    })

    it('should extract video ID from embed URL', () => {
      const url = 'https://www.youtube.com/embed/dQw4w9WgXcQ'
      expect(extractYouTubeVideoId(url)).toBe('dQw4w9WgXcQ')
    })

    it('should extract video ID from v/ URL format', () => {
      const url = 'https://www.youtube.com/v/dQw4w9WgXcQ'
      expect(extractYouTubeVideoId(url)).toBe('dQw4w9WgXcQ')
    })

    it('should extract video ID from URL with additional parameters', () => {
      const url = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=30s&list=PLrAXtmRdnEQy'
      expect(extractYouTubeVideoId(url)).toBe('dQw4w9WgXcQ')
    })

    it('should return null for invalid URLs', () => {
      expect(extractYouTubeVideoId('https://example.com')).toBeNull()
      expect(extractYouTubeVideoId('not-a-url')).toBeNull()
      expect(extractYouTubeVideoId('')).toBeNull()
      expect(extractYouTubeVideoId(null)).toBeNull()
      expect(extractYouTubeVideoId(undefined)).toBeNull()
    })

    it('should return null for non-string input', () => {
      expect(extractYouTubeVideoId(123)).toBeNull()
      expect(extractYouTubeVideoId({})).toBeNull()
      expect(extractYouTubeVideoId([])).toBeNull()
    })
  })

  describe('getYouTubeEmbedUrl', () => {
    it('should generate embed URL with default options', () => {
      const videoId = 'dQw4w9WgXcQ'
      const embedUrl = getYouTubeEmbedUrl(videoId)
      
      expect(embedUrl).toContain(`https://www.youtube.com/embed/${videoId}`)
      expect(embedUrl).toContain('autoplay=1')
      expect(embedUrl).toContain('controls=1')
      expect(embedUrl).toContain('origin=https%3A%2F%2Fexample.com')
    })

    it('should generate embed URL with custom options', () => {
      const videoId = 'dQw4w9WgXcQ'
      const options = { autoplay: 0, mute: 1 }
      const embedUrl = getYouTubeEmbedUrl(videoId, options)
      
      expect(embedUrl).toContain('autoplay=0')
      expect(embedUrl).toContain('mute=1')
    })

    it('should return null for empty video ID', () => {
      expect(getYouTubeEmbedUrl('')).toBeNull()
      expect(getYouTubeEmbedUrl(null)).toBeNull()
      expect(getYouTubeEmbedUrl(undefined)).toBeNull()
    })

    it('should merge custom options with defaults', () => {
      const videoId = 'dQw4w9WgXcQ'
      const options = { autoplay: 0 }
      const embedUrl = getYouTubeEmbedUrl(videoId, options)
      
      expect(embedUrl).toContain('autoplay=0')
      expect(embedUrl).toContain('controls=1') // Default should still be present
    })
  })

  describe('getYouTubeThumbnail', () => {
    it('should generate thumbnail URL with default quality', () => {
      const videoId = 'dQw4w9WgXcQ'
      const thumbnailUrl = getYouTubeThumbnail(videoId)
      
      expect(thumbnailUrl).toBe(`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`)
    })

    it('should generate thumbnail URL with custom quality', () => {
      const videoId = 'dQw4w9WgXcQ'
      const quality = 'maxresdefault'
      const thumbnailUrl = getYouTubeThumbnail(videoId, quality)
      
      expect(thumbnailUrl).toBe(`https://img.youtube.com/vi/${videoId}/${quality}.jpg`)
    })

    it('should return null for empty video ID', () => {
      expect(getYouTubeThumbnail('')).toBeNull()
      expect(getYouTubeThumbnail(null)).toBeNull()
      expect(getYouTubeThumbnail(undefined)).toBeNull()
    })
  })

  describe('isYouTubeUrl', () => {
    it('should return true for YouTube URLs', () => {
      expect(isYouTubeUrl('https://www.youtube.com/watch?v=dQw4w9WgXcQ')).toBe(true)
      expect(isYouTubeUrl('https://youtu.be/dQw4w9WgXcQ')).toBe(true)
      expect(isYouTubeUrl('http://youtube.com/watch?v=test')).toBe(true)
      expect(isYouTubeUrl('HTTPS://YOUTUBE.COM/WATCH?V=TEST')).toBe(true)
    })

    it('should return false for non-YouTube URLs', () => {
      expect(isYouTubeUrl('https://example.com')).toBe(false)
      expect(isYouTubeUrl('https://vimeo.com/123456')).toBe(false)
      expect(isYouTubeUrl('not-a-url')).toBe(false)
      expect(isYouTubeUrl('')).toBe(false)
    })

    it('should return false for non-string input', () => {
      expect(isYouTubeUrl(null)).toBe(false)
      expect(isYouTubeUrl(undefined)).toBe(false)
      expect(isYouTubeUrl(123)).toBe(false)
      expect(isYouTubeUrl({})).toBe(false)
    })
  })

  describe('getYouTubeDuration', () => {
    it('should return default duration', async () => {
      const videoId = 'dQw4w9WgXcQ'
      const duration = await getYouTubeDuration(videoId)
      
      expect(duration).toBe(180) // 3 minutes default
    })

    it('should handle any video ID', async () => {
      const duration1 = await getYouTubeDuration('test1')
      const duration2 = await getYouTubeDuration('test2')
      
      expect(duration1).toBe(180)
      expect(duration2).toBe(180)
    })
  })

  describe('createYouTubePlayerConfig', () => {
    it('should create player config with default options', () => {
      const videoId = 'dQw4w9WgXcQ'
      const config = createYouTubePlayerConfig(videoId)
      
      expect(config.videoId).toBe(videoId)
      expect(config.playerVars.autoplay).toBe(1)
      expect(config.playerVars.controls).toBe(1)
      expect(config.playerVars.mute).toBe(0)
      expect(config.playerVars.origin).toBe('https://example.com')
    })

    it('should create player config with custom options', () => {
      const videoId = 'dQw4w9WgXcQ'
      const customOptions = { autoplay: 0, mute: 1, controls: 0 }
      const config = createYouTubePlayerConfig(videoId, customOptions)
      
      expect(config.videoId).toBe(videoId)
      expect(config.playerVars.autoplay).toBe(0)
      expect(config.playerVars.mute).toBe(1)
      expect(config.playerVars.controls).toBe(0)
    })

    it('should merge custom options with defaults', () => {
      const videoId = 'dQw4w9WgXcQ'
      const customOptions = { autoplay: 0 }
      const config = createYouTubePlayerConfig(videoId, customOptions)
      
      expect(config.playerVars.autoplay).toBe(0) // Custom
      expect(config.playerVars.controls).toBe(1) // Default
      expect(config.playerVars.fs).toBe(1) // Default
    })
  })
})