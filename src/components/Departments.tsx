/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Stethoscope,
  Activity,
  Heart,
  Scissors,
  Baby,
  Smile,
  Scan,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  X,
} from 'lucide-react';
import { DEPARTMENTS } from '../data';
import { Department } from '../types';

export default function Departments() {
  const [selectedDept, setSelectedDept] = useState<Department | null>(null);

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'Stethoscope':
        return <Stethoscope className="text-teal-600" size={24} />;
      case 'Activity':
        return <Activity className="text-red-500" size={24} />;
      case 'Heart':
        return <Heart className="text-rose-500" size={24} />;
      case 'Scissors':
        return <Scissors className="text-cyan-600" size={24} />;
      case 'Baby':
        return <Baby className="text-purple-500" size={24} />;
      case 'Smile':
        return <Smile className="text-amber-500" size={24} />;
      case 'Scan':
        return <Scan className="text-indigo-600" size={24} />;
      case 'Sparkles':
        return <Sparkles className="text-emerald-500" size={24} />;
      default:
        return <Stethoscope className="text-teal-600" size={24} />;
    }
  };

  return (
    <section id="khoa-phong" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Section Heading info */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold text-teal-600 uppercase tracking-widest block bg-teal-50 px-3 py-1 rounded-full w-fit mx-auto">
            Khối Lâm Sàng & Cận Lâm Sàng
          </span>
          <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight leading-tight">
            Chuyên Khoa Chuyên Môn Điển Hình
          </h2>
          <p className="text-xs md:text-sm text-gray-550 leading-relaxed">
            Hệ thống các khoa lâm sàng và cận lâm sàng được tổ chức bài bản, liên tục nâng cấp công nghệ điều trị hiện đại nhằm nâng tầm sức sống cộng đồng.
          </p>
        </div>

        {/* Departments Grid layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {DEPARTMENTS.map((dept) => (
            <div
              key={dept.id}
              id={`dept-card-${dept.id}`}
              onClick={() => setSelectedDept(dept)}
              className="p-6 bg-white border border-gray-150 rounded-2xl transition-all duration-300 hover:shadow-lg hover:border-teal-200 group cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="p-3 bg-gray-50 group-hover:bg-teal-50 rounded-xl w-fit mb-5 transition-colors duration-300">
                  {getIconComponent(dept.icon)}
                </div>
                <h3 className="text-base font-bold text-gray-800 mb-2 group-hover:text-teal-700 transition-colors">
                  {dept.name}
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed mb-4 line-clamp-3">
                  {dept.description}
                </p>
              </div>
              <button
                id={`dept-card-btn-${dept.id}`}
                className="text-xs font-bold text-teal-600 group-hover:text-teal-700 flex items-center gap-1.5 transition-all w-fit mt-2"
              >
                <span>Xem Chi Tiết</span>
                <ChevronRight size={14} className="transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          ))}
        </div>

        {/* Dynamic Detail Modal for Selected Department */}
        <AnimatePresence>
          {selectedDept && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
              <motion.div
                id="dept-detail-modal"
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                transition={{ duration: 0.25, type: 'spring', damping: 30 }}
                className="bg-white rounded-3xl overflow-hidden max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl relative"
              >
                {/* Close Button top-right */}
                <button
                  id="modal-close-btn"
                  onClick={() => setSelectedDept(null)}
                  className="absolute top-4 right-4 z-40 p-2 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-800 transition-colors cursor-pointer"
                  aria-label="Close modal"
                >
                  <X size={18} />
                </button>

                {/* Banner Area */}
                <div className="relative h-48 md:h-64 shrink-0">
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${selectedDept.imageUrl})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                  <div className="absolute bottom-6 left-6 text-white text-left">
                    <span className="px-2.5 py-1 bg-teal-500 rounded-full text-[10px] font-bold uppercase tracking-wider mb-2.5 inline-block">
                      Dịch Vụ Y Khoa
                    </span>
                    <h3 className="text-xl md:text-2xl font-extrabold tracking-tight">
                      {selectedDept.name}
                    </h3>
                  </div>
                </div>

                {/* Scrollable details */}
                <div className="p-6 md:p-8 overflow-y-auto space-y-6 text-left">
                  <div>
                    <h4 className="text-xs font-bold text-teal-600 uppercase tracking-wider mb-2">Giới thiệu chung</h4>
                    <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
                      {selectedDept.description}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-teal-600 uppercase tracking-wider mb-3">Thế mạnh điều trị nổi bật</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                      {selectedDept.highlights.map((highlight, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-gray-700 leading-relaxed bg-teal-50/30 p-2.5 rounded-xl border border-teal-50/50">
                          <ShieldCheck size={16} className="text-teal-600 shrink-0 mt-0.5" />
                          <span>{highlight}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-100 flex justify-end">
                    <button
                      id="modal-close-footer"
                      onClick={() => setSelectedDept(null)}
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
