"use client";

import Image from "@/components/Image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import dayjs from "dayjs";
import dynamic from "next/dynamic";
import { fadeInUp } from "@/lib/motion/variants";

const MotionBlock = dynamic(() => import("./motions/Block"));

interface NewsHeroProps {
  featuredPost: any;
}

export default function NewsHero({ featuredPost }: NewsHeroProps) {
  if (!featuredPost) return null;

  return (
    <MotionBlock variants={fadeInUp}>
      <Card className="bg-white dark:bg-slate-700 border-0 shadow-lg overflow-hidden">
        <Link href={`/blog/${featuredPost.slug || featuredPost.name || featuredPost.title}`}>
          <div className="relative h-[400px] md:h-[500px] lg:h-[600px] group cursor-pointer">
            <Image
              src={
                (featuredPost.images && Array.isArray(featuredPost.images) && featuredPost.images[0] && typeof featuredPost.images[0] === 'string')
                  ? featuredPost.images[0]
                  : "/placeholder.jpg"
              }
              alt={featuredPost.title || 'Featured post'}
              fill
              sizes="100vw"
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            <CardContent className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white">
              <div className="flex flex-wrap gap-2 mb-3">
                {featuredPost.tags?.slice(0, 3).map((tag: string) => (
                  <Badge key={tag} variant="secondary" className="bg-white/20 text-white hover:bg-white/30">
                    {tag}
                  </Badge>
                ))}
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 line-clamp-2">
                {featuredPost.title}
              </h1>
              {featuredPost.summary && (
                <p className="text-lg md:text-xl text-gray-200 line-clamp-2 mb-3">
                  {featuredPost.summary}
                </p>
              )}
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <time dateTime={featuredPost.date}>
                  {dayjs(featuredPost.date).format("MMMM DD, YYYY")}
                </time>
              </div>
            </CardContent>
          </div>
        </Link>
      </Card>
    </MotionBlock>
  );
}

