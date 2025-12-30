import dynamic from "next/dynamic";
import { getAllArticles, type Article } from "@/lib/api/articles";

export const runtime = 'edge';

const HomePage = dynamic(() => import("@/components/home"), {
  ssr: true,
  loading: () => (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white mx-auto"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
      </div>
    </div>
  ),
});

export default async function Home() {
  try {
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
      blogPosts = (articles || []).map((article) => {
        try {
          return {
            ...article,
            name: article.slug || '',
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
          };
        } catch (err) {
          console.error('Error transforming single article:', err);
          return null;
        }
      }).filter((post): post is any => post !== null);
    } catch (error: any) {
      console.error('Error transforming articles:', error?.message || error);
      blogPosts = [];
    }
    
    return <HomePage blogs={blogPosts} />;
  } catch (error: any) {
    // Ultimate fallback - if anything fails, show error page
    console.error('Critical error in Home page:', error?.message || error);
    // Return empty page instead of crashing
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center p-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Welcome
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Content is loading...
          </p>
        </div>
      </div>
    );
  }
}
