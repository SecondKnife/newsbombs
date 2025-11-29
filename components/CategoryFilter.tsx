"use client";

import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import dynamic from "next/dynamic";
import { fadeInUp } from "@/lib/motion/variants";
import { useTranslation } from "@/contexts/LanguageContext";

const MotionBlock = dynamic(() => import("./motions/Block"));

interface CategoryFilterProps {
  tags: string[];
  selectedTag: string | null;
  onSelectTag: (tag: string | null) => void;
}

export default function CategoryFilter({ tags, selectedTag, onSelectTag }: CategoryFilterProps) {
  const { t } = useTranslation();
  
  if (!tags || tags.length === 0) return null;

  // Show fewer tags on mobile (5) vs desktop (8)
  const displayTags = tags.slice(0, 6);

  return (
    <MotionBlock variants={fadeInUp}>
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-sm border border-gray-100 dark:border-slate-700 mx-2 sm:mx-0">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
          <span className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 whitespace-nowrap mb-1 sm:mb-0">
            {t('home.filterByTopic')}
          </span>
          <div className="flex items-center gap-2 flex-wrap overflow-x-auto pb-1 sm:pb-0">
            {/* All button */}
            <Badge
              variant={selectedTag === null ? "default" : "secondary"}
              className={`cursor-pointer transition-all duration-200 px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm whitespace-nowrap ${
                selectedTag === null 
                  ? "bg-primary-600 text-white shadow-md" 
                  : "hover:bg-primary-100 dark:hover:bg-primary-900 hover:text-primary-700 dark:hover:text-primary-300"
              }`}
              onClick={() => onSelectTag(null)}
            >
              {t('home.all')}
            </Badge>

            {/* Tag buttons */}
            {displayTags.map((tag) => (
              <Badge
                key={tag}
                variant={selectedTag === tag ? "default" : "secondary"}
                className={`cursor-pointer transition-all duration-200 px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm whitespace-nowrap ${
                  selectedTag === tag 
                    ? "bg-primary-600 text-white shadow-md" 
                    : "hover:bg-primary-100 dark:hover:bg-primary-900 hover:text-primary-700 dark:hover:text-primary-300"
                }`}
                onClick={() => onSelectTag(selectedTag === tag ? null : tag)}
              >
                {tag}
              </Badge>
            ))}

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
      </div>
    </MotionBlock>
  );
}

