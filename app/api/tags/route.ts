import { NextResponse } from 'next/server';

// Edge runtime required for Cloudflare Pages
export const runtime = 'edge';

// Get API base URL with better fallback handling
function getApiBaseUrl(): string {
  try {
    // Try multiple methods to get environment variable
    let apiUrl: string | undefined;
    
    if (typeof process !== 'undefined' && process.env) {
      apiUrl = process.env.NEXT_PUBLIC_API_URL || process.env.API_URL;
    }
    
    if (!apiUrl && typeof globalThis !== 'undefined') {
      apiUrl = (globalThis as any).NEXT_PUBLIC_API_URL;
    }
    
    if (apiUrl && typeof apiUrl === 'string' && apiUrl.trim() !== '') {
      return apiUrl.trim();
    }
  } catch (error) {
    console.warn('Error reading API URL:', error);
  }
  
  // On Cloudflare Pages without API URL, return empty string
  return '';
}

export async function GET() {
  try {
    // Get API URL at runtime (not at module level) for edge runtime compatibility
    const API_BASE_URL = getApiBaseUrl();
    
    // If no API URL is configured, return empty tags
    if (!API_BASE_URL) {
      console.warn('No API_BASE_URL configured, returning empty tags');
      return NextResponse.json({});
    }
    
    // Check if setTimeout is available (requires nodejs_compat flag)
    if (typeof setTimeout === 'undefined' || typeof clearTimeout === 'undefined') {
      // Fallback: fetch without timeout
      const response = await fetch(`${API_BASE_URL}/api/articles`, {
        next: { revalidate: 60 },
      });
      
      if (!response.ok) {
        console.error(`Failed to fetch articles: ${response.status} ${response.statusText}`);
        return NextResponse.json({});
      }
      
      const articles = await response.json();
      const tagCounts: Record<string, number> = {};
      
      if (Array.isArray(articles)) {
        articles.forEach((article: any) => {
          if (article.tags && Array.isArray(article.tags)) {
            article.tags.forEach((tag: string) => {
              tagCounts[tag] = (tagCounts[tag] || 0) + 1;
            });
          }
        });
      }
      
      return NextResponse.json(tagCounts);
    }
    
    // Use timeout if setTimeout is available
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const response = await fetch(`${API_BASE_URL}/api/articles`, {
      next: { revalidate: 60 },
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      console.error(`Failed to fetch articles: ${response.status} ${response.statusText}`);
      return NextResponse.json({});
    }
    
    const articles = await response.json();
    const tagCounts: Record<string, number> = {};
    
    if (Array.isArray(articles)) {
      articles.forEach((article: any) => {
        if (article.tags && Array.isArray(article.tags)) {
          article.tags.forEach((tag: string) => {
            tagCounts[tag] = (tagCounts[tag] || 0) + 1;
          });
        }
      });
    }
    
    return NextResponse.json(tagCounts);
  } catch (error: any) {
    // Handle network errors gracefully
    if (error.name === 'AbortError') {
      console.error('Request timeout while fetching tags');
    } else {
      console.error('Error fetching tags:', error.message || error);
    }
    // Return empty tags instead of 500 error
    return NextResponse.json({});
  }
}

