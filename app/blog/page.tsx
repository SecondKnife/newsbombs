import ListLayout from "@layouts/ListLayoutWithTags";
import { genPageMetadata } from "data/seo";
import { getAllArticles, type Article } from "@/lib/api/articles";
import { POSTS_PER_PAGE } from "@/lib/constants/pagination";

// Cloudflare Pages requires Edge Runtime for all routes
export const runtime = 'edge';

// Force dynamic rendering to always fetch fresh data from API
export const dynamic = 'force-dynamic';

export const metadata = genPageMetadata({ title: "Blog" });

export default async function BlogPage(props: any) {
  // Fetch articles from backend API with error handling
  let articles: Article[] = [];
  try {
    articles = await getAllArticles();
    // Ensure articles is always an array
    if (!Array.isArray(articles)) {
      articles = [];
    }
  } catch (error: any) {
    console.error('Error loading articles:', error?.message || error);
    articles = [];
  }
  
  // Transform articles to match the expected format
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
  
  const pageNumber = 1;
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
      title="Tất cả bài viết"
    />
  );
}
