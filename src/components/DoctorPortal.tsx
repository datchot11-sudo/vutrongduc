/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Users,
  Stethoscope,
  FileCheck,
  Search,
  CheckCircle2,
  AlertTriangle,
  History,
  Trash2,
  Plus,
  BookOpen,
  Printer,
  ChevronRight,
  ClipboardList
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Booking, PrescriptionItem, Medicine } from '../types';

export default function DoctorPortal() {
  const { currentUser, bookings, medicines, recordExamination, departments } = useApp();
  const [activeExam, setActiveExam] = useState<Booking | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchTermHistory, setSearchTermHistory] = useState('');

  // Exam clinical record form
  const [symptoms, setSymptoms] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [note, setNote] = useState('');
  const [prescriptionItems, setPrescriptionItems] = useState<PrescriptionItem[]>([]);

  // Drug selection assist states
  const [selectedMedId, setSelectedMedId] = useState('');
  const [customMedName, setCustomMedName] = useState('');
  const [prescriptionMode, setPrescriptionMode] = useState<'select' | 'type'>('select');
  const [medQuantity, setMedQuantity] = useState(1);
  const [medDosage, setMedDosage] = useState('Ngày uống 2 lần, mỗi lần 1 viên sau ăn');
  const [medInstruction, setMedInstruction] = useState('Uống sau ăn no');
  const [warningMsg, setWarningMsg] = useState('');
  const [viewedRecord, setViewedRecord] = useState<Booking | null>(null);

  // Medicine filters for prescribing
  const [medFilterDept, setMedFilterDept] = useState('all');
  const [medFilterName, setMedFilterName] = useState('');
  const [medFilterType, setMedFilterType] = useState('');
  const [medFilterId, setMedFilterId] = useState('');

  const clearMedFilters = () => {
    setMedFilterDept('all');
    setMedFilterName('');
    setMedFilterType('');
    setMedFilterId('');
  };

  // 1. Patient Queues for this Doctor or specialty
  const queuePatients = bookings.filter(
    (b) => b.status === 'Checked-In' && b.doctorId === currentUser?.username
  );

  const pendingConfirmationPatients = bookings.filter(
    (b) => b.status === 'Confirmed' && b.doctorId === currentUser?.username
  );

  const completedPatients = bookings.filter(
    (b) => b.status === 'Completed' && b.doctorId === currentUser?.username
  );

  // 2. Filter medicines based on search term
  const filteredMeds = medicines.filter((m) =>
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 3. Simple patient historical lookups for study
  const historyResults = bookings.filter((b) => {
    if (!searchTermHistory.trim()) return false;
    return b.patientName.toLowerCase().includes(searchTermHistory.toLowerCase()) ||
           b.patientPhone.includes(searchTermHistory);
  });

  // 4. Advanced medicine filters for prescribing
  const filteredPrescriptionMeds = medicines.filter((m) => {
    if (medFilterName && !m.name.toLowerCase().includes(medFilterName.toLowerCase())) return false;
    if (medFilterType && !m.type.toLowerCase().includes(medFilterType.toLowerCase())) return false;
    if (medFilterId && !m.id.toLowerCase().includes(medFilterId.toLowerCase())) return false;
    if (medFilterDept !== 'all') {
      if (m.specialtyId !== medFilterDept) return false;
    }
    return true;
  });

  const handleStartExam = (b: Booking) => {
    setActiveExam(b);
    setSymptoms(b.reason || '');
    setDiagnosis('');
    setNote('');
    setPrescriptionItems([]);
    setWarningMsg('');
    setSelectedMedId('');
    setCustomMedName('');
    setPrescriptionMode('select');
    setMedQuantity(1);
  };

  const handleAddMedicineToPre = () => {
    setWarningMsg('');
    if (prescriptionMode === 'select') {
      if (!selectedMedId) return;
      const med = medicines.find((m) => m.id === selectedMedId);
      if (!med) return;

      // Check if quantity exceeds stock
      if (med.stock < medQuantity) {
        setWarningMsg(`Lỗi tồn kho: Thuốc "${med.name}" hiện chỉ còn [ ${med.stock} ] viên trong kho. Không thể kê ${medQuantity} viên!`);
        return;
      }

      // Check if medicine already existed in the prescription list
      const existsIdx = prescriptionItems.findIndex((itm) => itm.medicineId === selectedMedId);
      if (existsIdx > -1) {
        const existingItem = prescriptionItems[existsIdx];
        const newTotalQuantity = existingItem.quantity + medQuantity;
        if (med.stock < newTotalQuantity) {
          setWarningMsg(`Lỗi tổng gộp: Tổng số lượng thuốc "${med.name}" sau gộp là [ ${newTotalQuantity} ] viên, vượt quá tồn kho còn lại [ ${med.stock} ] viên.`);
          return;
        }
        const updated = [...prescriptionItems];
        updated[existsIdx].quantity = newTotalQuantity;
        setPrescriptionItems(updated);
      } else {
        const newItem: PrescriptionItem = {
          medicineId: med.id,
          name: med.name,
          quantity: medQuantity,
          dosage: medDosage,
          instruction: medInstruction,
        };
        setPrescriptionItems([...prescriptionItems, newItem]);
      }
    } else {
      // Manual typing mode
      if (!customMedName.trim()) {
        setWarningMsg('Lỗi điền thuốc: Vui lòng nhập rõ Tên thuốc tự kê!');
        return;
      }
      const customId = `custom-${Date.now()}`;
      const newItem: PrescriptionItem = {
        medicineId: customId,
        name: customMedName.trim(),
        quantity: medQuantity,
        dosage: medDosage,
        instruction: medInstruction,
      };
      setPrescriptionItems([...prescriptionItems, newItem]);
      setCustomMedName('');
    }

    // Reset temporary states
    setSelectedMedId('');
    setMedQuantity(1);
    setMedDosage('Ngày uống 2 lần, mỗi lần 1 viên sau ăn');
    setMedInstruction('Uống sau ăn no');
  };

  const handleRemoveMedicineFromPre = (mId: string) => {
    setPrescriptionItems(prescriptionItems.filter((itm) => itm.medicineId !== mId));
  };

  const handleSubmitExam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeExam) return;
    if (!diagnosis.trim()) {
      alert('Vui lòng điền Chẩn đoán bệnh trước khi lưu bệnh án!');
      return;
    }

    recordExamination(activeExam.id, symptoms.trim(), diagnosis.trim(), note.trim(), prescriptionItems);
    
    // Alert nicely
    alert(`Hoàn thành kê đơn & lưu hồ sơ bệnh án thành công cho bệnh nhân: ${activeExam.patientName}`);
    setActiveExam(null);
  };

  return (
    <div className="space-y-6 text-left select-none">
      {/* Welcome doctor layout */}
      <div className="bg-gradient-to-r from-blue-700 to-teal-700 p-6 md:p-8 rounded-3xl text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-[10px] font-extrabold uppercase bg-white/20 px-2.5 py-1 rounded-full text-white tracking-widest w-fit block">
            Cổng nghiệp vụ bác sĩ lâm sàng
          </span>
          <h2 className="text-xl md:text-2xl font-extrabold">Chào Bác sĩ, {currentUser?.fullName}!</h2>
          <p className="text-xs text-blue-100/90 leading-relaxed max-w-xl">
            Bác sĩ hãy theo dõi danh sách bệnh nhân hiển thị dưới hàng đợi khám để tiến hành chẩn đoán lâm sàng, ghi chép triệu chứng và hoàn thành phiếu kê đơn thuốc điện tử.
          </p>
        </div>
        <div className="bg-white/10 p-4.5 rounded-2.5xl flex shrink-0 border border-white/10 items-center justify-center text-center max-w-xs">
          <div className="text-center font-sans">
            <span className="text-[10px] uppercase font-bold text-teal-200 block">Số bệnh nhân đang đợi trực tiếp</span>
            <strong className="text-2xl font-black text-white mt-1 block">{queuePatients.length}</strong>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Queues and History */}
        <div className="lg:col-span-4 space-y-6">
          {/* Active Examination Queue */}
          <div className="bg-white p-6 rounded-3xl border border-gray-150 shadow-sm space-y-4">
            <h3 className="text-xs font-black text-gray-800 uppercase tracking-wider flex items-center gap-1.5">
              <Users size={16} className="text-blue-500 animate-pulse" />
              <span>Hàng đợi khám trực tiếp ({queuePatients.length})</span>
            </h3>

            {queuePatients.length === 0 ? (
              <div className="py-10 text-center text-gray-400 text-xs">
                Chưa có bệnh nhân nào được Lễ Tân làm thủ tục check-in xếp hàng trong phòng khám của bạn.
              </div>
            ) : (
              <div className="space-y-3">
                {queuePatients.map((p) => {
                  const isActive = activeExam?.id === p.id;
                  return (
                    <div
                      key={p.id}
                      className={`p-4 border rounded-2xl transition-all text-left ${
                        isActive
                          ? 'border-blue-500 bg-blue-50/20'
                          : 'border-slate-150 hover:border-slate-350 bg-slate-50/30'
                      }`}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-mono text-[9px] bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded font-black">
                          STT: {p.queueNumber}
                        </span>
                        <span className="text-[10px] text-gray-400 font-mono">{p.appointmentTime}</span>
                      </div>
                      <h4 className="text-xs font-extrabold text-slate-800 leading-tight block">{p.patientName}</h4>
                      <p className="text-[10px] text-gray-500 mt-1 line-clamp-2">Lý do: "{p.reason}"</p>
                      
                      {!isActive && (
                        <button
                          onClick={() => handleStartExam(p)}
                          className="mt-3.5 w-full py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-[10px] cursor-pointer"
                        >
                          Bắt đầu khám bệnh →
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Historical records search */}
          <div className="bg-white p-6 rounded-3xl border border-gray-150 shadow-sm space-y-4">
            <h3 className="text-xs font-black text-gray-800 uppercase tracking-wider flex items-center gap-1.5">
              <History size={16} className="text-slate-500" />
              <span>Tra cứu hồ sơ bệnh án cũ</span>
            </h3>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -y-1/2 -translate-y-1/2 text-gray-400" size={14} />
              <input
                type="text"
                placeholder="Nhập tên sđt của bệnh nhân..."
                value={searchTermHistory}
                onChange={(e) => setSearchTermHistory(e.target.value)}
                className="w-full pl-8.5 pr-4 py-2 border border-gray-200 rounded-xl text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {searchTermHistory.trim() && (
              <div className="space-y-2 mt-2 max-h-[180px] overflow-y-auto">
                {historyResults.length === 0 ? (
                  <p className="text-[10px] text-gray-400 italic text-center py-2">Không tìm thấy bệnh nhân phù hợp</p>
                ) : (
                  historyResults.map((hs) => (
                    <div key={hs.id} className="p-2 border border-slate-100 rounded-lg text-[11px] bg-slate-50/40 flex justify-between items-center gap-2">
                      <div className="space-y-0.5">
                        <p className="font-bold text-gray-800">{hs.patientName} ({hs.dob})</p>
                        <p className="text-teal-700">Chẩn đoán: {hs.examinationResult?.diagnosis || 'Chưa khám hoàn thành'}</p>
                        <p className="text-[10px] text-gray-400">Khám ngày: {hs.appointmentDate}</p>
                      </div>
                      {hs.status === 'Completed' && (
                        <button
                          type="button"
                          onClick={() => setViewedRecord(hs)}
                          className="bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-750 font-bold p-1 px-1.5 rounded text-[10px] cursor-pointer shrink-0"
                        >
                          Xem BA
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Active Examination Form & Pedigree Prescription */}
        <div className="lg:col-span-8">
          {activeExam ? (
            <form onSubmit={handleSubmitExam} className="bg-white border border-gray-200 shadow-sm rounded-3xl p-6 md:p-8 space-y-6">
              <div className="flex justify-between items-center border-b border-gray-100 pb-3 flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 bg-blue-50 text-blue-700 rounded-lg">
                    <Stethoscope size={18} />
                  </span>
                  <div>
                    <h3 className="font-extrabold text-sm text-gray-800">Khám bệnh & Kê đơn thuốc</h3>
                    <p className="text-[11px] text-gray-400 mt-0.5">Bệnh nhân: <strong className="text-slate-700">{activeExam.patientName}</strong> ({activeExam.dob})</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm('Hành trình khám bệnh hiện tại chưa được lưu. Hủy bỏ phòng khám?')) {
                      setActiveExam(null);
                    }
                  }}
                  className="px-3 py-1 bg-red-50 text-red-600 font-bold text-[10px] rounded-lg cursor-pointer hover:bg-red-100"
                >
                  Hủy khám
                </button>
              </div>

              {/* Form Areas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs text-left">
                {/* Symptoms and Signs of patient */}
                <div className="space-y-1.5">
                  <label className="font-bold text-gray-700 block">Triệu chứng & Biểu hiện lâm sàng <span className="text-red-500">*</span></label>
                  <textarea
                    required
                    rows={3}
                    placeholder="VD: Bệnh nhân đau đầu thái dương trái liên tục, sốt cao 38.5 độ C..."
                    value={symptoms}
                    onChange={(e) => setSymptoms(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 focus:outline-none focus:border-blue-500 rounded-xl bg-slate-50/20"
                  />
                </div>

                {/* Final Diagnostic conclusions */}
                <div className="space-y-1.5">
                  <label className="font-bold text-gray-700 block">Chẩn đoán tóm tắt / Bệnh lý chính <span className="text-red-500">*</span></label>
                  <textarea
                    required
                    rows={3}
                    placeholder="VD: Sốt xuất huyết Dengue ngày thứ 3, cơ địa mệt mỏi nhẹ..."
                    value={diagnosis}
                    onChange={(e) => setDiagnosis(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 focus:outline-none focus:border-blue-500 rounded-xl bg-slate-50/20"
                  />
                </div>
              </div>

              <div className="space-y-1.5 text-left text-xs">
                <label className="font-bold text-gray-700 block">Lời dặn bổ sung của Bác sĩ</label>
                <input
                  type="text"
                  placeholder="VD: Ăn cháo ấm, uống nhiều Oresol bù nước điện giải. Tái khám sau 3 ngày lâm sàng."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 focus:outline-none focus:border-blue-500 rounded-xl bg-slate-50/20"
                />
              </div>

               {/* DRUG PRESCRIPTION COMPONENT (CORE COMPLIANT WITH PAGE 48, 52) */}
              <div className="pt-4 border-t border-gray-150 space-y-4">
                <div className="bg-slate-50/80 p-4.5 rounded-2xl border border-slate-150 space-y-4 text-left">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-blue-800 uppercase tracking-widest">
                      KÊ ĐƠN THUỐC ĐIỆN TỬ
                    </span>
                    <span className="text-[10px] text-gray-400">Kiểm tra tồn kho tự động</span>
                  </div>

                  {/* Mode Selector Tabs */}
                  <div className="flex gap-2 p-1 bg-gray-200/60 rounded-xl max-w-md">
                    <button
                      type="button"
                      onClick={() => {
                        setPrescriptionMode('select');
                        setWarningMsg('');
                      }}
                      className={`flex-1 py-1.5 text-center text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
                        prescriptionMode === 'select'
                          ? 'bg-white text-blue-800 shadow-sm'
                          : 'text-gray-500 hover:text-gray-800'
                      }`}
                    >
                      🏥 Thuốc trong danh mục kho
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setPrescriptionMode('type');
                        setWarningMsg('');
                      }}
                      className={`flex-1 py-1.5 text-center text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
                        prescriptionMode === 'type'
                          ? 'bg-white text-teal-850 shadow-sm'
                          : 'text-gray-500 hover:text-gray-800'
                      }`}
                    >
                      ✍️ Tự gõ tên thuốc ngoài kho
                    </button>
                  </div>

                  {warningMsg && (
                    <div className="p-3 bg-amber-50 text-amber-700 rounded-xl border border-amber-100 font-bold text-[11px] flex gap-2">
                      <AlertTriangle size={16} className="shrink-0" />
                      <span>{warningMsg}</span>
                    </div>
                  )}

                  {prescriptionMode === 'select' && (
                    <div className="p-3 bg-slate-50 border border-slate-200/60 rounded-xl space-y-2 text-xs">
                      <span className="text-[10px] uppercase font-bold text-slate-500 block">🔍 Bộ lọc tìm kiếm thuốc nhanh (Tìm theo Khoa, Tên, Loại, Mã thuốc)</span>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        <div>
                          <label className="text-[10px] text-gray-400 block font-bold mb-0.5">Tìm mã thuốc</label>
                          <input
                            type="text"
                            placeholder="VD: MED-001"
                            value={medFilterId}
                            onChange={(e) => setMedFilterId(e.target.value)}
                            className="w-full px-2 py-1 border border-gray-200 bg-white rounded-lg text-[11px]"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-gray-400 block font-bold mb-0.5">Tìm tên thuốc</label>
                          <input
                            type="text"
                            placeholder="VD: Paracetamol"
                            value={medFilterName}
                            onChange={(e) => setMedFilterName(e.target.value)}
                            className="w-full px-2 py-1 border border-gray-200 bg-white rounded-lg text-[11px]"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-gray-400 block font-bold mb-0.5">Tìm loại thuốc</label>
                          <input
                            type="text"
                            placeholder="VD: Kháng sinh, hạ sốt"
                            value={medFilterType}
                            onChange={(e) => setMedFilterType(e.target.value)}
                            className="w-full px-2 py-1 border border-gray-200 bg-white rounded-lg text-[11px]"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-gray-400 block font-bold mb-0.5">Khoa chuyên trị</label>
                          <select
                            value={medFilterDept}
                            onChange={(e) => setMedFilterDept(e.target.value)}
                            className="w-full px-2 py-1 border border-gray-200 bg-white rounded-lg text-[11px]"
                          >
                            <option value="all">-- Tất cả khoa --</option>
                            {departments.map((d) => (
                              <option key={d.id} value={d.id}>{d.name}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={clearMedFilters}
                          className="text-[10px] font-bold text-red-500 hover:underline cursor-pointer"
                        >
                          Xóa các bộ lọc
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Drug search list box selection or custom name typing */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 text-xs">
                    <div className="space-y-1.5">
                      <label className="font-bold text-gray-650 block">
                        {prescriptionMode === 'select' ? 'Tên biệt dược / Hoạt chất' : 'Tự nhập tên thuốc biệt dược/hoạt chất'}
                      </label>
                      {prescriptionMode === 'select' ? (
                        <select
                          value={selectedMedId}
                          onChange={(e) => {
                            setSelectedMedId(e.target.value);
                            setWarningMsg('');
                            setMedQuantity(1);
                            const chosen = medicines.find(m => m.id === e.target.value);
                            if (chosen) {
                              setMedDosage(chosen.usage);
                            }
                          }}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white"
                        >
                          <option value="">-- Chọn thuốc trong danh mục ({filteredPrescriptionMeds.length}) --</option>
                          {filteredPrescriptionMeds.map((m) => (
                            <option key={m.id} value={m.id}>
                              {m.id} - {m.name} [Tồn: {m.stock} {m.unit}] - {m.price.toLocaleString('vi-VN')}đ
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type="text"
                          required
                          placeholder="VD: Paracetamol 500mg, Augmentin..."
                          value={customMedName}
                          onChange={(e) => {
                            setCustomMedName(e.target.value);
                            setWarningMsg('');
                          }}
                          className="w-full px-3 py-2 border border-teal-300 rounded-lg bg-white focus:ring-1 focus:ring-teal-500 min-h-9"
                        />
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-bold text-gray-650 block">Số lượng kê (Viên/Chai/Hộp)</label>
                      <input
                        type="number"
                        min={1}
                        value={medQuantity}
                        onChange={(e) => setMedQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-full px-3 py-1.5 border border-gray-200 rounded-lg min-h-9"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-bold text-gray-650 block">Cách dùng của thuốc</label>
                      <select
                        value={medInstruction}
                        onChange={(e) => setMedInstruction(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white"
                      >
                        <option value="Uống sau ăn no">Uống sau ăn no</option>
                        <option value="Uống trước ăn 30 phút">Uống trước ăn 30 phút</option>
                        <option value="Uống trước khi đi ngủ">Uống trước khi đi ngủ</option>
                        <option value="Hòa nước sủi uống">Hòa nước sủi uống</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs text-left">
                    <label className="font-bold text-gray-650 block">Cách phân bổ liều dùng chi tiết</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="VD: Sáng uống 1 viên, tối uống 1 viên sau khi ăn no"
                        value={medDosage}
                        onChange={(e) => setMedDosage(e.target.value)}
                        className="w-full px-3 py-1.5 border border-gray-200 rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={handleAddMedicineToPre}
                        className={`font-bold px-4 rounded-lg flex items-center gap-1 shrink-0 text-xs cursor-pointer text-white transition-colors ${
                          prescriptionMode === 'select'
                            ? 'bg-blue-600 hover:bg-blue-700'
                            : 'bg-teal-600 hover:bg-teal-700'
                        }`}
                      >
                        <Plus size={14} />
                        <span>Thêm</span>
                      </button>
                    </div>
                  </div>

                  {/* Added Medicines Table list representation */}
                  <div className="space-y-2 mt-4">
                    <span className="text-[10px] font-bold text-gray-400 block uppercase">Danh sách thuốc kê trên đơn ({prescriptionItems.length})</span>
                    {prescriptionItems.length === 0 ? (
                      <p className="text-[11px] text-gray-400 italic py-2 text-center">Chưa có loại thuốc nào được kê cho bệnh nhân.</p>
                    ) : (
                      <div className="border border-slate-150 rounded-xl overflow-hidden text-xs">
                        <table className="w-full text-left font-sans">
                          <thead className="bg-slate-100 text-slate-700 text-[10px] font-extrabold uppercase">
                            <tr>
                              <th className="p-3">#</th>
                              <th>Tên Thuốc</th>
                              <th>Số lượng</th>
                              <th>Liều dùng & Hướng dẫn</th>
                              <th className="p-3 text-center">Xóa</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 bg-white">
                            {prescriptionItems.map((itm, idx) => (
                              <tr key={itm.medicineId} className="hover:bg-slate-50">
                                <td className="p-3 text-gray-400 font-mono">{idx + 1}</td>
                                <td className="font-bold text-slate-800">{itm.name}</td>
                                <td className="font-mono text-indigo-600 font-black">{itm.quantity}</td>
                                <td>
                                  <span className="block text-[11px] text-gray-700">{itm.dosage}</span>
                                  <span className="text-[9px] bg-slate-100 text-slate-700 px-1 rounded font-medium inline-block mt-0.5">{itm.instruction}</span>
                                </td>
                                <td className="p-3 text-center">
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveMedicineFromPre(itm.medicineId)}
                                    className="text-gray-400 hover:text-red-500 p-1 rounded-lg"
                                  >
                                    <Trash2 size={13} />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Submit panel */}
              <div className="pt-4 border-t border-gray-150 flex justify-end gap-3">
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 text-white font-extrabold text-xs rounded-xl shadow-md cursor-pointer flex items-center gap-1.5 transition-all"
                >
                  <FileCheck size={16} />
                  <span>Xác nhận & Lưu hồ sơ kê đơn</span>
                </button>
              </div>
            </form>
          ) : (
            <div className="bg-slate-50 border border-dashed border-slate-200 rounded-3xl p-12 text-center text-gray-400 space-y-4">
              <Stethoscope className="mx-auto text-slate-300 animate-bounce" size={40} />
              <p className="text-xs max-w-sm mx-auto">
                Chọn một bệnh nhân đang chờ trực tiếp ở hàng đợi bên trái để khởi tạo hồ sơ khám bệnh, chuẩn đoán bệnh lý và kê đơn thuốc điện tử.
              </p>
            </div>
          )}
        </div>
      </div>

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
                <span>📄 CHI TIẾT HỒ SƠ BỆNH ÁN CŨ (BÁC SĨ TRA CỨU)</span>
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
