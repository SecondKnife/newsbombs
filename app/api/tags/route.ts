import { NextResponse } from 'next/server';

export const runtime = 'edge';

// Get API base URL with better fallback handling
function getApiBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  if (process.env.API_URL) {
    return process.env.API_URL;
  }
  // On Cloudflare Pages, return empty string if no API URL is set
  if (typeof process !== 'undefined' && process.env.CF_PAGES) {
    return '';
  }
  return 'http://localhost:3001';
}

const API_BASE_URL = getApiBaseUrl();

export async function GET() {
  try {
    // If no API URL is configured, return empty tags
    if (!API_BASE_URL) {
      console.warn('No API_BASE_URL configured, returning empty tags');
      return NextResponse.json({});
    }
    
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

