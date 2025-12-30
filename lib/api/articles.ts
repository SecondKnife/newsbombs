// Get API base URL with better fallback handling
function getApiBaseUrl(): string {
  // If explicitly set, use it
  if (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  
  // On Cloudflare Pages, check for CF_PAGES environment variable
  // If no API URL is set, return empty string to avoid localhost calls
  if (typeof process !== 'undefined') {
    // Check if we're on Cloudflare Pages
    if (process.env.CF_PAGES || process.env.CF_PAGES_BRANCH) {
      // Return empty string to avoid making requests to localhost
      return '';
    }
  }
  
  // Development fallback (only in Node.js environment)
  if (typeof process !== 'undefined' && process.env.NODE_ENV !== 'production') {
    return 'http://localhost:3001';
  }
  
  // Default: return empty string to avoid errors
  return '';
}

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
    // If no API URL is configured, return empty array
    if (!API_BASE_URL) {
      console.warn('No API_BASE_URL configured, returning empty articles array');
      return [];
    }
    
    const response = await fetchWithTimeout(`${API_BASE_URL}/api/articles`, {
      next: { revalidate: 60 }, // Revalidate every 60 seconds
    }, 5000);
    
    if (!response.ok) {
      console.error(`Failed to fetch articles: ${response.status} ${response.statusText}`);
      return [];
    }
    
    return await response.json();
  } catch (error: any) {
    // Handle network errors gracefully
    if (error.name === 'AbortError') {
      console.error('Request timeout while fetching articles');
    } else {
      console.error('Error fetching articles:', error.message || error);
    }
    return [];
  }
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  try {
    // If no API URL is configured, return null
    if (!API_BASE_URL) {
      console.warn('No API_BASE_URL configured, cannot fetch article');
      return null;
    }
    
    const response = await fetchWithTimeout(`${API_BASE_URL}/api/articles/slug/${encodeURIComponent(slug)}`, {
      next: { revalidate: 60 },
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
    // If no API URL is configured, return null
    if (!API_BASE_URL) {
      console.warn('No API_BASE_URL configured, cannot fetch article');
      return null;
    }
    
    const response = await fetchWithTimeout(`${API_BASE_URL}/api/articles/${id}`, {
      next: { revalidate: 60 },
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

