import { YouTubeVideoItem } from '../types';

/**
 * Robust YouTube video ID extractor that supports:
 * - https://www.youtube.com/watch?v=VIDEO_ID
 * - https://youtu.be/VIDEO_ID
 * - https://youtube.com/shorts/VIDEO_ID
 * - https://www.youtube.com/live/VIDEO_ID
 * - https://www.youtube.com/embed/VIDEO_ID
 * - https://m.youtube.com/watch?v=VIDEO_ID
 * - https://img.youtube.com/vi/VIDEO_ID/...
 * - https://i.ytimg.com/vi/VIDEO_ID/...
 * - Raw 11-character video ID (e.g. y4K_5A4wNrw)
 */
export const extractVideoId = (input?: string | null): string | null => {
  if (!input) return null;
  const trimmed = input.trim();

  // If already an 11-character video ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }

  // Common YouTube URL regex covering watch, youtu.be, shorts, live, embed, and img/i.ytimg urls
  const patterns = [
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|shorts\/|live\/|watch\?v=|watch\?.+&v=))([a-zA-Z0-9_-]{11})/i,
    /(?:img\.youtube\.com\/vi\/|i\.ytimg\.com\/vi\/)([a-zA-Z0-9_-]{11})/i,
    /[?&]v=([a-zA-Z0-9_-]{11})/i,
  ];

  for (const pattern of patterns) {
    const match = trimmed.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
};

/**
 * Returns a guaranteed working high-quality YouTube thumbnail.
 * 'hqdefault.jpg' (480x360) exists for 100% of YouTube videos on earth,
 * whereas 'maxresdefault.jpg' returns 404 for non-HD/shorts videos.
 */
export const getYouTubeThumbnail = (
  input?: string | YouTubeVideoItem | { thumbnail?: string; youtubeUrl?: string; videoId?: string } | null
): string => {
  if (!input) {
    return 'https://img.youtube.com/vi/y4K_5A4wNrw/hqdefault.jpg';
  }

  if (typeof input === 'string') {
    // If it's a direct image URL (e.g. data:image or custom hosted image)
    if (input.startsWith('data:image') || (input.startsWith('http') && !input.includes('youtube.com') && !input.includes('youtu.be') && !input.includes('ytimg.com'))) {
      return input;
    }
    const videoId = extractVideoId(input);
    if (videoId) {
      return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
    }
    return input;
  }

  // If it's an object with custom thumbnail
  if (input.thumbnail && !input.thumbnail.includes('unsplash.com') && !input.thumbnail.includes('placeholder')) {
    return input.thumbnail;
  }

  const videoId = input.videoId || extractVideoId(input.youtubeUrl);
  if (videoId) {
    return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  }

  return 'https://img.youtube.com/vi/y4K_5A4wNrw/hqdefault.jpg';
};

/**
 * Fetches video metadata (title, official thumbnail) from oEmbed
 */
export const fetchYouTubeInfo = async (
  urlOrId: string
): Promise<{ title?: string; author_name?: string; thumbnail_url?: string; videoId?: string } | null> => {
  const videoId = extractVideoId(urlOrId);
  if (!videoId) return null;

  const targetUrl = `https://www.youtube.com/watch?v=${videoId}`;
  const defaultThumbnail = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

  try {
    // 1. Try local server API route
    try {
      const serverRes = await fetch(`/api/youtube/info?url=${encodeURIComponent(targetUrl)}`);
      if (serverRes.ok) {
        const data = await serverRes.json();
        if (data && data.thumbnail_url) {
          return {
            title: data.title,
            author_name: data.author_name,
            thumbnail_url: data.thumbnail_url || defaultThumbnail,
            videoId,
          };
        }
      }
    } catch {
      // fallback to client-side oembed
    }

    // 2. Direct oEmbed fallback
    const oembedUrl = `https://noembed.com/embed?url=${encodeURIComponent(targetUrl)}`;
    const res = await fetch(oembedUrl);
    if (res.ok) {
      const data = await res.json();
      if (data && !data.error) {
        return {
          title: data.title,
          author_name: data.author_name,
          thumbnail_url: data.thumbnail_url || defaultThumbnail,
          videoId,
        };
      }
    }
  } catch (err) {
    console.warn('oEmbed fetch error:', err);
  }

  return {
    thumbnail_url: defaultThumbnail,
    videoId,
  };
};

/**
 * Image error fallback for YouTube thumbnails
 */
export const handleThumbnailError = (e: React.SyntheticEvent<HTMLImageElement, Event>, fallbackVideoId?: string) => {
  const target = e.currentTarget;
  const currentSrc = target.src;

  const vId = fallbackVideoId || extractVideoId(currentSrc);
  if (vId) {
    if (currentSrc.includes('maxresdefault')) {
      target.src = `https://img.youtube.com/vi/${vId}/hqdefault.jpg`;
    } else if (currentSrc.includes('hqdefault')) {
      target.src = `https://img.youtube.com/vi/${vId}/mqdefault.jpg`;
    } else if (currentSrc.includes('mqdefault')) {
      target.src = `https://img.youtube.com/vi/${vId}/0.jpg`;
    }
  } else {
    target.src = 'https://img.youtube.com/vi/y4K_5A4wNrw/hqdefault.jpg';
  }
};
