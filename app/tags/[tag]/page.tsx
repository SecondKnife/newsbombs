import siteMetadata from "@data/siteMetadata";
import ListLayout from "@layouts/ListLayoutWithTags";
import { genPageMetadata } from "@data/seo";
import { Metadata } from "next";
import { POSTS_PER_PAGE } from "@/lib/constants/pagination";
import { getAllArticles, type Article } from "@/lib/api/articles";

export const runtime = 'edge';
export const dynamic = 'force-dynamic';
export const dynamicParams = false;

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

export default async function TagPage(props: { params: Promise<{ tag: string }> }) {
  let tag = 'Unknown';
  try {
    const params = await props.params;
    tag = decodeURI(params.tag);
  } catch (error: any) {
    console.error('Error getting tag from params:', error?.message || error);
  }
  
  try {
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
    
    const filteredArticles = articles.filter((article) => 
      article.tags && article.tags.includes(tag)
    );
  
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
