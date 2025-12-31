// Get API base URL with better fallback handling
// In edge runtime, environment variables are available directly
function getApiBaseUrl(): string {
  try {
    // Try multiple ways to get environment variable (works in both Node.js and Edge runtime)
    // In Cloudflare Pages, NEXT_PUBLIC_* variables are available at runtime
    let apiUrl: string | undefined;
    
    // Method 1: Try process.env (Node.js and some edge runtimes)
    if (typeof process !== 'undefined' && process.env) {
      apiUrl = process.env.NEXT_PUBLIC_API_URL;
      console.log('[getApiBaseUrl] Method 1 (process.env):', apiUrl || 'not found');
    }
    
    // Method 2: Try globalThis (edge runtime fallback)
    if (!apiUrl && typeof globalThis !== 'undefined') {
      apiUrl = (globalThis as any).NEXT_PUBLIC_API_URL;
      console.log('[getApiBaseUrl] Method 2 (globalThis):', apiUrl || 'not found');
    }
    
    // Method 3: Try direct access (Cloudflare Pages)
    if (!apiUrl && typeof process !== 'undefined') {
      try {
        apiUrl = (process as any).env?.NEXT_PUBLIC_API_URL;
        console.log('[getApiBaseUrl] Method 3 (process.env?):', apiUrl || 'not found');
      } catch (e) {
        console.log('[getApiBaseUrl] Method 3 error:', e);
      }
    }
    
    // Method 4: Try accessing via Request context (Cloudflare Pages edge runtime)
    // In Cloudflare Pages, env vars might be in the request context
    if (!apiUrl) {
      try {
        // This is a fallback - Cloudflare Pages might inject env vars differently
        const env = (globalThis as any).env || (globalThis as any).ENV;
        if (env && env.NEXT_PUBLIC_API_URL) {
          apiUrl = env.NEXT_PUBLIC_API_URL;
          console.log('[getApiBaseUrl] Method 4 (globalThis.env):', apiUrl);
        }
      } catch (e) {
        // Ignore
      }
    }
    
    if (apiUrl && typeof apiUrl === 'string' && apiUrl.trim() !== '') {
      console.log('[getApiBaseUrl] Found API URL:', apiUrl.trim());
      return apiUrl.trim();
    }
    
    // Fallback: Hardcode for testing (remove after fixing)
    console.warn('[getApiBaseUrl] No API URL found in env, using fallback');
    const fallbackUrl = 'http://157.66.100.32:3001';
    console.log('[getApiBaseUrl] Using fallback URL:', fallbackUrl);
    return fallbackUrl;
  } catch (error) {
    console.error('[getApiBaseUrl] Error reading API URL from environment:', error);
    // Fallback for testing
    return 'http://157.66.100.32:3001';
  }
}

// Get API base URL at runtime (not at module load time)
// This ensures environment variables are read correctly in edge runtime
export function getApiBaseUrlRuntime(): string {
  return getApiBaseUrl();
}

// For backward compatibility, but prefer using getApiBaseUrlRuntime() in edge runtime
// Note: Don't initialize at module level in edge runtime - use getApiBaseUrlRuntime() instead
// const API_BASE_URL = getApiBaseUrl(); // Removed - causes issues in edge runtime

export interface Article {
  id: string;
  title: string;
  summary: string | null;
  content: string;
  slug: string;
  date: string;
  lastmod: string | null;
  tags: string[] | null;
  images: string[] | null;
  draft: boolean;
  layout: string;
  authorId: string | null;
  createdAt: string;
  updatedAt: string;
}

// Helper function to create fetch with timeout
// Note: setTimeout requires nodejs_compat flag in Cloudflare Pages
// In edge runtime, we use AbortController with a Promise-based timeout
async function fetchWithTimeout(url: string, options: RequestInit = {}, timeout = 5000): Promise<Response> {
  // Check if setTimeout is available (requires nodejs_compat flag)
  if (typeof setTimeout === 'undefined' || typeof clearTimeout === 'undefined') {
    // Fallback: fetch without timeout if setTimeout is not available
    // This happens when nodejs_compat flag is not set
    return await fetch(url, options);
  }
  
  try {
    // Use AbortController for timeout (works in edge runtime with nodejs_compat)
    const controller = new AbortController();
    
    // Create timeout promise
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, timeout);
    
    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      
      // Clear timeout if fetch completed successfully
      clearTimeout(timeoutId);
      
      return response;
    } catch (error: any) {
      // Clear timeout on error
      clearTimeout(timeoutId);
      
      // If it's an AbortError, it's from timeout
      if (error.name === 'AbortError') {
        throw new Error('Request timeout');
      }
      throw error;
    }
  } catch (error) {
    // Re-throw any errors
    throw error;
  }
}

