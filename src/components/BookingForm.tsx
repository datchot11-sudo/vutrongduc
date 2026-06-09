/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Calendar,
  User,
  Phone,
  Mail,
  FileText,
  Clock,
  ShieldAlert,
  CheckCircle2,
  Printer,
  Trash2,
  Info,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';
import { DEPARTMENTS } from '../data';
import { Booking, Schedule } from '../types';
import { useApp } from '../context/AppContext';

interface BookingFormProps {
  selectedDoctorId?: string;
  selectedDeptId?: string;
  clearSelection: () => void;
}

export default function BookingForm({
  selectedDoctorId = '',
  selectedDeptId = '',
  clearSelection,
}: BookingFormProps) {
  // Access global context
  const { addBooking, schedules, currentUser, doctors } = useApp();

  // Step tracker
  const [step, setStep] = useState(1);

  // Form Fields State
  const [deptId, setDeptId] = useState('');
  const [doctorId, setDoctorId] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('');
  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [patientEmail, setPatientEmail] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState<'Nam' | 'Nữ' | 'Khác'>('Nam');
  const [cccd, setCccd] = useState(''); // CCCD
  const [insuranceCode, setInsuranceCode] = useState('');
  const [reason, setReason] = useState('');

  // Local storage lists of existing bookings
  const [myBookings, setMyBookings] = useState<Booking[]>([]);
  const [activeReceipt, setActiveReceipt] = useState<Booking | null>(null);

  // Sync parent doctor selection triggers
  useEffect(() => {
    if (selectedDeptId) {
      setDeptId(selectedDeptId);
    }
    if (selectedDoctorId) {
      setDoctorId(selectedDoctorId);
      setStep(1); // Reset to first step to enter remaining parameters
    }
  }, [selectedDoctorId, selectedDeptId]);

  // Autofill if logged in as Patient
  useEffect(() => {
    if (currentUser && currentUser.role === 'Patient') {
      setPatientName(currentUser.fullName || '');
      setPatientPhone(currentUser.phone || currentUser.username || '');
      setPatientEmail(currentUser.email || '');
      setDob(currentUser.dob || '');
      setGender(currentUser.gender || 'Nam');
      setCccd(currentUser.cccd || '');
    }
  }, [currentUser]);

  // Load existing bookings from LocalStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('thuy_nguyen_bookings');
      if (stored) {
        setMyBookings(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Error loading bookings', e);
    }
  }, [schedules]); // Refresh when schedules change

  // Filter available doctors depending on selected department
  const filteredDoctors = doctors.filter((doc) => !deptId || doc.specialtyId === deptId);

  // Pre-set available morning and afternoon slots
  const timeSlots = [
    { value: '07:30', period: 'Sáng', range: '07:30-08:30' },
    { value: '08:30', period: 'Sáng', range: '08:30-09:30' },
    { value: '09:30', period: 'Sáng', range: '09:30-10:30' },
    { value: '13:30', period: 'Chiều', range: '13:30-14:30' },
    { value: '14:30', period: 'Chiều', range: '14:30-15:30' },
    { value: '15:30', period: 'Chiều', range: '15:30-16:30' },
  ];

  // Lookup schedule for selected doctor, date and timeSlot range
  const getScheduleForSlot = (slotRange: string) => {
    return schedules.find(
      (s) =>
        s.doctorId === doctorId &&
        (!appointmentDate || s.date === appointmentDate) &&
        s.timeSlot === slotRange
    );
  };

  const handleNextStep = () => {
    if (step === 1) {
      if (!deptId) {
        alert('Vui lòng chọn Khoa khám chuyên môn!');
        return;
      }
      if (!appointmentDate) {
        alert('Vui lòng chọn Ngày hẹn khám!');
        return;
      }
      if (!appointmentTime) {
        alert('Vui lòng chọn Khung giờ khám!');
        return;
      }
      // Check if selected is fully booked already
      const matchedSlot = timeSlots.find((t) => t.value === appointmentTime);
      if (matchedSlot) {
        const sch = getScheduleForSlot(matchedSlot.range);
        if (sch && sch.currentPatients >= sch.maxPatients) {
          alert(`Khung giờ "${matchedSlot.range}" của bác sĩ này đã đầy (${sch.maxPatients}/${sch.maxPatients}). Vui lòng chọn khung giờ khác!`);
          return;
        }
      }
    }
    setStep((prev) => prev + 1);
  };

  const handlePrevStep = () => {
    setStep((prev) => Math.max(1, prev - 1));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!patientName.trim()) return alert('Vui lòng điền họ và tên!');
    if (!patientPhone.trim()) return alert('Vui lòng điền số điện thoại liên lạc!');
    if (!dob) return alert('Vui lòng chọn ngày tháng năm sinh!');

    const departmentObj = DEPARTMENTS.find((d) => d.id === deptId);
    const doctorObj = doctors.find((doc) => doc.id === doctorId);

    const matchedSlot = timeSlots.find((t) => t.value === appointmentTime);
    const matchedSchedule = matchedSlot ? getScheduleForSlot(matchedSlot.range) : undefined;

    try {
      // Call standard context provider method to increment schedule patients and save
      const added = addBooking({
        patientName: patientName.trim(),
        patientPhone: patientPhone.trim(),
        patientEmail: patientEmail.trim(),
        dob,
        gender,
        cccd: cccd.trim(),
        appointmentDate,
        appointmentTime,
        departmentId: deptId,
        departmentName: departmentObj ? departmentObj.name : 'Khám Tổng Hợp',
        doctorId,
        doctorName: doctorObj ? doctorObj.name : 'Bác sĩ trực ban',
        reason: reason.trim() || 'Thăm khám sức khỏe tổng quát',
        insuranceCode: insuranceCode.trim(),
        paymentAmount: 120000,
        scheduleId: matchedSchedule?.id || '',
      });

      const updated = [added, ...myBookings];
      setMyBookings(updated);

      // Show receipt and clean fields
      setActiveReceipt(added);
      setStep(3); // Result confirmation screen
      clearFields();
    } catch (err: any) {
      // Show blocking error (concurrency control verification!)
      alert(err.message || 'Đăng ký thất bại do xung đột lịch đặt.');
    }
  };

  const clearFields = () => {
    setDeptId('');
    setDoctorId('');
    setAppointmentDate('');
    setAppointmentTime('');
    setPatientName('');
    setPatientPhone('');
    setPatientEmail('');
    setDob('');
    setGender('Nam');
    setInsuranceCode('');
    setReason('');
    clearSelection();
  };

  const handleCancelBooking = (bookingId: string) => {
    if (window.confirm('Bạn có chắc chắn muốn hủy phiếu đặt lịch này không?')) {
      const updated = myBookings.filter((b) => b.id !== bookingId);
      setMyBookings(updated);
      localStorage.setItem('thuy_nguyen_bookings', JSON.stringify(updated));
      if (activeReceipt && activeReceipt.id === bookingId) {
        setActiveReceipt(null);
        setStep(1);
      }
    }
  };

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <section id="dat-lich" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Section Heading informational block */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold text-teal-600 uppercase tracking-widest block bg-teal-50 px-3 py-1 rounded-full w-fit mx-auto">
            Hệ Thống Đặt Chỗ Thông Minh
          </span>
          <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight leading-tight">
            Đăng Ký Khám Bệnh Khám Trực Tuyến
          </h2>
          <p className="text-xs md:text-sm text-gray-550 leading-relaxed">
            Hẹn giờ khám nhanh chóng để hạn chế xếp hàng chờ đợi lâu. Đặt nhanh qua các thuộc tính đơn giản trong 1 phút.
          </p>
        </div>

        {/* Layout with Form + Patient Current bookings checklist */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Main Booking Wizard Module */}
          <div className="lg:col-span-8 bg-white border border-gray-150 rounded-3xl overflow-hidden shadow-sm">
            {/* Step Indicators Headers */}
            <div className="bg-gray-50/70 border-b border-gray-150 px-6 py-4.5 flex justify-between items-center select-none">
              <span className="text-xs font-bold text-gray-800">
                Phiếu Đăng Ký Trực Tuyến
              </span>
              <div className="flex items-center gap-1.5 md:gap-3 text-[11px] font-bold">
                <span className={`px-2.5 py-1 rounded-full transition-all ${
                  step === 1 ? 'bg-teal-600 text-white shadow-md shadow-teal-100' : 'bg-gray-200 text-gray-500'
                }`}>
                  1. Dịch Vụ
                </span>
                <ChevronRight size={12} className="text-gray-300" />
                <span className={`px-2.5 py-1 rounded-full transition-all ${
                  step === 2 ? 'bg-teal-600 text-white shadow-md shadow-teal-100' : 'bg-gray-200 text-gray-500'
                }`}>
                  2. Thông Tin
                </span>
                <ChevronRight size={12} className="text-gray-300" />
                <span className={`px-2.5 py-1 rounded-full transition-all ${
                  step === 3 ? 'bg-emerald-600 text-white shadow-md shadow-emerald-100' : 'bg-gray-200 text-gray-500'
                }`}>
                  3. Hoàn Tất
                </span>
              </div>
            </div>

            <div className="p-6 md:p-8 text-left">
              <AnimatePresence mode="wait">
                {/* Step 1: Services setup selection */}
                {step === 1 && (
                  <motion.div
                    key="step-1"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="space-y-6"
                  >
                    <div className="bg-teal-50/30 border border-teal-100/50 p-4 rounded-xl flex gap-3 text-xs leading-relaxed text-teal-800">
                      <Info size={18} className="text-teal-600 shrink-0 mt-0.5" />
                      <div>
                        <strong>Lưu ý đặt lịch hẹn khám:</strong> Giờ khám hiển thị mang tính định hướng. Bệnh viện luôn có các chỉ tiêu phân bổ tiếp đón ưu tiên riêng dành cho người đăng ký trước tại website này.
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Department Select box */}
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-700 block">
                          Khoa khám chuyên khoa <span className="text-red-500">*</span>
                        </label>
                        <select
                          id="booking-dept-select"
                          value={deptId}
                          onChange={(e) => {
                            setDeptId(e.target.value);
                            setDoctorId(''); // Reset doctor when changing dept
                          }}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl text-xs text-gray-700 bg-white focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/30 min-h-11"
                        >
                          <option value="">-- Chọn chuyên khoa khám --</option>
                          {DEPARTMENTS.map((dept) => (
                            <option key={dept.id} value={dept.id}>
                              {dept.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Doctor Select field */}
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-700 block text-left">
                          Bác sĩ yêu cầu (Không bắt buộc)
                        </label>
                        <select
                          id="booking-doctor-select"
                          value={doctorId}
                          onChange={(e) => setDoctorId(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl text-xs text-gray-700 bg-white focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/30 min-h-11"
                        >
                          <option value="">-- Bác sĩ trực ban của khoa (Phục vụ ngẫu nhiên) --</option>
                          {filteredDoctors.map((doc) => (
                            <option key={doc.id} value={doc.id}>
                              {doc.name} ({doc.title})
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Appointment Date select */}
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-700 block">
                          Chọn ngày hẹn <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <input
                            id="booking-date-input"
                            type="date"
                            min={todayStr}
                            value={appointmentDate}
                            onChange={(e) => setAppointmentDate(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-xs text-gray-750 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/30 min-h-11 cursor-pointer"
                          />
                        </div>
                      </div>

                      {/* Appointment Time slots */}
                      <div className="space-y-2 text-left">
                        <label className="text-xs font-bold text-gray-700 block">
                          Chọn khung giờ dự kiến <span className="text-red-500">*</span>
                        </label>
                        {doctorId ? (
                          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-150 mb-2.5 text-[10px] text-gray-550 leading-tight">
                            💡 Chọn ngày hẹn ở bên trái để theo dõi đúng số chỗ còn trống cho từng ca tiếp nhận của bác sĩ.
                          </div>
                        ) : (
                          <div className="bg-amber-50/40 p-2.5 rounded-xl border border-amber-100/50 mb-2.5 text-[10px] text-amber-800 leading-tight">
                            ⚠️ Vui lòng chọn Bác sĩ cụ thể để kiểm tra chi tiết số ca tiếp nhận còn trống của từng khung giờ.
                          </div>
                        )}
                        <div className="grid grid-cols-2 gap-2">
                          {timeSlots.map((slot) => {
                            const sch = getScheduleForSlot(slot.range);
                            const isFull = sch ? sch.currentPatients >= sch.maxPatients : false;
                            const remaining = sch ? sch.maxPatients - sch.currentPatients : 5;
                            return (
                              <button
                                key={slot.value}
                                id={`slot-${slot.value}`}
                                type="button"
                                disabled={isFull}
                                onClick={() => setAppointmentTime(slot.value)}
                                className={`p-2.5 rounded-xl text-[11px] font-bold border transition-all text-center flex flex-col items-center justify-center gap-0.5 cursor-pointer ${
                                  isFull
                                    ? 'bg-red-50 border-red-150 text-red-400 cursor-not-allowed opacity-60'
                                    : appointmentTime === slot.value
                                    ? 'bg-teal-600 border-teal-600 text-white shadow-md shadow-teal-50'
                                    : 'bg-white border-gray-200 text-gray-650 hover:bg-teal-50/20 hover:border-teal-300'
                                }`}
                              >
                                <div className="text-xs font-sans tracking-tight font-black">{slot.value} ({slot.period})</div>
                                <span className={`text-[8px] font-bold block px-1 py-0.5 rounded-md ${
                                  isFull
                                    ? 'bg-red-100 text-red-650'
                                    : appointmentTime === slot.value
                                    ? 'bg-white/25 text-white'
                                    : remaining === 1
                                    ? 'bg-amber-100 text-amber-700 font-extrabold animate-pulse'
                                    : 'bg-slate-100 text-slate-500'
                                }`}>
                                  {isFull ? 'Hết chỗ' : `Còn ${remaining}/${sch ? sch.maxPatients : 5} chỗ`}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-gray-100 flex justify-end">
                      <button
                        id="booking-step1-next"
                        type="button"
                        onClick={handleNextStep}
                        className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer flex items-center gap-1.5 transition-colors"
                      >
                        <span>Tiếp Tục Điền Thông Tin</span>
                        <ChevronRight size={14} />
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Step 2: Patient Registration Information entry */}
                {step === 2 && (
                  <form key="step-2" onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* Name of applicant */}
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-700 block">
                          Họ và tên bệnh nhân <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                          <input
                            id="patient-name-input"
                            type="text"
                            required
                            placeholder="Nguyễn Văn A"
                            value={patientName}
                            onChange={(e) => setPatientName(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-xs text-gray-700 focus:outline-none focus:border-teal-500 min-h-11"
                          />
                        </div>
                      </div>

                      {/* DOB */}
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-700 block">
                          Ngày tháng năm sinh <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="patient-dob-input"
                          type="date"
                          required
                          max={todayStr}
                          value={dob}
                          onChange={(e) => setDob(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl text-xs text-gray-700 focus:outline-none focus:border-teal-500 min-h-11 cursor-pointer"
                        />
                      </div>

                      {/* Gender Selector */}
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-700 block">
                          Giới tính <span className="text-red-500">*</span>
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                          {(['Nam', 'Nữ', 'Khác'] as const).map((g) => (
                            <button
                              key={g}
                              id={`gender-${g}`}
                              type="button"
                              onClick={() => setGender(g)}
                              className={`py-2.5 rounded-lg text-xs font-bold border transition-all text-center cursor-pointer ${
                                gender === g
                                  ? 'bg-teal-600 border-teal-600 text-white shadow-sm'
                                  : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                              }`}
                            >
                              {g}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* Phone contact */}
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-700 block">
                          Số điện thoại liên lạc <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                          <input
                            id="patient-phone-input"
                            type="tel"
                            required
                            placeholder="0912345678"
                            value={patientPhone}
                            onChange={(e) => setPatientPhone(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-xs text-gray-755 focus:outline-none focus:border-teal-500 min-h-11"
                          />
                        </div>
                      </div>

                      {/* Email address */}
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-700 block">
                          Địa chỉ Email (Nhân thông tin cứu xét)
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                          <input
                            id="patient-email-input"
                            type="email"
                            placeholder="lienhe@gmail.com"
                            value={patientEmail}
                            onChange={(e) => setPatientEmail(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-xs text-gray-755 focus:outline-none focus:border-teal-500 min-h-11"
                          />
                        </div>
                      </div>

                      {/* CCCD Patient Ident Number */}
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-700 block">
                          Số CCCD / Mã định danh <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <FileText className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                          <input
                            id="patient-cccd-input"
                            type="text"
                            required
                            placeholder="VD: 031095012345"
                            value={cccd}
                            onChange={(e) => setCccd(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-xs text-gray-755 focus:outline-none focus:border-teal-500 min-h-11"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Insurance code */}
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-700 block">
                          Mã số Thẻ Bảo hiểm y tế BHYT (Nếu áp dụng)
                        </label>
                        <div className="relative">
                          <FileText className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                          <input
                            id="patient-insurance-input"
                            type="text"
                            placeholder="VD: GD43132034xxxxx"
                            value={insuranceCode}
                            onChange={(e) => setInsuranceCode(e.target.value.toUpperCase())}
                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-xs text-gray-755 focus:outline-none focus:border-teal-500 min-h-11"
                          />
                        </div>
                      </div>

                      {/* Symptom / Medical reason */}
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-700 block">
                          Lý do khám / Triệu chứng bệnh lý sơ lược
                        </label>
                        <input
                          id="patient-reason-input"
                          type="text"
                          placeholder="VD: Kiểm tra tim mạch định kỳ, đau nhức họng..."
                          value={reason}
                          onChange={(e) => setReason(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl text-xs text-gray-755 focus:outline-none focus:border-teal-500 min-h-11"
                        />
                      </div>
                    </div>

                    {/* Submit buttons */}
                    <div className="pt-6 border-t border-gray-100 flex items-center justify-between gap-4">
                      <button
                        id="booking-step2-prev"
                        type="button"
                        onClick={handlePrevStep}
                        className="px-5 py-3 border border-gray-250 hover:bg-gray-50 text-gray-600 font-bold text-xs rounded-xl cursor-pointer flex items-center gap-1 transition-all"
                      >
                        <ChevronLeft size={14} />
                        <span>Quay Lại</span>
                      </button>

                      <button
                        id="booking-submit"
                        type="submit"
                        className="px-6 py-3 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-md cursor-pointer flex items-center gap-2 transition-transform"
                      >
                        <CheckCircle2 size={16} />
                        <span>Xác Nhận Đăng Ký Khám bệnh</span>
                      </button>
                    </div>
                  </form>
                )}

                {/* Step 3: Success Confirmation E-Ticket Printable Card */}
                {step === 3 && activeReceipt && (
                  <motion.div
                    key="step-3"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-6 text-center py-4"
                  >
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <div className="p-3 bg-emerald-50 text-emerald-600 rounded-full animate-bounce">
                        <CheckCircle2 size={36} />
                      </div>
                      <h3 className="text-lg font-extrabold text-gray-900">
                        Đặt Lịch Hẹn Khám Thành Công!
                      </h3>
                      <p className="text-xs text-gray-550 max-w-sm">
                        Phiếu tiếp đón thông minh của quý khách đã được khởi tạo và ghi vào sổ trực tuyến của bệnh viện.
                      </p>
                    </div>

                    {/* Real e-ticket card visual presentation */}
                    <div
                      id="medical-e-ticket"
                      className="max-w-md mx-auto bg-gradient-to-br from-teal-50 to-emerald-50 border border-teal-150 rounded-2xl overflow-hidden shadow-sm p-6 text-left relative"
                    >
                      {/* Top Header Ticket decor */}
                      <div className="border-b border-teal-150/60 pb-3 flex justify-between items-center mb-4">
                        <div className="flex items-center gap-1 text-[10px] font-extrabold text-teal-700 bg-teal-100 rounded-full px-2.5 py-0.5 uppercase tracking-wider">
                          <Clock size={10} />
                          <span>Hẹn Giờ Thông Minh</span>
                        </div>
                        <span className="font-mono text-xs font-bold text-gray-500">
                          {activeReceipt.id}
                        </span>
                      </div>

                      {/* Info lines */}
                      <div className="space-y-2.5 text-xs text-gray-700">
                        <div className="grid grid-cols-3">
                          <span className="text-gray-450">Bệnh nhân:</span>
                          <span className="col-span-2 font-bold text-gray-800">{activeReceipt.patientName}</span>
                        </div>
                        <div className="grid grid-cols-3">
                          <span className="text-gray-450">Điện thoại:</span>
                          <span className="col-span-2 font-mono font-medium">{activeReceipt.patientPhone}</span>
                        </div>
                        <div className="grid grid-cols-3">
                          <span className="text-gray-450 font-sans">Khoa Khám:</span>
                          <span className="col-span-2 font-semibold text-teal-750">{activeReceipt.departmentName}</span>
                        </div>
                        <div className="grid grid-cols-3">
                          <span className="text-gray-450">Bác sĩ:</span>
                          <span className="col-span-2 font-medium text-gray-800">{activeReceipt.doctorName}</span>
                        </div>
                        <div className="grid grid-cols-3">
                          <span className="text-gray-450">Thời gian hẹn:</span>
                          <span className="col-span-2 font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded w-fit">
                            {activeReceipt.appointmentTime} | {activeReceipt.appointmentDate}
                          </span>
                        </div>
                        {activeReceipt.insuranceCode && (
                          <div className="grid grid-cols-3">
                            <span className="text-gray-450">Mã Thẻ BHYT:</span>
                            <span className="col-span-2 font-mono text-gray-600">{activeReceipt.insuranceCode}</span>
                          </div>
                        )}
                        <div className="grid grid-cols-3">
                          <span className="text-gray-450">Lý do khám:</span>
                          <span className="col-span-2 text-gray-600 italic">"{activeReceipt.reason}"</span>
                        </div>
                      </div>

                      {/* Queue Indicator Banner */}
                      <div className="mt-5 p-3.5 bg-white border border-teal-100 rounded-xl flex justify-between items-center">
                        <div>
                          <span className="text-[10px] text-gray-400 uppercase tracking-wider block">Mã số Hẹn Giờ</span>
                          <strong className="text-teal-700 text-sm font-mono">{activeReceipt.queueNumber}</strong>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] text-gray-400 block">Thời gian tiếp đón tối ưu</span>
                          <span className="text-[10px] text-teal-650 font-bold">Vui lòng đến trước 15 phút</span>
                        </div>
                      </div>

                      {/* Barcode representation using simple styled lines */}
                      <div className="mt-4 flex flex-col items-center justify-center space-y-1 opacity-80 select-none">
                        <div className="flex gap-0.5 h-6">
                          {[1,2,4,1,3,1,2,1,4,1,2,3,1,1,2,4,1,3,1,2].map((w, i) => (
                            <span
                              key={i}
                              className="bg-black"
                              style={{ width: `${w}px` }}
                            />
                          ))}
                        </div>
                        <span className="text-[9px] font-mono text-gray-400">PATIENT-UID-CHECKIN</span>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-gray-100 flex items-center justify-center gap-3">
                      <button
                        id="print-ticket-btn"
                        onClick={() => window.print()}
                        className="px-4 py-2.5 border border-gray-250 hover:bg-gray-50 text-gray-650 font-bold text-xs rounded-xl cursor-pointer flex items-center gap-1.5 transition-colors"
                      >
                        <Printer size={14} />
                        <span>In Phiếu Bản Cứng</span>
                      </button>

                      <button
                        id="booking-finish-btn"
                        onClick={() => setStep(1)}
                        className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl cursor-pointer transition-colors"
                      >
                        Tạo Đăng Ký Mới
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* List of current Active Bookings in LocalStorage */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-gray-50 border border-gray-150 rounded-3xl p-6 text-left">
              <h3 className="text-sm font-extrabold text-gray-850 mb-4 flex items-center gap-1.5">
                <Calendar size={16} className="text-teal-600" />
                <span>Lịch Đã Đặt Của Tôi ({myBookings.length})</span>
              </h3>

              {myBookings.length === 0 ? (
                <div className="py-8 text-center text-gray-400 space-y-2">
                  <span className="text-xs">Chưa ghi nhận lịch khám trực tuyến nào từ thiết bị này.</span>
                </div>
              ) : (
                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1">
                  {myBookings.map((b) => (
                    <div
                      key={b.id}
                      id={`active-booking-item-${b.id}`}
                      className="p-4 bg-white border border-gray-150 hover:border-teal-150 rounded-xl transition-all relative group"
                    >
                      {/* Delete icon */}
                      <button
                        id={`cancel-booking-btn-${b.id}`}
                        onClick={() => handleCancelBooking(b.id)}
                        className="absolute top-3 right-3 text-gray-400 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition-colors cursor-pointer"
                        title="Hủy lịch hẹn"
                      >
                        <Trash2 size={13} />
                      </button>

                      <div className="space-y-1.5">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-[9px] bg-teal-50 text-teal-700 px-1.5 py-0.5 rounded font-bold">
                            {b.id}
                          </span>
                          <span className="font-mono text-[9px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-bold">
                            {b.queueNumber}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-gray-800 line-clamp-1 pr-6">
                          {b.patientName}
                        </h4>
                        <div className="text-[10px] text-gray-500 space-y-0.5">
                          <p className="line-clamp-1 font-semibold text-teal-750">{b.departmentName}</p>
                          <p className="font-mono">{b.appointmentTime} | {b.appointmentDate}</p>
                          <p className="line-clamp-1">Bác sĩ: {b.doctorName}</p>
                        </div>
                      </div>

                      {/* View Receipt button */}
                      <button
                        id={`view-receipt-btn-${b.id}`}
                        onClick={() => {
                          setActiveReceipt(b);
                          setStep(3);
                        }}
                        className="mt-3 text-[10px] font-bold text-indigo-600 hover:text-indigo-800 cursor-pointer block"
                      >
                        Xem phiếu điện tử →
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* General FAQs banner */}
            <div className="p-6 bg-gradient-to-br from-indigo-900 to-slate-900 text-white rounded-3xl text-left space-y-3.5">
              <h4 className="text-xs font-extrabold tracking-wider uppercase text-indigo-300">
                Lưu ý Quy Trình
              </h4>
              <ul className="text-[11px] text-indigo-100/90 space-y-2.5 leading-relaxed">
                <li className="flex gap-2">
                  <span className="h-4 w-4 bg-indigo-500/30 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0 mt-0.5">1</span>
                  <span>Quý khách vui lòng đến quầy tiếp đón số 01 (Khoa Khám Bệnh) để quét thẻ BHYT & đối chiếu phiếu hẹn giờ này.</span>
                </li>
                <li className="flex gap-2">
                  <span className="h-4 w-4 bg-indigo-500/30 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0 mt-0.5">2</span>
                  <span>Nếu ho, sốt cao, có yếu tố dịch tễ, vui lòng trực tiếp khai báo tại Luồng Sàng Lọc Phân Loại Cấp Cứu.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
