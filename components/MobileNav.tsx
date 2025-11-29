'use client'

import { useState } from 'react'
import Link from './Link'
import { useTranslation } from '@/contexts/LanguageContext'
import { Menu, X, Home, Newspaper, Tag, Info, LogIn, UserPlus } from 'lucide-react'

const MobileNav = () => {
  const [navShow, setNavShow] = useState(false)
  const { t } = useTranslation()

  // Navigation links with translations
  const navLinks = [
    { href: '/', title: t('common.home'), icon: Home },
    { href: '/blog', title: t('common.news'), icon: Newspaper },
    { href: '/tags', title: t('common.topics'), icon: Tag },
    { href: '/about', title: t('common.about'), icon: Info },
  ]

  const onToggleNav = () => {
    setNavShow((status) => {
      if (status) {
        document.body.style.overflow = 'auto'
      } else {
        document.body.style.overflow = 'hidden'
      }
      return !status
    })
  }

  return (
    <>
      <button aria-label="Toggle Menu" onClick={onToggleNav} className="sm:hidden p-2">
        <Menu className="h-6 w-6 text-gray-900 dark:text-gray-100" />
      </button>
      <div
        className={`fixed left-0 top-0 z-50 h-full w-full transform bg-white/95 backdrop-blur-md duration-300 ease-in-out dark:bg-gray-950/95 ${
          navShow ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-800">
          <span className="text-xl font-bold text-gray-900 dark:text-white">Menu</span>
          <button className="p-2" aria-label="Close Menu" onClick={onToggleNav}>
            <X className="h-6 w-6 text-gray-900 dark:text-gray-100" />
          </button>
        </div>
        <nav className="p-6">
          {navLinks.map((link) => {
            const Icon = link.icon
            return (
              <div key={link.href} className="border-b border-gray-100 dark:border-gray-800">
                <Link
                  href={link.href}
                  className="flex items-center gap-4 py-4 text-lg font-medium text-gray-900 dark:text-gray-100 hover:text-primary-500 transition-colors"
                  onClick={onToggleNav}
                >
                  <Icon className="w-5 h-5" />
                  {link.title}
                </Link>
              </div>
            )
          })}
          
          {/* Mobile Login/Register */}
          <div className="mt-6 space-y-3">
            <Link
              href="/admin/login"
              onClick={onToggleNav}
              className="flex items-center justify-center gap-2 w-full py-3 px-4 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <LogIn className="w-5 h-5" />
              {t('common.login')}
            </Link>
            <Link
              href="/register"
              onClick={onToggleNav}
              className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-primary-500 hover:bg-primary-600 rounded-lg text-white font-medium transition-colors"
            >
              <UserPlus className="w-5 h-5" />
              {t('common.register')}
            </Link>
          </div>
        </nav>
      </div>
    </>
  )
}

export default MobileNav
