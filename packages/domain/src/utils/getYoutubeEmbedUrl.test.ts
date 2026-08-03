import { describe, expect, it } from 'vitest'
import { getYoutubeEmbedUrl } from './getYoutubeEmbedUrl.ts'

describe('getYoutubeEmbedUrl', () => {
  it('returns null when no url is given', () => {
    expect(getYoutubeEmbedUrl(undefined)).toBeNull()
    expect(getYoutubeEmbedUrl('')).toBeNull()
  })

  it('returns null for a non-youtube url', () => {
    expect(getYoutubeEmbedUrl('https://example.com/video')).toBeNull()
  })

  it('returns null for a malformed url', () => {
    expect(getYoutubeEmbedUrl('not a url')).toBeNull()
  })

  it('builds an embed url from a standard watch url', () => {
    expect(getYoutubeEmbedUrl('https://www.youtube.com/watch?v=abc123')).toBe(
      'https://www.youtube.com/embed/abc123',
    )
  })

  it('builds an embed url from a watch url with extra query params', () => {
    expect(getYoutubeEmbedUrl('https://www.youtube.com/watch?v=abc123&t=42s')).toBe(
      'https://www.youtube.com/embed/abc123',
    )
  })

  it('builds an embed url from a shortened youtu.be url', () => {
    expect(getYoutubeEmbedUrl('https://youtu.be/abc123')).toBe(
      'https://www.youtube.com/embed/abc123',
    )
  })

  it('builds an embed url from an existing embed url', () => {
    expect(getYoutubeEmbedUrl('https://www.youtube.com/embed/abc123')).toBe(
      'https://www.youtube.com/embed/abc123',
    )
  })

  it('builds an embed url from a shorts url', () => {
    expect(getYoutubeEmbedUrl('https://www.youtube.com/shorts/abc123')).toBe(
      'https://www.youtube.com/embed/abc123',
    )
  })

  it('builds an embed url from a mobile (m.youtube.com) url', () => {
    expect(getYoutubeEmbedUrl('https://m.youtube.com/watch?v=abc123')).toBe(
      'https://www.youtube.com/embed/abc123',
    )
  })
})
