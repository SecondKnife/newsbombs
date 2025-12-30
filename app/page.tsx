import dynamic from "next/dynamic";
import { getAllArticles, type Article } from "@/lib/api/articles";

export const runtime = 'edge';

const HomePage = dynamic(() => import("@/components/home"));

export default async function Home() {
  // Fetch articles from backend API
  let articles: Article[] = [];
  try {
    articles = await getAllArticles();
  } catch (error) {
    console.error('Error loading articles:', error);
    // Continue with empty array to show page without articles
  }
  
  // Transform articles to match the expected format
  const blogPosts = articles.map((article) => ({
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
  }));
  
  return <HomePage blogs={blogPosts} />;
}
