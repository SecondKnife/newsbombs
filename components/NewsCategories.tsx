"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import dynamic from "next/dynamic";
import { fadeInRight } from "@/lib/motion/variants";

const MotionBlock = dynamic(() => import("./motions/Block"));

interface NewsCategoriesProps {
  posts: any[];
}

export default function NewsCategories({ posts }: NewsCategoriesProps) {
  // Extract all unique tags from posts
  const allTags = new Set<string>();
  posts.forEach((post) => {
    post.tags?.forEach((tag: string) => allTags.add(tag));
  });

  const tagsArray = Array.from(allTags).slice(0, 10);

  return (
    <MotionBlock variants={fadeInRight}>
      <Card className="bg-white dark:bg-slate-700 border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {tagsArray.map((tag) => (
              <Link key={tag} href={`/tags/${tag}`}>
                <Badge
                  variant="secondary"
                  className="cursor-pointer hover:bg-primary-100 dark:hover:bg-primary-900 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
                >
                  {tag}
                </Badge>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </MotionBlock>
  );
}

