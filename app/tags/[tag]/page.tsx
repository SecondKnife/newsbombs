import siteMetadata from "@data/siteMetadata";
import ListLayout from "@layouts/ListLayoutWithTags";
import { genPageMetadata } from "@data/seo";
import { Metadata } from "next";
import { POSTS_PER_PAGE } from "@/lib/constants/pagination";
import { getAllArticles, type Article } from "@/lib/api/articles";

// Cloudflare Pages requires Edge Runtime for all routes
export const runtime = 'edge';

// Force dynamic rendering to always fetch fresh data from API
export const dynamic = 'force-dynamic';

export const dynamicParams = false; // Return 404 for unknown tags

export async function generateMetadata(
  props: {
    params: Promise<{ tag: string }>;
  }
): Promise<Metadata> {
  const params = await props.params;
  const tag = decodeURI(params.tag);
  return genPageMetadata({
    title: tag,
    description: `${siteMetadata.title} ${tag} tagged content`,
    alternates: {
      canonical: "./",
      types: {
        "application/rss+xml": `${siteMetadata.siteUrl}/tags/${tag}/feed.xml`,
      },
    },
  });
}

// Note: generateStaticParams cannot be used with Edge Runtime
// Cloudflare Pages will handle static generation automatically

export default async function TagPage(props: { params: Promise<{ tag: string }> }) {
  // Get tag from params first, before try-catch
  let tag = 'Unknown';
  try {
    const params = await props.params;
    tag = decodeURI(params.tag);
  } catch (error: any) {
    console.error('Error getting tag from params:', error?.message || error);
    // tag will remain 'Unknown'
  }
  
  try {
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
    
    // Filter articles by tag
    const filteredArticles = articles.filter((article) => 
      article.tags && article.tags.includes(tag)
    );
  
    // Transform articles to match expected format
    const posts = filteredArticles.map((article) => ({
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
    
    // Capitalize first letter and convert space to dash
    const title = tag[0].toUpperCase() + tag.split(" ").join("-").slice(1);
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
        title={title}
        pagination={pagination}
      />
    );
  } catch (error: any) {
    console.error('Error rendering tag page:', error?.message || error);
    // Return empty page instead of crashing
    return (
      <ListLayout
        posts={[]}
        initialDisplayPosts={[]}
        title={tag}
        pagination={{
          currentPage: 1,
          totalPages: 0,
        }}
      />
    );
  }
}
