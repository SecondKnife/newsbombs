import ListLayout from "@layouts/ListLayoutWithTags";
import { getAllArticles } from "@/lib/api/articles";
import { POSTS_PER_PAGE } from "@/lib/constants/pagination";

export async function generateStaticParams() {
  // Fetch articles to calculate total pages
  const articles = await getAllArticles();
  const totalPages = Math.ceil(articles.length / POSTS_PER_PAGE);
  const paths = Array.from({ length: totalPages }, (_, i) => ({
    page: (i + 1).toString(),
  }));
  return paths;
}

export default async function Page(props: { params: Promise<{ page: string }> }) {
  const params = await props.params;
  
  // Fetch articles from backend
  const articles = await getAllArticles();
  
  // Transform articles to match expected format
  const posts = articles.map((article) => ({
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
}
