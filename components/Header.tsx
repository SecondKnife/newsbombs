'use client';
import { useState, useEffect } from 'react';
import siteMetadata from "@data/siteMetadata";
import ThemeSwitcher from "./ThemeSwitcher";
import MobileNav from "./MobileNav";
import LanguageSwitcher from "./LanguageSwitcher";
import { Button } from "./ui/button";
import Link from 'next/link';
import Image from 'next/image';
import { fadeInLeft, fadeInUp } from "@/lib/motion/variants";
import { motion } from "framer-motion";
import { LogOut, Settings, FileText } from "lucide-react";
import { useTheme } from "next-themes";
import { useTranslation } from "@/contexts/LanguageContext";

interface UserInfo {
  id: string;
  email: string;
  username: string;
  name: string;
  isAdmin: boolean;
}

const Header = () => {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme, resolvedTheme } = useTheme();
  const { t } = useTranslation();
  
  // Navigation links with translations
  const navLinks = [
    { href: '/', title: t('common.home') },
    { href: '/blog', title: t('common.news') },
    { href: '/tags', title: t('common.topics') },
    { href: '/about', title: t('common.about') },
  ];

  useEffect(() => {
    setMounted(true);
    // Check if user is logged in
    const token = localStorage.getItem("admin_token");
    const userInfo = localStorage.getItem("admin_user");
    
    if (token && userInfo) {
      try {
        setUser(JSON.parse(userInfo));
      } catch (e) {
        console.error("Error parsing user info:", e);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");
    setUser(null);
    setShowDropdown(false);
    window.location.href = "/";
  };

  // Determine which logo to show based on theme
  const currentTheme = mounted ? (resolvedTheme || theme) : 'dark';
  const logoSrc = currentTheme === 'dark' ? '/logo-dark.png' : '/logo-light.png';

  return (
    <header className="flex items-center justify-between py-2 sm:py-3 md:py-4 lg:py-6 px-2 sm:px-4">
      <motion.div variants={fadeInLeft} className="flex-shrink-0 max-w-[50%] sm:max-w-none">
        <Link href="/" aria-label={siteMetadata.headerTitle}>
          <div className="flex items-center">
            {/* Logo Image */}
            <Image
              src={logoSrc}
              alt={siteMetadata.headerTitle}
              width={280}
              height={60}
              className="h-7 sm:h-9 md:h-11 lg:h-14 w-auto object-contain"
              priority
              unoptimized
            />
          </div>
        </Link>
      </motion.div>
      <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-3 lg:space-x-4 leading-5 flex-shrink-0">
        {navLinks
          .filter((link) => link.href !== "/")
          .map((link, key) => (
            <Button key={key} variant="ghost" asChild className="hover:bg-white/40 dark:hover:bg-white/10 hover:backdrop-blur-none">
              <Link
                href={link.href}
                className="hidden font-medium text-gray-900 dark:text-gray-50 sm:block"
              >
                <motion.span variants={fadeInUp}>{link.title}</motion.span>
              </Link>
            </Button>
          ))}
        
        {/* User Account Section */}
        {user ? (
          <div className="relative">
            <Button
              variant="ghost"
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-2 hover:bg-white/40 dark:hover:bg-white/10"
            >
              <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center text-white font-semibold">
                {user.name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || 'U'}
              </div>
              <span className="hidden sm:block text-sm font-medium text-gray-900 dark:text-gray-50">
                {user.name || user.username || 'User'}
              </span>
            </Button>
            
            {/* Dropdown Menu */}
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
                <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {user.name || user.username}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {user.email}
                  </p>
                </div>
                
                {user.isAdmin && (
                  <>
                    <Link
                      href="/admin/dashboard"
                      onClick={() => setShowDropdown(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <Settings className="w-4 h-4" />
                      {t('header.adminDashboard')}
                    </Link>
                    <Link
                      href="/admin/articles/new"
                      onClick={() => setShowDropdown(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <FileText className="w-4 h-4" />
                      {t('header.newArticle')}
                    </Link>
                  </>
                )}
                
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <LogOut className="w-4 h-4" />
                  {t('common.logout')}
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="hidden sm:flex items-center gap-2">
            <Button variant="ghost" asChild className="hover:bg-white/40 dark:hover:bg-white/10">
              <Link href="/admin/login" className="text-sm font-medium text-gray-900 dark:text-gray-50">
                {t('common.login')}
              </Link>
            </Button>
            <Button asChild className="bg-primary-500 hover:bg-primary-600 text-white">
              <Link href="/register" className="text-sm font-medium">
                {t('common.register')}
              </Link>
            </Button>
          </div>
        )}
        
        <LanguageSwitcher />
        <ThemeSwitcher />
        <MobileNav />
      </div>
      
      {/* Click outside to close dropdown */}
      {showDropdown && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowDropdown(false)}
        />
      )}
    </header>
  );
};

export default Header;
