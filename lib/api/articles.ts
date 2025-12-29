// Get API base URL
// Server-side (SSR/SSG) needs full URL, client-side can use relative path
const getApiBaseUrl = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
  
  // If running on server-side (SSR/SSG), need full URL
  if (typeof window === 'undefined') {
    // Server-side: use full URL
    if (apiUrl) {
      if (apiUrl.startsWith('http://') || apiUrl.startsWith('https://')) {
        return apiUrl;
      }
      return `http://${apiUrl}`;
    }
    // Default to localhost for server-side
    return 'http://localhost:3001';
  }
  
  // Client-side: can use relative path (empty string) or full URL
  if (!apiUrl) return ''; // Relative path for client-side
  if (apiUrl.startsWith('http://') || apiUrl.startsWith('https://')) {
    return apiUrl;
  }
  return `http://${apiUrl}`;
};

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

export async function getAllArticles(): Promise<Article[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/articles`, {
      next: { revalidate: 60 }, // Revalidate every 60 seconds
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch articles: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching articles:', error);
    return [];
  }
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/articles/slug/${encodeURIComponent(slug)}`, {
      next: { revalidate: 60 },
    });
    
    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`Failed to fetch article: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching article:', error);
    return null;
  }
}

export async function getArticleById(id: string): Promise<Article | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/articles/${id}`, {
      next: { revalidate: 60 },
    });
    
    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`Failed to fetch article: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching article:', error);
    return null;
  }
}

