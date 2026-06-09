/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Calendar, Clock, FileText, CheckCircle2, AlertCircle, QrCode, CreditCard, Printer, ShieldAlert, BadgeCheck, Stethoscope, Search, Home } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Booking } from '../types';

export default function PatientPortal() {
  const { currentUser, bookings, confirmPayment } = useApp();
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showPayModal, setShowPayModal] = useState<Booking | null>(null);
  const [payMethod, setPayMethod] = useState<'Chuyển khoản' | 'Ví điện tử'>('Chuyển khoản');
  const [isProcessingPay, setIsProcessingPay] = useState(false);
  const [paySuccessMsg, setPaySuccessMsg] = useState('');

  // Filter bookings belonging to current patient (based on phone link)
  const patientBookings = bookings.filter(
    (b) => b.patientPhone === currentUser?.phone || b.patientName === currentUser?.fullName
  );

  const activeAppointments = patientBookings.filter(b => b.status !== 'Completed' && b.status !== 'Cancelled');
  const pastAppointments = patientBookings.filter(b => b.status === 'Completed' || b.status === 'Cancelled');

  const handleOnlinePaySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showPayModal) return;
    setIsProcessingPay(true);
    setTimeout(() => {
      // Simulate gateway approval
      confirmPayment(showPayModal.id, payMethod, showPayModal.paymentAmount || 120000);
      setIsProcessingPay(false);
      setPaySuccessMsg('Thanh toán viện phí trực tuyến thành công!');
      setTimeout(() => {
        setPaySuccessMsg('');
        setShowPayModal(null);
      }, 1500);
    }, 1500);
  };

  const getStatusBadge = (status: Booking['status']) => {
    switch (status) {
      case 'Pending':
        return <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-50 text-amber-700 font-bold border border-amber-100">Chờ duyệt</span>;
      case 'Confirmed':
        return <span className="px-2 py-0.5 rounded-full text-[10px] bg-blue-50 text-blue-700 font-bold border border-blue-100">Đã xác nhận</span>;
      case 'Checked-In':
        return <span className="px-2 py-0.5 rounded-full text-[10px] bg-indigo-50 text-indigo-700 font-bold border border-indigo-100">Đã Check-in ({status})</span>;
      case 'Completed':
        return <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-50 text-emerald-700 font-bold border border-emerald-100">Hoàn thành</span>;
      case 'Cancelled':
        return <span className="px-2 py-0.5 rounded-full text-[10px] bg-red-50 text-red-700 font-bold border border-red-100">Đã hủy</span>;
      default:
        return null;
    }
  };

  const formatPrice = (num?: number) => {
    if (!num) return '120.000 đ';
    return num.toLocaleString('vi-VN') + ' đ';
  };

  return (
    <div className="space-y-6 text-left">
      {/* Header Welcome Block */}
      <div className="bg-gradient-to-r from-teal-700 to-emerald-700 p-6 md:p-8 rounded-3xl text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <span className="text-[10px] font-extrabold uppercase bg-white/20 px-2.5 py-1 rounded-full text-white tracking-widest w-fit block">
            Cổng Thông Tin Bệnh Nhân
          </span>
          <h2 className="text-xl md:text-2xl font-extrabold">Chào mừng trở lại, {currentUser?.fullName}!</h2>
          <p className="text-xs text-teal-100/90 leading-relaxed max-w-xl">
            Nơi quản lý lịch khám, theo dõi kết quả hồ sơ bệnh án điện tử, nhận đơn thuốc và thanh toán viện phí trực tuyến tiện lợi tại Bệnh viện đa khoa Thủy Nguyên.
          </p>
        </div>
        <div className="bg-white/10 p-4 rounded-2xl flex flex-col items-center justify-center shrink-0 border border-white/10 text-center min-w-[140px]">
          <span className="text-[10px] uppercase font-bold tracking-wider text-teal-200">Mã Bệnh Nhân</span>
          <strong className="text-sm font-mono tracking-tight mt-1">{currentUser?.id?.replace('ACC-', 'BN')}</strong>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left column: List of Bookings */}
        <div className="lg:col-span-7 space-y-6">
          {/* Active Appointments panel */}
          <div className="bg-white p-6 rounded-3xl border border-gray-150 shadow-sm space-y-4">
            <h3 className="text-xs font-extrabold text-gray-800 uppercase tracking-wider flex items-center gap-1.5">
              <Calendar size={15} className="text-teal-600" />
              <span>Lịch Khám Đang Chờ ({activeAppointments.length})</span>
            </h3>

            {activeAppointments.length === 0 ? (
              <div className="py-8 text-center text-gray-400 text-xs">
                Không có lịch khám nào đang chờ thực hiện.
              </div>
            ) : (
              <div className="space-y-3">
                {activeAppointments.map((b) => (
                  <div key={b.id} className="p-4 bg-slate-50 hover:bg-slate-100/70 border border-slate-150 rounded-2xl transition-all">
                    <div className="flex justify-between items-start mb-2.5">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-[9px] bg-slate-200 text-gray-700 px-1.5 py-0.5 rounded font-bold">
                          {b.id}
                        </span>
                        {b.queueNumber && (
                          <span className="font-mono text-[9px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold">
                            STT: {b.queueNumber}
                          </span>
                        )}
                      </div>
                      {getStatusBadge(b.status)}
                    </div>
                    <div className="text-xs space-y-1.5 text-gray-650">
                      <p className="font-bold text-gray-800 text-sm">{b.patientName}</p>
                      <p><span className="text-gray-400">Khoa khám:</span> <strong className="text-teal-700 font-semibold">{b.departmentName}</strong></p>
                      <p><span className="text-gray-400">Bác sĩ:</span> {b.doctorName}</p>
                      <p className="font-mono text-indigo-700"><span className="text-gray-400 font-sans">Thời gian:</span> {b.appointmentTime} - {b.appointmentDate}</p>
                    </div>

                    {/* Action buttons (Pay) */}
                    <div className="mt-3.5 pt-3 border-t border-slate-200 flex justify-between items-center">
                      <span className="text-[10px] text-gray-400">
                        {b.paymentStatus === 'Paid' ? (
                          <span className="text-emerald-600 font-bold flex items-center gap-0.5">✔ Đã nộp viện phí</span>
                        ) : (
                          <span className="text-red-500 font-bold flex items-center gap-0.5">● Chưa nộp phí: {formatPrice(b.paymentAmount)}</span>
                        )}
                      </span>
                      <div className="flex gap-2">
                        {b.paymentStatus === 'Unpaid' && (
                          <button
                            onClick={() => setShowPayModal(b)}
                            className="px-3.5 py-1.5 bg-teal-600 hover:bg-teal-700 text-white text-[10px] font-bold rounded-lg cursor-pointer transition-colors shadow-sm shadow-teal-50"
                          >
                            Đóng phí trực tuyến
                          </button>
                        )}
                        <button
                          onClick={() => {
                            // Simple view ticket logic
                            setSelectedBooking(b);
                          }}
                          className="px-3 py-1.5 border border-slate-250 hover:bg-slate-100 text-slate-700 text-[10px] font-bold rounded-lg cursor-pointer transition-colors"
                        >
                          Chi tiết
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Past/Completed Appointments panel */}
          <div className="bg-white p-6 rounded-3xl border border-gray-150 shadow-sm space-y-4">
            <h3 className="text-xs font-extrabold text-gray-800 uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 size={15} className="text-emerald-600" />
              <span>Lịch Sử Khám & Nhận Đơn Thuốc ({pastAppointments.length})</span>
            </h3>

            {pastAppointments.length === 0 ? (
              <div className="py-8 text-center text-gray-400 text-xs text-left">
                Chưa có lịch sử kết luận khám hoặc đơn thuốc nào được ghi nhận.
              </div>
            ) : (
              <div className="space-y-3">
                {pastAppointments.map((b) => (
                  <div
                    key={b.id}
                    id={`past-booking-${b.id}`}
                    onClick={() => {
                      if (b.status === 'Completed' && b.examinationResult) {
                        setSelectedBooking(b);
                      }
                    }}
                    className={`p-4 border rounded-2xl transition-all text-left cursor-pointer ${
                      selectedBooking && selectedBooking.id === b.id
                        ? 'border-emerald-500 bg-emerald-50/20'
                        : 'border-slate-150 hover:border-slate-300 bg-slate-50/40'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-mono text-[9px] bg-slate-200 text-gray-600 px-1.5 py-0.5 rounded font-bold">
                        HĐ: {b.id}
                      </span>
                      {getStatusBadge(b.status)}
                    </div>
                    <div className="text-xs space-y-1 text-gray-700">
                      <p className="font-bold text-gray-800 text-sm">{b.patientName}</p>
                      <p><span className="text-gray-400">Khoa khám:</span> {b.departmentName}</p>
                      <p><span className="text-gray-400">Bác sĩ kết luận:</span> <strong>{b.doctorName}</strong></p>
                      {b.examinationResult?.diagnosis && (
                        <p className="text-emerald-800 bg-emerald-50/50 p-2 rounded-lg mt-1 border border-emerald-100/50">
                          <span className="font-bold block text-[10px]">Chẩn đoán:</span>
                          <span className="text-[11px] font-medium">{b.examinationResult.diagnosis}</span>
                        </p>
                      )}
                    </div>
                    {b.status === 'Completed' && b.examinationResult && (
                      <span className="text-[10px] text-teal-600 font-bold block mt-3 text-right">
                        Click để xem CHI TIẾT ĐƠN THUỐC ĐIỆN TỬ →
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right column: E-Ticket or Prescription View */}
        <div className="lg:col-span-5 space-y-6">
          {selectedBooking ? (
            <div className="bg-white border-2 border-indigo-100 rounded-3xl p-6 shadow-sm space-y-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50 rounded-bl-full -z-10 opacity-70" />
              
              <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
                  Chi Tiết Hồ Sơ Y Tế
                </span>
                <button
                  onClick={() => setSelectedBooking(null)}
                  className="text-xs text-gray-400 hover:text-gray-650 cursor-pointer"
                >
                  Đóng [x]
                </button>
              </div>

              {/* Patient Basic Info */}
              <div className="space-y-3.5">
                <div className="space-y-1">
                  <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Tiền sử / Bệnh nhân</span>
                  <p className="text-sm font-extrabold text-gray-800">{selectedBooking.patientName}</p>
                  <p className="text-xs text-gray-500 font-mono">Sinh ngày: {selectedBooking.dob} | Giới tính: {selectedBooking.gender}</p>
                  {selectedBooking.insuranceCode && <p className="text-[11px] text-slate-500 font-mono">Thẻ BHYT: {selectedBooking.insuranceCode}</p>}
                </div>

                {selectedBooking.status === 'Completed' && selectedBooking.examinationResult ? (
                  // Show prescription and clinical results
                  <div className="space-y-4 pt-3 border-t border-gray-100">
                    <div className="p-3.5 bg-emerald-50/50 border border-emerald-100 rounded-2xl text-xs space-y-2 text-slate-750">
                      <div className="flex items-center gap-1 text-emerald-800 font-bold">
                        <Stethoscope size={14} />
                        <span>KẾT LUẬN LÂM SÀNG BÁC SĨ</span>
                      </div>
                      <p><strong>Triệu chứng:</strong> {selectedBooking.examinationResult.symptoms}</p>
                      <p><strong>Chẩn đoán:</strong> <span className="text-emerald-700 font-extrabold">{selectedBooking.examinationResult.diagnosis}</span></p>
                      {selectedBooking.examinationResult.doctorNote && (
                        <p className="p-2 bg-white rounded-lg border border-slate-100 text-slate-500 italic">
                          "Dặn dò: {selectedBooking.examinationResult.doctorNote}"
                        </p>
                      )}
                    </div>

                    {/* Prescription details */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs font-bold text-gray-800">
                        <span>ĐƠN THUỐC ĐIỆN TỬ</span>
                        <span className="text-[10px] text-gray-400">Xuất trực tiếp từ kho thuốc</span>
                      </div>

                      {selectedBooking.examinationResult.medicines && selectedBooking.examinationResult.medicines.length > 0 ? (
                        <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
                          {selectedBooking.examinationResult.medicines.map((m, idx) => (
                            <div key={idx} className="p-3 bg-slate-50 border border-slate-150 rounded-xl space-y-1">
                              <div className="flex justify-between items-center text-xs">
                                <strong className="text-gray-800 font-bold block">{idx + 1}. {m.name}</strong>
                                <span className="font-mono text-gray-500">SL: <strong className="text-indigo-600 font-extrabold">{m.quantity}</strong> viên</span>
                              </div>
                              <div className="text-[10px] text-gray-500 flex justify-between gap-2">
                                <span>Liều lượng: <strong>{m.dosage}</strong></span>
                                <span className="bg-indigo-50 text-indigo-700 px-1 rounded font-medium shrink-0">{m.instruction}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-[11px] text-gray-400 italic">Không kê toa thuốc tây hoặc đã hoàn thành khám cơ bản.</p>
                      )}
                    </div>

                    {/* Instructions for drug use */}
                    <div className="p-3 bg-blue-50/50 border border-blue-150 rounded-2xl text-[10px] leading-relaxed text-blue-800 flex gap-2">
                      <AlertCircle size={15} className="text-blue-600 shrink-0 mt-0.5" />
                      <div>
                        <strong>Hướng dẫn sử dụng thuốc an toàn:</strong> Sử dụng đúng liều và thời gian quy định phía trên. Không tự ý tăng giảm liều hoặc bỏ dở thuốc kháng sinh khi chưa hết hạn điều trị.
                      </div>
                    </div>

                    {/* Print ticket view */}
                    <button
                      onClick={() => window.print()}
                      className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-250 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Printer size={13} />
                      <span>In Đơn Đính Kèm</span>
                    </button>
                  </div>
                ) : (
                  // Show ticket and calendar scheduling details
                  <div className="space-y-4 pt-3 border-t border-gray-100 text-xs">
                    <div className="p-3 px-4 bg-teal-50/40 border border-teal-100 rounded-2xl space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Trạng thái phiếu:</span>
                        <span className="font-semibold text-teal-800">{selectedBooking.status === 'Checked-In' ? 'Bệnh nhân đã Check-in' : 'Lịch hẹn trực tuyến'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400 font-sans">Thời gian hẹn:</span>
                        <span className="font-bold text-gray-800">{selectedBooking.appointmentTime} - {selectedBooking.appointmentDate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Khoa khám bệnh:</span>
                        <span className="font-semibold text-teal-700">{selectedBooking.departmentName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Bác sĩ thăm khám:</span>
                        <span className="font-medium text-gray-800">{selectedBooking.doctorName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400 font-mono">ID Đặt lịch:</span>
                        <span className="font-mono font-medium text-gray-500">{selectedBooking.id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Tiền khám:</span>
                        <span className="font-mono font-bold text-indigo-600">{formatPrice(selectedBooking.paymentAmount)}</span>
                      </div>
                    </div>

                    {/* QR and Barcode checkin card info */}
                    <div className="border border-dashed border-gray-200 rounded-2xl p-4 text-center space-y-2 bg-slate-50/60">
                      <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Mã Quét Tiếp Đón</span>
                      <div className="flex justify-center py-2">
                        <QrCode size={90} className="text-slate-800 bg-white p-2 rounded-xl border border-slate-100 shadow-sm" />
                      </div>
                      <p className="text-[10px] text-gray-400">
                        Xuất trình mã này tại quầy tiếp đón số 01 của lễ tân để thực hiện Check-In & in số thứ tự trực tiếp.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 border border-dashed border-slate-200 rounded-3xl p-12 text-center text-gray-400 space-y-3">
              <Search className="mx-auto text-slate-300" size={32} />
              <p className="text-xs max-w-xs mx-auto">
                Chọn một lịch hẹn của bạn bên danh sách để xem hồ sơ kết luận lâm sàng, đơn thuốc tây chi tiết hoặc theo dõi hướng dẫn tiếp đón.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ONLINE PAYMENT MODAL (GATEWAY MOCK-SIMULATION) */}
      {showPayModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white w-full max-w-md rounded-2xl overflow-hidden shadow-2xl border border-slate-100 text-left p-6 space-y-4"
          >
            {paySuccessMsg ? (
              <div className="py-8 text-center space-y-3">
                <CheckCircle2 size={40} className="text-emerald-500 mx-auto animate-bounce" />
                <h4 className="font-bold text-sm text-gray-800">{paySuccessMsg}</h4>
                <p className="text-xs text-gray-400">Viện phí đã được ghi nhận trên hệ thống và chuyển phòng khám.</p>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                  <h4 className="font-extrabold text-sm text-gray-800 flex items-center gap-1.5">
                    <CreditCard size={16} className="text-teal-600" />
                    <span>Thanh Toán Viện Phí Trực Tuyến</span>
                  </h4>
                  <button onClick={() => setShowPayModal(null)} className="text-gray-400 text-xs hover:text-gray-600">Đóng</button>
                </div>

                <div className="bg-teal-50/50 p-4 rounded-xl space-y-1.5 text-xs text-teal-800">
                  <p><strong>Mã phiếu:</strong> {showPayModal.id}</p>
                  <p><strong>Bệnh nhân:</strong> {showPayModal.patientName}</p>
                  <p><strong>Dịch vụ:</strong> Khám {showPayModal.departmentName}</p>
                  <p><strong>Số tiền cần đóng:</strong> <strong className="text-indigo-600 font-extrabold text-sm">{formatPrice(showPayModal.paymentAmount || 120000)}</strong></p>
                </div>

                <form onSubmit={handleOnlinePaySubmit} className="space-y-4 text-xs font-sans text-left">
                  {/* Select Payment gateway method */}
                  <div className="space-y-2">
                    <label className="font-black text-gray-700 block text-xs">Phương thức thanh toán</label>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { key: 'Chuyển khoản', label: 'QR Chuyển khoản', sub: 'Miễn phí, an toàn' },
                        { key: 'Ví điện tử', label: 'Ví điện tử', sub: 'Momo, ZaloPay...' }
                      ].map((m) => (
                        <button
                          key={m.key}
                          type="button"
                          onClick={() => setPayMethod(m.key as any)}
                          className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                            payMethod === m.key ? 'border-teal-500 bg-teal-50/20 text-teal-800' : 'border-slate-150 hover:bg-slate-50 text-gray-650'
                          }`}
                        >
                          <strong className="block text-[11px] font-bold">{m.label}</strong>
                          <span className="text-[9px] text-gray-400 block mt-0.5">{m.sub}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* QR Image Representation */}
                  <div className="flex flex-col items-center justify-center p-4 bg-slate-50 border border-slate-150 rounded-xl space-y-2">
                    {payMethod === 'Chuyển khoản' ? (
                      <>
                        <QrCode size={130} className="text-slate-800 bg-white p-3 rounded-xl border border-slate-100" />
                        <div className="text-center font-sans">
                          <strong className="block text-[11px] text-gray-700">NGÂN HÀNG VIETINBANK - BV THUY NGUYEN</strong>
                          <span className="text-[9px] text-gray-400 font-mono block mt-0.5">Số tài khoản: 1018594235489</span>
                          <span className="text-[10px] text-teal-700 font-extrabold block mt-1">Nội dung chuyển: VP {showPayModal.id}</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="relative">
                          <QrCode size={130} className="text-pink-600 bg-white p-3 rounded-xl border border-pink-100" />
                          <span className="absolute bottom-1 right-1 bg-pink-600 text-white font-black text-[7px] px-1 rounded">MoMo</span>
                        </div>
                        <div className="text-center">
                          <strong className="block text-[10px] text-pink-700 font-black">QUÉT MÃ VÍ ĐIỆN TỬ MOMO</strong>
                          <p className="text-[9px] text-gray-400 mt-0.5">Hệ thống chuyển tự động đến cổng bảo mật MoMo Hospital Gateway</p>
                        </div>
                      </>
                    )}
                  </div>

                  <button
                    id="confirm-portal-payment-btn"
                    type="submit"
                    disabled={isProcessingPay}
                    className="w-full py-3 bg-gradient-to-r from-teal-600 to-emerald-600 text-white text-xs font-bold rounded-xl shadow-md cursor-pointer hover:opacity-90 flex justify-center items-center gap-1.5"
                  >
                    {isProcessingPay ? (
                      <>
                        <span className="animate-spin h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full block" />
                        <span>Đang xử lý kết nối, vui lòng chờ...</span>
                      </>
                    ) : (
                      <span>Tôi Đã Hoàn Tất Chuyển Khoản</span>
                    )}
                  </button>
                </form>
              </>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
}
