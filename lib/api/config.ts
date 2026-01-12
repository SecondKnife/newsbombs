/**
 * Get the API base URL
 * - Uses NEXT_PUBLIC_API_URL if set (for external backend)
 * - Uses relative path on Vercel (same domain)
 * - Falls back to localhost for development
 */
export function getApiBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }

  if (typeof window === 'undefined' && process.env.NEXT_PHASE === 'phase-production-build') {
    return process.env.BUILD_API_URL || 'http://localhost:3001';
  }

  if (typeof window === 'undefined' && process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  if (process.env.NODE_ENV === 'production' || process.env.VERCEL) {
    return '';
  }

  return 'http://localhost:3001';
}

export const API_BASE_URL = getApiBaseUrl();

