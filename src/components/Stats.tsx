/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Award, ShieldCheck, HeartPulse, Clock, Sparkles } from 'lucide-react';

export default function Stats() {
  const supportCards = [
    {
      icon: <Clock className="text-teal-600 h-6 w-6" />,
      title: 'Dịch Vụ Cấp Cứu 24/7',
      desc: 'Đội ngũ trực ban cấp cứu hồi sức thường trực phản ứng nhanh, cơ động sẵn sàng xử lý mọi ca bệnh.',
      badge: 'Điện thoại: 0225 3859 135',
      color: 'border-red-100 bg-red-50/10 hover:border-red-200',
    },
    {
      icon: <ShieldCheck className="text-emerald-600 h-6 w-6" />,
      title: 'Khám Bảo Hiểm Y Tế (BHYT)',
      desc: 'Áp dụng đầy đủ quyền lợi bảo lãnh đúng tuyến và trái tuyến thuận lợi đúng theo thông tư Bộ Y tế hiện hành.',
      badge: 'Thủ tục nhanh chóng',
      color: 'border-emerald-100 bg-emerald-50/10 hover:border-emerald-200',
    },
    {
      icon: <Sparkles className="text-indigo-600 h-6 w-6" />,
      title: 'Khám Sức Khỏe Doanh Nghiệp',
      desc: 'Thiết kế gói kiểm tra sức khỏe tổng quát riêng biệt định kỳ cho các công ty, cụm công nghiệp tại Thủy Nguyên.',
      badge: 'Chiết khấu ưu đãi',
      color: 'border-indigo-100 bg-indigo-50/10 hover:border-indigo-200',
    },
  ];

  const statItems = [
    { value: '550+', label: 'Giường bệnh thực kê', sub: 'Quy trình vận hành tối ưu hóa' },
    { value: '320+', label: 'Y bác sĩ & Cán bộ y tế', sub: 'Giàu y đức, trình độ đại học trở lên' },
    { value: '25+', label: 'Chuyên khoa lâm sàng', sub: 'Đầy đủ phòng khám chuyên khoa' },
    { value: '50+', label: 'Năm hoạt động cống hiến', sub: 'Được Đảng & Nhà nước trao tặng huân chương' },
  ];

  return (
    <section id="gioi-thieu" className="py-16 bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Support Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 -mt-24 sm:-mt-28 relative z-20 mb-16">
          {supportCards.map((card, idx) => (
            <div
              key={idx}
              id={`stat-card-${idx}`}
              className={`p-6 bg-white rounded-2xl border transition-all duration-350 hover:-translate-y-1 hover:shadow-xl ${card.color}`}
            >
              <div className="p-3 bg-gray-50 rounded-xl w-fit mb-5">
                {card.icon}
              </div>
              <h3 className="text-base font-bold text-gray-800 mb-2">{card.title}</h3>
              <p className="text-xs text-gray-500 leading-relaxed mb-4">{card.desc}</p>
              <span className="inline-block px-2.5 py-1 bg-gray-100/80 rounded-full text-[10px] font-bold text-gray-600 uppercase tracking-wider">
                {card.badge}
              </span>
            </div>
          ))}
        </div>

        {/* Introduction Context block */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-16">
          <div className="lg:col-span-7 space-y-6">
            <span className="text-xs font-bold text-teal-600 tracking-widest uppercase block">
              Bệnh Viện Đa Khoa Thủy Nguyên Hải Phòng
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight leading-tight">
              Hơn Nửa Thế Kỷ Đồng Hành và Bảo Vệ <br />
              Sức Khỏe Cho Hàng Triệu Người Dân Đất Cảng
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              Thành lập từ những năm gian khó đấu tranh cách mạng, Bệnh viện Đa khoa Thủy Nguyên luôn tự hào là ngọn cờ đầu trong lĩnh vực y tế tuyến huyện của thành phố Hải Phòng. Chúng tôi không ngừng phấn đấu vươn mình, đổi mới hạ tầng, đào tạo nâng cấp chuyên sâu nguồn chất xám y khoa nhằm cung cấp giải pháp bảo bọc sức khỏe tối ưu hàng đầu.
            </p>
            <p className="text-gray-600 text-sm leading-relaxed border-l-3 border-teal-500 pl-4 bg-teal-50/30 py-3 rounded-r-lg">
              "Lấy sức khỏe bệnh nhân làm tôn chỉ hoạt động duy nhất, chúng tôi không ngừng cải cách hành chính số, áp dụng đặt hẹn linh hoạt và tối ưu tiện ích giúp người dân tiếp cận quy trình y học văn minh ngay tại quê nhà."
            </p>
          </div>
          <div className="lg:col-span-5 relative mt-6 lg:mt-0">
            {/* Visual Decorative Box representing awards */}
            <div className="p-8 bg-gradient-to-br from-teal-700 to-emerald-800 text-white rounded-3xl shadow-xl shadow-teal-900/10">
              <div className="flex items-center gap-2 mb-6">
                <HeartPulse size={28} className="text-emerald-300 animate-pulse" />
                <span className="text-xs font-bold tracking-wider uppercase text-teal-200">Cam Kết Y Đức</span>
              </div>
              <h3 className="text-lg md:text-xl font-extrabold mb-4">Các Chức Danh Thi Đua</h3>
              <ul className="space-y-4 text-xs text-teal-50/90 leading-relaxed">
                <li className="flex items-start gap-2.5">
                  <Award size={18} className="text-amber-400 shrink-0 mt-0.5" />
                  <span>Đơn vị văn hóa xuất sắc xuất sắc của thành phố Hải Phòng hàng năm.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Award size={18} className="text-amber-400 shrink-0 mt-0.5" />
                  <span>Huân chương Lao động hạng Ba do Chủ tịch nước trao tặng.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Award size={18} className="text-amber-400 shrink-0 mt-0.5" />
                  <span>Điểm chất lượng bệnh viện xuất sắc đứng đầu trong phân khúc tuyến cơ sở.</span>
                </li>
              </ul>
            </div>
            {/* Decorative mesh */}
            <div className="absolute -bottom-4 -right-4 w-full h-full border-2 border-dashed border-teal-200 rounded-3xl -z-10 hidden sm:block" />
          </div>
        </div>

        {/* Stats Numbers Counter Display */}
        <div className="p-8 bg-white rounded-3xl border border-gray-150 shadow-sm grid grid-cols-2 lg:grid-cols-4 gap-8">
          {statItems.map((stat, idx) => (
            <div key={idx} className="text-center space-y-1.5" id={`stat-item-${idx}`}>
              <div className="text-2xl md:text-35xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-600">
                {stat.value}
              </div>
              <div className="text-xs font-bold text-gray-850 tracking-wide">
                {stat.label}
              </div>
              <div className="text-[10px] text-gray-450 leading-relaxed">
                {stat.sub}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
