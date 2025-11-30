"use client";

import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import dynamic from "next/dynamic";
import { fadeInUp } from "@/lib/motion/variants";
import { useTranslation } from "@/contexts/LanguageContext";

const MotionBlock = dynamic(() => import("@/components/motions/Block"));

interface CategoryFilterProps {
  tags: string[];
  selectedTag: string | null;
  onSelectTag: (tag: string | null) => void;
}

export default function CategoryFilter({ tags, selectedTag, onSelectTag }: CategoryFilterProps) {
  const { t } = useTranslation();

  const handleTagClick = (tag: string) => {
    if (selectedTag === tag) {
      onSelectTag(null); // Deselect if clicking the same tag
    } else {
      onSelectTag(tag);
    }
  };

  return (
    <MotionBlock variants={fadeInUp} className="w-full">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-6 sm:mb-8">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 overflow-x-auto pb-2 sm:pb-0">
          {/* All Posts Button */}
          <button
            onClick={() => onSelectTag(null)}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
              selectedTag === null
                ? "bg-primary-600 text-white dark:bg-primary-500"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            }`}
          >
            {t('common.all')}
          </button>

          {/* Tag Buttons */}
          {tags.slice(0, 8).map((tag) => (
            <button
              key={tag}
              onClick={() => handleTagClick(tag)}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
                selectedTag === tag
                  ? "bg-primary-600 text-white dark:bg-primary-500"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              }`}
            >
              {tag}
            </button>
          ))}

          {/* View All Link */}
          {tags.length > 8 && (
            <Link 
              href="/tags" 
              className="text-xs sm:text-sm text-primary-600 dark:text-primary-400 hover:underline whitespace-nowrap"
            >
              {t('common.viewAll')} →
            </Link>
          )}
        </div>
      </div>
    </MotionBlock>
  );
}

