import PostSimple from '@layouts/PostSimple'
import PostLayout from '@layouts/PostLayout'
import PostBanner from '@layouts/PostBanner'
import siteMetadata from '@data/siteMetadata'
import { notFound } from 'next/navigation'
import { getArticleBySlug, getAllArticles, type Article } from '@/lib/api/articles'
import { Metadata } from 'next'

export const runtime = 'edge';
export const dynamic = 'force-dynamic';
export const dynamicParams = false;

function isHTMLContent(content: string): boolean {
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
  try {
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
  } catch (error) {
    return undefined;
  }
}

export default async function Page(props: { params: Promise<{ slug: string[] }> }) {
  try {
    const params = await props.params;
    const slug = decodeURI(params.slug.join('/'))
    
    let article;
    try {
      article = await getArticleBySlug(slug);
    } catch (error: any) {
      console.error('Error fetching article:', error?.message || error);
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Article not found</h1>
            <p className="mt-4">The article you are looking for does not exist.</p>
          </div>
        </div>
      );
    }
    
    if (!article) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Article not found</h1>
            <p className="mt-4">The article you are looking for does not exist.</p>
          </div>
        </div>
      );
    }

    let allArticles: Article[] = [];
    try {
      allArticles = await getAllArticles();
      if (!Array.isArray(allArticles)) {
        allArticles = [];
      }
    } catch (error: any) {
      console.error('Error fetching all articles:', error?.message || error);
      allArticles = [];
    }
    
    let sortedArticles: Article[] = [];
    try {
      sortedArticles = allArticles.sort((a, b) => {
        try {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        } catch {
          return 0;
        }
      });
    } catch (error: any) {
      console.error('Error sorting articles:', error?.message || error);
      sortedArticles = allArticles;
    }
  
    const postIndex = sortedArticles.findIndex((p) => p.slug === slug)
    const prev = postIndex < sortedArticles.length - 1 ? sortedArticles[postIndex + 1] : null
    const next = postIndex > 0 ? sortedArticles[postIndex - 1] : null

    let mainContent;
    try {
      mainContent = {
        ...article,
        name: article.slug || '',
        slug: article.slug || '',
        path: `blog/${article.slug || ''}`,
        filePath: `blog/${article.slug || ''}`,
        excerpt: article.summary || '',
        structuredData: {
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          headline: article.title || '',
          datePublished: article.date || new Date().toISOString(),
          dateModified: article.lastmod || article.date || new Date().toISOString(),
          author: {
            '@type': 'Person',
            name: siteMetadata.author || 'Unknown',
          },
        },
        body: {
          code: article.content || '',
        },
        toc: [],
        authors: ['default'],
      };
    } catch (error: any) {
      console.error('Error transforming article:', error?.message || error);
      throw error;
    }

    const authorDetails = [{
      name: siteMetadata.author || 'Unknown',
      slug: 'default',
    }]

    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: article.title || '',
      datePublished: article.date || new Date().toISOString(),
      dateModified: article.lastmod || article.date || new Date().toISOString(),
      author: {
        '@type': 'Person',
        name: siteMetadata.author || 'Unknown',
      },
    }

    const Layout = layouts[article.layout as keyof typeof layouts] || layouts[defaultLayout]
    
    try {
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
            {isHTMLContent(article.content || '') ? (
              <div 
                className="article-content prose max-w-none dark:prose-invert prose-headings:font-bold prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-p:leading-relaxed prose-a:text-primary-500 prose-img:rounded-lg prose-img:mx-auto prose-figure:mx-auto prose-figure:text-center"
                dangerouslySetInnerHTML={{ __html: article.content || '' }}
              />
            ) : (
              <div className="article-content prose max-w-none dark:prose-invert whitespace-pre-wrap">
                {article.content || ''}
              </div>
            )}
          </Layout>
        </>
      );
    } catch (renderError: any) {
      console.error('Error rendering Layout:', renderError?.message || renderError);
      return (
        <div className="min-h-screen p-8">
          <h1 className="text-3xl font-bold mb-4">{article.title || 'Untitled'}</h1>
          <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: article.content || '' }} />
        </div>
      );
    }
  } catch (error: any) {
    console.error('Error rendering article page:', error?.message || error);
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Error loading article</h1>
          <p className="mt-4">An error occurred while loading this article.</p>
        </div>
      </div>
    );
  }
}
