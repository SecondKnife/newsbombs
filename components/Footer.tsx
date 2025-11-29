'use client';
import Link from './Link'
import siteMetadata from '@data/siteMetadata'
import SocialIcon from '@components/social-icons'
import { motion } from "framer-motion";
import { arise } from '@/lib/motion/variants';
import { useTranslation } from '@/contexts/LanguageContext';

export default function Footer() {
  const { t } = useTranslation();
  
  return (
    <motion.footer variants={arise}>
      <div className="mt-8 sm:mt-16 border-t border-gray-200 dark:border-gray-700">
        <div className="py-6 sm:py-8 px-4 sm:px-6">
          {/* Footer Links */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mb-6 sm:mb-8">
            <div>
              <h4 className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white mb-2 sm:mb-3">{t('footer.aboutUs')}</h4>
              <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                <li><Link href="/about" className="hover:text-primary-600">{t('common.about')}</Link></li>
                <li><Link href="/blog" className="hover:text-primary-600">{t('footer.allPosts')}</Link></li>
                <li><Link href="/tags" className="hover:text-primary-600">{t('common.topics')}</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white mb-2 sm:mb-3">{t('footer.contact')}</h4>
              <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                <li><a href={`mailto:${siteMetadata.email}`} className="hover:text-primary-600 break-all">{siteMetadata.email}</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white mb-2 sm:mb-3">{t('footer.follow')}</h4>
              <div className="flex space-x-3">
                <SocialIcon kind="facebook" href={siteMetadata.facebook} size={5} />
                <SocialIcon kind="youtube" href={siteMetadata.youtube} size={5} />
                <SocialIcon kind="mail" href={`mailto:${siteMetadata.email}`} size={5} />
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white mb-2 sm:mb-3">{t('footer.legal')}</h4>
              <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                <li><Link href="#" className="hover:text-primary-600">{t('footer.terms')}</Link></li>
                <li><Link href="#" className="hover:text-primary-600">{t('footer.privacy')}</Link></li>
              </ul>
            </div>
          </div>

          {/* Copyright */}
          <div className="pt-4 sm:pt-6 border-t border-gray-200 dark:border-gray-700 text-center">
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
              © {new Date().getFullYear()} NewsBombs. {t('footer.copyright')} {siteMetadata.company || siteMetadata.author}.
            </p>
          </div>
        </div>
      </div>
    </motion.footer>
  )
}
