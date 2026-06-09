/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useApp } from '../context/AppContext';
import { Star, ArrowRight } from 'lucide-react';

interface DoctorsProps {
  onSelectDoctor: (doctorId: string, deptId: string) => void;
}

export default function Doctors({ onSelectDoctor }: DoctorsProps) {
  const { doctors } = useApp();

  return (
    <section id="bac-si" className="py-20 bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Section Heading info */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold text-teal-600 uppercase tracking-widest block bg-teal-50 px-3 py-1 rounded-full w-fit mx-auto">
            Đội Ngũ Thầy Thuốc Nhân Dân
          </span>
          <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight leading-tight">
            Y Bác Sĩ Tiêu Biểu Thủy Nguyên
          </h2>
          <p className="text-xs md:text-sm text-gray-550 leading-relaxed">
            Hội tụ các chuyên gia đầu ngành giỏi chuyên môn, tận tâm hết mình hỗ trợ vì sức sống và bình an tối đa của bạn và gia đình.
          </p>
        </div>

        {/* Doctors Grid Cards layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {doctors.map((doc) => (
            <div
              key={doc.id}
              id={`doctor-card-${doc.id}`}
              className="bg-white border border-gray-150 rounded-2xl overflow-hidden transition-all duration-350 hover:shadow-lg hover:border-teal-150 flex flex-col justify-between group"
            >
              <div>
                {/* Doctor Image with scaling zoom on hover */}
                <div className="relative aspect-square overflow-hidden bg-gray-100">
                  <img
                    src={doc.imageUrl}
                    alt={doc.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-106"
                  />
                  {/* Overlay Specialty Badge */}
                  <div className="absolute bottom-3 left-3">
                    <span className="px-2.5 py-1 bg-white/95 backdrop-blur-sm rounded-lg text-[10px] font-bold text-teal-700 shadow-sm uppercase tracking-wide">
                      {doc.specialtyName}
                    </span>
                  </div>
                </div>

                {/* Info Text Area */}
                <div className="p-5 space-y-2 text-left">
                  <div className="flex justify-between items-start gap-1">
                    <div>
                      <h3 className="text-sm font-extrabold text-gray-800 leading-tight">
                        {doc.name}
                      </h3>
                      <p className="text-[11px] font-bold text-teal-600 uppercase tracking-wider mt-0.5">
                        {doc.title}
                      </p>
                    </div>
                    {/* Rating */}
                    <div className="flex items-center gap-0.5 bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded text-[10px] font-bold shrink-0">
                      <Star size={10} className="fill-amber-500 text-amber-500" />
                      <span>{doc.rating}</span>
                    </div>
                  </div>

                  <p className="text-xs text-gray-500 leading-relaxed pt-1 border-t border-gray-100 italic line-clamp-3">
                    "{doc.experience}"
                  </p>
                </div>
              </div>

              {/* Directly book appointment with this doctor */}
              <div className="p-5 pt-0">
                <button
                  id={`doctor-book-btn-${doc.id}`}
                  onClick={() => onSelectDoctor(doc.id, doc.specialtyId)}
                  className="w-full py-2.5 bg-teal-50 hover:bg-teal-600 text-teal-700 hover:text-white border border-teal-120 hover:border-teal-600 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer group-hover:bg-teal-600 group-hover:text-white"
                >
                  <span>Đặt Lịch Với Bác Sĩ</span>
                  <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
