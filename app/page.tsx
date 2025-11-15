import dynamic from "next/dynamic";
import { getAllArticles } from "@/lib/api/articles";

const HomePage = dynamic(() => import("@/components/home"));

export default async function Home() {
  // Fetch articles from backend API
  const articles = await getAllArticles();
  
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
