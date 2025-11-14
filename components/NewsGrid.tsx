"use client";

import Image from "@/components/Image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import dayjs from "dayjs";
import dynamic from "next/dynamic";
import { fadeInUp } from "@/lib/motion/variants";

const MotionBlock = dynamic(() => import("./motions/Block"));

interface NewsGridProps {
  posts: any[];
  title?: string;
}

export default function NewsGrid({ posts, title = "Latest News" }: NewsGridProps) {
  if (!posts || posts.length === 0) return null;

  return (
    <div className="space-y-6">
      <MotionBlock variants={fadeInUp}>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{title}</h2>
      </MotionBlock>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post, index) => (
          <MotionBlock
            key={post.slug || post.name || index}
            variants={fadeInUp}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="bg-white dark:bg-slate-700 border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden group h-full flex flex-col">
              <Link href={`/blog/${post.slug || post.name || post.title}`}>
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={
                      (post.images && Array.isArray(post.images) && post.images[0] && typeof post.images[0] === 'string')
                        ? post.images[0]
                        : "/placeholder.jpg"
                    }
                    alt={post.title || 'News article'}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <CardContent className="p-5 flex-1 flex flex-col">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {post.tags?.slice(0, 2).map((tag: string) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <h3 className="text-xl font-bold mb-2 line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    {post.title}
                  </h3>
                  {post.summary && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 mb-4 flex-1">
                      {post.summary}
                    </p>
                  )}
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mt-auto">
                    <time dateTime={post.date}>
                      {dayjs(post.date).format("MMM DD, YYYY")}
                    </time>
                    <span className="text-primary-600 dark:text-primary-400 group-hover:underline">
                      Read more →
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

