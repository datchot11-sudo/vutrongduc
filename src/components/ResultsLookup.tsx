/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  FileSearch,
  Search,
  User,
  Activity,
  Heart,
  Database,
  ArrowRight,
  TrendingUp,
  X,
  AlertTriangle,
  HeartPulse,
} from 'lucide-react';
import { TEST_RESULTS } from '../data';
import { TestResult } from '../types';

export default function ResultsLookup() {
  const [query, setQuery] = useState('');
  const [activeReport, setActiveReport] = useState<TestResult | null>(null);
  const [errorText, setErrorText] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorText('');
    setActiveReport(null);

    const term = query.trim().toUpperCase();
    if (!term) return;

    // Search by patient ID or phone number
    const result = TEST_RESULTS.find(
      (r) => r.patientId.toUpperCase() === term || r.patientPhone === term
    );

    if (result) {
      setActiveReport(result);
    } else {
      setErrorText(
        'Không tìm thấy hồ sơ bệnh án tương ứng. Thử kiểm tra bằng mã "BN2026" hoặc "0912345678" để xem kết quả mẫu.'
      );
    }
  };

  const handleQuickDemoCode = (code: string) => {
    setQuery(code);
    setActiveReport(TEST_RESULTS.find((r) => r.patientId === code) || null);
    setErrorText('');
  };

  return (
    <section id="tra-cuu" className="py-20 bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Top Header info */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold text-teal-600 uppercase tracking-widest block bg-teal-50 px-3 py-1 rounded-full w-fit mx-auto">
            Hệ Thống Trực Tuyến
          </span>
          <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight leading-tight">
            Tra Cứu Kết Quả Xét Nghiệm & Chẩn Đoán
          </h2>
          <p className="text-xs md:text-sm text-gray-550 leading-relaxed">
            Nhận phiếu báo cáo xét nghiệm máu, chẩn đoán điện tâm đồ và siêu âm ngay tại nhà mà không cần phải chờ đợi nhận bản cứng trực tiếp tại viện.
          </p>
        </div>

        {/* Search Bar Widgets bar */}
        <div className="max-w-xl mx-auto bg-white p-6 rounded-3xl border border-gray-150 shadow-sm space-y-4 mb-10">
          <p className="text-xs text-gray-450 leading-relaxed text-left">
            Vui lòng nhập <strong>Mã số bệnh nhân (mã BN)</strong> hoặc <strong>Số điện thoại đăng ký khám</strong> hiển thị trên hóa đơn hoặc phiếu tiếp đón để truy vấn kết quả:
          </p>

          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                id="lookup-query-input"
                type="text"
                placeholder="Ví dụ: BN2026 hoặc 0912345678"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-xs text-gray-700 font-sans focus:outline-none focus:border-teal-500 uppercase min-h-11"
              />
            </div>
            <button
              id="lookup-search-btn"
              type="submit"
              className="bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs px-5 py-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <FileSearch size={15} />
              <span>Tìm Kiếm</span>
            </button>
          </form>

          {/* Quick Demo Badges */}
          <div className="pt-2 border-t border-gray-100 flex flex-wrap items-center gap-2 text-left justify-start">
            <span className="text-[10px] text-gray-400 font-medium">Tìm kết quả mẫu:</span>
            <button
              id="quick-demo-bn2026"
              type="button"
              onClick={() => handleQuickDemoCode('BN2026')}
              className="px-2.5 py-1 bg-teal-50 hover:bg-teal-100 text-teal-700 rounded-lg text-[10px] font-bold tracking-wide transition-colors cursor-pointer"
            >
              BN2026 (Gan nhiễm mỡ nhẹ)
            </button>
            <button
              id="quick-demo-bn7890"
              type="button"
              onClick={() => handleQuickDemoCode('BN7890')}
              className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-[10px] font-bold tracking-wide transition-colors cursor-pointer"
            >
              BN7890 (Chỉ số huyết học)
            </button>
          </div>

          {errorText && (
            <div className="p-3 bg-red-50 text-red-700 text-[11px] rounded-lg border border-red-100 text-left flex gap-1.5 items-start">
              <AlertTriangle size={15} className="shrink-0 mt-0.5 text-red-500" />
              <span>{errorText}</span>
            </div>
          )}
        </div>

        {/* Dynamic Display PDF-like Health Report Sheet */}
        <AnimatePresence>
          {activeReport && (
            <motion.div
              id="health-report-sheet"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="max-w-3xl mx-auto bg-white border border-gray-200 shadow-xl rounded-3xl overflow-hidden text-left"
            >
              {/* Report Sheet Title Header */}
              <div className="bg-gradient-to-r from-teal-700 to-sky-800 text-white p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative">
                <div>
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping absolute top-5 right-5 hidden md:block" />
                  <div className="flex items-center gap-2 mb-1.5">
                    <HeartPulse size={20} className="text-emerald-300" />
                    <span className="text-[10px] font-bold tracking-widest uppercase text-teal-200">Báo cáo sức khỏe trực tuyến</span>
                  </div>
                  <h3 className="text-lg md:text-xl font-extrabold tracking-tight">
                    Kết Quả Thăm Khám & Xét Nghiệm Tổng Hợp
                  </h3>
                </div>
                <div className="text-left md:text-right text-xs md:text-sm font-mono bg-white/10 px-3.5 py-2 rounded-xl backdrop-blur-sm self-stretch md:self-auto border border-white/10">
                  <p className="text-[10px] text-teal-200 uppercase font-bold tracking-wide">Mã hồ sơ bệnh án</p>
                  <strong className="text-emerald-300">{activeReport.patientId}</strong>
                </div>
              </div>

              {/* Patient details block */}
              <div className="p-6 md:p-8 border-b border-gray-150 grid grid-cols-2 md:grid-cols-4 gap-4 bg-gray-50/60">
                <div className="space-y-0.5">
                  <span className="text-[10px] text-gray-400 font-medium">Bệnh nhân</span>
                  <p className="text-xs md:text-sm font-bold text-gray-800">{activeReport.patientName}</p>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[10px] text-gray-400 font-medium font-sans">Ngày sinh</span>
                  <p className="text-xs md:text-sm font-mono font-medium text-gray-700">
                    {new Date(activeReport.dob).toLocaleDateString('vi-VN')}
                  </p>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[10px] text-gray-400 font-medium">Giới tính</span>
                  <p className="text-xs md:text-sm font-semibold text-gray-750">{activeReport.gender}</p>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[10px] text-gray-400 font-medium">Ngày thực hiện</span>
                  <p className="text-xs md:text-sm font-mono font-medium text-gray-700">
                    {new Date(activeReport.testDate).toLocaleDateString('vi-VN')}
                  </p>
                </div>
                <div className="col-span-2 space-y-0.5">
                  <span className="text-[10px] text-gray-400 font-medium">Phòng khám thực hiện</span>
                  <p className="text-xs text-gray-750 font-semibold leading-relaxed">{activeReport.department}</p>
                </div>
                <div className="col-span-2 space-y-0.5">
                  <span className="text-[10px] text-gray-400 font-medium font-sans">Bác sĩ điều trị / Kýt duyệt</span>
                  <p className="text-xs text-teal-700 font-bold leading-relaxed">{activeReport.doctor}</p>
                </div>
              </div>

              {/* Laboratory parameters details table */}
              <div className="p-6 md:p-8">
                <h4 className="text-xs font-bold text-teal-650 uppercase tracking-widest mb-4 flex items-center gap-1.5">
                  <Activity size={14} />
                  <span>Kết Quả Xét Nghiệm Sinh Hóa & Huyết Học</span>
                </h4>

                <div className="border border-gray-150 rounded-xl overflow-hidden bg-white">
                  <div className="grid grid-cols-12 bg-gray-50/80 border-b border-gray-150 p-3.5 text-[10px] font-extrabold text-gray-500 uppercase tracking-wider text-left">
                    <div className="col-span-5 md:col-span-6 font-sans">Chỉ số xét nghiệm</div>
                    <div className="col-span-3 md:col-span-2 text-center">Kết quả</div>
                    <div className="col-span-2 text-center">Đơn vị</div>
                    <div className="col-span-2 text-right">Khoảng Quy Chiếu</div>
                  </div>

                  <div className="divide-y divide-gray-100 text-xs">
                    {activeReport.parameters.map((param, idx) => (
                      <div key={idx} id={`param-row-${idx}`} className="grid grid-cols-12 p-3.5 items-center text-left hover:bg-gray-50/50">
                        <div className="col-span-5 md:col-span-6 font-bold text-gray-700">
                          {param.parameter}
                        </div>
                        <div className="col-span-3 md:col-span-2 text-center font-mono font-extrabold text-sm">
                          <span
                            className={
                              param.status === 'high'
                                ? 'text-red-500 bg-red-50 px-2 py-0.5 rounded'
                                : param.status === 'low'
                                ? 'text-amber-600 bg-amber-50 px-2 py-0.5 rounded'
                                : 'text-gray-800'
                            }
                          >
                            {param.value}
                          </span>
                        </div>
                        <div className="col-span-2 text-center text-gray-450 font-mono">
                          {param.unit}
                        </div>
                        <div className="col-span-2 text-right text-gray-550 font-mono">
                          {param.referenceRange}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Radiographic imaging results (e.g. Ultrasound findings) */}
              {activeReport.imagingReport && (
                <div className="px-6 md:px-8 pb-8">
                  <h4 className="text-xs font-bold text-teal-650 uppercase tracking-widest mb-4 flex items-center gap-1.5">
                    <FileSearch size={14} />
                    <span>Kết Quả Chẩn Đoán Hình Ảnh ({activeReport.imagingReport.type})</span>
                  </h4>

                  <div className="p-5 bg-teal-50/20 border border-teal-100/50 rounded-2xl flex flex-col md:flex-row gap-6">
                    <div className="flex-1 space-y-3.5">
                      <div className="text-left">
                        <span className="text-[10px] text-gray-400 font-bold block uppercase tracking-wide">Mô tả chi tiết kỹ thuật</span>
                        <p className="text-xs text-gray-600 leading-relaxed mt-1">
                          {activeReport.imagingReport.details}
                        </p>
                      </div>
                      <div className="text-left bg-teal-500/10 p-3 rounded-lg border border-teal-500/10">
                        <span className="text-[10px] text-teal-700 font-extrabold block uppercase tracking-wider">Kết luận hình ảnh</span>
                        <strong className="text-xs text-teal-900 leading-relaxed block mt-1">
                          {activeReport.imagingReport.conclusion}
                        </strong>
                      </div>
                    </div>
                    {activeReport.imagingReport.imageUrl && (
                      <div className="w-full md:w-48 shrink-0 relative aspect-video md:aspect-square overflow-hidden bg-white border border-gray-150 rounded-xl">
                        <img
                          src={activeReport.imagingReport.imageUrl}
                          alt="Ultrasound preview"
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 left-2 bg-black/70 px-2 py-0.5 rounded text-[8px] font-bold text-white uppercase tracking-wider">
                          Mô Phỏng 4D
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Doctor diagnostics and therapeutic advisory notes */}
              <div className="p-6 md:p-8 bg-slate-900 text-white space-y-4">
                <div className="space-y-1">
                  <span className="text-[10px] text-teal-400 font-extrabold tracking-widest uppercase">Kết Luận Bác Sĩ Tổng Quan</span>
                  <p className="text-sm font-bold text-teal-100 leading-relaxed">
                    {activeReport.conclusion}
                  </p>
                </div>

                <div className="pt-3.5 border-t border-white/10 space-y-1.5">
                  <span className="text-[10px] text-amber-400 font-extrabold tracking-widest uppercase flex items-center gap-1">
                    <AlertTriangle size={12} />
                    <span>Chỉ định / Lời khuyên y học của Bác sĩ</span>
                  </span>
                  <p className="text-xs text-gray-300 leading-relaxed">
                    {activeReport.doctorNote}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
