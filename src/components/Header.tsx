/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Phone, Mail, Clock, Menu, X, HeartPulse, LogOut, User } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../context/AppContext';
import LoginModal from './LoginModal';

interface HeaderProps {
  activeSection: string;
  onNavigate: (sectionId: string) => void;
}

export default function Header({ activeSection, onNavigate }: HeaderProps) {
  const { currentUser, logout, hospitalContact } = useApp();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'trang-chu', label: 'Trang Chủ' },
    { id: 'gioi-thieu', label: 'Giới Thiệu' },
    { id: 'khoa-phong', label: 'Khoa Phòng' },
    { id: 'bac-si', label: 'Đội Ngũ Bác Sĩ' },
    { id: 'dat-lich', label: 'Đặt Lịch Khám' },
    { id: 'tra-cuu', label: 'Tra Cứu Kết Quả' },
    { id: 'tin-tuc', label: 'Tin Tức' },
    { id: 'member-portal', label: currentUser ? 'Cổng Nghiệp Vụ' : 'Đăng Nhập' },
    { id: 'lien-he', label: 'Liên Hệ' },
  ];

  const handleNavClick = (id: string) => {
    if (id === 'member-portal') {
      if (!currentUser) {
        setIsLoginModalOpen(true);
      } else {
        onNavigate('member-portal');
      }
    } else {
      onNavigate(id);
    }
    setIsMobileMenuOpen(false);
  };

  const handleClickLogout = () => {
    logout();
    onNavigate('trang-chu');
    alert('Đã đăng xuất tài khoản thành công!');
  };

  return (
    <header className="w-full relative z-50">
      {/* Top Bar for Contacts and Announcements */}
      <div className="bg-gradient-to-r from-teal-700 to-emerald-700 text-white text-xs py-2 px-4 shadow-sm hidden md:block">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-left">
          <div className="flex items-center gap-5">
            <span className="flex items-center gap-1.5 font-medium tracking-wide">
              <Phone size={14} className="text-emerald-300 animate-pulse animate-none" />
              Tổng đài CSKH: <strong className="text-emerald-250">{hospitalContact?.hotline || '1900 9095'}</strong> - Cấp cứu (24/7): <strong>{hospitalContact?.emergency || '0225 3859 135'}</strong>
            </span>
            <span className="h-3 w-px bg-teal-500" />
            <span className="flex items-center gap-1.5 text-teal-100">
              <Mail size={13} />
              {hospitalContact?.email || 'bvdkthuynguyen@gmail.com'}
            </span>
          </div>
          <div className="flex items-center gap-4 text-teal-100">
            <div className="flex items-center gap-1.5">
              <Clock size={13} />
              <span>Thứ 2 - Thứ 6: 7:00 - 17:00 | Cấp cứu: 24/7</span>
            </div>
            {currentUser && (
              <div className="flex items-center gap-2 border-l border-teal-500 pl-4">
                <span className="flex items-center gap-1 text-[11px] font-bold bg-white/20 px-2 py-0.5 rounded-full text-white">
                  <User size={11} />
                  <span>{currentUser.fullName}</span>
                </span>
                <button
                  onClick={handleClickLogout}
                  className="text-red-300 hover:text-red-100 font-bold transition-colors cursor-pointer flex items-center gap-0.5 text-[11px]"
                  title="Đăng xuất"
                >
                  <LogOut size={11} />
                  <span>Thoát</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Header navigation */}
      <nav
        className={`w-full transition-all duration-300 ${
          isScrolled
            ? 'fixed top-0 bg-white shadow-md py-3 border-b border-gray-100'
            : 'relative bg-white py-4 border-b border-gray-150'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-6 flex justify-between items-center">
          {/* Logo Brand area */}
          <div
            onClick={() => handleNavClick('trang-chu')}
            className="flex items-center gap-2.5 cursor-pointer select-none group"
            id="header-logo-brand"
          >
            <div className="p-2.5 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-xl text-white shadow-md shadow-teal-100 transition-transform duration-300 group-hover:scale-105">
              <HeartPulse size={24} />
            </div>
            <div>
              <div className="flex flex-col text-left">
                <span className="text-teal-700 font-extrabold text-base md:text-lg tracking-tight uppercase leading-none font-sans">
                  Bệnh Viện Đa Khoa
                </span>
                <span className="text-emerald-600 font-bold text-sm tracking-wide uppercase mt-0.5 font-sans leading-none">
                  Thủy Nguyên Hải Phòng
                </span>
              </div>
            </div>
          </div>

          {/* Desktop Navigation Link items */}
          <div className="hidden lg:flex items-center gap-1 select-none">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-${item.id}`}
                  onClick={() => handleNavClick(item.id)}
                  className={`px-3 py-2 rounded-lg text-[13px] font-semibold transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'text-teal-700 bg-teal-50/70 font-bold border-b-2 border-teal-600'
                      : 'text-gray-600 hover:text-teal-700 hover:bg-gray-50'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>

          {/* Booking Shortcut Button */}
          <div className="hidden sm:flex items-center gap-3 select-none">
            <button
              id="header-booking"
              onClick={() => handleNavClick('dat-lich')}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md shadow-indigo-150 transition-all duration-300 hover:-translate-y-0.5 cursor-pointer flex items-center gap-1.5"
            >
              <span>Đặt Lịch Hẹn</span>
            </button>

            {/* Logout shortcut on desktop directly */}
            {currentUser && (
              <button
                onClick={handleClickLogout}
                className="lg:hidden p-2 text-red-500 hover:bg-red-50 rounded-lg cursor-pointer transition-colors"
                title="Đăng xuất"
              >
                <LogOut size={20} />
              </button>
            )}

            {/* Hamburger for small screen sizes */}
            <button
              id="mobile-menu-toggle"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-gray-500 hover:text-teal-700 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors"
            >
              {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>

          {/* Booking shortcut inside mobile or just standard toggle */}
          <div className="sm:hidden flex items-center">
            {currentUser && (
              <button
                onClick={handleClickLogout}
                className="p-1 px-2 text-red-550 mr-1 cursor-pointer text-xs font-bold"
              >
                Thoát
              </button>
            )}
            <button
              id="mobile-menu-toggle-sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-gray-500 hover:text-teal-700 hover:bg-gray-100 rounded-lg cursor-pointer"
            >
              {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation Drawer Panel */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            id="mobile-nav-panel"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="lg:hidden bg-white border-b border-gray-100 shadow-inner overflow-hidden absolute w-full top-full left-0 bg-opacity-98 backdrop-blur-md"
          >
            <div className="p-4 flex flex-col gap-1">
              <div className="p-2 mb-2 bg-teal-50/50 rounded-lg text-[11px] text-teal-800 font-medium md:hidden text-left">
                <span className="block font-semibold">Hotline Cấp cứu (24/7): 0225 3859 135</span>
                <span className="block mt-0.5 text-gray-500">Mã NV / Thẻ đang chạy: {currentUser?.fullName || 'Chưa đăng nhập'}</span>
              </div>

              {navItems.map((item) => (
                <button
                  key={item.id}
                  id={`nav-mobile-${item.id}`}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center justify-between p-3 rounded-lg text-left text-sm font-semibold transition-all cursor-pointer ${
                    activeSection === item.id
                      ? 'text-teal-700 bg-teal-50 font-bold'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-teal-600'
                  }`}
                >
                  <span>{item.label}</span>
                  {activeSection === item.id && (
                    <span className="h-1.5 w-1.5 bg-teal-600 rounded-full" />
                  )}
                </button>
              ))}

              <div className="mt-2 pt-2 border-t border-gray-100 flex flex-col gap-2">
                <button
                  id="mobile-nav-booking-btn"
                  onClick={() => handleNavClick('dat-lich')}
                  className="w-full text-center bg-teal-600 hover:bg-teal-700 text-white py-2.5 rounded-xl text-xs font-bold shadow-md transition-all cursor-pointer"
                >
                  Đăng Ký Khám Bệnh Trực Tuyến
                </button>
                <button
                  id="mobile-nav-lookup-btn"
                  onClick={() => handleNavClick('tra-cuu')}
                  className="w-full text-center bg-indigo-50 text-indigo-700 border border-indigo-120 hover:bg-indigo-100 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  Tra Cứu Kết Quả Xét Nghiệm
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />

      {/* Spacer when scrolled to prevent page jump */}
      {isScrolled && <div className="hidden lg:block h-[64px]" />}
    </header>
  );
}
