"use client";

import SectionContainer from '@components/SectionContainer'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { 
  Calendar,
  Award,
  Users,
  BookOpen,
  Star,
  Flag,
  Shield,
  Target,
  Heart,
  Newspaper,
  Clock,
  MapPin
} from 'lucide-react'

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
}

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
}

export default function AboutPage() {
  return (
    <SectionContainer>
      <div className="py-4 sm:py-6 md:py-8">
        {/* Hero Banner */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative bg-gradient-to-r from-red-700 via-red-600 to-yellow-500 rounded-xl sm:rounded-2xl md:rounded-3xl overflow-hidden mb-6 sm:mb-8 md:mb-12"
        >
          <div className="absolute inset-0 bg-black/30"></div>
          <div className="relative z-10 py-6 sm:py-8 md:py-12 px-4 sm:px-6 md:px-8 text-center text-white">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mb-4 sm:mb-6"
            >
              <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-white/20 backdrop-blur-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-full mb-3 sm:mb-4 text-sm sm:text-base">
                <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-300" />
                <span className="font-semibold">1946 - 2026</span>
                <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-300" />
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 sm:mb-4">
                🎖️ Chào mừng 80 năm
              </h1>
              <h2 className="text-lg sm:text-xl md:text-2xl lg:text-4xl font-bold text-yellow-300 leading-tight">
                Ngày thành lập Binh chủng Công binh
              </h2>
              <p className="text-base sm:text-lg md:text-xl mt-2 sm:mt-4 text-white/90">
                25/03/1946 - 25/03/2026
              </p>
            </motion.div>
          </div>
          
          {/* Decorative elements - hidden on very small screens */}
          <div className="hidden sm:block absolute top-4 left-4 w-12 sm:w-16 h-12 sm:h-16 border-4 border-yellow-400/50 rounded-full"></div>
          <div className="hidden sm:block absolute bottom-4 right-4 w-16 sm:w-24 h-16 sm:h-24 border-4 border-yellow-400/30 rounded-full"></div>
        </motion.div>

        {/* Introduction */}
        <motion.div 
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="mb-8 sm:mb-10 md:mb-12"
        >
          <motion.div variants={fadeInUp} className="text-center mb-6 sm:mb-8 px-2">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
              Giới thiệu về <span className="text-primary-500">NewsBombs</span>
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
              <strong>NewsBombs</strong> là trang tin tức được xây dựng nhằm <strong>chào mừng kỷ niệm 80 năm 
              Ngày thành lập Binh chủng Công binh Việt Nam</strong> (25/03/1946 - 25/03/2026). 
              Trang web là nơi lưu giữ, tổng hợp và chia sẻ những thông tin, hình ảnh, câu chuyện 
              về lịch sử hào hùng của Binh chủng Công binh qua 80 năm xây dựng và phát triển.
            </p>
          </motion.div>
        </motion.div>

        {/* Timeline - Key Milestones */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-8 sm:mb-12 md:mb-16"
        >
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center text-gray-900 dark:text-white mb-6 sm:mb-8 px-2">
            📅 Mốc lịch sử quan trọng
          </h2>
          
          <div className="relative px-2 sm:px-4">
            {/* Timeline line */}
            <div className="absolute left-4 md:left-1/2 transform md:-translate-x-1/2 h-full w-0.5 sm:w-1 bg-gradient-to-b from-red-500 via-yellow-500 to-green-500"></div>
            
            <div className="space-y-6 sm:space-y-8">
              {/* 1946 */}
              <motion.div 
                variants={fadeInUp}
                className="flex flex-col md:flex-row items-start md:items-center gap-3 sm:gap-4 relative pl-8 md:pl-0"
              >
                <div className="md:w-1/2 md:text-right md:pr-6 lg:pr-8">
                  <div className="bg-red-50 dark:bg-red-900/20 p-4 sm:p-5 md:p-6 rounded-lg sm:rounded-xl border-l-4 border-red-500">
                    <div className="flex items-center gap-2 justify-start md:justify-end mb-2">
                      <span className="text-xl sm:text-2xl font-bold text-red-600">1946</span>
                      <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />
                    </div>
                    <h3 className="font-bold text-base sm:text-lg text-gray-900 dark:text-white mb-1 sm:mb-2">Ngày thành lập</h3>
                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                      Ngày 25/03/1946, Binh chủng Công binh Việt Nam chính thức được thành lập, 
                      đánh dấu sự ra đời của lực lượng kỹ thuật quân sự đầu tiên của Quân đội Nhân dân Việt Nam.
                    </p>
                  </div>
                </div>
                <div className="absolute left-0 md:left-1/2 md:transform md:-translate-x-1/2 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-red-500 rounded-full flex items-center justify-center z-10 shadow-lg">
                  <Flag className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
                </div>
                <div className="md:w-1/2 md:pl-6 lg:pl-8"></div>
              </motion.div>

              {/* Kháng chiến */}
              <motion.div 
                variants={fadeInUp}
                className="flex flex-col md:flex-row items-start md:items-center gap-3 sm:gap-4 relative pl-8 md:pl-0"
              >
                <div className="md:w-1/2 md:pr-6 lg:pr-8"></div>
                <div className="absolute left-0 md:left-1/2 md:transform md:-translate-x-1/2 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-yellow-500 rounded-full flex items-center justify-center z-10 shadow-lg">
                  <Shield className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
                </div>
                <div className="md:w-1/2 md:pl-6 lg:pl-8">
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 sm:p-5 md:p-6 rounded-lg sm:rounded-xl border-l-4 border-yellow-500">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl sm:text-2xl font-bold text-yellow-600">1946-1975</span>
                      <Award className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />
                    </div>
                    <h3 className="font-bold text-base sm:text-lg text-gray-900 dark:text-white mb-1 sm:mb-2">Kháng chiến trường kỳ</h3>
                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                      Qua hai cuộc kháng chiến chống Pháp và chống Mỹ, Công binh đã lập nhiều chiến công 
                      xuất sắc: mở đường Trường Sơn, xây dựng cầu phà, phá bom mìn, bảo đảm giao thông...
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Hiện đại hóa */}
              <motion.div 
                variants={fadeInUp}
                className="flex flex-col md:flex-row items-start md:items-center gap-3 sm:gap-4 relative pl-8 md:pl-0"
              >
                <div className="md:w-1/2 md:text-right md:pr-6 lg:pr-8">
                  <div className="bg-green-50 dark:bg-green-900/20 p-4 sm:p-5 md:p-6 rounded-lg sm:rounded-xl border-l-4 border-green-500">
                    <div className="flex items-center gap-2 justify-start md:justify-end mb-2">
                      <span className="text-xl sm:text-2xl font-bold text-green-600">2026</span>
                      <Star className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                    </div>
                    <h3 className="font-bold text-base sm:text-lg text-gray-900 dark:text-white mb-1 sm:mb-2">80 năm vẻ vang</h3>
                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                      Kỷ niệm 80 năm thành lập, Binh chủng Công binh tiếp tục phát triển, hiện đại hóa, 
                      đóng góp quan trọng vào sự nghiệp xây dựng và bảo vệ Tổ quốc.
                    </p>
                  </div>
                </div>
                <div className="absolute left-0 md:left-1/2 md:transform md:-translate-x-1/2 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-green-500 rounded-full flex items-center justify-center z-10 shadow-lg">
                  <Star className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
                </div>
                <div className="md:w-1/2 md:pl-6 lg:pl-8"></div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* What we provide */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8 sm:mb-12 md:mb-16 px-2"
        >
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center text-gray-900 dark:text-white mb-6 sm:mb-8">
            📰 NewsBombs mang đến cho bạn
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
            {/* Card 1 */}
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 shadow-lg border border-gray-100 dark:border-gray-700"
            >
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center mb-3 sm:mb-4">
                <BookOpen className="w-6 h-6 sm:w-7 sm:h-7 text-red-500" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2">Lịch sử hào hùng</h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                Những câu chuyện, sự kiện lịch sử quan trọng về quá trình hình thành và phát triển 
                của Binh chủng Công binh qua 80 năm.
              </p>
            </motion.div>

            {/* Card 2 */}
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 shadow-lg border border-gray-100 dark:border-gray-700"
            >
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl flex items-center justify-center mb-3 sm:mb-4">
                <Users className="w-6 h-6 sm:w-7 sm:h-7 text-yellow-600" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2">Gương anh hùng</h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                Vinh danh những tướng lĩnh, anh hùng, chiến sĩ Công binh đã cống hiến 
                và hy sinh vì sự nghiệp bảo vệ Tổ quốc.
              </p>
            </motion.div>

            {/* Card 3 */}
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 shadow-lg border border-gray-100 dark:border-gray-700"
            >
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center mb-3 sm:mb-4">
                <Award className="w-6 h-6 sm:w-7 sm:h-7 text-green-500" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2">Chiến công vẻ vang</h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                Những chiến công, thành tích xuất sắc của Binh chủng trong các cuộc kháng chiến 
                và thời kỳ xây dựng đất nước.
              </p>
            </motion.div>

            {/* Card 4 */}
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 shadow-lg border border-gray-100 dark:border-gray-700"
            >
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mb-3 sm:mb-4">
                <Newspaper className="w-6 h-6 sm:w-7 sm:h-7 text-blue-500" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2">Tin tức sự kiện</h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                Cập nhật các hoạt động, sự kiện kỷ niệm 80 năm Ngày thành lập Binh chủng Công binh 
                trên toàn quốc.
              </p>
            </motion.div>

            {/* Card 5 */}
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 shadow-lg border border-gray-100 dark:border-gray-700"
            >
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center mb-3 sm:mb-4">
                <Target className="w-6 h-6 sm:w-7 sm:h-7 text-purple-500" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2">Hiện đại hóa</h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                Quá trình xây dựng, phát triển và hiện đại hóa Binh chủng Công binh 
                trong thời kỳ mới.
              </p>
            </motion.div>

            {/* Card 6 */}
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 shadow-lg border border-gray-100 dark:border-gray-700"
            >
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-pink-100 dark:bg-pink-900/30 rounded-xl flex items-center justify-center mb-3 sm:mb-4">
                <Heart className="w-6 h-6 sm:w-7 sm:h-7 text-pink-500" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2">Tri ân & Nhớ ơn</h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                Thể hiện lòng biết ơn, tri ân đến các thế hệ cán bộ, chiến sĩ Công binh 
                đã đóng góp cho đất nước.
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* Quote Section */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-r from-red-600 to-yellow-500 rounded-xl sm:rounded-2xl p-6 sm:p-8 mb-8 sm:mb-12 text-center text-white mx-2 sm:mx-0"
        >
          <div className="text-3xl sm:text-4xl md:text-5xl mb-3 sm:mb-4">⭐</div>
          <blockquote className="text-lg sm:text-xl md:text-2xl font-medium italic mb-3 sm:mb-4 leading-relaxed">
            "Vững tư tưởng, vượt khó khăn, Mở đường thắng lợi"
          </blockquote>
          <p className="text-sm sm:text-base text-white/80">— Khẩu hiệu truyền thống của Binh chủng Công binh —</p>
        </motion.div>

        {/* Stats */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-8 sm:mb-12 px-2"
        >
          <div className="text-center p-4 sm:p-5 md:p-6 bg-red-50 dark:bg-red-900/20 rounded-lg sm:rounded-xl">
            <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-red-600 mb-1 sm:mb-2">80</div>
            <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Năm thành lập</div>
          </div>
          <div className="text-center p-4 sm:p-5 md:p-6 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg sm:rounded-xl">
            <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-yellow-600 mb-1 sm:mb-2">1946</div>
            <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Năm ra đời</div>
          </div>
          <div className="text-center p-4 sm:p-5 md:p-6 bg-green-50 dark:bg-green-900/20 rounded-lg sm:rounded-xl">
            <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-green-600 mb-1 sm:mb-2">25/03</div>
            <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Ngày thành lập</div>
          </div>
          <div className="text-center p-4 sm:p-5 md:p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg sm:rounded-xl">
            <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-600 mb-1 sm:mb-2">2026</div>
            <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Năm kỷ niệm</div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="text-center bg-gray-100 dark:bg-gray-800 rounded-xl sm:rounded-2xl p-6 sm:p-8 mx-2 sm:mx-0"
        >
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
            🎉 Cùng chào mừng 80 năm Binh chủng Công binh!
          </h3>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-4 sm:mb-6 max-w-2xl mx-auto leading-relaxed">
            Hãy cùng chúng tôi khám phá những câu chuyện, hình ảnh và thông tin 
            về lịch sử hào hùng của Binh chủng Công binh Việt Nam.
          </p>
          <Link 
            href="/blog"
            className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg font-semibold transition-colors text-sm sm:text-base"
          >
            📰 Xem tin tức
          </Link>
        </motion.div>
      </div>
    </SectionContainer>
  )
}
