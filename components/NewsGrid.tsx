"use client";

import Image from "@/components/Image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import dayjs from "dayjs";
import dynamic from "next/dynamic";
import { fadeInUp } from "@/lib/motion/variants";
import { useTranslation } from "@/contexts/LanguageContext";

const MotionBlock = dynamic(() => import("./motions/Block"));

interface NewsGridProps {
  posts: any[];
  title?: string;
}

export default function NewsGrid({ posts, title }: NewsGridProps) {
  const { t } = useTranslation();
  const displayTitle = title || t('home.latestNews');
  
  if (!posts || posts.length === 0) return null;

  // First post is featured (larger)
  const featuredPost = posts[0];
  const remainingPosts = posts.slice(1);

  return (
    <div className="space-y-4 sm:space-y-6">
      <MotionBlock variants={fadeInUp}>
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">{displayTitle}</h2>
      </MotionBlock>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
        {/* Featured Card - Full width on mobile, half on tablet+ */}
        <MotionBlock variants={fadeInUp} className="md:row-span-2">
          <Card className="bg-white dark:bg-slate-700 border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group h-full flex flex-col">
            <Link href={`/blog/${featuredPost.slug || featuredPost.name || featuredPost.title}`} className="flex flex-col h-full">
              <div className="relative h-44 sm:h-52 md:h-60 lg:h-72 overflow-hidden">
                <Image
                  src={
                    (featuredPost.images && Array.isArray(featuredPost.images) && featuredPost.images[0] && typeof featuredPost.images[0] === 'string')
                      ? featuredPost.images[0]
                      : "/placeholder.jpg"
                  }
                  alt={featuredPost.title || 'News article'}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 md:p-5">
                  <div className="flex flex-wrap gap-1 sm:gap-1.5 mb-1.5 sm:mb-2">
                    {featuredPost.tags?.slice(0, 2).map((tag: string) => (
                      <Badge key={tag} className="bg-primary-600/90 text-white text-[10px] sm:text-xs px-1.5 py-0.5">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-white mb-1 line-clamp-2 group-hover:text-primary-200 transition-colors">
                    {featuredPost.title}
                  </h3>
                  <time className="text-[10px] sm:text-xs text-gray-300" dateTime={featuredPost.date}>
                    {dayjs(featuredPost.date).format("DD/MM/YYYY")}
                  </time>
                </div>
              </div>
              <CardContent className="p-3 sm:p-4 flex-1 flex flex-col bg-white dark:bg-slate-700">
                {featuredPost.summary && (
                  <p className="text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-300 line-clamp-2 sm:line-clamp-3 mb-2 sm:mb-3 flex-1">
                    {featuredPost.summary}
                  </p>
                )}
                <span className="text-xs sm:text-sm text-primary-600 dark:text-primary-400 font-medium group-hover:underline inline-flex items-center gap-1">
                  {t('common.readMore')} <span className="group-hover:translate-x-1 transition-transform">→</span>
                </span>
              </CardContent>
            </Link>
          </Card>
        </MotionBlock>

        {/* Remaining Cards - Horizontal layout */}
        {remainingPosts.map((post, index) => (
          <MotionBlock
            key={post.slug || post.name || index}
            variants={fadeInUp}
            transition={{ delay: (index + 1) * 0.05 }}
          >
            <Card className="bg-white dark:bg-slate-700 border-0 shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group h-full">
              <Link href={`/blog/${post.slug || post.name || post.title}`} className="flex flex-row h-full">
                {/* Image */}
                <div className="relative w-24 sm:w-32 md:w-36 lg:w-40 h-24 sm:h-28 md:h-32 flex-shrink-0 overflow-hidden">
                  <Image
                    src={
                      (post.images && Array.isArray(post.images) && post.images[0] && typeof post.images[0] === 'string')
                        ? post.images[0]
                        : "/placeholder.jpg"
                    }
                    alt={post.title || 'News article'}
                    fill
                    sizes="160px"
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <CardContent className="p-2.5 sm:p-3 md:p-4 flex-1 flex flex-col justify-center min-w-0">
                  <div className="min-w-0">
                    <div className="flex flex-wrap gap-1 mb-1 sm:mb-1.5">
                      {post.tags?.slice(0, 1).map((tag: string) => (
                        <Badge key={tag} variant="secondary" className="text-[9px] sm:text-[10px] md:text-xs px-1 sm:px-1.5 py-0.5">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <h3 className="text-xs sm:text-sm md:text-base font-bold mb-1 line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors leading-tight">
                      {post.title}
                    </h3>
                  </div>
                  <div className="flex items-center justify-between text-[9px] sm:text-[10px] md:text-xs text-gray-500 dark:text-gray-400 mt-1">
                    <time dateTime={post.date}>
                      {dayjs(post.date).format("DD/MM/YYYY")}
                    </time>
                    <span className="text-primary-600 dark:text-primary-400 group-hover:underline hidden sm:inline">
                      {t('common.readMore')} →
                    </span>
                  </div>
                </CardContent>
              </Link>
            </Card>
          </MotionBlock>
        ))}
      </div>
    </div>
  );
}

