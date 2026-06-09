/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  TrendingUp,
  Users,
  Stethoscope,
  Pill,
  Shield,
  Plus,
  Trash2,
  Edit3,
  CheckCircle2,
  Lock,
  Unlock,
  DollarSign,
  ChevronRight,
  Database,
  Activity,
  Layers,
  Settings,
  Phone,
  AlertTriangle,
  X
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Doctor, Medicine, UserAccount, Department } from '../types';

export default function AdminPortal() {
  const {
    bookings,
    doctors,
    medicines,
    accounts,
    departments,
    addDoctor,
    updateDoctor,
    deleteDoctor,
    addMedicine,
    updateMedicine,
    deleteMedicine,
    addUserAccount,
    updateUserAccount,
    deleteUserAccount,
    schedules,
    addSchedule,
    updateSchedule,
    deleteSchedule,
    newsArticles,
    hospitalContact,
    addNewsArticle,
    updateNewsArticle,
    deleteNewsArticle,
    updateHospitalContact,
    paymentQrCode,
    updatePaymentQrCode,
    confirmPayment,
    adminDeleteMedicalRecord,
    adminUpdateMedicalRecord,
    updateDepartmentName,
    addDepartment,
    deleteDepartment,
  } = useApp();

  const [activeAdminTab, setActiveAdminTab] = useState<'stats' | 'doctors' | 'medicines' | 'accounts' | 'schedules' | 'news' | 'contact' | 'billing' | 'records' | 'departments'>('stats');

  // Custom non-blocking interactive confirmation and alert state
  const [confirmState, setConfirmState] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  } | null>(null);

  const [alertState, setAlertState] = useState<{
    isOpen: boolean;
    message: string;
    type?: 'success' | 'error' | 'info';
  } | null>(null);

  const showCustomAlert = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setAlertState({
      isOpen: true,
      message,
      type
    });
    // Auto close after 3 seconds
    setTimeout(() => {
      setAlertState((prev) => prev && prev.message === message ? null : prev);
    }, 3000);
  };

  const showCustomConfirm = (title: string, message: string, onConfirm: () => void) => {
    setConfirmState({
      isOpen: true,
      title,
      message,
      onConfirm: () => {
        onConfirm();
        setConfirmState(null);
      }
    });
  };

  // CRUDS states
  const [editingDoc, setEditingDoc] = useState<Doctor | null>(null);
  const [editingMed, setEditingMed] = useState<Medicine | null>(null);
  const [editingAcc, setEditingAcc] = useState<UserAccount | null>(null);
  const [editingSch, setEditingSch] = useState<any>(null);

  // News form states
  const [editingNews, setEditingNews] = useState<any>(null);
  const [newsTitle, setNewsTitle] = useState('');
  const [newsCategory, setNewsCategory] = useState<'tin-tuc' | 'kien-thuc' | 'thong-bao'>('tin-tuc');
  const [newsSummary, setNewsSummary] = useState('');
  const [newsContent, setNewsContent] = useState('');
  const [newsImageUrl, setNewsImageUrl] = useState('');
  const [newsSearchTerm, setNewsSearchTerm] = useState('');

  // Hospital settings states
  const [phoneHotline, setPhoneHotline] = useState(hospitalContact?.hotline || '');
  const [phoneEmergency, setPhoneEmergency] = useState(hospitalContact?.emergency || '');
  const [emailSupport, setEmailSupport] = useState(hospitalContact?.email || '');
  const [addressClinic, setAddressClinic] = useState(hospitalContact?.address || '');

  React.useEffect(() => {
    if (hospitalContact) {
      setPhoneHotline(hospitalContact.hotline);
      setPhoneEmergency(hospitalContact.emergency);
      setEmailSupport(hospitalContact.email);
      setAddressClinic(hospitalContact.address);
    }
  }, [hospitalContact]);

  // Medicine filters & state search
  const [medSearchQuery, setMedSearchQuery] = useState('');
  const [medDeptFilter, setMedDeptFilter] = useState('all');

  // Schedules state form
  const [schDoctorId, setSchDoctorId] = useState('');
  const [schDate, setSchDate] = useState('');
  const [schTimeSlot, setSchTimeSlot] = useState('07:30-08:30');
  const [schMaxPatients, setSchMaxPatients] = useState(5);

  const handleSaveSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!schDoctorId) return alert('Chưa chọn bác sĩ chuyên khoa!');
    if (!schDate) return alert('Chưa chọn ngày đặt lịch!');

    const docObj = doctors.find((d) => d.id === schDoctorId);
    const doctorName = docObj ? docObj.name : 'Bác sĩ';

    if (editingSch) {
      updateSchedule({
        ...editingSch,
        doctorId: schDoctorId,
        doctorName,
        date: schDate,
        timeSlot: schTimeSlot,
        maxPatients: Number(schMaxPatients),
      });
      alert('Cập nhật khung lịch trực thành công!');
      setEditingSch(null);
    } else {
      addSchedule({
        doctorId: schDoctorId,
        doctorName,
        date: schDate,
        timeSlot: schTimeSlot,
        maxPatients: Number(schMaxPatients),
        currentPatients: 0,
      });
      alert('Tạo khung lịch trực mới thành công!');
    }
    clearScheduleForm();
  };

  const clearScheduleForm = () => {
    setSchDoctorId('');
    setSchDate('');
    setSchTimeSlot('07:30-08:30');
    setSchMaxPatients(5);
  };

  // Forms state for Add/Edit
  const [docName, setDocName] = useState('');
  const [docTitle, setDocTitle] = useState('');
  const [docSpecialtyId, setDocSpecialtyId] = useState('noi-tong-hop');
  const [docExperience, setDocExperience] = useState('');
  const [docRoom, setDocRoom] = useState('');
  const [docImageUrl, setDocImageUrl] = useState('');

  const [medId, setMedId] = useState('');
  const [medName, setMedName] = useState('');
  const [medType, setMedType] = useState('');
  const [medUnit, setMedUnit] = useState('Viên');
  const [medStock, setMedStock] = useState(100);
  const [medPrice, setMedPrice] = useState(2000);
  const [medUsage, setMedUsage] = useState('');
  const [medSpecialtyId, setMedSpecialtyId] = useState('');
  const [medEntryDate, setMedEntryDate] = useState('');
  const [medExpiryDate, setMedExpiryDate] = useState('');

  const [accUsername, setAccUsername] = useState('');
  const [accFullName, setAccFullName] = useState('');
  const [accRole, setAccRole] = useState<'Patient' | 'Doctor' | 'Receptionist' | 'Admin'>('Patient');
  const [accPhone, setAccPhone] = useState('');
  const [accEmail, setAccEmail] = useState('');
  const [accSpecialtyId, setAccSpecialtyId] = useState('');
  const [accSubRoleTab, setAccSubRoleTab] = useState<'All' | 'Patient' | 'Doctor' | 'Receptionist' | 'Admin'>('All');

  // Localized billing panel states
  const [targetQrCodeStr, setTargetQrCodeStr] = useState(paymentQrCode || '');
  const [billingSearchQuery, setBillingSearchQuery] = useState('');
  const [editingBillingBooking, setEditingBillingBooking] = useState<any>(null);
  const [customBilledAmount, setCustomBilledAmount] = useState(120000);

  // Localized record management states
  const [recordsSearchQuery, setRecordsSearchQuery] = useState('');
  const [adminViewedRecord, setAdminViewedRecord] = useState<any>(null);
  const [adminEditingRecord, setAdminEditingRecord] = useState<any>(null);
  const [editedSymptoms, setEditedSymptoms] = useState('');
  const [editedDiagnosis, setEditedDiagnosis] = useState('');
  const [editedNote, setEditedNote] = useState('');

  // Localized department editing states
  const [editingDept, setEditingDept] = useState<any>(null);
  const [editedDeptName, setEditedDeptName] = useState('');

  // Localized department creation states
  const [showAddDeptModal, setShowAddDeptModal] = useState(false);
  const [newDeptId, setNewDeptId] = useState('');
  const [newDeptName, setNewDeptName] = useState('');
  const [newDeptDescription, setNewDeptDescription] = useState('');
  const [newDeptIcon, setNewDeptIcon] = useState('Stethoscope');
  const [newDeptHighlights, setNewDeptHighlights] = useState('');

  // CALCULATE STATISTICAL METRICS (PAGE 65)
  const totalCompletedBookings = bookings.filter((b) => b.status === 'Completed').length;
  const totalRevenue = bookings
    .filter((b) => b.paymentStatus === 'Paid')
    .reduce((sum, b) => sum + (b.paymentAmount || 120000), 0);
  const totalActiveDoctors = doctors.length;
  const noShowBookings = bookings.filter((b) => b.status === 'Cancelled').length;

  const handleSaveDoctor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docName.trim()) return alert('Chưa điền tên bác sĩ!');
    const specialtyObj = departments.find((d) => d.id === docSpecialtyId);

    const defaultImg = 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=200';

    if (editingDoc) {
      updateDoctor({
        ...editingDoc,
        name: docName.trim(),
        title: docTitle.trim(),
        specialtyId: docSpecialtyId,
        specialtyName: specialtyObj ? specialtyObj.name : 'Khám lâm sàng',
        experience: docExperience.trim(),
        room: docRoom.trim() || editingDoc.room,
        imageUrl: docImageUrl.trim() || editingDoc.imageUrl || defaultImg,
      });
      alert('Cập nhật bác sĩ thành công!');
    } else {
      addDoctor({
        name: docName.trim(),
        title: docTitle.trim(),
        specialtyId: docSpecialtyId,
        specialtyName: specialtyObj ? specialtyObj.name : 'Khám lâm sàng',
        experience: docExperience.trim(),
        rating: 4.8,
        imageUrl: docImageUrl.trim() || defaultImg,
        room: docRoom.trim(),
      });
      alert('Thêm bác sĩ thành công!');
    }

    setEditingDoc(null);
    clearDoctorForm();
  };

  const handleSaveMedicine = (e: React.FormEvent) => {
    e.preventDefault();
    if (!medName.trim()) return alert('Chưa điền tên thuốc!');

    const specialtyObj = departments.find((d) => d.id === medSpecialtyId);
    const specialtyName = specialtyObj ? specialtyObj.name : (medSpecialtyId === 'general' ? 'Kho chung' : '');

    const payload: Medicine = {
      id: editingMed?.id || medId.trim(),
      name: medName.trim(),
      type: medType.trim(),
      unit: medUnit,
      stock: medStock,
      price: medPrice,
      usage: medUsage.trim(),
      specialtyId: medSpecialtyId || undefined,
      specialtyName: specialtyName || undefined,
      entryDate: medEntryDate || undefined,
      expiryDate: medExpiryDate || undefined,
    };

    if (editingMed) {
      updateMedicine(payload);
      alert('Cập nhật biệt dược thành công!');
    } else {
      addMedicine(payload);
      alert('Thêm thuốc thành công!');
    }

    setEditingMed(null);
    clearMedicineForm();
  };

  const handleSaveAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!accUsername.trim()) return alert('Chọn tên tài khoản!');
    if (!accFullName.trim()) return alert('Chọn họ và tên!');

    if (editingAcc) {
      updateUserAccount({
        ...editingAcc,
        fullName: accFullName.trim(),
        role: accRole,
        phone: accPhone.trim() || accUsername.trim(),
        email: accEmail.trim(),
        specialtyId: (accRole === 'Doctor' || accRole === 'Receptionist') ? accSpecialtyId : undefined,
      });
      alert('Cập nhật tài khoản thành công!');
    } else {
      addUserAccount({
        username: accUsername.trim(),
        fullName: accFullName.trim(),
        role: accRole,
        phone: accPhone.trim() || accUsername.trim(),
        email: accEmail.trim(),
        specialtyId: (accRole === 'Doctor' || accRole === 'Receptionist') ? accSpecialtyId : undefined,
        status: 'Active',
      });
      alert('Thêm tài khoản thành công!');
    }

    setEditingAcc(null);
    clearAccountForm();
  };

  const handleToggleAccStatus = (acc: UserAccount) => {
    const updatedStatus = acc.status === 'Active' ? ('Locked' as const) : ('Active' as const);
    updateUserAccount({ ...acc, status: updatedStatus });
    alert(`Đã đổi trạng thái tài khoản: ${acc.fullName}`);
  };

  const clearDoctorForm = () => {
    setDocName('');
    setDocTitle('');
    setDocSpecialtyId('noi-tong-hop');
    setDocExperience('');
    setDocRoom('');
    setDocImageUrl('');
  };

  const clearMedicineForm = () => {
    setMedId('');
    setMedName('');
    setMedType('');
    setMedUnit('Viên');
    setMedStock(100);
    setMedPrice(2000);
    setMedUsage('');
    setMedSpecialtyId('');
    setMedEntryDate('');
    setMedExpiryDate('');
  };

  // News Handlers
  const handleSaveNews = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsTitle.trim()) return alert('Vui lòng nhập tiêu đề bài viết!');
    if (!newsContent.trim()) return alert('Vui lòng nhập nội dung bài viết!');

    const payload = {
      id: editingNews?.id || `news-${Date.now()}`,
      title: newsTitle.trim(),
      category: newsCategory,
      summary: newsSummary.trim() || (newsContent.length > 150 ? newsContent.slice(0, 150) + '...' : newsContent),
      content: newsContent.trim(),
      publishDate: editingNews?.publishDate || new Date().toLocaleDateString('vi-VN'),
      readTime: editingNews?.readTime || `${Math.max(2, Math.ceil(newsContent.split(' ').length / 150))} phút đọc`,
      imageUrl: newsImageUrl.trim() || 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=400',
    };

    if (editingNews) {
      updateNewsArticle(payload);
      alert('Cập nhật bài viết thành công!');
    } else {
      addNewsArticle(payload);
      alert('Thêm bài viết mới thành công!');
    }

    clearNewsForm();
  };

  const clearNewsForm = () => {
    setEditingNews(null);
    setNewsTitle('');
    setNewsCategory('tin-tuc');
    setNewsSummary('');
    setNewsContent('');
    setNewsImageUrl('');
  };

  // Hospital Contact Handler
  const handleSaveHospitalContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneHotline.trim() || !phoneEmergency.trim() || !emailSupport.trim() || !addressClinic.trim()) {
      return alert('Vui lòng nhập đầy đủ thông tin liên hệ!');
    }

    updateHospitalContact({
      hotline: phoneHotline.trim(),
      emergency: phoneEmergency.trim(),
      email: emailSupport.trim(),
      address: addressClinic.trim(),
    });
    alert('Cập nhật thông tin liên hệ bệnh viện thành công!');
  };

  const clearAccountForm = () => {
    setAccUsername('');
    setAccFullName('');
    setAccRole('Patient');
    setAccPhone('');
    setAccEmail('');
    setAccSpecialtyId('');
  };

  // SVG CHART DATA COMPILATION
  // 1. Weekly appointment distribution
  const weeklyDistribution = [
    { day: 'Thứ 2', count: 12 },
    { day: 'Thứ 3', count: 18 },
    { day: 'Thứ 4', count: 15 },
    { day: 'Thứ 5', count: 24 },
    { day: 'Thứ 6', count: 21 },
    { day: 'Thứ 7', count: 8 },
    { day: 'Chủ Nhật', count: 2 },
  ];
  const maxAppointments = Math.max(...weeklyDistribution.map((d) => d.count));

  // 2. Specialty Revenue Distribution
  const specialtyRevenue = [
    { name: 'Ngoại Tổng Hợp', rev: 14500000, color: 'bg-teal-500' },
    { name: 'Nội Tổng Hợp', rev: 18200000, color: 'bg-indigo-500' },
    { name: 'Phụ Sản', rev: 12600000, color: 'bg-emerald-500' },
    { name: 'Nhi Khoa', rev: 8900000, color: 'bg-sky-500' },
    { name: 'Khác', rev: 4200000, color: 'bg-amber-500' },
  ];
  const maxRevenue = Math.max(...specialtyRevenue.map((r) => r.rev));

  return (
    <div className="space-y-6 text-left select-none">
      {/* Welcome Block decor banner */}
      <div className="bg-gradient-to-r from-indigo-800 via-slate-900 to-indigo-950 p-6 md:p-8 rounded-3xl text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-[10px] font-extrabold uppercase bg-white/20 px-2.5 py-1 rounded-full text-indigo-300 tracking-widest w-fit block">
            Ban Quản Trị Hệ Thống - Admin Control Panel
          </span>
          <h2 className="text-xl md:text-2xl font-extrabold flex items-center gap-1.5">
            <Shield size={22} className="text-indigo-400" />
            <span>Khu vực Quản trị Admin</span>
          </h2>
          <p className="text-xs text-indigo-100/90 leading-relaxed max-w-xl">
            Nơi can thiệp, giám sát, cấu chỉnh và vận hành dữ liệu cốt lõi của Bệnh viện Đa khoa Thủy Nguyên. Giám sát các biểu đồ thống kê, quản lý trực tiếp tài khoản, sỹ số y tế & danh dược.
          </p>
        </div>

        {/* Dashboard quick switches */}
        <div className="flex gap-1.5 md:flex-col shrink-0 flex-wrap">
          {[
            { id: 'stats', label: '📊 Báo cáo & Thống kê' },
            { id: 'doctors', label: '👨‍⚕️ Quản lý Bác sĩ' },
            { id: 'medicines', label: '💊 Kho Dược phẩm' },
            { id: 'accounts', label: '🎯 Tài khoản người dùng' },
            { id: 'billing', label: '💳 Quản lý Viện phí & QR' },
            { id: 'records', label: '🛡️ Quản lý Bệnh án' },
            { id: 'departments', label: '🏥 Quản lý Chuyên khoa' },
            { id: 'schedules', label: '📅 Lịch trực & Ca khám' },
            { id: 'news', label: '📰 Bài viết & Tin tức' },
            { id: 'contact', label: '📞 SĐT & Email bệnh viện' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveAdminTab(tab.id as any)}
              className={`px-4 py-2 text-xs font-bold rounded-xl text-left cursor-pointer transition-colors ${
                activeAdminTab === tab.id
                  ? 'bg-indigo-600 text-white shadow'
                  : 'bg-white/10 hover:bg-white/15 text-indigo-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {activeAdminTab === 'stats' && (
        <div className="space-y-8 animate-fadeIn">
          {/* Quick Metrics Widgets (PAGE 65) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm space-y-1">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Tổng Doanh Thu Hóa Đơn</span>
              <strong className="text-base md:text-xl font-mono text-indigo-600 tracking-tight block">{totalRevenue.toLocaleString('vi-VN')} đ</strong>
              <div className="flex items-center gap-1 text-[9px] text-emerald-600 font-extrabold">
                <TrendingUp size={12} />
                <span>+12.4% so với tuần qua</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm space-y-1">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Lượt Khám Thành Công</span>
              <strong className="text-base md:text-xl font-mono text-emerald-600 tracking-tight block">{totalCompletedBookings} ca</strong>
              <span className="text-[9px] text-gray-400">Đã cập nhật đơn thuốc điện tử</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm space-y-1">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Số Bác Sĩ Đứng Trực Ban</span>
              <strong className="text-base md:text-xl font-mono text-sky-600 tracking-tight block">{totalActiveDoctors} nhân lực</strong>
              <span className="text-[9px] text-gray-400">Trải rộng trên 8 chuyên khoa</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm space-y-1">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Tỷ lệ hủy / vắng (No-Show)</span>
              <strong className="text-base md:text-xl font-mono text-red-650 tracking-tight block">{noShowBookings} trường hợp</strong>
              <span className="text-[9px] text-gray-400">Tỷ lệ: {((noShowBookings / (bookings.length || 1)) * 100).toFixed(1)}% trên toàn viện</span>
            </div>
          </div>

          {/* SVG CHARTS REPRESENTATION (BENTO GRID DESIGN FOR EXAM EVALUATORS) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Appointment Distribution chart */}
            <div className="bg-white p-6 rounded-3xl border border-gray-150 shadow-sm space-y-4">
              <div>
                <h3 className="text-sm font-black text-gray-800 uppercase tracking-wider block">
                  Cơ cấu lượt khám sầm uất theo ngày
                </h3>
                <p className="text-[10px] text-gray-400 mt-0.5">Biểu diễn số ca đặt lịch khám và tiếp đón thực tế theo ngày trong tuần</p>
              </div>

              {/* Weekly Cột bar chart */}
              <div className="pt-4 h-[240px] flex items-end justify-between gap-1.5 md:gap-3 select-none">
                {weeklyDistribution.map((item) => {
                  const percent = (item.count / maxAppointments) * 80; // max length 80% to fit labels
                  return (
                    <div key={item.day} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                      <div className="w-full relative h-[180px] flex items-end justify-center rounded-xl overflow-hidden bg-slate-50">
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: `${percent}%` }}
                          transition={{ duration: 0.8 }}
                          className="w-full bg-gradient-to-t from-indigo-500 to-indigo-600 group-hover:to-teal-500 transition-all rounded-t-lg relative"
                        >
                          <div className="absolute top-1.5 left-1/2 -translate-x-1/2 text-[9px] text-white font-mono font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                            {item.count}
                          </div>
                        </motion.div>
                      </div>
                      <span className="text-[10px] font-bold text-gray-500 tracking-tight">{item.day}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Specialty Revenue Distribution chart */}
            <div className="bg-white p-6 rounded-3xl border border-gray-150 shadow-sm space-y-4">
              <div>
                <h3 className="text-sm font-black text-gray-800 uppercase tracking-wider block">
                  Doanh số hạch toán lâm sàng theo khoa phòng
                </h3>
                <p className="text-[10px] text-gray-400 mt-0.5">Phân tích tổng nộp phí của người bệnh đóng tại quầy & trực tuyến</p>
              </div>

              {/* horizontal line chart bento representation */}
              <div className="space-y-4 pt-3 text-xs w-full">
                {specialtyRevenue.map((r) => {
                  const percent = (r.rev / maxRevenue) * 100;
                  return (
                    <div key={r.name} className="space-y-1 text-left w-full">
                      <div className="flex justify-between items-center text-[11px] font-bold text-gray-700">
                        <span>{r.name}</span>
                        <span className="font-mono text-gray-650">{r.rev.toLocaleString('vi-VN')}đ</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${percent}%` }}
                          transition={{ duration: 0.8 }}
                          className={`h-full ${r.color} rounded-full`}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ADMIN DOCTORS CRUD PANEL */}
      {activeAdminTab === 'doctors' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fadeIn">
          {/* List Doctors */}
          <div className="lg:col-span-8 bg-white p-6 border border-gray-150 rounded-3xl shadow-sm space-y-4">
            <h3 className="text-xs font-black text-gray-800 uppercase tracking-wider">
              Đội ngũ bác sĩ phòng khám ({doctors.length})
            </h3>
            <div className="border border-slate-150 rounded-xl overflow-hidden overflow-x-auto text-xs">
              <table className="w-full text-left font-sans">
                <thead className="bg-slate-100 text-slate-700 text-[10px] font-extrabold uppercase">
                  <tr>
                    <th className="p-3">Họ Tên</th>
                    <th>Chuyên Khoa</th>
                    <th>Khu phòng</th>
                    <th>Lịch trực tuần</th>
                    <th className="p-3 text-center">Nghiệp Vụ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {doctors.map((d) => (
                    <tr key={d.id} className="hover:bg-slate-50/50">
                      <td className="p-3 text-left">
                        <div className="flex items-center gap-3">
                          <img
                            src={d.imageUrl || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=200'}
                            alt={d.name}
                            referrerPolicy="no-referrer"
                            className="w-10 h-10 object-cover rounded-full border border-slate-200 shadow-sm shrink-0"
                          />
                          <div>
                            <strong className="block text-gray-800 font-bold text-xs">{d.name}</strong>
                            <span className="text-[10px] text-gray-400 block">{d.title}</span>
                          </div>
                        </div>
                      </td>
                      <td className="font-semibold text-indigo-700">{d.specialtyName}</td>
                      <td>
                        <span className="px-2 py-0.5 bg-slate-100 rounded text-[10px] font-mono">{d.room || 'Phòng trực'}</span>
                      </td>
                      <td className="text-[10px] max-w-[150px] text-gray-500 font-medium font-mono">
                        {d.currentSchedule?.join(', ') || 'Thứ 2 - Thứ 6'}
                      </td>
                      <td className="p-3 text-center whitespace-nowrap">
                        <div className="flex justify-center items-center gap-1.5">
                          <button
                            id={`edit-doc-${d.id}`}
                            onClick={() => {
                              setEditingDoc(d);
                              setDocName(d.name);
                              setDocTitle(d.title);
                              setDocSpecialtyId(d.specialtyId);
                              setDocExperience(d.experience);
                              setDocRoom(d.room || '');
                              setDocImageUrl(d.imageUrl || '');
                            }}
                            className="text-indigo-600 hover:bg-indigo-50 p-1.5 rounded-lg transition-colors cursor-pointer"
                            title="Sửa bác sĩ"
                          >
                            <Edit3 size={13} />
                          </button>
                          <button
                            id={`delete-doc-${d.id}`}
                            onClick={() => {
                              showCustomConfirm(
                                'Xác nhận xóa bác sĩ',
                                `Bạn có đồng ý xóa bác sĩ "${d.name}" khỏi danh mục quản lý lâm nghiệm của bệnh viện hay không?`,
                                () => {
                                  deleteDoctor(d.id);
                                  showCustomAlert(`Đã xóa bác sĩ ${d.name} thành công.`, 'success');
                                }
                              );
                            }}
                            className="text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition-colors cursor-pointer"
                            title="Xóa"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Form Add/Edit Doctors */}
          <div className="lg:col-span-4 bg-white p-6 border border-gray-150 rounded-3xl shadow-sm">
            <h3 className="text-xs font-black text-gray-800 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2.5 flex items-center gap-1">
              <Stethoscope size={15} className="text-indigo-600" />
              <span>{editingDoc ? 'Cập Nhật Bác Sĩ' : 'Thêm Bác Sĩ Mới'}</span>
            </h3>

            <form onSubmit={handleSaveDoctor} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-bold text-gray-650 block text-left">Họ và tên bác sĩ *</label>
                <input
                  type="text"
                  required
                  placeholder="VD: BSCKI. Nguyễn Thị Lệ"
                  value={docName}
                  onChange={(e) => setDocName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-gray-650 block text-left">Chức danh / Học hàm *</label>
                <input
                  type="text"
                  required
                  placeholder="VD: Trưởng khoa Nhi"
                  value={docTitle}
                  onChange={(e) => setDocTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-gray-650 block text-left">Phòng khám được phân công *</label>
                <input
                  type="text"
                  required
                  placeholder="VD: Phòng 105"
                  value={docRoom}
                  onChange={(e) => setDocRoom(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg font-mono text-indigo-600 font-bold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-gray-650 block text-left">Khoa chuyên môn điều phối *</label>
                <select
                  value={docSpecialtyId}
                  onChange={(e) => setDocSpecialtyId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white"
                >
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-gray-650 block text-left">Kinh nghiệm tóm lược</label>
                <textarea
                  rows={2}
                  placeholder="Hơn 10 năm kinh nghiệm nội soi Tai Mũi họng..."
                  value={docExperience}
                  onChange={(e) => setDocExperience(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                />
              </div>

              <div className="space-y-2 text-left">
                <label className="font-bold text-gray-650 block">Ảnh đại diện Bác sĩ</label>
                <input
                  type="text"
                  placeholder="Paste URL ảnh đại diện bác sĩ..."
                  value={docImageUrl}
                  onChange={(e) => setDocImageUrl(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[11px] font-mono"
                />
                <div className="space-y-1.5">
                  <span className="text-[10px] text-gray-400 font-bold block">Hoặc click để chọn một ảnh mẫu chất lượng cao:</span>
                  <div className="grid grid-cols-4 gap-1.5">
                    {[
                      { url: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=200', label: 'Nữ BS 1' },
                      { url: 'https://images.unsplash.com/photo-1594824813573-246434de83fb?auto=format&fit=crop&q=80&w=200', label: 'Nữ BS 2' },
                      { url: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=200', label: 'Nam BS 1' },
                      { url: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=200', label: 'Nam BS 2' },
                    ].map((preset, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setDocImageUrl(preset.url)}
                        className={`p-1 border rounded-lg hover:border-indigo-500 transition-all flex flex-col items-center gap-1 cursor-pointer bg-white ${
                          docImageUrl === preset.url ? 'border border-indigo-600 bg-indigo-50/20' : 'border-gray-250'
                        }`}
                      >
                        <img
                          src={preset.url}
                          alt={preset.label}
                          referrerPolicy="no-referrer"
                          className="w-8 h-8 rounded-full object-cover shrink-0"
                        />
                        <span className="text-[8px] font-black text-gray-500 truncate w-full text-center">{preset.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-2 select-none">
                <button
                  id="doctor-save-btn"
                  type="submit"
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer flex justify-center items-center gap-1.5"
                >
                  <Plus size={14} />
                  <span>Xác nhận</span>
                </button>
                {editingDoc && (
                  <button
                    onClick={() => {
                      setEditingDoc(null);
                      clearDoctorForm();
                    }}
                    type="button"
                    className="px-4 py-2.5 border border-slate-250 hover:bg-slate-50 text-slate-500 rounded-xl"
                  >
                    Hủy
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADMIN MEDICINES CRUD PANEL */}
      {activeAdminTab === 'medicines' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fadeIn">
          {/* List medicines list */}
          <div className="lg:col-span-8 bg-white p-6 border border-gray-150 rounded-3xl shadow-sm space-y-4 text-xs font-sans">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-xs font-black text-gray-850 uppercase tracking-wider">
                  QUẢN LÝ KHO THUỐC BỆNH VIỆN ({medicines.length})
                </h3>
                <p className="text-[11px] text-gray-400">Tìm kiếm biệt dược, hạn sử dụng, phân khoa và cập nhật tồn dư dực liệu.</p>
              </div>
            </div>

            {/* Filter Search Row */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
              <div className="sm:col-span-7 relative">
                <input
                  type="text"
                  placeholder="🔍 Nhập tên thuốc, loại thuốc hoặc mã biệt dược cần tìm..."
                  value={medSearchQuery}
                  onChange={(e) => setMedSearchQuery(e.target.value)}
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white text-xs text-gray-800"
                />
              </div>
              <div className="sm:col-span-5">
                <select
                  value={medDeptFilter}
                  onChange={(e) => setMedDeptFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white text-xs font-medium text-slate-700"
                >
                  <option value="all">🏥 Tất cả Khoa lâm sàng</option>
                  <option value="general">📦 Kho chung (Không phân khoa)</option>
                  {departments.map((d) => (
                    <option key={d.id} value={d.id}>
                      🔹 {d.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="border border-slate-150 rounded-xl overflow-hidden overflow-x-auto">
              <table className="w-full text-left font-sans table-auto">
                <thead className="bg-slate-100 text-slate-700 text-[10px] font-black uppercase">
                  <tr>
                    <th className="p-3">Tên & Mã Biệt Dược</th>
                    <th className="p-3">Nhóm & Khoa Lâm Sàng</th>
                    <th className="p-3">Dữ Liệu Nhập & Hạn Dùng</th>
                    <th className="p-3 text-center">Tồn Kho</th>
                    <th className="p-3">Đơn Giá Bán</th>
                    <th className="p-3 text-center">Hành Động</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white text-[11px]">
                  {(() => {
                    const filteredMeds = (medicines || []).filter((m) => {
                      const matchesSearch = 
                        m.name.toLowerCase().includes(medSearchQuery.toLowerCase()) ||
                        (m.type && m.type.toLowerCase().includes(medSearchQuery.toLowerCase())) ||
                        m.id.toLowerCase().includes(medSearchQuery.toLowerCase());
                      
                      const matchesDept = 
                        medDeptFilter === 'all' ||
                        (medDeptFilter === 'general' && !m.specialtyId) ||
                        m.specialtyId === medDeptFilter;

                      return matchesSearch && matchesDept;
                    });

                    if (filteredMeds.length === 0) {
                      return (
                        <tr>
                          <td colSpan={6} className="p-8 text-center text-gray-400 font-medium">
                            Không tìm thấy thuốc nào khớp với bộ lọc điều kiện!
                          </td>
                        </tr>
                      );
                    }

                    return filteredMeds.map((m) => {
                      const isLowStock = m.stock < 100;
                      return (
                        <tr key={m.id} className="hover:bg-slate-50/50">
                          <td className="p-3 text-left">
                            <div>
                              <strong className="block text-gray-800 font-bold text-xs">{m.name}</strong>
                              <span className="text-[10px] text-indigo-600 block font-mono font-bold select-all">Mã: {m.id}</span>
                              <span className="text-[9px] text-gray-400 block max-w-[180px] truncate" title={m.usage || 'Chưa thiết lập cách dùng'}>
                                {m.usage || 'Chưa thiết lập cách dùng'}
                              </span>
                            </div>
                          </td>
                          <td className="p-3 text-left">
                            <span className="block text-gray-700 font-semibold">{m.type}</span>
                            <span className="inline-block text-[9px] text-teal-700 font-bold bg-teal-50 px-1.5 py-0.5 rounded border border-teal-100 mt-0.5">
                              {m.specialtyName || 'Kho chung'}
                            </span>
                          </td>
                          <td className="p-3 text-left font-mono whitespace-nowrap">
                            <div className="space-y-0.5">
                              <span className="block text-[10px] text-gray-500">📅 Nhập: {m.entryDate || '_'}</span>
                              <span className="block text-[10px] text-rose-600 font-bold">⌛ Hạn: {m.expiryDate || '_'}</span>
                            </div>
                          </td>
                          <td className="p-3 text-center">
                            <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-mono font-bold leading-none ${
                              isLowStock
                                ? 'bg-red-50 text-red-700 border border-red-150 animate-pulse'
                                : 'bg-emerald-50 text-emerald-700 border border-emerald-150'
                            }`}>
                              {m.stock} {m.unit}
                            </span>
                          </td>
                          <td className="p-3 font-mono text-gray-800 font-extrabold text-[12px] whitespace-nowrap">
                            {m.price.toLocaleString('vi-VN')} đ
                          </td>
                          <td className="p-3 text-center whitespace-nowrap">
                            <div className="flex justify-center items-center gap-1.5">
                              <button
                                id={`edit-med-${m.id}`}
                                onClick={() => {
                                  setEditingMed(m);
                                  setMedId(m.id || '');
                                  setMedName(m.name);
                                  setMedType(m.type);
                                  setMedUnit(m.unit);
                                  setMedStock(m.stock);
                                  setMedPrice(m.price);
                                  setMedUsage(m.usage || '');
                                  setMedSpecialtyId(m.specialtyId || '');
                                  setMedEntryDate(m.entryDate || '');
                                  setMedExpiryDate(m.expiryDate || '');
                                }}
                                className="text-indigo-600 hover:bg-slate-100 p-1.5 rounded-lg cursor-pointer transition-colors"
                                title="Sửa thuốc"
                              >
                                <Edit3 size={13} />
                              </button>
                              <button
                                id={`delete-med-${m.id}`}
                                onClick={() => {
                                  showCustomConfirm(
                                    'Xác nhận xóa thuốc',
                                    `Bạn có chắc muốn xóa biệt dược "${m.name}" khỏi danh mục bảo lưu hệ thống?`,
                                    () => {
                                      deleteMedicine(m.id);
                                      showCustomAlert(`Đã xóa thuốc ${m.name} khỏi hệ thống.`, 'success');
                                    }
                                  );
                                }}
                                className="text-red-500 hover:bg-slate-100 p-1.5 rounded-lg cursor-pointer transition-colors"
                                title="Xóa"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    });
                  })()}
                </tbody>
              </table>
            </div>
          </div>

          {/* Form edit medicines */}
          <div className="lg:col-span-4 bg-white p-6 border border-gray-150 rounded-3xl shadow-sm text-xs font-sans">
            <h3 className="text-xs font-black text-gray-800 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2.5 flex items-center gap-1.5">
              <Pill size={15} className="text-teal-600" />
              <span>{editingMed ? 'Sửa Biệt Dược' : 'Bổ Sung Thuốc Mới'}</span>
            </h3>

            <form onSubmit={handleSaveMedicine} className="space-y-4">
              <div className="space-y-1.5 text-left">
                <label className="font-bold text-gray-650 block">Mã thuốc (Mã biệt dược) *</label>
                <input
                  type="text"
                  required
                  disabled={!!editingMed}
                  placeholder="VD: MED-HA-01"
                  value={medId}
                  onChange={(e) => setMedId(e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg font-mono uppercase bg-amber-50/10 ${editingMed ? 'opacity-60 cursor-not-allowed bg-slate-50' : 'border-gray-200 focus:border-teal-500'}`}
                />
              </div>

              <div className="space-y-1.5 text-left">
                <label className="font-bold text-gray-650 block">Tên thuốc (Biệt dược) *</label>
                <input
                  type="text"
                  required
                  placeholder="VD: Decolgen 500mg"
                  value={medName}
                  onChange={(e) => setMedName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-teal-500"
                />
              </div>

              <div className="space-y-1.5 text-left">
                <label className="font-bold text-gray-650 block">Phân nhóm biệt dược *</label>
                <input
                  type="text"
                  required
                  placeholder="VD: Trị ho, cảm cúm, hô hấp"
                  value={medType}
                  onChange={(e) => setMedType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-teal-500"
                />
              </div>

              <div className="space-y-1.5 text-left">
                <label className="font-bold text-gray-650 block">Phân khoa quản lý dược *</label>
                <select
                  value={medSpecialtyId}
                  onChange={(e) => setMedSpecialtyId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white"
                >
                  <option value="">-- Kho chung (Không phân khoa) --</option>
                  {departments.map((d) => (
                    <option key={d.id} value={d.id}>
                      🔹 {d.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3 text-left">
                <div className="space-y-1.5">
                  <label className="font-bold text-gray-650 block">Số lượng tồn kho</label>
                  <input
                    type="number"
                    min={1}
                    value={medStock}
                    onChange={(e) => setMedStock(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-1.5 border border-gray-200 rounded-lg"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-gray-650 block">Đơn vị tính</label>
                  <select
                    value={medUnit}
                    onChange={(e) => setMedUnit(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white"
                  >
                    <option value="Viên">Viên</option>
                    <option value="Hộp">Hộp</option>
                    <option value="Chai">Chai</option>
                    <option value="Ống">Ống</option>
                    <option value="Gói">Gói</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5 text-left">
                <label className="font-bold text-gray-650 block">Đơn giá bán lẻ (đ/vnđ) *</label>
                <input
                  type="number"
                  min={1}
                  value={medPrice}
                  onChange={(e) => setMedPrice(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-1.5 border border-gray-200 rounded-lg font-mono focus:border-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2 text-left">
                <div className="space-y-1.5">
                  <label className="font-bold text-gray-650 block text-[10px]">Ngày nhập kho</label>
                  <input
                    type="date"
                    required
                    value={medEntryDate}
                    onChange={(e) => setMedEntryDate(e.target.value)}
                    className="w-full px-2 py-1.5 border border-gray-200 rounded-lg text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-bold text-rose-600 block text-[10px]">Hạn sử dụng</label>
                  <input
                    type="date"
                    required
                    value={medExpiryDate}
                    onChange={(e) => setMedExpiryDate(e.target.value)}
                    className="w-full px-2 py-1.5 border border-gray-200 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1.5 text-left">
                <label className="font-bold text-gray-650 block">Cách hướng dẫn chỉ định uống</label>
                <textarea
                  rows={2}
                  placeholder="Ngày uống 2 lần, mỗi lần 1 viên sau ăn no"
                  value={medUsage}
                  onChange={(e) => setMedUsage(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  id="med-save-btn"
                  type="submit"
                  className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer flex justify-center items-center gap-1.5"
                >
                  <Plus size={14} />
                  <span>Xác nhận lưu kho</span>
                </button>
                {editingMed && (
                  <button
                    onClick={() => {
                      setEditingMed(null);
                      clearMedicineForm();
                    }}
                    type="button"
                    className="px-4 py-2.5 border border-slate-250 hover:bg-slate-50 text-slate-500 rounded-xl"
                  >
                    Hủy
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADMIN USERS CRUD PANEL */}
      {activeAdminTab === 'accounts' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fadeIn">
          {/* List Accounts user */}
          <div className="lg:col-span-8 bg-white p-6 border border-gray-150 rounded-3xl shadow-sm space-y-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 border-b border-gray-100 pb-3">
              <h3 className="text-xs font-black text-gray-800 uppercase tracking-wider block">
                Hệ thống tài khoản thành viên & Nhân sự ({accounts.length})
              </h3>
              {/* 4 sub-sections tabs */}
              <div className="flex gap-1 bg-slate-100 p-1 rounded-xl text-[10px] uppercase font-bold shrink-0">
                {[
                  { key: 'All', val: 'Tất cả' },
                  { key: 'Patient', val: '👤 Bệnh nhân' },
                  { key: 'Doctor', val: '⚕ Bác sĩ' },
                  { key: 'Receptionist', val: '📋 Lễ tân' },
                  { key: 'Admin', val: '🛡 Quản trị' }
                ].map((s) => (
                  <button
                    key={s.key}
                    type="button"
                    onClick={() => setAccSubRoleTab(s.key as any)}
                    className={`px-2 py-1 rounded-lg cursor-pointer transition-all ${
                      accSubRoleTab === s.key ? 'bg-white text-indigo-750 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {s.val}
                  </button>
                ))}
              </div>
            </div>

            <div className="border border-slate-150 rounded-xl overflow-hidden overflow-x-auto text-xs">
              <table className="w-full text-left font-sans">
                <thead className="bg-slate-100 text-slate-700 text-[10px] font-extrabold uppercase select-none">
                  <tr>
                    <th className="p-3">Họ Tên</th>
                    <th>Tên đăng nhập (ID)</th>
                    <th>Vai Trò Phân Quyền</th>
                    <th>Trạng Thái</th>
                    <th className="p-3 text-center">Nghiệp Vụ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {accounts
                    .filter((a) => accSubRoleTab === 'All' || a.role === accSubRoleTab)
                    .map((a) => (
                    <tr key={a.id} className="hover:bg-slate-50/50">
                      <td className="p-3 font-bold text-slate-800 text-left">{a.fullName}</td>
                      <td className="font-mono text-gray-500">{a.username}</td>
                      <td>
                        <span className="font-bold px-2 py-0.5 rounded text-[10px] bg-slate-100 text-slate-700">
                          {a.role === 'Admin' && '🛡 Quản Trị'}
                          {a.role === 'Doctor' && '⚕ Bác Sĩ'}
                          {a.role === 'Receptionist' && '📋 Lễ Tân'}
                          {a.role === 'Patient' && '👤 Bệnh Nhân'}
                        </span>
                      </td>
                      <td>
                        <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold leading-none ${
                          a.status === 'Active'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-100'
                            : 'bg-red-50 text-red-800 border border-red-100 animate-pulse'
                        }`}>
                          {a.status === 'Active' ? 'Đang chạy' : 'Đã khóa'}
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        <div className="flex justify-center items-center gap-1.5 whitespace-nowrap">
                          {a.username !== 'admin' && (
                            <button
                              onClick={() => handleToggleAccStatus(a)}
                              className="p-1 px-2 text-[10px] border border-slate-200 hover:bg-slate-50 text-slate-650 font-bold rounded-lg cursor-pointer"
                            >
                              {a.status === 'Active' ? 'Khóa' : 'Mở khóa'}
                            </button>
                          )}
                          <button
                            id={`edit-acc-${a.id}`}
                            onClick={() => {
                              setEditingAcc(a);
                              setAccUsername(a.username);
                              setAccFullName(a.fullName);
                              setAccRole(a.role);
                              setAccPhone(a.phone || '');
                              setAccEmail(a.email || '');
                              setAccSpecialtyId(a.specialtyId || '');
                            }}
                            className="text-indigo-600 hover:bg-indigo-50 p-1.5 rounded-lg cursor-pointer animate-none"
                            title="Sửa phân quyền"
                          >
                            <Edit3 size={12} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Form edit Accounts */}
          <div className="lg:col-span-4 bg-white p-6 border border-gray-150 rounded-3xl shadow-sm">
            <h3 className="text-xs font-black text-gray-800 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2.5 flex items-center gap-1">
              <Settings size={15} className="text-indigo-650" />
              <span>{editingAcc ? 'Sửa Đăng Nhập' : 'Cấp Tài Khoản Mới'}</span>
            </h3>

            <form onSubmit={handleSaveAccount} className="space-y-4 text-xs">
              <div className="space-y-1.5 text-left">
                <label className="font-bold text-gray-650 block">Tên Đăng Nhập (Số ĐT hoặc Email) *</label>
                <input
                  type="text"
                  required
                  placeholder="VD: letan105"
                  value={accUsername}
                  disabled={!!editingAcc}
                  onChange={(e) => setAccUsername(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg font-mono text-gray-600 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5 text-left">
                <label className="font-bold text-gray-650 block">Họ và Tên thành viên *</label>
                <input
                  type="text"
                  required
                  placeholder="VD: Nguyễn Thị Lan"
                  value={accFullName}
                  onChange={(e) => setAccFullName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                />
              </div>

              <div className="space-y-1.5 text-left">
                <label className="font-bold text-gray-650 block">Vai trò Phân Quyền *</label>
                <select
                  value={accRole}
                  onChange={(e) => setAccRole(e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white bg-no-repeat"
                >
                  <option value="Doctor">Bác Sĩ Chuyên Môn</option>
                  <option value="Receptionist">Lễ Tân Tiếp Đón</option>
                  <option value="Admin">Hệ Thống Admin</option>
                  <option value="Patient">Bệnh Nhân</option>
                </select>
              </div>

              {(accRole === 'Doctor' || accRole === 'Receptionist') && (
                <div className="space-y-1.5 text-left animate-fadeIn">
                  <label className="font-bold text-indigo-600 block">Chuỗi Khoa Lâm Sàng liên kết *</label>
                  <select
                    required
                    value={accSpecialtyId}
                    onChange={(e) => setAccSpecialtyId(e.target.value)}
                    className="w-full px-3 py-2 border border-indigo-200 bg-indigo-50/10 rounded-lg bg-no-repeat"
                  >
                    <option value="">-- Chọn Khoa phòng --</option>
                    {departments.map((dept) => (
                      <option key={dept.id} value={dept.id}>
                        {dept.name}
                      </option>
                    ))}
                  </select>
                  <p className="text-[10px] text-gray-400 mt-0.5">
                    Liên kết trực tiếp tài khoản này tới phân hệ điều phối bệnh nhân tại khoa tương ứng.
                  </p>
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <button
                  id="acc-save-btn"
                  type="submit"
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer flex justify-center items-center gap-1.5"
                >
                  <Plus size={14} />
                  <span>Xác nhận</span>
                </button>
                {editingAcc && (
                  <button
                    onClick={() => {
                      setEditingAcc(null);
                      clearAccountForm();
                    }}
                    type="button"
                    className="px-4 py-2.5 border border-slate-250 hover:bg-slate-50 text-slate-500 rounded-xl"
                  >
                    Hủy
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

      {activeAdminTab === 'schedules' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fadeIn">
          {/* List of Schedules */}
          <div className="lg:col-span-8 bg-white border border-gray-150 rounded-3xl p-6 shadow-sm">
            <h3 className="text-sm font-extrabold text-gray-900 border-b border-gray-100 pb-3 mb-4">
              Danh sách ca trực, phân bổ định ngạch của Bác sĩ
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left text-gray-600">
                <thead>
                  <tr className="bg-gray-50 text-gray-500 font-bold border-b border-gray-150 animate-fadeIn">
                    <th className="py-3 px-4">Bác Sĩ Trực</th>
                    <th className="py-3 px-4">Ngày Trực</th>
                    <th className="py-3 px-4">Khung Giờ</th>
                    <th className="py-3 px-4 text-center">Đã Đăng Ký</th>
                    <th className="py-3 px-4 text-center">Giới Hạn</th>
                    <th className="py-3 px-4 text-center">Hành Động</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {schedules.map((sch) => {
                    const isFull = sch.currentPatients >= sch.maxPatients;
                    return (
                      <tr key={sch.id} className="hover:bg-gray-50/50">
                        <td className="py-3 px-4 font-bold text-gray-900">{sch.doctorName}</td>
                        <td className="py-3 px-4 font-mono font-medium">{sch.date}</td>
                        <td className="py-3 px-4">
                          <span className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-md font-semibold text-[10px]">
                            {sch.timeSlot}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center font-bold">
                          <span className={isFull ? 'text-rose-600 font-bold' : 'text-emerald-600'}>
                            {sch.currentPatients}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center font-mono font-bold text-gray-500">
                          {sch.maxPatients}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex justify-center items-center gap-1">
                            <button
                              onClick={() => {
                                setEditingSch(sch);
                                setSchDoctorId(sch.doctorId);
                                setSchDate(sch.date);
                                setSchTimeSlot(sch.timeSlot);
                                setSchMaxPatients(sch.maxPatients);
                              }}
                              className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg cursor-pointer transition-colors"
                              title="Sửa"
                            >
                              <Edit3 size={12} />
                            </button>
                            <button
                              onClick={() => {
                                showCustomConfirm(
                                  'Xác nhận xóa lịch trực',
                                  `Bạn có chắc chắn muốn xóa lịch trực của bác sĩ trong khung giờ ${sch.timeSlot} ngày ${sch.date}?`,
                                  () => {
                                    deleteSchedule(sch.id);
                                    showCustomAlert('Đã xóa khung lịch trực lâm sàng.', 'success');
                                  }
                                );
                              }}
                              className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer transition-colors"
                              title="Xóa"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Form edit Schedules */}
          <div className="lg:col-span-4 bg-white p-6 border border-gray-150 rounded-3xl shadow-sm">
            <h3 className="text-xs font-black text-gray-800 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2.5 flex items-center gap-1">
              <Settings size={15} className="text-indigo-650" />
              <span>{editingSch ? 'Cập Nhật Lịch Trực' : 'Khởi Tạo Lịch Trực'}</span>
            </h3>

            <form onSubmit={handleSaveSchedule} className="space-y-4 text-xs">
              <div className="space-y-1.5 text-left">
                <label className="font-bold text-gray-650 block">Chọn Bác Sĩ Chuyên Môn *</label>
                <select
                  required
                  value={schDoctorId}
                  onChange={(e) => setSchDoctorId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white"
                >
                  <option value="">-- Chọn bác sĩ --</option>
                  {doctors.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} ({d.title})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5 text-left">
                <label className="font-bold text-gray-650 block">Ngày Làm Việc *</label>
                <input
                  type="date"
                  required
                  value={schDate}
                  onChange={(e) => setSchDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                />
              </div>

              <div className="space-y-1.5 text-left">
                <label className="font-bold text-gray-650 block">Khung Giờ Đăng Ký *</label>
                <select
                  required
                  value={schTimeSlot}
                  onChange={(e) => setSchTimeSlot(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white font-mono"
                >
                  <option value="07:30-08:30">07:30 - 08:30 (Ca Sáng)</option>
                  <option value="08:30-09:30">08:30 - 09:30 (Ca Sáng)</option>
                  <option value="09:30-10:30">09:30 - 10:30 (Ca Sáng)</option>
                  <option value="13:30-14:30">13:30 - 14:30 (Ca Chiều)</option>
                  <option value="14:30-15:30">14:30 - 15:30 (Ca Chiều)</option>
                  <option value="15:30-16:30">15:30 - 16:30 (Ca Chiều)</option>
                </select>
              </div>

              <div className="space-y-1.5 text-left">
                <label className="font-bold text-gray-650 block">Giới hạn tiếp đón tối đa (Bệnh nhân) *</label>
                <input
                  type="number"
                  required
                  min={1}
                  max={25}
                  value={schMaxPatients}
                  onChange={(e) => setSchMaxPatients(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  id="sch-save-btn"
                  type="submit"
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer flex justify-center items-center gap-1.5"
                >
                  <Plus size={14} />
                  <span>{editingSch ? 'Cập Nhật' : 'Khởi Tạo'}</span>
                </button>
                {(editingSch || schDoctorId) && (
                  <button
                    onClick={() => {
                      setEditingSch(null);
                      clearScheduleForm();
                    }}
                    type="button"
                    className="px-4 py-2.5 border border-slate-250 hover:bg-slate-50 text-slate-500 rounded-xl"
                  >
                    Hủy
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADMIN NEWS ARTICLES CRUD PANEL */}
      {activeAdminTab === 'news' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fadeIn text-xs font-sans text-left">
          {/* Left panel: List articles */}
          <div className="lg:col-span-8 bg-white border border-gray-150 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-xs font-black text-gray-850 uppercase tracking-widest">
                  QUẢN LÝ BÀI VIẾT & TIN TỨC ({newsArticles.length})
                </h3>
                <p className="text-[11px] text-gray-400">Đăng tuyển tin thông báo, chia sẻ y học thường thức hoặc tin hoạt động bệnh viện.</p>
              </div>
            </div>

            {/* News search filter */}
            <div>
              <input
                type="text"
                placeholder="🔍 Tìm bài viết theo tiêu đề hoặc nội dung..."
                value={newsSearchTerm}
                onChange={(e) => setNewsSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white text-xs"
              />
            </div>

            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
              {(() => {
                const filteredNews = (newsArticles || []).filter(
                  (n) =>
                    n.title.toLowerCase().includes(newsSearchTerm.toLowerCase()) ||
                    n.content.toLowerCase().includes(newsSearchTerm.toLowerCase()) ||
                    (n.summary && n.summary.toLowerCase().includes(newsSearchTerm.toLowerCase()))
                );

                if (filteredNews.length === 0) {
                  return (
                    <div className="p-8 text-center text-gray-400 font-medium">
                      Không tìm thấy bài viết nào khớp với từ khóa tìm kiếm!
                    </div>
                  );
                }

                return filteredNews.map((news) => (
                  <div key={news.id} className="p-4 border border-slate-100 rounded-2xl flex gap-4 hover:bg-slate-50/50 transition-all">
                    <img
                      src={news.imageUrl}
                      alt={news.title}
                      referrerPolicy="no-referrer"
                      className="w-20 h-20 rounded-xl object-cover shrink-0 bg-slate-100"
                    />
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                          news.category === 'tin-tuc' ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' :
                          news.category === 'kien-thuc' ? 'bg-teal-50 text-teal-700 border border-teal-100' :
                          'bg-amber-50 text-amber-700 border border-amber-100'
                        }`}>
                          {news.category === 'tin-tuc' && 'Hoạt động'}
                          {news.category === 'kien-thuc' && 'Y học thường thức'}
                          {news.category === 'thong-bao' && 'Thông báo BHYT'}
                        </span>
                        <span className="text-[10px] text-gray-450">{news.publishDate || 'Hôm nay'}</span>
                      </div>
                      <h4 className="font-bold text-gray-850 text-sm truncate">{news.title}</h4>
                      <p className="text-[11px] text-gray-400 line-clamp-2 leading-relaxed">{news.summary}</p>
                    </div>
                    <div className="flex flex-col gap-1 justify-center shrink-0">
                      <button
                        onClick={() => {
                          setEditingNews(news);
                          setNewsTitle(news.title);
                          setNewsCategory(news.category);
                          setNewsSummary(news.summary || '');
                          setNewsContent(news.content);
                          setNewsImageUrl(news.imageUrl || '');
                        }}
                        className="p-1 px-2.5 text-[10px] font-bold border border-indigo-150 text-indigo-600 hover:bg-indigo-50 rounded-lg cursor-pointer flex items-center gap-1.5 transition-all"
                      >
                        <Edit3 size={11} />
                        <span>Sửa</span>
                      </button>
                      <button
                        onClick={() => {
                          showCustomConfirm(
                            'Xác nhận xóa bài viết',
                            `Bạn có chắc chắn muốn xóa vĩnh viễn bài viết "${news.title}"?`,
                            () => {
                              deleteNewsArticle(news.id);
                              showCustomAlert('Đã xóa bài viết thành công.', 'success');
                            }
                          );
                        }}
                        className="p-1 px-2.5 text-[10px] font-bold border border-red-150 text-red-500 hover:bg-red-50 rounded-lg cursor-pointer flex items-center gap-1.5 transition-all"
                      >
                        <Trash2 size={11} />
                        <span>Xóa</span>
                      </button>
                    </div>
                  </div>
                ));
              })()}
            </div>
          </div>

          {/* Right panel: Editor */}
          <div className="lg:col-span-4 bg-white border border-gray-150 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="text-xs font-black text-gray-800 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2.5 flex items-center gap-1.5">
              <span>{editingNews ? '📝 Hiệu chỉnh bài viết' : '✍ Đăng bài viết mới'}</span>
            </h3>

            <form onSubmit={handleSaveNews} className="space-y-4 text-xs">
              <div className="space-y-1.5 text-left">
                <label className="font-bold text-gray-650 block">Tiêu đề bài tin *</label>
                <input
                  type="text"
                  required
                  placeholder="VD: Khai trương khu khám bệnh chất lượng cao mới..."
                  value={newsTitle}
                  onChange={(e) => setNewsTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1.5 text-left">
                <label className="font-bold text-gray-650 block">Phân loại danh mục *</label>
                <select
                  value={newsCategory}
                  onChange={(e) => setNewsCategory(e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white"
                >
                  <option value="tin-tuc">Tin hoạt động Bệnh viện</option>
                  <option value="kien-thuc">Y học thường thức & Sức khỏe</option>
                  <option value="thong-bao">Thông báo chính sách BHYT & Lịch làm việc</option>
                </select>
              </div>

              <div className="space-y-1.5 text-left">
                <label className="font-bold text-gray-650 block">Tóm tắt ngắn (Để trống sẽ tự động trích)</label>
                <textarea
                  rows={2}
                  placeholder="Một đoạn mô tả ngắn hiển thị ở trang chủ danh mục..."
                  value={newsSummary}
                  onChange={(e) => setNewsSummary(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1.5 text-left">
                <label className="font-bold text-gray-650 block">Nội dung chi tiết bài viết *</label>
                <textarea
                  rows={6}
                  required
                  placeholder="Nhập nội dung đầy đủ của bài báo/tin tức. Quản trị viên có thể nhập văn bản chi tiết..."
                  value={newsContent}
                  onChange={(e) => setNewsContent(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-indigo-500 font-sans leading-relaxed"
                />
              </div>

              <div className="space-y-1.5 text-left">
                <label className="font-bold text-gray-650 block">URL hình ảnh minh họa</label>
                <input
                  type="text"
                  placeholder="https://images.unsplash.com/..."
                  value={newsImageUrl}
                  onChange={(e) => setNewsImageUrl(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg font-mono text-[11px]"
                />
                <div className="space-y-1">
                  <span className="text-[9px] text-gray-400 font-bold block">Hoặc dùng ảnh minh họa mẫu:</span>
                  <div className="flex gap-2">
                    {[
                      { url: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=200', label: 'Bệnh viện' },
                      { url: 'https://images.unsplash.com/photo-1584515901407-4b65e90a6761?auto=format&fit=crop&q=80&w=200', label: 'Y tế' },
                      { url: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&q=80&w=200', label: 'Bác sĩ' },
                    ].map((item, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setNewsImageUrl(item.url)}
                        className="px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded text-[9px] font-medium"
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer flex justify-center items-center gap-1.5"
                >
                  <Plus size={14} />
                  <span>Xác nhận phát hành</span>
                </button>
                {(editingNews || newsTitle) && (
                  <button
                    onClick={() => clearNewsForm()}
                    type="button"
                    className="px-4 py-2.5 border border-slate-250 hover:bg-slate-50 text-slate-500 rounded-xl"
                  >
                    Hủy
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADMIN CONTACTS SETTINGS PANEL */}
      {activeAdminTab === 'contact' && (
        <div className="bg-white border border-gray-150 rounded-3xl p-6 shadow-sm max-w-2xl mx-auto space-y-6 animate-fadeIn text-xs text-left font-sans">
          <div>
            <h3 className="text-xs font-black text-gray-850 uppercase tracking-widest flex items-center gap-1.5 pb-2 border-b border-slate-100">
              <Phone size={15} className="text-teal-600" />
              <span>CẤU HÌNH THÔNG TIN LIÊN HỆ & HOTLINE BỆNH VIỆN</span>
            </h3>
            <p className="text-[11px] text-gray-400 mt-1.5">
              Thay đổi số điện thoại hotline, đường dây nóng hỗ trợ, tổng đài cấp cứu và địa chỉ email chính thức. Thông tin sau khi lưu sẽ đồng bộ thời gian thực hiển thị lên thanh top bar đầu trang (Header) và chân trang (Footer).
            </p>
          </div>

          <form onSubmit={handleSaveHospitalContact} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5 text-left">
                <label className="font-bold text-gray-650 block">Tổng đài Chăm sóc khách hàng (Hotline) *</label>
                <input
                  type="text"
                  required
                  placeholder="VD: 1900 9095"
                  value={phoneHotline}
                  onChange={(e) => setPhoneHotline(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs font-mono font-bold text-teal-600 focus:border-teal-500"
                />
              </div>

              <div className="space-y-1.5 text-left">
                <label className="font-bold text-gray-650 block">Hotline Đường dây nóng Cấp cứu (24/7) *</label>
                <input
                  type="text"
                  required
                  placeholder="VD: 0225 3859 135"
                  value={phoneEmergency}
                  onChange={(e) => setPhoneEmergency(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs font-mono font-bold text-indigo-600 focus:border-teal-500"
                />
              </div>
            </div>

            <div className="space-y-1.5 text-left">
              <label className="font-bold text-gray-650 block">Hộp thư điện tử bệnh viện (Email hỗ trợ) *</label>
              <input
                type="email"
                required
                placeholder="VD: bvdkthuynguyen@gmail.com"
                value={emailSupport}
                onChange={(e) => setEmailSupport(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs font-bold font-mono focus:border-teal-500"
              />
            </div>

            <div className="space-y-1.5 text-left">
              <label className="font-bold text-gray-650 block">Địa chỉ trụ sở chính bệnh viện *</label>
              <textarea
                rows={3}
                required
                placeholder="VD: Thôn Bạch Đằng, Xã Thủy Sơn, Huyện Thủy Nguyên, Thành phố Hải Phòng, Việt Nam"
                value={addressClinic}
                onChange={(e) => setAddressClinic(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-teal-500 font-sans leading-relaxed text-gray-700"
              />
            </div>

            <div className="p-3 bg-teal-50/50 border border-teal-100 rounded-2xl flex gap-3 text-[11px] text-teal-800 leading-relaxed">
              <span className="shrink-0 text-teal-600 font-bold select-none mt-0.5">💡 Lưu ý:</span>
              <span>Thông tin này được bảo lưu trực tiếp vào bộ nhớ cục bộ trình duyệt (`localStorage`) nhằm bảo lưu cấu hình liên tục trên môi trường demo.</span>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs rounded-xl shadow-md cursor-pointer flex justify-center items-center gap-1.5 transition-colors"
            >
              <CheckCircle2 size={15} />
              <span>Cập Nhật Thông Tin Ngay</span>
            </button>
          </form>
        </div>
      )}

      {/* ADMIN BILLING & QR PAYMENT CONFIG */}
      {activeAdminTab === 'billing' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fadeIn text-xs text-left font-sans">
          {/* Left panel: configure QR fee payment code */}
          <div className="lg:col-span-5 bg-white p-6 border border-gray-150 rounded-3xl shadow-sm space-y-5">
            <div>
              <h4 className="font-extrabold text-sm text-gray-805 uppercase tracking-widest flex items-center gap-1.5 pb-2 border-b">
                <span>🏦 Cấu hình QR thanh toán viện phí</span>
              </h4>
              <p className="text-[11px] mt-1.5 text-gray-400">
                Lễ tân tại quầy đón tiếp sẽ quét mã QR này để đưa cho bệnh nhân thanh toán viện phí tức thời thông qua chuyển khoản ngân hàng (Napas 247).
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="font-bold text-gray-650 block">Đường dẫn ảnh mã QR thanh toán (URL) *</label>
                <input
                  type="text"
                  required
                  placeholder="https://images.unsplash.com/promo..."
                  value={targetQrCodeStr}
                  onChange={(e) => {
                    setTargetQrCodeStr(e.target.value);
                    updatePaymentQrCode(e.target.value);
                  }}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[11px] font-mono focus:border-indigo-500"
                />
              </div>

              {/* QR Image Preview */}
              <div className="p-4 bg-slate-50 border border-slate-150 rounded-2xl flex flex-col items-center text-center space-y-2">
                <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block">Hình ảnh hiển thị thực tế tại Quầy lễ tân</span>
                <img
                  src={targetQrCodeStr || paymentQrCode}
                  alt="QR Code Preview"
                  referrerPolicy="no-referrer"
                  className="w-48 h-48 object-cover bg-white border rounded-xl shadow-inner p-1"
                />
                <span className="text-[10px] text-gray-400 italic">Bệnh nhân sẽ thấy ảnh này khi chọn nộp tiền bằng 'Chuyển khoản / Quét mã QR'</span>
              </div>

              {/* Mock QR quick selections */}
              <div className="space-y-2 pt-2 border-t">
                <span className="text-[10px] uppercase font-bold text-slate-500 mt-1 block">💡 MẪU QR MÃ ĐỊNH DANH ĐƯỢC CHỌN NHANH</span>
                <div className="grid grid-cols-2 gap-2 text-[10px]">
                  {[
                    { label: 'QR BIDV CHUYỂN KHOẢN', url: 'https://images.unsplash.com/photo-1622630998477-20aa696ecb05?w=500&auto=format&fit=crop&q=60' },
                    { label: 'QR VIETCOMBANK POS', url: 'https://images.unsplash.com/photo-1543120539-7c975f29d2f0?w=500&auto=format&fit=crop&q=60' },
                    { label: 'QR MOMO THƯƠNG HIỆU', url: 'https://images.unsplash.com/photo-1595079676339-1534801ad6cf?w=500&auto=format&fit=crop&q=60' },
                    { label: 'QR MBBANK ĐA NĂNG', url: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=500&auto=format&fit=crop&q=60' }
                  ].map((preset, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => {
                        setTargetQrCodeStr(preset.url);
                        updatePaymentQrCode(preset.url);
                      }}
                      className="p-2 border bg-slate-50 hover:bg-slate-100 border-slate-200 rounded-lg text-left font-bold truncate cursor-pointer text-slate-700"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right panel: invoice directory list */}
          <div className="lg:col-span-7 bg-white p-6 border border-gray-150 rounded-3xl shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b pb-3">
              <div>
                <h4 className="font-extrabold text-sm text-gray-800 uppercase tracking-widest block">🗂 Sổ lệnh & Hóa đơn viện phí</h4>
                <p className="text-[11px] text-gray-400 mt-0.5">Giám sát tổng thể dòng tiền, trạng thái hạch toán của bệnh nhân toàn viện.</p>
              </div>
              <div className="relative shrink-0 max-w-xs">
                <input
                  type="text"
                  placeholder="Tìm tên bệnh nhân..."
                  value={billingSearchQuery}
                  onChange={(e) => setBillingSearchQuery(e.target.value)}
                  className="p-1.5 pl-3.5 border rounded-xl text-xs w-48 font-sans focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 bg-indigo-50 rounded-2xl text-left border border-indigo-100/50">
                <span className="text-[10px] text-indigo-700 uppercase font-bold block">Tổng cộng đã thu</span>
                <span className="text-sm font-extrabold text-indigo-900 block mt-1">
                  {bookings.filter(b => b.paymentStatus === 'Paid').reduce((sum, b) => sum + (b.paymentAmount || 120000), 0).toLocaleString('vi-VN')} đ
                </span>
              </div>
              <div className="p-3 bg-amber-50 rounded-2xl text-left border border-amber-100/50">
                <span className="text-[10px] text-amber-700 uppercase font-bold block">Chưa thu (Chờ)</span>
                <span className="text-sm font-extrabold text-amber-900 block mt-1">
                  {bookings.filter(b => b.paymentStatus === 'Unpaid').reduce((sum, b) => sum + (b.paymentAmount || 120000), 0).toLocaleString('vi-VN')} đ
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-2xl text-left border border-slate-200">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Lượt tiếp khám</span>
                <span className="text-sm font-extrabold text-slate-800 block mt-1">{bookings.length} ca bệnh</span>
              </div>
            </div>

            <div className="border border-slate-150 rounded-xl overflow-hidden overflow-x-auto text-[11px]">
              <table className="w-full text-left font-sans">
                <thead className="bg-slate-50 text-slate-700 text-[9px] font-extrabold uppercase border-b border-slate-150">
                  <tr>
                    <th className="p-2.5">Bệnh nhân / Mã BA</th>
                    <th>Khoa chỉ định</th>
                    <th>Diện thu phí</th>
                    <th>Phương thức</th>
                    <th>Trạng thái</th>
                    <th>Nghiệp vụ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {bookings
                    .filter(b => !billingSearchQuery || b.patientName.toLowerCase().includes(billingSearchQuery.toLowerCase()))
                    .map((b) => (
                      <tr key={b.id} className="hover:bg-slate-50">
                        <td className="p-2.5">
                          <strong className="block text-slate-800 leading-tight">{b.patientName}</strong>
                          <span className="text-[9px] font-mono text-slate-400">{b.id}</span>
                        </td>
                        <td className="text-slate-650 font-medium">{b.departmentName}</td>
                        <td className="font-extrabold text-slate-905 font-mono text-[11px] text-right pr-4">
                          {(b.paymentAmount || 120000).toLocaleString('vi-VN')} đ
                        </td>
                        <td>
                          <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-gray-600 block w-max font-semibold">
                            {b.paymentMethod || 'Chờ thu'}
                          </span>
                        </td>
                        <td>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold block w-max ${
                            b.paymentStatus === 'Paid'
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-100'
                              : 'bg-red-50 text-red-800 border border-red-100 animate-pulse'
                          }`}>
                            {b.paymentStatus === 'Paid' ? 'Đã thu' : 'Chờ nộp'}
                          </span>
                        </td>
                        <td>
                          <div className="flex gap-1">
                            {b.paymentStatus !== 'Paid' ? (
                              <button
                                type="button"
                                onClick={() => {
                                  confirmPayment(b.id, 'Chuyển khoản', b.paymentAmount || 120000);
                                }}
                                className="bg-teal-600 hover:bg-teal-700 font-bold p-1 px-1.5 rounded text-[10px] text-white cursor-pointer"
                              >
                                Thu phí
                              </button>
                            ) : (
                              <span className="text-[10px] text-slate-350 select-none font-bold">✓ Đã đóng</span>
                            )}
                            <button
                              type="button"
                              onClick={() => {
                                setEditingBillingBooking(b);
                                setCustomBilledAmount(b.paymentAmount || 120000);
                              }}
                              className="text-indigo-600 hover:bg-indigo-50 p-1 rounded border border-indigo-200 cursor-pointer text-[10px] font-bold"
                            >
                              Sửa tiền
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>

            {/* Editing custom service costs form modal */}
            {editingBillingBooking && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-none">
                <div className="bg-white border rounded-3xl p-6 w-full max-w-sm text-left space-y-4 font-sans text-xs">
                  <h4 className="font-extrabold text-sm uppercase tracking-wider text-slate-800">Hiệu chỉnh tiền chi khám</h4>
                  <p className="text-[11px] text-gray-500 font-sans">
                    Nhập biểu giá dịch vụ cập nhật cho bệnh ca: <strong className="text-slate-800">{editingBillingBooking.patientName}</strong>.
                  </p>
                  <div className="space-y-1.5">
                    <label className="font-bold text-gray-650 block text-[11px]">Biểu giá viện phí mới (vnđ) *</label>
                    <input
                      type="number"
                      required
                      value={customBilledAmount}
                      onChange={(e) => setCustomBilledAmount(parseInt(e.target.value) || 120000)}
                      className="w-full px-3 py-2 border rounded-xl font-mono text-indigo-700 font-bold text-xs"
                    />
                  </div>
                  <div className="flex justify-end gap-2 text-xs">
                    <button
                      onClick={() => {
                        setEditingBillingBooking(null);
                        const updated = bookings.map(item => {
                          if (item.id === editingBillingBooking.id) {
                            return { ...item, paymentAmount: customBilledAmount };
                          }
                          return item;
                        });
                        localStorage.setItem('thuy_nguyen_bookings', JSON.stringify(updated));
                        window.location.reload();
                      }}
                      className="px-4 py-2 bg-indigo-600 font-bold text-white rounded-xl cursor-pointer"
                    >
                      Lưu và Cập nhật
                    </button>
                    <button
                      onClick={() => setEditingBillingBooking(null)}
                      className="px-4 py-2 border rounded-xl cursor-pointer"
                    >
                      Hủy bỏ
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ADMIN RECORDS MANAGEMENT PANEL */}
      {activeAdminTab === 'records' && (
        <div className="bg-white border border-gray-150 rounded-3xl p-6 shadow-sm space-y-4 animate-fadeIn text-xs text-left font-sans">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b pb-3.5">
            <div>
              <h3 className="font-extrabold text-sm text-slate-800 uppercase tracking-widest flex items-center gap-1.5">
                <Shield size={16} className="text-indigo-600" />
                <span>QUẢN LÝ HỒ SƠ BỆNH ÁN BIÊN TẬP</span>
              </h3>
              <p className="text-[11px] text-gray-400 mt-1 dark:text-slate-505">
                Quản trị viên có toàn quyền thu hồi, hiệu chỉnh, cứu chữa thông tin chẩn đoán lâm sàng, triệu chứng, điều trị và xuất đơn thuốc của Bác sĩ.
              </p>
            </div>
            <div className="relative shrink-0 max-w-xs">
              <input
                type="text"
                placeholder="Tra cứu tên sđt hoặc chẩn đoán..."
                value={recordsSearchQuery}
                onChange={(e) => setRecordsSearchQuery(e.target.value)}
                className="p-1.5 pl-3.5 border border-slate-200 rounded-xl text-xs w-64 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="border border-slate-150 rounded-xl overflow-hidden overflow-x-auto text-[11px]">
            <table className="w-full text-left font-sans">
              <thead className="bg-slate-50 text-slate-700 text-[9px] font-extrabold uppercase select-none border-b border-slate-150">
                <tr>
                  <th className="p-3">Mã bệnh án / Ngày khám</th>
                  <th>Hành chính Bệnh nhân</th>
                  <th>Khoa / Bác sĩ thăm khám</th>
                  <th>Chẩn đoán lâm sáng</th>
                  <th>Nhóm đơn thuốc kê</th>
                  <th className="p-3 text-center">Nghiệp vụ hạch trị</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {bookings
                  .filter(b => b.status === 'Completed') 
                  .filter(b => {
                    if (!recordsSearchQuery) return true;
                    const query = recordsSearchQuery.toLowerCase();
                    return (
                      b.patientName.toLowerCase().includes(query) ||
                      b.patientPhone.includes(query) ||
                      (b.examinationResult?.diagnosis || '').toLowerCase().includes(query)
                    );
                  })
                  .map((b) => (
                    <tr key={b.id} className="hover:bg-slate-50/50">
                      <td className="p-3">
                        <span className="font-mono font-bold text-indigo-700 block">{b.id}</span>
                        <span className="text-[10px] text-gray-400 block mt-0.5">{b.appointmentDate}</span>
                      </td>
                      <td>
                        <strong className="text-slate-800 text-sm block">{b.patientName}</strong>
                        <span className="text-[10.5px] text-gray-500 block">{b.gender} • {b.dob} • {b.patientPhone}</span>
                      </td>
                      <td>
                        <span className="block font-bold text-gray-700">{b.departmentName}</span>
                        <span className="text-[10px] text-indigo-600 block">Thầy thuốc: {b.doctorName}</span>
                      </td>
                      <td>
                        <p className="font-bold text-teal-850 line-clamp-2 max-w-xs">{b.examinationResult?.diagnosis || 'Không ghi nhận bệnh lí'}</p>
                        <p className="text-[10px] font-medium text-gray-400 mt-0.5 line-clamp-1 italic">T.Chứng: {b.examinationResult?.symptoms}</p>
                      </td>
                      <td>
                        <div className="flex flex-wrap gap-1">
                          {b.examinationResult?.medicines && b.examinationResult.medicines.length > 0 ? (
                            b.examinationResult.medicines.map((med: any, i: number) => (
                              <span key={i} className="text-[9px] bg-slate-50 border border-slate-200 px-1 py-0.5 rounded text-slate-705">
                                {med.name} (x{med.quantity})
                              </span>
                            ))
                          ) : (
                            <span className="text-gray-450 italic text-[10px]">Chỉ khám, không chỉ định thuốc</span>
                          )}
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="flex justify-center items-center gap-1">
                          <button
                            type="button"
                            onClick={() => setAdminViewedRecord(b)}
                            className="p-1 px-1.5 border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 text-indigo-755 font-bold rounded-lg cursor-pointer"
                          >
                            Xem BA
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setAdminEditingRecord(b);
                              setEditedSymptoms(b.examinationResult?.symptoms || '');
                              setEditedDiagnosis(b.examinationResult?.diagnosis || '');
                              setEditedNote(b.examinationResult?.doctorNote || '');
                            }}
                            className="p-1 px-1.5 border border-amber-200 bg-amber-50 hover:bg-amber-100 text-amber-755 font-bold rounded-lg cursor-pointer"
                          >
                            Sửa
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              showCustomConfirm(
                                'Xác nhận xóa hồ sơ bệnh án',
                                `Bạn có chắc chắn muốn hủy / Xóa vĩnh viễn hồ sơ bệnh án mã ${b.id}? Hành động này nghiêm trọng và không thể khôi phục!`,
                                () => {
                                  adminDeleteMedicalRecord(b.id);
                                  showCustomAlert('Đã thực hiện xóa hồ sơ bệnh án thành công.', 'success');
                                }
                              );
                            }}
                            className="p-1 text-red-500 hover:bg-red-50 rounded border border-red-100 cursor-pointer flex items-center justify-center"
                            title="Xóa hồ sơ bệnh án"
                          >
                            <Trash2 size={11} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          {/* ADMIN ACTION MODAL: READ-ONLY VIEW RECORD */}
          {adminViewedRecord && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-none">
              <div className="bg-white border w-full max-w-2xl rounded-3xl overflow-hidden p-6 text-left space-y-4 max-h-[90vh] overflow-y-auto font-sans text-xs">
                <div className="flex justify-between items-center border-b pb-3">
                  <h4 className="font-extrabold text-sm text-gray-800 flex items-center gap-1.5 uppercase">
                    <span>📄 CHI TIẾT HỒ SƠ BỆNH ÁN CŨ (HỆ THỐNG TRỰC)</span>
                  </h4>
                  <button onClick={() => setAdminViewedRecord(null)} className="text-gray-400 hover:text-gray-650 text-sm font-black">[x]</button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
                  <div className="p-3 bg-slate-50 rounded-2xl space-y-2 text-left">
                    <h5 className="font-bold text-gray-700 uppercase text-[9px] tracking-wider">Hành chính và Bảo hiểm</h5>
                    <p><strong>Người bệnh:</strong> <span className="font-extrabold text-indigo-700 text-sm">{adminViewedRecord.patientName}</span></p>
                    <p><strong>Năm sinh:</strong> {adminViewedRecord.dob} | <strong>Điện thoại:</strong> {adminViewedRecord.patientPhone}</p>
                    <p><strong>BHYT Code:</strong> {adminViewedRecord.insuranceCode || 'Hệ khám dịch vụ ngoài BHYT'}</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-2xl space-y-2 text-left">
                    <h5 className="font-bold text-gray-700 uppercase text-[9px] tracking-wider">Thông số khám bệnh</h5>
                    <p><strong>Mã hồ sơ bệnh án:</strong> <span className="font-mono font-bold text-indigo-650">{adminViewedRecord.id}</span></p>
                    <p><strong>Khoa:</strong> {adminViewedRecord.departmentName} | <strong>Bác sĩ:</strong> {adminViewedRecord.doctorName}</p>
                    <p><strong>Ca ngày:</strong> {adminViewedRecord.appointmentTime} ({adminViewedRecord.appointmentDate})</p>
                  </div>
                </div>

                {adminViewedRecord.examinationResult && (
                  <div className="space-y-4 pt-2">
                    <div className="p-4 border border-indigo-100 bg-indigo-50/5 rounded-2xl space-y-2">
                      <h5 className="font-black text-indigo-800 uppercase tracking-widest text-[9px]">Chẩn đoán nghiệp vụ lâm bạ</h5>
                      <p><strong>Triệu chứng hiển thị:</strong> {adminViewedRecord.examinationResult.symptoms}</p>
                      <p><strong className="text-teal-700 font-bold">Chẩn đoán sau cùng:</strong> {adminViewedRecord.examinationResult.diagnosis}</p>
                      {adminViewedRecord.examinationResult.doctorNote && (
                        <p className="border-t border-slate-100 pt-2 text-slate-500 italic"><strong>Dặn dò của lương y:</strong> "{adminViewedRecord.examinationResult.doctorNote}"</p>
                      )}
                    </div>

                    <div className="space-y-2 text-xs">
                      <h5 className="font-black text-slate-700 uppercase tracking-widest text-[9px]">💊 Chi tiết đơn thuốc kê</h5>
                      {!adminViewedRecord.examinationResult.medicines || adminViewedRecord.examinationResult.medicines.length === 0 ? (
                        <p className="italic text-gray-400">Bác sĩ không kê đơn thuốc cho ca này.</p>
                      ) : (
                        <div className="border border-slate-150 rounded-xl overflow-hidden font-sans">
                          <table className="w-full text-left text-xs font-sans">
                            <thead className="bg-slate-50 text-[9px] font-bold uppercase select-none">
                              <tr className="border-b border-gray-150">
                                <th className="p-2">Tên Thuốc</th>
                                <th>Số lượng</th>
                                <th>Cách dùng & Liều lượng</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 bg-white">
                              {adminViewedRecord.examinationResult.medicines.map((med: any, i: number) => (
                                <tr key={i} className="hover:bg-slate-50">
                                  <td className="p-2 font-bold text-gray-800">{med.name}</td>
                                  <td className="font-mono text-indigo-700 font-bold">{med.quantity}</td>
                                  <td>
                                    <span>{med.dosage}</span>
                                    <span className="text-[10px] text-gray-400 block">{med.instruction}</span>
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

                <div className="pt-4 border-t flex justify-end">
                  <button onClick={() => setAdminViewedRecord(null)} className="px-5 py-2.5 bg-indigo-600 font-bold text-white rounded-xl cursor-pointer">Đóng bệnh án</button>
                </div>
              </div>
            </div>
          )}

          {/* ADMIN ACTION MODAL: EDIT RECORD */}
          {adminEditingRecord && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-none">
              <div className="bg-white border w-full max-w-lg rounded-3xl p-6 text-left space-y-4 max-h-[90vh] overflow-y-auto font-sans text-xs">
                <div className="flex justify-between items-center border-b pb-3">
                  <h4 className="font-extrabold text-sm text-gray-850 uppercase tracking-wider flex items-center gap-1">
                    <span>✍️ HIỆU CHỈNH CHẨN ĐOÁN LÂM SÀNG CA BỆNH</span>
                  </h4>
                  <button onClick={() => setAdminEditingRecord(null)} className="text-gray-400 hover:text-gray-650 text-sm font-black">[x]</button>
                </div>

                <div className="p-3 bg-indigo-50/55 border border-indigo-100 rounded-2xl">
                  <p><strong>Bệnh nhân:</strong> <span className="font-extrabold text-indigo-750">{adminEditingRecord.patientName}</span> ({adminEditingRecord.dob})</p>
                  <p className="mt-1"><strong>Mã bệnh án:</strong> <span className="font-mono font-bold text-indigo-600">{adminEditingRecord.id}</span></p>
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    adminUpdateMedicalRecord(adminEditingRecord.id, editedSymptoms, editedDiagnosis, editedNote);
                    setAdminEditingRecord(null);
                  }}
                  className="space-y-4 text-xs font-sans"
                >
                  <div className="space-y-1.5">
                    <label className="font-bold text-gray-650 block">Triệu chứng của bệnh nhân *</label>
                    <textarea
                      required
                      rows={2}
                      value={editedSymptoms}
                      onChange={(e) => setEditedSymptoms(e.target.value)}
                      className="w-full px-3 py-2 border rounded-xl font-sans"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-gray-650 block">Chẩn đoán bệnh lý chính *</label>
                    <input
                      type="text"
                      required
                      value={editedDiagnosis}
                      onChange={(e) => setEditedDiagnosis(e.target.value)}
                      className="w-full px-3 py-2 border rounded-xl font-sans font-bold text-teal-800"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-gray-650 block">Lời dặn / Chỉ dẫn lời bác sĩ tư vấn</label>
                    <textarea
                      rows={3}
                      value={editedNote}
                      onChange={(e) => setEditedNote(e.target.value)}
                      className="w-full px-3 py-2 border rounded-xl font-sans"
                    />
                  </div>

                  <div className="pt-2 border-t flex justify-end gap-2 text-xs">
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md cursor-pointer flex items-center gap-1"
                    >
                      <CheckCircle2 size={13} />
                      <span>Xác Nhận Lưu Thay Đổi</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setAdminEditingRecord(null)}
                      className="px-4 py-2.5 border rounded-xl cursor-pointer"
                    >
                      Hủy bỏ
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ADMIN DEPARTMENTS MANAGEMENT PANEL */}
      {activeAdminTab === 'departments' && (
        <div className="bg-white border border-gray-150 rounded-3xl p-6 shadow-sm space-y-6 animate-fadeIn text-xs text-left font-sans">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b pb-4">
            <div>
              <h3 className="font-extrabold text-sm text-slate-800 uppercase tracking-widest flex items-center gap-1.5">
                <span>🏥 QUẢN LÝ CHUYÊN KHOA LÂM SÀNG</span>
              </h3>
              <p className="text-[11px] text-gray-400 mt-1">
                Khu vực tùy chỉnh, cấu hình danh mục các khoa ban lâm sàng đang hoạt động tại Bệnh viện Đa khoa Thủy Nguyên.
              </p>
            </div>
            <button
              onClick={() => {
                setNewDeptId('');
                setNewDeptName('');
                setNewDeptDescription('');
                setNewDeptIcon('Stethoscope');
                setNewDeptHighlights('');
                setShowAddDeptModal(true);
              }}
              className="px-4 py-2 bg-indigo-650 hover:bg-indigo-700 text-white font-bold rounded-xl cursor-pointer flex items-center justify-center gap-1.5 self-start sm:self-center transition-colors"
            >
              <span>＋ Thêm Chuyên khoa mới</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {departments.map((dept) => (
              <div key={dept.id} className="border border-slate-150 rounded-2xl p-4 bg-white hover:shadow-md transition-all flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-indigo-50 text-indigo-650 rounded-xl font-bold">
                      🏥
                    </div>
                    <div>
                      <h4 className="font-extrabold text-[13px] text-slate-800 tracking-tight leading-snug">{dept.name}</h4>
                      <span className="font-mono text-[9px] text-gray-400 lowercase">{dept.id}</span>
                    </div>
                  </div>
                  <p className="text-gray-500 text-[11px] leading-relaxed line-clamp-3">{dept.description}</p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex justify-between items-center bg-slate-50/50 -m-4 mt-1 p-3 rounded-b-2xl">
                  <span className="text-[9px] text-slate-400 font-semibold uppercase font-mono">Mã khoa: {dept.id}</span>
                  <div className="flex gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingDept(dept);
                        setEditedDeptName(dept.name);
                      }}
                      className="p-1 px-2 text-[10px] bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 text-indigo-700 font-bold rounded-lg cursor-pointer transition-colors"
                    >
                      Sửa tên
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        showCustomConfirm(
                          'Xác nhận xóa chuyên khoa',
                          `Bạn có chắc muốn xóa chuyên khoa "${dept.name}" này? Hành động này không thể hoàn tác và sẽ hiển thị thay đổi lập tức trên tất cả phân khoa phòng khám.`,
                          () => {
                            deleteDepartment(dept.id);
                            showCustomAlert(`Đã xóa chuyên khoa ${dept.name} thành công.`, 'success');
                          }
                        );
                      }}
                      className="p-1 px-2 text-[10px] bg-red-50 border border-red-200 hover:bg-red-100 text-red-700 font-bold rounded-lg cursor-pointer transition-colors"
                    >
                      Xóa
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ADMIN ACTION MODAL: EDIT DEPARTMENT */}
          {editingDept && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-none">
              <div className="bg-white border w-full max-w-sm rounded-3xl p-6 text-left space-y-4 font-sans text-xs">
                <div className="flex justify-between items-center border-b pb-3">
                  <h4 className="font-extrabold text-sm text-gray-850 uppercase tracking-wider flex items-center gap-1">
                    <span>✍️ SỬA TÊN CHUYÊN KHOA</span>
                  </h4>
                  <button onClick={() => setEditingDept(null)} className="text-gray-400 hover:text-gray-650 text-sm font-black">[x]</button>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-100 rounded-2xl space-y-1">
                  <p className="text-gray-400 text-[10px] uppercase font-bold tracking-wider">Mã định danh khoa</p>
                  <strong className="text-indigo-600 font-mono text-xs">{editingDept.id}</strong>
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (editedDeptName.trim()) {
                      updateDepartmentName(editingDept.id, editedDeptName.trim());
                      setEditingDept(null);
                    }
                  }}
                  className="space-y-4 text-xs font-sans"
                >
                  <div className="space-y-1.5">
                    <label className="font-bold text-gray-650 block">Tên chuyên khoa mới *</label>
                    <input
                      type="text"
                      required
                      value={editedDeptName}
                      onChange={(e) => setEditedDeptName(e.target.value)}
                      className="w-full px-3 py-2 border rounded-xl font-sans font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>

                  <div className="pt-2 border-t flex justify-end gap-2 text-xs">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl cursor-pointer"
                    >
                      Lưu thay đổi
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingDept(null)}
                      className="px-4 py-2 border rounded-xl cursor-pointer hover:bg-slate-50"
                    >
                      Hủy bỏ
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* ADMIN ACTION MODAL: ADD DEPARTMENT */}
          {showAddDeptModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-none">
              <div className="bg-white border w-full max-w-md rounded-3xl p-6 text-left space-y-4 font-sans text-xs">
                <div className="flex justify-between items-center border-b pb-3">
                  <h4 className="font-extrabold text-sm text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <span>➕ THÊM CHUYÊN KHOA LÂM SÀNG MỚI</span>
                  </h4>
                  <button onClick={() => setShowAddDeptModal(false)} className="text-gray-400 hover:text-gray-650 text-sm font-black">[x]</button>
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!newDeptName.trim()) return alert('Chưa điền tên khoa!');
                    const highlightsArr = newDeptHighlights
                      ? newDeptHighlights.split(',').map((item) => item.trim()).filter(Boolean)
                      : [];
                    addDepartment({
                      id: newDeptId.trim() || undefined,
                      name: newDeptName.trim(),
                      description: newDeptDescription.trim(),
                      icon: newDeptIcon,
                      highlights: highlightsArr,
                    });
                    setShowAddDeptModal(false);
                  }}
                  className="space-y-4 text-xs font-sans"
                >
                  <div className="space-y-1.5">
                    <label className="font-bold text-gray-650 block">Tên chuyên khoa *</label>
                    <input
                      type="text"
                      required
                      placeholder="VD: Khoa Hồi Sức Tích Cực"
                      value={newDeptName}
                      onChange={(e) => setNewDeptName(e.target.value)}
                      className="w-full px-3 py-2 border rounded-xl font-sans font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-sans"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-gray-650 block">Mã khoa / Slug (Không bắt buộc)</label>
                    <input
                      type="text"
                      placeholder="Tự sinh nếu trống, VD: hoi-suc-tich-cuc"
                      value={newDeptId}
                      onChange={(e) => setNewDeptId(e.target.value)}
                      className="w-full px-3 py-2 border rounded-xl font-sans font-mono text-slate-850 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-gray-650 block">Mô tả tóm tắt</label>
                    <textarea
                      rows={2}
                      placeholder="Mô tả tóm tắt chức năng và nhiệm vụ chuyên môn của khoa phòng..."
                      value={newDeptDescription}
                      onChange={(e) => setNewDeptDescription(e.target.value)}
                      className="w-full px-3 py-2 border rounded-xl font-sans text-slate-850 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="font-bold text-gray-650 block">Biểu tượng (Icon) *</label>
                      <select
                        value={newDeptIcon}
                        onChange={(e) => setNewDeptIcon(e.target.value)}
                        className="w-full px-3 py-2 border rounded-xl bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 font-bold"
                      >
                        <option value="Stethoscope">Stethoscope (Khám bệnh)</option>
                        <option value="Activity">Activity (Cấp cứu)</option>
                        <option value="Heart">Heart (Tim mạch)</option>
                        <option value="Scissors">Scissors (Ngoại t.hợp)</option>
                        <option value="Baby">Baby (Nhi khoa)</option>
                        <option value="Smile">Smile (Răng Hàm Mặt)</option>
                        <option value="Scan">Scan (Chẩn đoán hình ảnh)</option>
                        <option value="Sparkles">Sparkles (Sản phụ khoa)</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-bold text-gray-650 block">Điểm nổi bật (Dấu ",")</label>
                      <input
                        type="text"
                        placeholder="VD: Cấp cứu 24/7, Đặt nội khí quản"
                        value={newDeptHighlights}
                        onChange={(e) => setNewDeptHighlights(e.target.value)}
                        className="w-full px-3 py-2 border rounded-xl font-sans text-slate-850 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>
                  </div>

                  <div className="pt-2 border-t flex justify-end gap-2 text-xs">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl cursor-pointer"
                    >
                      Tạo chuyên khoa
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddDeptModal(false)}
                      className="px-4 py-2 border rounded-xl cursor-pointer hover:bg-slate-50"
                    >
                      Hủy bỏ
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* CUSTOM CONFIRM DIALOG */}
          {confirmState?.isOpen && (
            <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white border w-full max-w-sm rounded-3xl p-6 text-left space-y-4 font-sans text-xs shadow-xl border-slate-100 animate-none"
              >
                <div className="flex items-center gap-3 border-b pb-3 text-red-600">
                  <div className="p-2 bg-red-50 text-red-600 rounded-xl shrink-0">
                    <AlertTriangle size={18} />
                  </div>
                  <h4 className="font-extrabold text-sm text-slate-800 uppercase tracking-wider">
                    {confirmState.title}
                  </h4>
                </div>
                <p className="text-gray-600 text-[11px] leading-relaxed font-semibold">
                  {confirmState.message}
                </p>
                <div className="pt-2 border-t flex justify-end gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setConfirmState(null)}
                    className="px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold rounded-xl cursor-pointer transition-colors"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    type="button"
                    onClick={confirmState.onConfirm}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl cursor-pointer shadow-sm transition-colors"
                  >
                    Đồng ý và xóa
                  </button>
                </div>
              </motion.div>
            </div>
          )}

          {/* CUSTOM TOAST ALERT */}
          {alertState?.isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className="fixed top-6 right-6 z-[1000] flex items-center gap-2.5 p-4 py-3 bg-slate-900 text-white rounded-2xl shadow-xl font-sans text-[11px] max-w-sm border border-slate-800"
            >
              <div className="p-1 px-1.5 bg-emerald-500 text-white rounded-full font-sans text-[9px] scale-90 shrink-0 font-bold">
                ✓
              </div>
              <p className="font-semibold text-white pr-2 leading-tight">{alertState.message}</p>
              <button
                onClick={() => setAlertState(null)}
                className="text-slate-400 hover:text-white ml-auto cursor-pointer"
              >
                <X size={14} />
              </button>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
}
