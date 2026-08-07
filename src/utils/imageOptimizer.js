const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

/**
 * Helper to produce optimized, compressed WebP image URLs from remote raw assets
 * @param {string} url - Original image URL
 * @param {object} options - { width: number, quality: number, format: 'webp' }
 * @returns {string}
 */
export function getOptimizedImageUrl(url, { width = 600, quality = 80, format = 'webp' } = {}) {
  if (!url) return '';
  // If it's a data URL or blob, return as is
  if (url.startsWith('data:') || url.startsWith('blob:')) return url;

  return `${API_BASE_URL}/images/optimize?url=${encodeURIComponent(url)}&w=${width}&q=${quality}&format=${format}`;
}
