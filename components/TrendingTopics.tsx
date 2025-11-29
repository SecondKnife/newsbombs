"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { fadeInUp } from "@/lib/motion/variants";
import { useTranslation } from "@/contexts/LanguageContext";

const MotionBlock = dynamic(() => import("./motions/Block"));

interface TrendingTopicsProps {
  tags: string[];
}

const topicIcons: Record<string, string> = {
  "Quân đội": "🎖️",
  "Lịch sử": "📜",
  "Việt Nam": "🇻🇳",
  "Hiện đại hóa": "⚡",
  "Tướng lĩnh": "⭐",
  "Anh hùng": "🏅",
  "tin tức": "📰",
  "công nghệ": "💻",
  "AI": "🤖",
  "22/12": "🎄",
};

export default function TrendingTopics({ tags }: TrendingTopicsProps) {
  const { t } = useTranslation();
  
  if (!tags || tags.length === 0) return null;

  return (
    <MotionBlock variants={fadeInUp}>
      <div className="bg-gradient-to-r from-primary-50 to-blue-50 dark:from-slate-800 dark:to-slate-700 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 mx-2 sm:mx-0">
        <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
          📌 {t('home.featuredTopics')}
        </h3>
        <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-3">
          {tags.map((tag, index) => (
            <Link
              key={tag}
              href={`/tags/${encodeURIComponent(tag)}`}
              className="group"
            >
              <div className="bg-white dark:bg-slate-600 rounded-lg sm:rounded-xl p-2 sm:p-4 text-center shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 border border-gray-100 dark:border-slate-500">
                <span className="text-xl sm:text-2xl mb-1 sm:mb-2 block">
                  {topicIcons[tag] || "📌"}
                </span>
                <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-200 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-1">
                  {tag}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </MotionBlock>
  );
}

