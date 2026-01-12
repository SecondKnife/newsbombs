import { NextResponse } from 'next/server';

export const runtime = 'edge';

function getApiBaseUrl(): string {
  try {
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
  
  return 'https://api.nhatbinhkt.com';
}

export async function GET() {
  try {
    const API_BASE_URL = getApiBaseUrl();
    
    if (!API_BASE_URL) {
      console.warn('No API_BASE_URL configured, returning empty tags');
      return NextResponse.json({});
    }
    
    const response = await fetch(`${API_BASE_URL}/api/articles`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
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
  } catch (error: any) {
    console.error('Error fetching tags:', error?.message || error);
    return NextResponse.json({});
  }
}

