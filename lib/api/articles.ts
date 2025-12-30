// Get API base URL with better fallback handling
function getApiBaseUrl(): string {
  // If explicitly set, use it
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  
  // On Cloudflare Pages, return empty string to use relative paths
  // This assumes API routes are proxied or backend is on same domain
  if (typeof process !== 'undefined' && process.env.CF_PAGES) {
    return '';
  }
  
  // Development fallback
  return 'http://localhost:3001';
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
async function fetchWithTimeout(url: string, options: RequestInit = {}, timeout = 5000): Promise<Response> {
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

