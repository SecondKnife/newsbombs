// Get API base URL with better fallback handling
// In edge runtime, environment variables are available directly
function getApiBaseUrl(): string {
  try {
    // Try to get from environment variable (works in both Node.js and Edge runtime)
    // In Cloudflare Pages, NEXT_PUBLIC_* variables are available at runtime
    let apiUrl: string | undefined;
    
    if (typeof process !== 'undefined' && process.env) {
      apiUrl = process.env.NEXT_PUBLIC_API_URL;
    }
    
    if (!apiUrl && typeof globalThis !== 'undefined') {
      apiUrl = (globalThis as any).NEXT_PUBLIC_API_URL;
    }
    
    if (apiUrl && typeof apiUrl === 'string' && apiUrl.trim() !== '') {
      const cleaned = apiUrl.trim().replace(/\/+$/, '').replace(/\/api$/, '');
      console.log('[getApiBaseUrl] Found API URL:', cleaned);
      return cleaned;
    }
  } catch (error) {
    console.warn('[getApiBaseUrl] Error reading API URL:', error);
  }
  
  // Fallback to HTTPS tunnel endpoint
  console.log('[getApiBaseUrl] Using fallback: https://api.nhatbinhkt.com');
  return 'https://api.nhatbinhkt.com';
}

// Get API base URL at runtime (not at module load time)
// This ensures environment variables are read correctly in edge runtime
export function getApiBaseUrlRuntime(): string {
  return getApiBaseUrl();
}

// For backward compatibility, but prefer using getApiBaseUrlRuntime() in edge runtime
const API_BASE_URL = getApiBaseUrl();

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
async function fetchWithTimeout(url: string, options: RequestInit = {}, timeout = 5000): Promise<Response> {
  try {
    // Try to use AbortController with timeout if available
    if (typeof AbortController !== 'undefined' && typeof setTimeout !== 'undefined') {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);
      
      try {
        const response = await fetch(url, {
          ...options,
          signal: controller.signal,
        });
        clearTimeout(timeoutId);
        return response;
      } catch (error) {
        clearTimeout(timeoutId);
        throw error;
      }
    } else {
      // Fallback: fetch without timeout if setTimeout is not available
      return await fetch(url, options);
    }
  } catch (error) {
    throw error;
  }
}

export async function getAllArticles(): Promise<Article[]> {
  try {
    // Get API URL at runtime to ensure environment variables are read correctly
    const apiBaseUrl = getApiBaseUrlRuntime();
    
    // If no API URL is configured, return empty array gracefully
    if (!apiBaseUrl || apiBaseUrl.trim() === '') {
      console.warn('[getAllArticles] No API_BASE_URL configured, returning empty articles array');
      console.warn('[getAllArticles] Check NEXT_PUBLIC_API_URL environment variable in Cloudflare Pages');
      return [];
    }
    
    // Ensure URL is valid before making request
    const url = `${apiBaseUrl}/api/articles`;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      console.warn('[getAllArticles] Invalid API URL:', url);
      return [];
    }
    
    console.log('[getAllArticles] Fetching articles from:', url);
    
    // Fetch with no cache to always get fresh data
    const response = await fetchWithTimeout(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
      },
      cache: 'no-store', // Disable caching for Edge Runtime
    }, 5000);
    
    if (!response.ok) {
      console.error(`[getAllArticles] Failed to fetch articles: ${response.status} ${response.statusText}`);
      const errorText = await response.text().catch(() => '');
      console.error(`[getAllArticles] Error response:`, errorText);
      return [];
    }
    
    const data = await response.json();
    console.log(`[getAllArticles] Successfully fetched ${Array.isArray(data) ? data.length : 0} articles`);
    // Ensure we return an array
    return Array.isArray(data) ? data : [];
  } catch (error: any) {
    // Handle network errors gracefully
    if (error.name === 'AbortError') {
      console.error('[getAllArticles] Request timeout while fetching articles');
    } else {
      console.error('[getAllArticles] Error fetching articles:', error.message || error);
      console.error('[getAllArticles] Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack,
      });
    }
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
    
    // Fetch with no cache to always get fresh data
    const response = await fetchWithTimeout(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
      },
      cache: 'no-store', // Disable caching for Edge Runtime
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
    
    // Fetch with no cache to always get fresh data
    const response = await fetchWithTimeout(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
      },
      cache: 'no-store', // Disable caching for Edge Runtime
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

