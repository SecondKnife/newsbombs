import siteMetadata from "@data/siteMetadata";
import ListLayout from "@layouts/ListLayoutWithTags";
import { genPageMetadata } from "@data/seo";
import { Metadata } from "next";
import { POSTS_PER_PAGE } from "@/lib/constants/pagination";
import { getAllArticles } from "@/lib/api/articles";

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

export async function generateStaticParams() {
  // Fetch all articles to get unique tags
  const articles = await getAllArticles();
  const allTags = new Set<string>();
  articles.forEach((article) => {
    if (article.tags && Array.isArray(article.tags)) {
      article.tags.forEach((tag) => allTags.add(tag));
    }
  });
  
  const paths = Array.from(allTags).map((tag) => ({
    tag: encodeURI(tag),
  }));
  return paths;
}

export default async function TagPage(props: { params: Promise<{ tag: string }> }) {
  const params = await props.params;
  const tag = decodeURI(params.tag);
  
  // Fetch articles from backend
  const articles = await getAllArticles();
  
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
}
