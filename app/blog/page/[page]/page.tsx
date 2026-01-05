import ListLayout from "@layouts/ListLayoutWithTags";
import { getAllArticles, type Article } from "@/lib/api/articles";
import { POSTS_PER_PAGE } from "@/lib/constants/pagination";

// Cloudflare Pages requires Edge Runtime for all routes
export const runtime = 'edge';

// Cloudflare Pages will handle static generation automatically
export const dynamicParams = false; // Return 404 for unknown pages

// Note: generateStaticParams cannot be used with Edge Runtime
// Cloudflare Pages will handle static generation automatically

export default async function Page(props: { params: Promise<{ page: string }> }) {
  try {
    const params = await props.params;
    
    // Fetch articles from backend with error handling
    let articles: Article[] = [];
    try {
      articles = await getAllArticles();
      if (!Array.isArray(articles)) {
        articles = [];
      }
    } catch (error: any) {
      console.error('Error loading articles:', error?.message || error);
      articles = [];
    }
    
    // Transform articles to match expected format
    const posts = (articles || []).map((article) => ({
    ...article,
    name: article.slug,
    excerpt: article.summary,
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: article.title,
      datePublished: article.date,
      dateModified: article.lastmod || article.date,
    },
    body: {
      code: article.content,
    },
    toc: [],
  })).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  const pageNumber = parseInt(params.page as string);
  const initialDisplayPosts = posts.slice(
    POSTS_PER_PAGE * (pageNumber - 1),
    POSTS_PER_PAGE * pageNumber
  );
  const pagination = {
    currentPage: pageNumber,
    totalPages: Math.ceil(posts.length / POSTS_PER_PAGE),
  };

  return (
    <ListLayout
      posts={posts}
      initialDisplayPosts={initialDisplayPosts}
      pagination={pagination}
      title="All Posts"
    />
  );
  } catch (error: any) {
    console.error('Error rendering blog page:', error?.message || error);
    // Return empty page instead of crashing
    return (
      <ListLayout
        posts={[]}
        initialDisplayPosts={[]}
        pagination={{
          currentPage: 1,
          totalPages: 0,
        }}
        title="All Posts"
      />
    );
  }
}
