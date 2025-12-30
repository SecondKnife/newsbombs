import PostSimple from '@layouts/PostSimple'
import PostLayout from '@layouts/PostLayout'
import PostBanner from '@layouts/PostBanner'
import siteMetadata from '@data/siteMetadata'
import { notFound } from 'next/navigation'
import { getArticleBySlug, getAllArticles } from '@/lib/api/articles'
import { Metadata } from 'next'

// Helper function to check if content is HTML
function isHTMLContent(content: string): boolean {
  // Check if content contains HTML tags
  return /<[a-z][\s\S]*>/i.test(content);
}

const defaultLayout = 'PostLayout'
const layouts = {
  PostSimple,
  PostLayout,
  PostBanner,
}

type PageParams = Promise<{ slug: string[] }>;

export async function generateMetadata({
  params: asyncParams,
}: {
  params: PageParams
}): Promise<Metadata | undefined> {
  const params = await asyncParams;
  const slug = decodeURI(params.slug.join('/'))
  const article = await getArticleBySlug(slug)
  
  if (!article) {
    return undefined
  }

  const publishedAt = new Date(article.date).toISOString()
  const modifiedAt = new Date(article.lastmod || article.date).toISOString()
  let imageList = [siteMetadata.socialBanner]
  if (article.images && article.images.length > 0) {
    imageList = article.images
  }
  const ogImages = imageList.map((img) => {
    return {
      url: img.includes('http') ? img : siteMetadata.siteUrl + img,
    }
  })

  return {
    title: article.title,
    description: article.summary || '',
    openGraph: {
      title: article.title,
      description: article.summary || '',
      siteName: siteMetadata.title,
      locale: 'en_US',
      type: 'article',
      publishedTime: publishedAt,
      modifiedTime: modifiedAt,
      url: './',
      images: ogImages,
      authors: [siteMetadata.author],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.summary || '',
      images: imageList,
    },
  }
}

export async function generateStaticParams() {
  try {
    // Fetch all articles to generate static paths
    const articles = await getAllArticles()
    return articles
      .filter((article) => article.slug && typeof article.slug === 'string')
      .map((article) => ({ 
        slug: article.slug.split('/') 
      }))
  } catch (error) {
    console.error('Error generating static params:', error)
    return []
  }
}

export default async function Page(props: { params: Promise<{ slug: string[] }> }) {
  const params = await props.params;
  const slug = decodeURI(params.slug.join('/'))
  
  // Fetch article from backend
  const article = await getArticleBySlug(slug)
  
  if (!article) {
    return notFound()
  }

  // Fetch all articles for prev/next navigation
  const allArticles = await getAllArticles()
  const sortedArticles = allArticles.sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  )
  
  const postIndex = sortedArticles.findIndex((p) => p.slug === slug)
  const prev = postIndex < sortedArticles.length - 1 ? sortedArticles[postIndex + 1] : null
  const next = postIndex > 0 ? sortedArticles[postIndex - 1] : null

  // Transform article to match expected format
  const mainContent = {
    ...article,
    name: article.slug,
    slug: article.slug,
    path: `blog/${article.slug}`,
    filePath: `blog/${article.slug}`,
    excerpt: article.summary,
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: article.title,
      datePublished: article.date,
      dateModified: article.lastmod || article.date,
      author: {
        '@type': 'Person',
        name: siteMetadata.author,
      },
    },
    body: {
      code: article.content,
    },
    toc: [],
    authors: ['default'],
  }

  const authorDetails = [{
    name: siteMetadata.author,
    slug: 'default',
  }]

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: article.title,
    datePublished: article.date,
    dateModified: article.lastmod || article.date,
    author: {
      '@type': 'Person',
      name: siteMetadata.author,
    },
  }

  const Layout = layouts[article.layout as keyof typeof layouts] || layouts[defaultLayout]
  
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Layout 
        content={mainContent} 
        authorDetails={authorDetails} 
        next={next ? {
          path: `blog/${next.slug}`,
          title: next.title,
        } : undefined} 
        prev={prev ? {
          path: `blog/${prev.slug}`,
          title: prev.title,
        } : undefined}
      >
        {isHTMLContent(article.content) ? (
          <div 
            className="article-content prose max-w-none dark:prose-invert prose-headings:font-bold prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-p:leading-relaxed prose-a:text-primary-500 prose-img:rounded-lg prose-img:mx-auto prose-figure:mx-auto prose-figure:text-center"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        ) : (
          <div className="article-content prose max-w-none dark:prose-invert whitespace-pre-wrap">
            {article.content}
          </div>
        )}
      </Layout>
    </>
  )
}
