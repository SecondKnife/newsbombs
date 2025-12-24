import { NextResponse } from 'next/server';
import { API_BASE_URL } from '@/lib/api/config';

export async function GET() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/articles`, {
      next: { revalidate: 60 },
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch articles: ${response.statusText}`);
    }
    
    const articles = await response.json();
    const tagCounts: Record<string, number> = {};
    
    articles.forEach((article: any) => {
      if (article.tags && Array.isArray(article.tags)) {
        article.tags.forEach((tag: string) => {
          tagCounts[tag] = (tagCounts[tag] || 0) + 1;
        });
      }
    });
    
    return NextResponse.json(tagCounts);
  } catch (error) {
    console.error('Error fetching tags:', error);
    return NextResponse.json({}, { status: 500 });
  }
}

