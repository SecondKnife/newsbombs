import dynamicImport from "next/dynamic";
import { getAllArticles, type Article } from "@/lib/api/articles";
import HomeRedirect from "@/components/HomeRedirect";

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

const HomePage = dynamicImport(() => import("@/components/home").catch((error) => {
  console.error('Failed to load HomePage component:', error);
  return {
    default: ({ blogs }: { blogs: any[] }) => (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Welcome
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {blogs.length > 0 ? `${blogs.length} articles loaded` : 'No articles available'}
          </p>
        </div>
      </div>
    ),
  };
}), {
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
    let articles: Article[] = [];
    try {
      try {
      articles = await getAllArticles();
      } catch (fetchError: any) {
        console.warn('Failed to fetch articles:', fetchError?.message || fetchError);
        articles = [];
      }
      
      if (!Array.isArray(articles)) {
        console.warn('getAllArticles returned non-array, using empty array');
        articles = [];
      }
    } catch (error: any) {
      console.error('Error loading articles:', error?.message || error);
      articles = [];
    }
    
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
    
    return (
      <HomeRedirect>
        <HomePage blogs={blogPosts} />
      </HomeRedirect>
    );
  } catch (error: any) {
    console.error('Critical error in Home page:', error?.message || error);
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
