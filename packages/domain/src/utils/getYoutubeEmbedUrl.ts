function extractYoutubeVideoId(url: string): string | null {
  let parsed: URL
  try {
    parsed = new URL(url)
  } catch {
    return null
  }

  const host = parsed.hostname.replace(/^www\.|^m\./, '')

  if (host === 'youtu.be') {
    return parsed.pathname.slice(1) || null
  }

  if (host === 'youtube.com') {
    if (parsed.pathname === '/watch') {
      return parsed.searchParams.get('v')
    }
    const match = parsed.pathname.match(/^\/(embed|shorts)\/([^/]+)/)
    if (match) return match[2]
  }

  return null
}

export function getYoutubeEmbedUrl(url?: string): string | null {
  if (!url) return null
  const videoId = extractYoutubeVideoId(url)
  return videoId ? `https://www.youtube.com/embed/${videoId}` : null
}
