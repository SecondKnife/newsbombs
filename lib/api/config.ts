/**
 * Get the API base URL
 * - Uses NEXT_PUBLIC_API_URL if set (for external backend)
 * - Uses relative path on Vercel (same domain)
 * - Falls back to localhost for development
 */
export function getApiBaseUrl(): string {
  // If explicitly set, use it
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }

  // During build time (static generation), we can't use relative URLs
  // Use localhost or skip API calls during build
  if (typeof window === 'undefined' && process.env.NEXT_PHASE === 'phase-production-build') {
    // During build, return empty string to skip API calls
    // Or use localhost if backend is running
    return process.env.BUILD_API_URL || 'http://localhost:3001';
  }

  // On Vercel server-side, use the Vercel URL
  if (typeof window === 'undefined' && process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  // On Vercel client-side or production, use relative path (same origin)
  if (process.env.NODE_ENV === 'production' || process.env.VERCEL) {
    return '';
  }

  // Development fallback
  return 'http://localhost:3001';
}

export const API_BASE_URL = getApiBaseUrl();

