/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../context/AppContext';
import { NewsArticle } from '../types';
import { Calendar, Clock, ArrowRight, BookOpen, X } from 'lucide-react';

export default function NewsSection() {
  const { newsArticles } = useApp();
  const [activeCategory, setActiveCategory] = useState<'all' | 'tin-tuc' | 'kien-thuc' | 'thong-bao'>('all');
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);

  const categories = [
    { value: 'all', label: 'Tất Cả Tin Bài' },
    { value: 'tin-tuc', label: 'Tin Tức Hoạt Động' },
    { value: 'kien-thuc', label: 'Y Học Thường Thức' },
    { value: 'thong-bao', label: 'Thông báo & BHYT' },
  ];

  const filteredArticles = (newsArticles || []).filter(
    (item) => activeCategory === 'all' || item.category === activeCategory
  );

  const getCategoryTheme = (cat: string) => {
    switch (cat) {
      case 'tin-tuc':
        return 'bg-teal-50 text-teal-700 border-teal-100';
      case 'kien-thuc':
        return 'bg-indigo-50 text-indigo-700 border-indigo-100';
      case 'thong-bao':
        return 'bg-amber-50 text-amber-700 border-amber-100';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-150';
    }
  };

  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case 'tin-tuc':
        return 'Hoạt động';
      case 'kien-thuc':
        return 'Y học mẫu';
      case 'thong-bao':
        return 'Thông báo BHYT';
      default:
        return 'Sức khỏe';
    }
  };

  return (
    <section id="tin-tuc" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <span className="text-xs font-bold text-teal-600 uppercase tracking-widest block bg-teal-50 px-3 py-1 rounded-full w-fit mx-auto">
            Tin Tức & Hoạt Động Y Khoa
          </span>
          <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight leading-tight">
            Cập Nhật Tin Tức & Kiến Thức Sức Khỏe
          </h2>
          <p className="text-xs md:text-sm text-gray-550 leading-relaxed">
            Xem các hoạt động chiến lược nổi bật của Bệnh viện đa khoa Thủy Nguyên cùng các cẩm nang, lời khuyên y phòng bệnh của đội ngũ bác sĩ.
          </p>
        </div>

        {/* Filter Navigation Tabs Bar */}
        <div className="flex flex-wrap justify-center items-center gap-2 mb-10 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.value}
              id={`news-filter-${cat.value}`}
              onClick={() => setActiveCategory(cat.value as any)}
              className={`px-4.5 py-2.5 rounded-full text-xs font-bold tracking-wide transition-all duration-200 cursor-pointer border ${
                activeCategory === cat.value
                  ? 'bg-teal-600 text-white border-teal-600 shadow-md shadow-teal-100'
                  : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* News Cards Grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredArticles.map((article) => (
              <motion.article
                key={article.id}
                id={`article-card-${article.id}`}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25 }}
                className="bg-white border border-gray-150 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between group cursor-pointer"
                onClick={() => setSelectedArticle(article)}
              >
                <div>
                  {/* Photo area */}
                  <div className="relative aspect-video overflow-hidden bg-gray-100">
                    <img
                      src={article.imageUrl}
                      alt={article.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-104"
                    />
                    <div className="absolute top-4 left-4">
                      <span className={`px-2.5 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-wide border shadow-sm ${getCategoryTheme(article.category)}`}>
                        {getCategoryLabel(article.category)}
                      </span>
                    </div>
                  </div>

                  {/* Text Contents */}
                  <div className="p-5 text-left space-y-3.5">
                    {/* Date and Read elements */}
                    <div className="flex items-center gap-4 text-[10px] text-gray-400 font-mono">
                      <span className="flex items-center gap-1.5">
                        <Calendar size={12} />
                        {article.publishDate}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock size={12} />
                        {article.readTime}
                      </span>
                    </div>

                    <h3 className="text-xs md:text-sm font-extrabold text-gray-900 group-hover:text-teal-700 transition-colors leading-tight">
                      {article.title}
                    </h3>

                    <p className="text-[11px] md:text-xs text-gray-500 leading-relaxed line-clamp-3">
                      {article.summary}
                    </p>
                  </div>
                </div>

                {/* Read full article trigger */}
                <div className="p-5 pt-0 text-left">
                  <button
                    id={`article-read-btn-${article.id}`}
                    className="text-xs font-bold text-teal-600 flex items-center gap-1 group-hover:text-teal-800 transition-all cursor-pointer"
                  >
                    <span>Đọc Chi Tiết Tin Bài</span>
                    <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
                  </button>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </div>

        {/* Diagnostic News Article Reader Modal */}
        <AnimatePresence>
          {selectedArticle && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
              <motion.div
                id="article-reader-modal"
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                transition={{ duration: 0.25, type: 'spring', damping: 30 }}
                className="bg-white rounded-3xl overflow-hidden max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl relative"
              >
                {/* Close Button top-right */}
                <button
                  id="reader-close-btn"
                  onClick={() => setSelectedArticle(null)}
                  className="absolute top-4 right-4 z-40 p-2 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-800 transition-colors cursor-pointer"
                  aria-label="Close article"
                >
                  <X size={18} />
                </button>

                {/* Cover Photo */}
                <div className="relative h-44 md:h-56 shrink-0 bg-slate-900">
                  <img
                    src={selectedArticle.imageUrl}
                    alt={selectedArticle.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover opacity-70"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                  <div className="absolute bottom-5 left-5 right-5 text-white text-left">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wide border inline-block mb-2 ${getCategoryTheme(selectedArticle.category)}`}>
                      {getCategoryLabel(selectedArticle.category)}
                    </span>
                    <h3 className="text-base md:text-lg font-extrabold tracking-tight leading-snug">
                      {selectedArticle.title}
                    </h3>
                  </div>
                </div>

                {/* Article Read Body */}
                <div className="p-6 md:p-8 overflow-y-auto space-y-4 text-left">
                  <div className="flex items-center gap-4 text-[10px] text-gray-400 font-mono pb-3.5 border-b border-gray-100">
                    <span className="flex items-center gap-1.5">
                      <Calendar size={12} />
                      Ngày: {selectedArticle.publishDate}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock size={12} />
                      Thời lượng: {selectedArticle.readTime}
                    </span>
                  </div>

                  <p className="text-xs font-bold text-gray-800 leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100 italic">
                    {selectedArticle.summary}
                  </p>

                  <div className="text-xs md:text-sm text-gray-600 leading-relaxed whitespace-pre-line space-y-4 font-sans">
                    {selectedArticle.content}
                  </div>

                  <div className="pt-6 border-t border-gray-100 flex justify-end">
                    <button
                      id="reader-close-footer"
                      onClick={() => setSelectedArticle(null)}
                      className="px-5 py-2.5 bg-gray-150 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                    >
                      Đóng Lại
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
