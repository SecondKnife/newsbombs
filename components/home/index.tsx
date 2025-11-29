"use client";

import dynamic from "next/dynamic";
import { useState, useMemo } from "react";
import { useTranslation } from "@/contexts/LanguageContext";

const NewsHero = dynamic(() => import("@components/NewsHero"));
const NewsGrid = dynamic(() => import("@components/NewsGrid"));
const CategoryFilter = dynamic(() => import("@components/CategoryFilter"));
const TrendingTopics = dynamic(() => import("@components/TrendingTopics"));

const HomePage = ({ blogs }: { blogs: any[] }) => {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const { t } = useTranslation();

  // Filter out draft posts and sort by date
  const sortedPosts = useMemo(() => [...blogs]
    .filter((post) => !post.draft)
    .sort((a, b) => 
      new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime()
    )
    .filter((post) => {
      if (post.images && Array.isArray(post.images) && post.images[0]) {
        const imgSrc = post.images[0];
        return typeof imgSrc === 'string';
      }
      return true;
    }), [blogs]);

  // Filter by selected tag
  const filteredPosts = useMemo(() => {
    if (!selectedTag) return sortedPosts;
    return sortedPosts.filter(post => 
      post.tags?.includes(selectedTag)
    );
  }, [sortedPosts, selectedTag]);

  // Featured post (most recent)
  const featuredPost = sortedPosts[0];

  // Latest posts (excluding featured)
  const latestPosts = filteredPosts.slice(selectedTag ? 0 : 1, 9);

  // More posts
  const morePosts = filteredPosts.slice(9, 17);

  // Extract all unique tags
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    sortedPosts.forEach((post) => {
      post.tags?.forEach((tag: string) => tags.add(tag));
    });
    return Array.from(tags);
  }, [sortedPosts]);

  return (
    <div className="space-y-8">
      {/* Hero Section - Featured News */}
      {featuredPost && !selectedTag && <NewsHero featuredPost={featuredPost} />}

      {/* Category Filter Bar */}
      <CategoryFilter 
        tags={allTags} 
        selectedTag={selectedTag} 
        onSelectTag={setSelectedTag} 
      />

      {/* Main Content - Full Width */}
      <div className="space-y-10">
        {latestPosts.length > 0 && (
          <NewsGrid 
            posts={latestPosts} 
            title={selectedTag ? `${t('home.postsAbout')} "${selectedTag}"` : t('home.latestNews')} 
          />
        )}
        
        {morePosts.length > 0 && (
          <NewsGrid posts={morePosts} title={t('home.moreNews')} />
        )}

        {filteredPosts.length === 0 && selectedTag && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              {t('home.noPostsFound')} "{selectedTag}"
            </p>
          </div>
        )}
      </div>

      {/* Trending Topics */}
      {!selectedTag && <TrendingTopics tags={allTags.slice(0, 6)} />}
    </div>
  );
};

export default HomePage;
