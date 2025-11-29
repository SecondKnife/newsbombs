"use client";

import { usePathname } from "next/navigation";
import { useMemo } from "react";
import Link from "@components/Link";
import { slug } from "@/lib/next-utils";
import dayjs from "dayjs";
import { DATE_LOCALE_FORMAT } from "@/lib/constants/format";
import { Button } from "@/components/ui/button";
import Image from "@/components/Image";
import { arise, cards, fadeInLeft, fadeInRight } from "@/lib/motion/variants";
import dynamic from "next/dynamic";
const MotionBlock = dynamic(() => import("@/components/motions/Block"));
const MotionListItem = dynamic(() => import("@/components/motions/ListItem"));
const Tag = dynamic(() => import("@components/Tag"));

interface PaginationProps {
  totalPages: number;
  currentPage: number;
}
interface ListLayoutProps {
  posts: any[];
  title: string;
  initialDisplayPosts?: any[];
  pagination: PaginationProps;
}

function Pagination({ totalPages, currentPage }: PaginationProps) {
  const pathname = usePathname();
  const basePath = pathname.split("/")[1];
  const prevPage = currentPage - 1 > 0;
  const nextPage = currentPage + 1 <= totalPages;

  return (
    <MotionBlock variants={arise} className="space-y-2 pb-8 pt-6 md:space-y-5">
      <nav className="flex justify-between">
        {!prevPage && (
          <button
            className="cursor-auto disabled:opacity-50"
            disabled={!prevPage}
          >
            Previous
          </button>
        )}
        {prevPage && (
          <Link
            href={
              currentPage - 1 === 1
                ? `/${basePath}/`
                : `/${basePath}/page/${currentPage - 1}`
            }
            rel="prev"
          >
            Previous
          </Link>
        )}
        <span>
          {currentPage} of {totalPages}
        </span>
        {!nextPage && (
          <button
            className="cursor-auto disabled:opacity-50"
            disabled={!nextPage}
          >
            Next
          </button>
        )}
        {nextPage && (
          <Link href={`/${basePath}/page/${currentPage + 1}`} rel="next">
            Next
          </Link>
        )}
      </nav>
    </MotionBlock>
  );
}

export default function ListLayoutWithTags({
  posts,
  title,
  initialDisplayPosts = [],
  pagination,
}: ListLayoutProps) {
  const pathname = usePathname();
  
  // Derive tags from posts dynamically
  const tagCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    posts.forEach((post) => {
      post.tags?.forEach((tag: string) => {
        counts[tag] = (counts[tag] || 0) + 1;
      });
    });
    return counts;
  }, [posts]);
  
  const tagKeys = Object.keys(tagCounts);
  const sortedTags = tagKeys.sort((a, b) => tagCounts[b] - tagCounts[a]);

  const displayPosts =
    initialDisplayPosts.length > 0 ? initialDisplayPosts : posts;

  return (
    <>
      <div>
        <div className="pb-4 sm:pb-6 pt-4 sm:pt-6">
          <h1 className="text-2xl sm:text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 md:text-4xl md:leading-10">
            {title}
          </h1>
        </div>
        <div className="flex flex-col sm:flex-row sm:space-x-6 lg:space-x-8">
          {/* Sidebar - Hidden on mobile */}
          <MotionBlock variants={fadeInLeft} className="hidden h-full max-h-screen min-w-[220px] lg:min-w-[280px] max-w-[280px] flex-wrap overflow-auto rounded bg-gray-50 shadow-md dark:bg-gray-900/70 dark:shadow-gray-800/40 sm:flex">
            <div className="px-4 lg:px-6 py-4">
              {pathname.startsWith("/blog") ? (
                <h3 className="font-bold uppercase text-primary-500 text-sm lg:text-base">
                  Tất cả
                </h3>
              ) : (
                <Link
                  href={`/blog`}
                  className="font-bold uppercase text-gray-700 hover:text-primary-500 dark:text-gray-300 dark:hover:text-primary-500 text-sm lg:text-base"
                >
                  Tất cả
                </Link>
              )}
              <ul>
                {sortedTags.map((t) => {
                  return (
                    <li key={t} className="my-2 lg:my-3">
                      {pathname.split("/tags/")[1] === slug(t) ? (
                        <h3 className="inline px-2 lg:px-3 py-1 lg:py-2 text-xs lg:text-sm font-bold uppercase text-primary-500">
                          {`${t} (${tagCounts[t]})`}
                        </h3>
                      ) : (
                        <Link
                          href={`/tags/${slug(t)}`}
                          className="px-2 lg:px-3 py-1 lg:py-2 text-xs lg:text-sm font-medium uppercase text-gray-500 hover:text-primary-500 dark:text-gray-300 dark:hover:text-primary-500"
                          aria-label={`View posts tagged ${t}`}
                        >
                          {`${t} (${tagCounts[t]})`}
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          </MotionBlock>
          {/* Main content - Full width on mobile */}
          <MotionBlock variants={fadeInRight} className="bg-slate-100 dark:bg-slate-700 px-3 sm:px-4 lg:px-6 rounded shadow w-full sm:flex-1">
            <ul>
              {displayPosts.map((post, index) => {
                const { slug, date, title, summary, tags, images } = post;
                const postPath = post.path || `blog/${slug}`;
                const uniqueKey = post.id || slug || `post-${index}`;
                
                return (
                  <MotionListItem key={uniqueKey} variants={cards} transition={{duration: 0.9, delay: 0.1 * index}} className="py-3 sm:py-4 border-b border-gray-200 dark:border-gray-600 last:border-0">
                    <article className="flex flex-row gap-3 sm:gap-4">
                      {/* Image - fixed width */}
                      <Link href={`/${postPath}`} className="flex-shrink-0 w-24 sm:w-32 md:w-40">
                        <Image
                          src={(images && images[0]) || "/placeholder.jpg"}
                          alt={images && images[0] ? title : 'Placeholder'}
                          height={200}
                          width={300}
                          className="object-cover rounded-md w-full h-20 sm:h-24 md:h-28"
                        />
                      </Link>
                      {/* Content */}
                      <div className="flex flex-col flex-1 min-w-0">
                        <time className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 mb-1" dateTime={date}>
                          {dayjs(date, "YYYY-MM-DD").format(DATE_LOCALE_FORMAT)}
                        </time>
                        <h2 className="text-sm sm:text-base md:text-lg font-bold leading-tight mb-1 line-clamp-2">
                          <Link href={`/${postPath}`} className="text-gray-900 dark:text-gray-100 hover:text-primary-600 dark:hover:text-primary-400">
                            {title}
                          </Link>
                        </h2>
                        <div className="flex flex-wrap gap-1 mb-1 hidden sm:flex">
                          {tags?.slice(0, 2).map((tag: string, tagIndex: number) => (
                            <Tag key={`${uniqueKey}-tag-${tagIndex}`} text={tag} />
                          ))}
                        </div>
                        {summary && (
                          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 line-clamp-2 hidden sm:block">
                            {summary}
                          </p>
                        )}
                      </div>
                    </article>
                  </MotionListItem>
                );
              })}
              {!displayPosts.length && (
                <>
                  <p className="mb-6">No posts here</p>
                  <Button variant={"link"}>
                    <Link href="/blog">Back</Link>
                  </Button>
                </>
              )}
            </ul>
            {pagination?.totalPages > 0 && (
              <Pagination
                currentPage={pagination?.currentPage}
                totalPages={pagination?.totalPages}
              />
            )}
          </MotionBlock>
        </div>
      </div>
    </>
  );
}
