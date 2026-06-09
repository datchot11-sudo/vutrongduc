/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Phone, Mail, Clock, MapPin, HeartPulse, ChevronRight, Award } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  const { hospitalContact } = useApp();
  const quickLinks = [
    { label: 'Trang Chủ', target: 'trang-chu' },
    { label: 'Giới Thiệu Chung', target: 'gioi-thieu' },
    { label: 'Khoa Phòng Chuyên Môn', target: 'khoa-phong' },
    { label: 'Đội Ngũ Bác Sĩ', target: 'bac-si' },
    { label: 'Tin Tức Hoạt Động', target: 'tin-tuc' },
  ];

  const actionLinks = [
    { label: 'Đặt lịch khám bệnh', target: 'dat-lich' },
    { label: 'Tra cứu kết quả xét nghiệm', target: 'tra-cuu' },
    { label: 'Liên hệ thắc mắc', target: 'lien-he' },
  ];

  return (
    <footer id="lien-he" className="bg-slate-950 text-gray-300 pt-16 pb-8 text-left border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Main Grid elements */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10-8 items-start mb-14">
          
          {/* Logo brand column */}
          <div className="lg:col-span-4 space-y-5">
            <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => onNavigate('trang-chu')}>
              <div className="p-2.5 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-xl text-white shadow-md">
                <HeartPulse size={22} />
              </div>
              <div>
                <span className="block text-white font-extrabold text-sm md:text-base tracking-wide uppercase leading-none">
                  Bệnh Viện Đa Khoa
                </span>
                <span className="block text-teal-400 font-bold text-xs tracking-wider uppercase mt-1 leading-none">
                  Thủy Nguyên Hải Phòng
                </span>
              </div>
            </div>

            <p className="text-xs text-gray-400 leading-relaxed max-w-sm">
              Thành lập và cống hiến vì sức sống lâu dài bền vững của nhân dân Huyện đảo và Thành phố Hoa phượng đỏ. Luôn phấn đấu hết lòng xây dựng mô hình y tế chuẩn mực cao.
            </p>

            <div className="flex items-center gap-2.5 bg-slate-900 border border-slate-800 p-3.5 rounded-xl text-xs w-fit">
              <Award className="text-amber-400 h-5 w-5 shrink-0" />
              <div>
                <strong className="text-white block font-sans">Bệnh Viện Hạng I</strong>
                <span className="text-[10px] text-gray-400">Sở Y tế Thành phố Hải Phòng</span>
              </div>
            </div>
          </div>

          {/* Quick link list */}
          <div className="lg:col-span-2.5 space-y-4">
            <h4 className="text-xs font-bold uppercase text-white tracking-widest">Liên Kết Nhanh</h4>
            <ul className="space-y-2.5 text-xs">
              {quickLinks.map((link, i) => (
                <li key={i}>
                  <button
                    id={`footer-link-quick-${i}`}
                    onClick={() => onNavigate(link.target)}
                    className="hover:text-teal-400 transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <ChevronRight size={12} className="text-teal-600" />
                    <span>{link.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Action portals list */}
          <div className="lg:col-span-2.5 space-y-4">
            <h4 className="text-xs font-bold uppercase text-white tracking-widest">Cổng Tiếp Đón</h4>
            <ul className="space-y-2.5 text-xs">
              {actionLinks.map((link, i) => (
                <li key={i}>
                  <button
                    id={`footer-link-action-${i}`}
                    onClick={() => onNavigate(link.target)}
                    className="hover:text-teal-400 transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <ChevronRight size={12} className="text-teal-600" />
                    <span>{link.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Core Contacts columns */}
          <div className="lg:col-span-3 space-y-4 text-xs">
            <h4 className="text-xs font-bold uppercase text-white tracking-widest">Thông Tin Khác</h4>
            
            <div className="space-y-3.5 leading-relaxed text-gray-400">
              <div className="flex items-start gap-2.5">
                <MapPin size={16} className="text-teal-400 shrink-0 mt-0.5" />
                <span>{hospitalContact?.address || 'Thôn Bạch Đằng, Xã Thủy Sơn, Huyện Thủy Nguyên, Thành phố Hải Phòng, Việt Nam.'}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone size={15} className="text-teal-400 shrink-0" />
                <div>
                  <p>Hotline hỗ trợ: <strong className="text-white">{hospitalContact?.hotline || '1900 9095'}</strong></p>
                  <p>Phòng Cấp cứu: <strong className="text-white">{hospitalContact?.emergency || '0225 3859 135'}</strong></p>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail size={15} className="text-teal-400 shrink-0" />
                <span>{hospitalContact?.email || 'bvdkthuynguyen@gmail.com'}</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Clock size={15} className="text-teal-400 shrink-0 mt-0.5" />
                <div>
                  Khám hành chính: Thứ 2 - Thứ 6 <br />
                  <span>Sáng: 07:00 - 11:30 | Chiều: 13:30 - 17:00</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Flat styled visual representation of the location route map */}
        <div className="border-t border-slate-900 pt-8 pb-5 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-gray-500">
          <p>© 2026 Bản quyền thuộc về Bệnh viện Đa khoa Thủy Nguyên Hải Phòng. Trang web phát triển tương thích cao.</p>
          <div className="flex items-center gap-3">
            <span className="hover:text-gray-400 transition-colors cursor-pointer">Chính sách bảo mật</span>
            <span className="h-3 w-px bg-slate-800" />
            <span className="hover:text-gray-400 transition-colors cursor-pointer">Điều khoản dịch vụ</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
