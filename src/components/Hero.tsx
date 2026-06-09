/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Calendar, ClipboardCheck, ShieldAlert } from 'lucide-react';

interface HeroProps {
  onBtnClick: (sectionId: string) => void;
}

export default function Hero({ onBtnClick }: HeroProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: 'Chung Tay Vì Sức Khỏe Cộng Đồng',
      subtitle: 'BỆNH VIỆN ĐA KHOA THỦY NGUYÊN HẢI PHÒNG',
      description: 'Nơi kết hợp hoàn hảo giữa đội ngũ chuyên gia giàu kinh nghiệm y đức và trang thiết bị hiện đại hàng đầu nhằm đem đến dịch vụ y tế an toàn, tận tâm nhất dành cho bạn.',
      image: 'https://images.unsplash.com/photo-1587351021355-a479a299d2f9?auto=format&fit=crop&q=80&w=1200',
      tag: 'Bệnh Viện Hạng I',
      ctaText: 'Đăng Ký Khám Bệnh',
      ctaTarget: 'dat-lich',
      secondaryText: 'Khám phá Đội Ngũ Bác Sĩ',
      secondaryTarget: 'bac-si',
    },
    {
      title: 'Đội Ngũ Bác Sĩ Chuyên Khoa Đầu Ngành',
      subtitle: 'TẬN TÂM - SÁNG TẠO - CHUYÊN NGHIỆP',
      description: 'Các Thầy thuốc ưu tú, Thạc sĩ, Bác sĩ chuyên khoa giàu kinh nghiệm, không ngừng nghiên cứu khoa học để mang lại tỷ lệ hồi phục và sự hài lòng tuyệt đối của người bệnh.',
      image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=1200',
      tag: 'Đội Ngũ Chuyên Gia',
      ctaText: 'Đặt Lịch Hẹn Ngay',
      ctaTarget: 'dat-lich',
      secondaryText: 'Chuyên Khoa Điển Hình',
      secondaryTarget: 'khoa-phong',
    },
    {
      title: 'Hạ Tầng Hiện Đại - Đột Phá Chuyển Đổi Số',
      subtitle: 'TIÊN PHONG CHẨN ĐOÁN VÀ ĐIỀU TRỊ',
      description: 'Đầu tư đồng bộ hệ thống máy MRI, CT đa lát cắt, máy siêu âm màu 4D chất lượng cao. Đăng ký trực tuyến, kiểm tra bệnh án, kết quả sức khỏe thần tốc qua QR Code cá nhân.',
      image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=1200',
      tag: 'Hạ Tầng Số Hóa',
      ctaText: 'Tra Cứu Kết Quả Sức Khỏe',
      ctaTarget: 'tra-cuu',
      secondaryText: 'Xem Tin Tức Y Học',
      secondaryTarget: 'tin-tuc',
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <section id="trang-chu" className="relative w-full min-h-[500px] md:min-h-[620px] bg-slate-900 overflow-hidden">
      {/* Slider Background wrapper */}
      <div className="absolute inset-0 w-full h-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0.2, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0.2 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 w-full h-full"
          >
            {/* Background Image with optimized filter overlay */}
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform"
              style={{ backgroundImage: `url(${slides[currentSlide].image})` }}
            />
            {/* Visual gradient overlay to ensure text contrast */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-900/75 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Decorative floating grids */}
      <div className="absolute top-10 right-10 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />

      {/* Slide Content wrapper */}
      <div className="relative max-w-7xl mx-auto px-4 md:px-6 py-20 md:py-28 min-h-[500px] md:min-h-[620px] flex flex-col justify-center text-white z-10">
        <div className="max-w-3xl">
          {/* Tagline */}
          <motion.span
            key={`tag-${currentSlide}`}
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-1.5 px-3 py-1 bg-teal-550/20 border border-teal-500/30 rounded-full text-xs font-bold text-teal-300 tracking-wider uppercase mb-5"
          >
            <span className="h-2 w-2 rounded-full bg-teal-400 animate-ping" />
            {slides[currentSlide].tag}
          </motion.span>

          {/* Subtitle */}
          <motion.h4
            key={`sub-${currentSlide}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-teal-400 text-xs md:text-sm font-extrabold tracking-widest mb-3 uppercase"
          >
            {slides[currentSlide].subtitle}
          </motion.h4>

          {/* Title with space-grotesk styling if needed or responsive screen sizing */}
          <motion.h1
            key={`title-${currentSlide}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 0.95, y: 0 }}
            transition={{ type: 'spring', stiffness: 80, delay: 0.4 }}
            className="text-3xl md:text-5xl lg:text-5.5xl font-extrabold tracking-tight leading-tight mb-6"
          >
            {slides[currentSlide].title}
          </motion.h1>

          {/* Description */}
          <motion.p
            key={`desc-${currentSlide}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.85, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-sm md:text-base text-gray-300 leading-relaxed mb-8 max-w-xl"
          >
            {slides[currentSlide].description}
          </motion.p>

          {/* Call to Actions */}
          <motion.div
            key={`btns-${currentSlide}`}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4"
          >
            <button
              id={`hero-cta-primary-${currentSlide}`}
              onClick={() => onBtnClick(slides[currentSlide].ctaTarget)}
              className="bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white font-bold text-sm px-6 py-3.5 rounded-xl transition-all duration-300 shadow-lg shadow-teal-900/30 hover:shadow-teal-800/40 hover:-translate-y-0.5 cursor-pointer flex items-center justify-center gap-2"
            >
              <Calendar size={16} />
              <span>{slides[currentSlide].ctaText}</span>
            </button>

            <button
              id={`hero-cta-secondary-${currentSlide}`}
              onClick={() => onBtnClick(slides[currentSlide].secondaryTarget)}
              className="bg-white/10 hover:bg-white/15 text-white border border-white/20 font-bold text-sm px-6 py-3.5 rounded-xl transition-all duration-300 hover:border-white/30 hover:-translate-y-0.5 cursor-pointer text-center"
            >
              {slides[currentSlide].secondaryText}
            </button>
          </motion.div>
        </div>
      </div>

      {/* Control Dots in right bottom */}
      <div className="absolute bottom-6 right-4 md:right-10 flex items-center gap-2 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            id={`slide-dot-${index}`}
            onClick={() => setCurrentSlide(index)}
            className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
              currentSlide === index ? 'w-8 bg-teal-400' : 'w-2.5 bg-white/40 hover:bg-white/70'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Left and Right arrows */}
      <button
        id="hero-slide-prev"
        onClick={handlePrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 text-white transition-all cursor-pointer hidden md:flex"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        id="hero-slide-next"
        onClick={handleNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 text-white transition-all cursor-pointer hidden md:flex"
      >
        <ChevronRight size={20} />
      </button>
    </section>
  );
}