export async function getAllArticles(): Promise<Article[]> {
  try {
    // Get API URL at runtime to ensure environment variables are read correctly
    const apiBaseUrl = getApiBaseUrlRuntime();
    
    // If no API URL is configured, return empty array gracefully
    if (!apiBaseUrl || apiBaseUrl.trim() === '') {
      console.warn('No API_BASE_URL configured, returning empty articles array');
      return [];
    }
    
    // Ensure URL is valid before making request
    const url = `${apiBaseUrl}/api/articles`;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      console.warn('Invalid API URL, returning empty articles array');
      return [];
    }
    
    try {
      // Note: next: { revalidate } doesn't work in Cloudflare Pages edge runtime
      // Use standard fetch with cache headers instead
      const response = await fetchWithTimeout(url, {
        headers: {
          'Accept': 'application/json',
          'Cache-Control': 'public, max-age=60, s-maxage=60',
        },
      }, 5000);
      
      if (!response.ok) {
        console.error(`Failed to fetch articles: ${response.status} ${response.statusText}`);
        return [];
      }
      
      const data = await response.json();
      // Ensure we return an array
      return Array.isArray(data) ? data : [];
    } catch (fetchError: any) {
      // Handle fetch errors specifically
      console.error('Fetch error:', fetchError?.message || fetchError);
      // Return empty array instead of throwing
      return [];
    }
  } catch (error: any) {
    // Handle any other errors gracefully
    console.error('Error in getAllArticles:', error?.message || error);
    // Always return empty array, never throw
    return [];
  }
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  try {
    // Get API URL at runtime
    const apiBaseUrl = getApiBaseUrlRuntime();
    
    // If no API URL is configured, return null
    if (!apiBaseUrl || apiBaseUrl.trim() === '') {
      console.warn('No API_BASE_URL configured, cannot fetch article');
      return null;
    }
    
    const url = `${apiBaseUrl}/api/articles/slug/${encodeURIComponent(slug)}`;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      console.warn('Invalid API URL, cannot fetch article');
      return null;
    }
    
    // Note: next: { revalidate } doesn't work in Cloudflare Pages edge runtime
    const response = await fetchWithTimeout(url, {
      headers: {
        'Accept': 'application/json',
        'Cache-Control': 'public, max-age=60, s-maxage=60',
      },
    }, 5000);
    
    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      console.error(`Failed to fetch article: ${response.status} ${response.statusText}`);
      return null;
    }
    
    return await response.json();
  } catch (error: any) {
    // Handle network errors gracefully
    if (error.name === 'AbortError') {
      console.error('Request timeout while fetching article');
    } else {
      console.error('Error fetching article:', error.message || error);
    }
    return null;
  }
}

export async function getArticleById(id: string): Promise<Article | null> {
  try {
    // Get API URL at runtime
    const apiBaseUrl = getApiBaseUrlRuntime();
    
    // If no API URL is configured, return null
    if (!apiBaseUrl || apiBaseUrl.trim() === '') {
      console.warn('No API_BASE_URL configured, cannot fetch article');
      return null;
    }
    
    const url = `${apiBaseUrl}/api/articles/${id}`;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      console.warn('Invalid API URL, cannot fetch article');
      return null;
    }
    
    // Note: next: { revalidate } doesn't work in Cloudflare Pages edge runtime
    const response = await fetchWithTimeout(url, {
      headers: {
        'Accept': 'application/json',
        'Cache-Control': 'public, max-age=60, s-maxage=60',
      },
    }, 5000);
    
    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      console.error(`Failed to fetch article: ${response.status} ${response.statusText}`);
      return null;
    }
    
    return await response.json();
  } catch (error: any) {
    // Handle network errors gracefully
    if (error.name === 'AbortError') {
      console.error('Request timeout while fetching article');
    } else {
      console.error('Error fetching article:', error.message || error);
    }
    return null;
  }
}

