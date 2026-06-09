/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  ClipboardCheck,
  Search,
  Check,
  X,
  Printer,
  FileCheck,
  DollarSign,
  AlertCircle,
  BadgeAlert,
  UserCheck,
  CreditCard,
  CheckCircle2,
  Calendar,
  Layers,
  ChevronRight,
  Info
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Booking } from '../types';

export default function ReceptionistPortal() {
  const { bookings, updateBookingStatus, checkInPatient, confirmPayment, paymentQrCode } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveExamTab] = useState<'all' | 'pending' | 'confirmed' | 'checked-in' | 'completed' | 'history_records'>('all');
  const [printingTicket, setPrintingTicket] = useState<Booking | null>(null);
  const [collectingPayment, setCollectingPayment] = useState<Booking | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'Tiền mặt' | 'Chuyển khoản'>('Tiền mặt');
  const [customAmount, setCustomAmount] = useState(120000);
  const [viewedRecord, setViewedRecord] = useState<Booking | null>(null);

  // Filter based on active filter tabs
  const filteredBookings = bookings.filter((b) => {
    // Tab filter
    if (activeTab === 'pending' && b.status !== 'Pending') return false;
    if (activeTab === 'confirmed' && b.status !== 'Confirmed') return false;
    if (activeTab === 'checked-in' && b.status !== 'Checked-In') return false;
    if (activeTab === 'completed' && b.status !== 'Completed') return false;
    if (activeTab === 'history_records' && b.status !== 'Completed') return false;

    // Search filter
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      b.patientName.toLowerCase().includes(term) ||
      b.patientPhone.includes(term) ||
      b.id.toLowerCase().includes(term)
    );
  });

  const getStatusBadge = (status: Booking['status']) => {
    switch (status) {
      case 'Pending':
        return <span className="px-2.5 py-1 rounded-full text-[10px] bg-amber-50 text-amber-700 font-bold border border-amber-250/20">Chờ Lễ Tân duyệt</span>;
      case 'Confirmed':
        return <span className="px-2.5 py-1 rounded-full text-[10px] bg-indigo-50 text-indigo-700 font-bold border border-indigo-250/20">Hẹn đã xác nhận</span>;
      case 'Checked-In':
        return <span className="px-2.5 py-1 rounded-full text-[10px] bg-sky-50 text-sky-700 font-bold border border-sky-250/20">Đã Check-In vào phòng</span>;
      case 'Completed':
        return <span className="px-2.5 py-1 rounded-full text-[10px] bg-emerald-50 text-emerald-700 font-bold border border-emerald-250/20">Khám hoàn thành</span>;
      case 'Cancelled':
        return <span className="px-2.5 py-1 rounded-full text-[10px] bg-red-50 text-red-700 font-bold border border-red-250/20 font-black">Hủy khám</span>;
      default:
        return null;
    }
  };

  const handleApprove = (id: string) => {
    updateBookingStatus(id, 'Confirmed');
    alert(`Đã duyệt & xác nhận cuộc hẹn khám thành công cho mã liên lạc: ${id}`);
  };

  const handleCancelApppointment = (id: string) => {
    if (window.confirm('Bạn có thực sự muốn hủy lịch khám này?')) {
      updateBookingStatus(id, 'Cancelled');
    }
  };

  const handleCheckInAndIssueTicket = (b: Booking) => {
    const updated = checkInPatient(b.id);
    setPrintingTicket(updated);
  };

  const handleCollectMoney = (e: React.FormEvent) => {
    e.preventDefault();
    if (!collectingPayment) return;
    confirmPayment(collectingPayment.id, paymentMethod, customAmount);
    alert(`Đã thu nộp viện phí thành công và in biên lai hạch toán tại quầy: ${collectingPayment.patientName}`);
    setCollectingPayment(null);
  };

  const formatPrice = (num?: number) => {
    if (!num) return '120.000 đ';
    return num.toLocaleString('vi-VN') + ' đ';
  };

  return (
    <div className="space-y-6 text-left select-none">
      {/* Front header block decor */}
      <div className="bg-gradient-to-r from-indigo-700 to-teal-700 p-6 md:p-8 rounded-3xl text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-[10px] font-extrabold uppercase bg-white/20 px-2.5 py-1 rounded-full text-white tracking-widest w-fit block">
            Ủy Thác Lễ Tân - Tiếp đón & Thu phí viện
          </span>
          <h2 className="text-xl md:text-2xl font-extrabold">Chào Lễ tân, {useApp().currentUser?.fullName}!</h2>
          <p className="text-xs text-indigo-100/90 leading-relaxed max-w-xl">
            Hãy thực hiện kiểm soát xếp lịch của người khám, tiếp đón Check-In bệnh nhân tại chỗ để sinh số thứ tự và thu viện phí lâm sàng, hạch toán hóa đơn biên lai minh bạch.
          </p>
        </div>
        <div className="bg-white/10 p-4.5 rounded-2.5xl flex shrink-0 border border-white/10 items-center justify-center text-center">
          <div className="text-center font-sans text-white">
            <span className="text-[10px] uppercase font-bold text-teal-200 block">Lệnh yêu cầu tiếp đón cần duyệt</span>
            <strong className="text-2.5xl font-black mt-1 block">
              {bookings.filter((b) => b.status === 'Pending').length} phiếu
            </strong>
          </div>
        </div>
      </div>

      {/* Main search and tabs container */}
      <div className="bg-white p-6 rounded-3xl border border-gray-150 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-3.5 top-1/2 -y-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Tìm bệnh nhân bằng tên, số điện thoại, mã phiếu..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none focus:border-indigo-500 bg-slate-50/20"
            />
          </div>

          {/* Quick tab filter selectors */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 select-none">
            {[
              { id: 'all', label: 'Tất cả' },
              { id: 'pending', label: 'Chờ duyệt' },
              { id: 'confirmed', label: 'Hẹn đã duyệt' },
              { id: 'checked-in', label: 'Đã Check-In' },
              { id: 'completed', label: 'Hoàn thành' },
              { id: 'history_records', label: '🔍 Tra cứu Bệnh án cũ' },
            ].map((t) => (
              <button
                key={t.id}
                id={`tab-receptionist-${t.id}`}
                onClick={() => setActiveExamTab(t.id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold shrink-0 transition-all cursor-pointer ${
                  activeTab === t.id
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-50'
                    : 'bg-slate-50 border border-slate-150 hover:bg-slate-100 text-slate-600'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Patients Booking Data Grid */}
        <div className="border border-slate-150 rounded-2xl overflow-hidden overflow-x-auto">
          <table className="w-full text-left font-sans text-xs">
            <thead className="bg-slate-100 text-slate-700 text-[10px] font-extrabold uppercase select-none">
              <tr>
                <th className="p-4">Mã Phiếu</th>
                <th>Bệnh Nhân</th>
                <th>Thông tin hẹn</th>
                <th>Tiền khám & Viện Phí</th>
                <th>Trạng Thái</th>
                <th className="p-4 text-center">Nghiệp Vụ Lễ Tân</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-gray-400 font-sans italic">
                    Không ghi nhận lịch khám bệnh hoặc phiếu yêu cầu tiếp đón tương ứng.
                  </td>
                </tr>
              ) : (
                filteredBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/50">
                    <td className="p-4 font-mono font-bold text-gray-500">{b.id}</td>
                    <td>
                      <div className="space-y-0.5">
                        <strong className="block text-gray-800 text-sm">{b.patientName}</strong>
                        <p className="font-mono text-gray-500 text-[10px]">SĐT: {b.patientPhone} | {b.gender} ({b.dob})</p>
                      </div>
                    </td>
                    <td>
                      <div className="space-y-0.5 max-w-[200px]">
                        <p className="text-indigo-700 font-bold block">{b.departmentName}</p>
                        <p className="font-mono text-[10px]">{b.appointmentTime} - {b.appointmentDate}</p>
                        <span className="text-[10px] text-gray-400 block line-clamp-1">{b.doctorName}</span>
                      </div>
                    </td>
                    <td>
                      <div className="space-y-1">
                        <strong className="block font-mono text-gray-800">{formatPrice(b.paymentAmount || 120000)}</strong>
                        {b.paymentStatus === 'Paid' ? (
                          <span className="text-[10px] text-emerald-600 bg-emerald-50 px-1 py-0.5 rounded font-black">
                            ✔ Thu nộp hoàn tất {b.paymentMethod && `(${b.paymentMethod})`}
                          </span>
                        ) : (
                          <span className="text-[10px] text-red-500 bg-red-50 px-1 py-0.5 rounded font-black animate-pulse">
                            ● Chưa nộp phí tại quầy
                          </span>
                        )}
                      </div>
                    </td>
                    <td>{getStatusBadge(b.status)}</td>
                    <td className="p-4 text-center">
                      <div className="flex justify-center items-center gap-1.5 flex-wrap">
                        {/* Process Accept for pending */}
                        {b.status === 'Pending' && (
                          <button
                            onClick={() => handleApprove(b.id)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold p-1 rounded hover:scale-105 transition-all text-[10px] px-2 cursor-pointer flex items-center gap-0.5"
                          >
                            <Check size={12} />
                            Duyệt
                          </button>
                        )}

                        {/* Process actual checked in STT issue */}
                        {b.status === 'Confirmed' && (
                          <button
                            onClick={() => handleCheckInAndIssueTicket(b)}
                            className="bg-sky-600 hover:bg-sky-700 text-white font-bold p-1 rounded hover:scale-105 transition-all text-[10px] px-2.5 cursor-pointer flex items-center gap-0.5"
                          >
                            <UserCheck size={12} />
                            Check-In (Cấp STT)
                          </button>
                        )}

                        {/* Support Collect Cash at Counter */}
                        {b.paymentStatus === 'Unpaid' && (
                          <button
                            onClick={() => {
                              setCustomAmount(b.paymentAmount || 120000);
                              setCollectingPayment(b);
                            }}
                            className="bg-amber-600 hover:bg-amber-700 text-white font-bold p-1 rounded text-[10px] px-2 cursor-pointer flex items-center gap-0.5"
                          >
                            <DollarSign size={12} />
                            Hạch toán viện phí
                          </button>
                        )}

                        {/* If checked in or completed, allow print ticket/receipt */}
                        {b.status === 'Checked-In' && (
                          <button
                            onClick={() => setPrintingTicket(b)}
                            className="border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold p-1 rounded text-[10px] px-2 cursor-pointer flex items-center gap-0.5"
                            title="In lại phiếu tiếp nhận"
                          >
                            <Printer size={12} />
                            In phiếu khám
                          </button>
                        )}

                        {b.status === 'Completed' && (
                          <button
                            onClick={() => setViewedRecord(b)}
                            className="bg-emerald-55 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 font-bold p-1.5 rounded-lg text-[10px] px-2.5 cursor-pointer flex items-center gap-0.5"
                          >
                            📋 Xem Bệnh án
                          </button>
                        )}

                        {/* Deny option for pending or confirm */}
                        {(b.status === 'Pending' || b.status === 'Confirmed') && (
                          <button
                            onClick={() => handleCancelApppointment(b.id)}
                            className="bg-red-50 text-red-650 hover:bg-red-100/50 p-1 rounded text-[10px] px-2 cursor-pointer"
                            title="Từ chối khám bệnh"
                          >
                            Hủy lịch
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* PRINT DIALOG / POPUP FOR MEDICAL TICKET (Sinh số STT) */}
      {printingTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white border-2 border-slate-200 w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl p-6 text-left space-y-4"
          >
            <div className="flex justify-between items-center border-b border-gray-100 pb-2.5">
              <span className="text-xs font-bold text-teal-700 uppercase tracking-widest bg-teal-50 px-2 py-0.5 rounded-full">
                PHIẾU KHÁM BỆNH BẢN CỨNG
              </span>
              <button
                onClick={() => setPrintingTicket(null)}
                className="text-gray-400 hover:text-gray-600 text-sm leading-none"
              >
                [x]
              </button>
            </div>

            {/* E-Ticket printout layout */}
            <div id="receptionist-printout" className="border border-slate-300 p-4.5 rounded-xl space-y-3 font-sans relative bg-yellow-50/5">
              <div className="text-center space-y-0.5 border-b border-dashed border-gray-200 pb-2">
                <h4 className="text-xs font-black uppercase text-gray-800">Sở Y Tế Hải Phòng</h4>
                <h3 className="text-sm font-black uppercase text-indigo-700 tracking-tight">BV ĐA KHOA THỦY NGUYÊN</h3>
                <span className="text-[9px] text-gray-400 block font-mono">Phiếu sinh: {new Date().toLocaleTimeString()}</span>
              </div>

              {/* Huge STT Number for queue display */}
              <div className="text-center py-4 bg-slate-50 border border-slate-100 rounded-xl space-y-1">
                <span className="text-[9px] text-gray-400 uppercase tracking-wider block">Số Thứ Tự Lâm Sàng</span>
                <strong className="text-3xl font-mono text-indigo-700 tracking-wider block">{printingTicket.queueNumber}</strong>
                <span className="text-[9px] text-indigo-600 font-extrabold uppercase block">{printingTicket.departmentName}</span>
              </div>

              <div className="space-y-1.5 text-slate-750 text-xs">
                <p><strong>Bệnh nhân:</strong> {printingTicket.patientName}</p>
                <p><strong>Ngày sinh:</strong> {printingTicket.dob} | Lớp: {printingTicket.gender}</p>
                <p><strong>SĐT:</strong> {printingTicket.patientPhone}</p>
                <p className="border-t border-dashed border-slate-200 pt-1.5 mt-1.5"><strong>Bác sĩ khám yêu cầu:</strong> {printingTicket.doctorName}</p>
              </div>

              <div className="text-center text-[10px] text-gray-400 mt-2.5 pt-2 border-t border-dashed border-gray-200">
                Chúc quý khách mau lành bệnh!
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => window.print()}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex justify-center items-center gap-1.5 shadow-md shadow-indigo-50 cursor-pointer"
              >
                <Printer size={13} />
                <span>In Phiếu Lâm Sàng</span>
              </button>
              <button
                onClick={() => setPrintingTicket(null)}
                className="px-4 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl text-xs font-bold"
              >
                Đóng
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* CASH PAYMENT INVOICE POPUP AT COUNTER (Thu viện phí tại quầy) */}
      {collectingPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white border w-full max-w-md rounded-2xl overflow-hidden p-6 text-left space-y-4"
          >
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <h4 className="font-extrabold text-sm text-gray-800 flex items-center gap-1.5">
                <CreditCard size={15} className="text-amber-600" />
                <span>Hạch Toán Nộp Phí Tại Quầy</span>
              </h4>
              <button onClick={() => setCollectingPayment(null)} className="text-gray-400 hover:text-gray-600 text-sm">[x]</button>
            </div>

            <form onSubmit={handleCollectMoney} className="space-y-4 text-xs">
              <div className="p-4 bg-slate-50 rounded-xl space-y-1.5">
                <p className="text-gray-400">Tên bệnh nhân: <strong className="text-gray-800 font-bold block text-sm mt-0.5">{collectingPayment.patientName}</strong></p>
                <p><strong>Điện thoại:</strong> {collectingPayment.patientPhone}</p>
                <p><strong>Mục khám:</strong> {collectingPayment.departmentName}</p>
                <p><strong>Mã đặt trước:</strong> {collectingPayment.id}</p>
              </div>

              <div className="space-y-1.5">
                <label className="font-extrabold text-gray-700 block text-xs">Hình thức đóng tiền thực tế</label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { key: 'Tiền mặt', label: 'Tiền mặt', sub: 'Thanh toán trực tiếp' },
                    { key: 'Chuyển khoản', label: 'Quẹt mã QR Pos', sub: 'Chuyển khoản liên ngân' }
                  ].map((m) => (
                    <button
                      key={m.key}
                      type="button"
                      onClick={() => setPaymentMethod(m.key as any)}
                      className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                        paymentMethod === m.key ? 'border-amber-500 bg-amber-50/20 text-amber-800' : 'border-slate-150 hover:bg-slate-50 text-gray-650'
                      }`}
                    >
                      <strong className="block text-[11px] font-bold">{m.label}</strong>
                      <span className="text-[9px] text-gray-400 block mt-0.5">{m.sub}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-extrabold text-gray-700 block text-xs">Số tiền viện phí hạch toán (vnđ)</label>
                <input
                  type="number"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(parseInt(e.target.value) || 120000)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs font-mono font-bold text-indigo-700"
                />
              </div>

              {paymentMethod === 'Chuyển khoản' && (
                <div className="p-3 bg-indigo-50/50 border border-indigo-100 rounded-xl space-y-2 text-center animate-fadeIn">
                  <span className="text-[10px] uppercase font-bold text-indigo-700 tracking-wide block">MÃ QR THANH TOÁN VIỆN PHÍ (ADMIN KHỞI TẠO)</span>
                  <div className="flex justify-center">
                    <img
                      src={paymentQrCode}
                      alt="Payment QR Code"
                      referrerPolicy="no-referrer"
                      className="w-40 h-40 object-cover border border-slate-200 rounded-lg shadow-sm bg-white"
                    />
                  </div>
                  <span className="text-[9px] text-slate-550 block">Bệnh nhân quét mã QR để chuyển khoản trực tiếp tổng số tiền: <strong className="text-indigo-600 font-bold">{customAmount.toLocaleString('vi-VN')} đ</strong></span>
                </div>
              )}

               <div className="bg-red-50 p-3 rounded-lg border border-red-100/50 text-[10px] text-red-800 flex gap-2">
                <Info size={14} className="shrink-0 text-red-650 mt-0.5" />
                <span>
                  <strong>Hạch toán trực tiếp:</strong> Cửa sổ này dùng để xác nhận người bệnh nộp tiền mặt/chuyển khoản tại quầy. Bấm nộp tiền sẽ lập tức cập nhật trạng thái đã thanh toán hoàn toàn.
                </span>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer flex justify-center items-center gap-1.5"
                >
                  <DollarSign size={14} />
                  <span>Xác Nhận Nộp Tiền & In Biên Lai</span>
                </button>
                <button
                  onClick={() => setCollectingPayment(null)}
                  type="button"
                  className="px-4 py-3 border border-slate-200 hover:bg-slate-50 text-slate-650 rounded-xl"
                >
                  Đóng
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* VIEW COMPLETED MEDICAL RECORD MODAL */}
      {viewedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white border w-full max-w-2xl rounded-2xl overflow-hidden p-6 text-left space-y-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center border-b border-gray-150 pb-3">
              <h4 className="font-extrabold text-sm text-gray-800 flex items-center gap-1.5 uppercase tracking-wide">
                <span>📄 CHI TIẾT HỒ SƠ BỆNH ÁN CŨ</span>
              </h4>
              <button onClick={() => setViewedRecord(null)} className="text-gray-400 hover:text-gray-600 text-sm font-black">[x]</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
              <div className="p-3.5 bg-slate-50 rounded-xl space-y-2">
                <h5 className="font-bold text-gray-800 uppercase tracking-wider text-[10px]">HÀNH CHÍNH & BỆNH NHÂN</h5>
                <p><strong>Bệnh nhân:</strong> <span className="text-sm font-extrabold text-indigo-700">{viewedRecord.patientName}</span></p>
                <p><strong>Ngày sinh:</strong> {viewedRecord.dob} | <strong>Giới tính:</strong> {viewedRecord.gender}</p>
                <p><strong>Điện thoại:</strong> {viewedRecord.patientPhone}</p>
                <p><strong>Số CCCD:</strong> {viewedRecord.cccd || 'Không ghi nhận'}</p>
                <p><strong>Mã bảo hiểm y tế:</strong> {viewedRecord.insuranceCode || 'Không có BHYT'}</p>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl space-y-2">
                <h5 className="font-bold text-gray-800 uppercase tracking-wider text-[10px]">LỊCH TRÌNH KHÁM</h5>
                <p><strong>Mã bệnh án:</strong> <span className="font-mono font-bold text-indigo-650">{viewedRecord.id}</span></p>
                <p><strong>Khoa điều trị:</strong> {viewedRecord.departmentName}</p>
                <p><strong>Bác sĩ thăm khám:</strong> {viewedRecord.doctorName}</p>
                <p><strong>Thời gian khám:</strong> {viewedRecord.appointmentTime} ngày {viewedRecord.appointmentDate}</p>
                <p><strong>Doanh thu viện phí:</strong> {viewedRecord.paymentAmount ? viewedRecord.paymentAmount.toLocaleString('vi-VN') + 'đ' : 'Miễn phí'} ({viewedRecord.paymentStatus === 'Paid' ? 'Đã thu tiền' : 'Chưa thu'})</p>
              </div>
            </div>

            {viewedRecord.examinationResult && (
              <div className="space-y-3.5 pt-2 text-xs">
                <div className="p-4 border border-indigo-100 bg-indigo-50/10 rounded-xl space-y-2 text-left">
                  <h5 className="font-black text-indigo-800 uppercase tracking-widest text-[10px]">KẾT QUẢ CHẨN ĐOÁN LÂM SÀNG</h5>
                  <p className="leading-relaxed"><strong>Triệu chứng lâm sàng:</strong> {viewedRecord.examinationResult.symptoms}</p>
                  <p className="leading-relaxed"><strong className="text-teal-700">Chẩn đoán bệnh lý chính:</strong> {viewedRecord.examinationResult.diagnosis}</p>
                  {viewedRecord.examinationResult.doctorNote && (
                    <p className="border-t border-slate-100 pt-2 text-[11px] text-gray-500 italic"><strong>Lời dặn của Bác sĩ:</strong> "{viewedRecord.examinationResult.doctorNote}"</p>
                  )}
                </div>

                <div className="space-y-2">
                  <h5 className="font-black text-gray-700 uppercase tracking-widest text-[10px]">💊 ĐƠN THUỐC ĐIỆN TỬ ĐÃ KÊ</h5>
                  {!viewedRecord.examinationResult.medicines || viewedRecord.examinationResult.medicines.length === 0 ? (
                    <p className="text-[11px] text-gray-400 italic">Bác sĩ không ra chỉ định kê đơn thuốc cho đợt khám này.</p>
                  ) : (
                    <div className="border border-slate-150 rounded-xl overflow-hidden font-sans">
                      <table className="w-full text-left font-sans text-xs">
                        <thead className="bg-slate-50 text-slate-700 text-[9px] font-bold uppercase select-none">
                          <tr className="border-b border-slate-150">
                            <th className="p-2">Tên Thuốc</th>
                            <th>Số lượng</th>
                            <th>Liều lượng & Cách dùng</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-white">
                          {viewedRecord.examinationResult.medicines.map((med, idx) => (
                            <tr key={idx} className="hover:bg-slate-50">
                              <td className="p-2 text-gray-800 font-bold">{med.name}</td>
                              <td className="font-mono text-indigo-600 font-bold">{med.quantity}</td>
                              <td>
                                <span className="block">{med.dosage}</span>
                                <span className="text-[10px] text-gray-400 font-medium">{med.instruction}</span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-gray-100 flex justify-end">
              <button
                onClick={() => setViewedRecord(null)}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold font-sans cursor-pointer animate-none"
              >
                Đóng hồ sơ bệnh án
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
