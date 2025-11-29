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

interface NewsHeroProps {
  featuredPost: any;
}

export default function NewsHero({ featuredPost }: NewsHeroProps) {
  const { t } = useTranslation();
  
  if (!featuredPost) return null;

  return (
    <MotionBlock variants={fadeInUp}>
      <Card className="bg-white dark:bg-slate-700 border-0 shadow-lg overflow-hidden">
        <Link href={`/blog/${featuredPost.slug || featuredPost.name || featuredPost.title}`}>
          {/* Responsive height: smaller on mobile */}
          <div className="relative h-[280px] sm:h-[350px] md:h-[450px] lg:h-[500px] group cursor-pointer">
            <Image
              src={
                (featuredPost.images && Array.isArray(featuredPost.images) && featuredPost.images[0] && typeof featuredPost.images[0] === 'string')
                  ? featuredPost.images[0]
                  : "/placeholder.jpg"
              }
              alt={featuredPost.title || 'Featured post'}
              fill
              sizes="100vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            <CardContent className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8 text-white">
              <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-2 sm:mb-3">
                {featuredPost.tags?.slice(0, 2).map((tag: string) => (
                  <Badge key={tag} variant="secondary" className="bg-white/20 text-white hover:bg-white/30 text-xs sm:text-sm">
                    {tag}
                  </Badge>
                ))}
              </div>
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-2 sm:mb-3 line-clamp-2">
                {featuredPost.title}
              </h1>
              {featuredPost.summary && (
                <p className="text-sm sm:text-base md:text-lg text-gray-200 line-clamp-2 mb-2 sm:mb-3 hidden sm:block">
                  {featuredPost.summary}
                </p>
              )}
              <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-300">
                <time dateTime={featuredPost.date}>
                  {dayjs(featuredPost.date).format("DD/MM/YYYY")}
                </time>
                <span className="text-primary-400 hover:underline">
                  {t('common.readMore')} →
                </span>
              </div>
            </CardContent>
          </div>
        </Link>
      </Card>
    </MotionBlock>
  );
}

