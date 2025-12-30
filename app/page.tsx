import dynamic from "next/dynamic";
import { getAllArticles, type Article } from "@/lib/api/articles";

export const runtime = 'edge';

const HomePage = dynamic(() => import("@/components/home"), {
  ssr: true,
});

export default async function Home() {
  // Fetch articles from backend API
  let articles: Article[] = [];
  try {
    articles = await getAllArticles();
    // Ensure articles is always an array
    if (!Array.isArray(articles)) {
      console.warn('getAllArticles returned non-array, using empty array');
      articles = [];
    }
  } catch (error: any) {
    // Log error but don't throw - show page with empty articles
    console.error('Error loading articles:', error?.message || error);
    articles = [];
  }
  
  // Transform articles to match the expected format
  // Use try-catch to handle any transformation errors
  let blogPosts: any[] = [];
  try {
    blogPosts = articles.map((article) => ({
      ...article,
      name: article.slug,
      excerpt: article.summary || '',
      structuredData: {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: article.title || '',
        datePublished: article.date || new Date().toISOString(),
        dateModified: article.lastmod || article.date || new Date().toISOString(),
      },
      body: {
        code: article.content || '',
      },
      toc: [],
    }));
  } catch (error: any) {
    console.error('Error transforming articles:', error?.message || error);
    blogPosts = [];
  }
  
  return <HomePage blogs={blogPosts} />;
}
