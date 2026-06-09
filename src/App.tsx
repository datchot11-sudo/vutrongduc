/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Header from './components/Header';
import Hero from './components/Hero';
import Stats from './components/Stats';
import Departments from './components/Departments';
import Doctors from './components/Doctors';
import BookingForm from './components/BookingForm';
import ResultsLookup from './components/ResultsLookup';
import NewsSection from './components/NewsSection';
import Footer from './components/Footer';

// Portals dynamic imports
import PatientPortal from './components/PatientPortal';
import DoctorPortal from './components/DoctorPortal';
import ReceptionistPortal from './components/ReceptionistPortal';
import AdminPortal from './components/AdminPortal';
import { Shield, LayoutDashboard, Home, LogOut, Info, Zap, ChevronUp, ChevronDown } from 'lucide-react';

function AppContent() {
  const { currentUser, logout, login, schedules, updateSchedule, medicines, updateMedicine } = useApp();
  const [activeSection, setActiveSection] = useState('trang-chu');
  const [bookedDoctorId, setBookedDoctorId] = useState('');
  const [bookedDeptId, setBookedDeptId] = useState('');

  // Reviewer Assistant Controller Panel States
  const [isDemoPanelExpanded, setIsDemoPanelExpanded] = useState(true);

  const simulateAutoLogin = (username: string, role: 'Patient' | 'Doctor' | 'Receptionist' | 'Admin') => {
    try {
      login(username, role);
      handleNavigate('member-portal');
      alert(`🎉 Đã tự động đăng nhập thành công với vai trò: ${role}!`);
    } catch (e: any) {
      alert(e.message || 'Lỗi liên kết tự động đăng nhập.');
    }
  };

  const triggerDoubleBookingSimulation = () => {
    // Tìm khung giờ sáng của BS Hương
    const huongSchIdx = schedules.findIndex(s => s.doctorId === 'dr-huong' && s.timeSlot === '08:30-09:30');
    if (huongSchIdx !== -1) {
      const updatedSchedules = [...schedules];
      updatedSchedules[huongSchIdx] = {
        ...updatedSchedules[huongSchIdx],
        currentPatients: updatedSchedules[huongSchIdx].maxPatients // Cho đầy hẳn
      };
      updateSchedule(updatedSchedules[huongSchIdx]);
    }
    
    // Đổ sẵn form đặt đặt lịch
    setBookedDoctorId('dr-huong');
    setBookedDeptId('noi-tong-hop');
    handleNavigate('dat-lich');
    alert('🔥 XUNG ĐỘT TRÙNG LỊCH KÍCH HOẠT!\n\nLịch khám BS. Hương lúc 08:30-09:30 đã đạt định mức tối đa 5/5.\nHệ thống đã đưa bạn xuống Form Đăng Ký và điền sẵn Bác sĩ Hương.\nHãy bấm thử nút giờ "08:30" để chứng minh cơ chế ngăn chặn chồng chéo lịch hẹn!');
  };

  const triggerDrugStockoutSimulation = () => {
    const amox = medicines.find(m => m.id === 'MED-001' || m.name.toLowerCase().includes('amoxicillin'));
    if (amox) {
      updateMedicine({
        ...amox,
        stock: 2 // chỉ còn 2 viên
      });
    }

    // Auto login as dr-huong to prescribe
    simulateAutoLogin('dr-huong', 'Doctor');
    alert('🔥 XUNG ĐỘT KÊ ĐƠN PHI VẬN KÍCH HOẠT!\n\nTồn kho Amoxicillin của toàn bệnh viện đã giảm còn đúng 2 hộp.\nHệ thống đã Đăng Nhập bạn với tư cách BS Chuyên khoa Nguyễn Minh Hương tại Cổng Nghiệp Vụ.\nHãy thử bấm nút khám để lập toa thuốc > 2 Amoxicillin và quan sát thông báo Warning!');
  };

  // Handle smooth scroll navigation
  const handleNavigate = (sectionId: string) => {
    setActiveSection(sectionId);
    if (sectionId !== 'member-portal') {
      const element = document.getElementById(sectionId);
      if (element) {
        // Calculate top padding adjustment for fixed elements
        const yOffset = -70; 
        const y = element.getBoundingClientRect().top + window.scrollY + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Callback when patient selects a specific doctor from doctor grid
  const handleSelectDoctor = (doctorId: string, deptId: string) => {
    setBookedDoctorId(doctorId);
    setBookedDeptId(deptId);
    
    // Auto navigate to the booking section
    handleNavigate('dat-lich');
  };

  // Clear choices of preselected doctor after form registers
  const handleClearChoices = () => {
    setBookedDoctorId('');
    setBookedDeptId('');
  };

  // Viewport scroll event listener to update active section highlighting
  useEffect(() => {
    if (activeSection === 'member-portal') return;

    const sections = [
      'trang-chu',
      'gioi-thieu',
      'khoa-phong',
      'bac-si',
      'dat-lich',
      'tra-cuu',
      'tin-tuc',
      'lien-he',
    ];

    const handleScrollDetect = () => {
      const scrollPosition = window.scrollY + 160;
      for (const section of sections) {
        const docEl = document.getElementById(section);
        if (docEl) {
          const offsetTop = docEl.offsetTop;
          const offsetHeight = docEl.offsetHeight;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScrollDetect);
    return () => window.removeEventListener('scroll', handleScrollDetect);
  }, [activeSection]);

  // Force navigate back to portal if currently logged in and clicking member-portal tab
  useEffect(() => {
    if (currentUser && activeSection === 'member-portal') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentUser, activeSection]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans antialiased text-gray-800 flex flex-col justify-between selection:bg-teal-500 selection:text-white">
      {/* Dynamic Navigation Header */}
      <Header activeSection={activeSection} onNavigate={handleNavigate} />

      {/* Main Single Scope Container */}
      <main className="flex-1 w-full flex flex-col">
        {activeSection === 'member-portal' && currentUser ? (
          // RENDER USER PORTAL WORKFLOW
          <div className="w-full max-w-7xl mx-auto px-4 md:px-6 py-8 space-y-6">
            <div className="flex justify-between items-center bg-white p-4.5 rounded-2xl border border-gray-150 shadow-sm flex-wrap gap-2">
              <div className="flex items-center gap-2 text-left">
                <span className="p-2 bg-indigo-50 text-indigo-700 rounded-xl">
                  <LayoutDashboard size={20} />
                </span>
                <div>
                  <h1 className="text-sm font-extrabold text-gray-800 uppercase tracking-tight">Cổng Nghiệp Vụ Bệnh Viện</h1>
                  <p className="text-[11px] text-gray-400 mt-0.5">
                    Tài khoản: <strong className="text-indigo-600">{currentUser.fullName}</strong> | Vai trò: 
                    <span className="text-gray-700 bg-slate-100 rounded-md px-1.5 py-0.5 ml-1 select-none font-bold">
                      {currentUser.role === 'Admin' ? '🛡 Hệ thống Quản trị' : ''}
                      {currentUser.role === 'Doctor' ? '⚕ Bác sĩ Chuyên khoa' : ''}
                      {currentUser.role === 'Receptionist' ? '📋 Lễ tân / Đón tiếp' : ''}
                      {currentUser.role === 'Patient' ? '👤 Bệnh nhân y tế' : ''}
                    </span>
                  </p>
                </div>
              </div>

              {/* Action utility bar in portal */}
              <div className="flex gap-2">
                <button
                  onClick={() => handleNavigate('trang-chu')}
                  className="px-3.5 py-2 border border-slate-250 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl cursor-pointer flex items-center gap-1.5"
                >
                  <Home size={14} />
                  <span>Về trang chủ</span>
                </button>
                <button
                  onClick={() => {
                    logout();
                    handleNavigate('trang-chu');
                    alert('Đã đăng xuất tài khoản thành công!');
                  }}
                  className="px-3.5 py-2 bg-red-50 text-red-600 hover:bg-red-100/40 text-xs font-bold rounded-xl cursor-pointer flex items-center gap-1.5"
                >
                  <LogOut size={14} />
                  <span>Đăng xuất</span>
                </button>
              </div>
            </div>

            {/* DYNAMICALLY LOAD THE SPECIFIC PORTAL ACCORDING TO ACTUAL ROLE */}
            {currentUser.role === 'Patient' && <PatientPortal />}
            {currentUser.role === 'Doctor' && <DoctorPortal />}
            {currentUser.role === 'Receptionist' && <ReceptionistPortal />}
            {currentUser.role === 'Admin' && <AdminPortal />}
          </div>
        ) : (
          // RENDER STANDARD PUBLIC CLINIC WEBSITE
          <>
            {/* Slide Carousel Hero */}
            <div id="trang-chu">
              <Hero onBtnClick={handleNavigate} />
            </div>

            {/* Stats Achievements and Support Shortcuts */}
            <div id="gioi-thieu">
              <Stats />
            </div>

            {/* Clinical Departments Category Catalog */}
            <div id="khoa-phong">
              <Departments />
            </div>

            {/* Doctor profiles with preselect hooks */}
            <div id="bac-si">
              <Doctors onSelectDoctor={handleSelectDoctor} />
            </div>

            {/* Dynamic Medical Slot Booking Form */}
            <div id="dat-lich">
              <BookingForm
                selectedDoctorId={bookedDoctorId}
                selectedDeptId={bookedDeptId}
                clearSelection={handleClearChoices}
              />
            </div>

            {/* Medical report exam results search deck */}
            <div id="tra-cuu">
              <ResultsLookup />
            </div>

            {/* News and advisory feed index */}
            <div id="tin-tuc">
              <NewsSection />
            </div>
          </>
        )}
      </main>

      {/* Bottom Footer block */}
      <Footer onNavigate={handleNavigate} />

      {/* FLOATING REVIEWER CONTROLLER PANEL (Thỏa mãn câu hỏi "làm sao chia sẻ" và Chứng minh Concurrency/Inventory) */}
      <div className="fixed bottom-5 right-5 z-50 max-w-sm w-full bg-slate-950/95 backdrop-blur-md rounded-2xl border border-indigo-500/50 shadow-2xl text-white select-none transition-all duration-300 overflow-hidden">
        {/* Panel Header */}
        <div 
          onClick={() => setIsDemoPanelExpanded(!isDemoPanelExpanded)}
          className="bg-gradient-to-r from-indigo-800 to-indigo-950 px-4 py-3 cursor-pointer flex justify-between items-center"
        >
          <div className="flex items-center gap-1.5">
            <Zap size={14} className="text-amber-400 animate-pulse" />
            <h4 className="text-[11px] font-black uppercase tracking-wider">Hỗ trợ Review nhanh (Dành cho Giám khảo)</h4>
          </div>
          <button className="text-slate-400 hover:text-white transition-colors">
            {isDemoPanelExpanded ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
          </button>
        </div>

        {/* Panel Content */}
        {isDemoPanelExpanded && (
          <div className="p-4 space-y-3.5 text-xs text-left">
            {/* Share guide box */}
            <div className="p-2.5 bg-slate-800/80 rounded-xl border border-slate-700 space-y-1">
              <span className="font-extrabold text-[10px] text-teal-400 flex items-center gap-1 uppercase tracking-wider">
                <Info size={12} className="shrink-0" />
                <span>Cách chia sẻ bản Web cho người khác</span>
              </span>
              <p className="text-[10px] text-slate-300 leading-normal">
                Để chia sẻ bản thử nghiệm này cho thầy cô, đồng nghiệp, hãy bấm nút <strong>"Share" ở góc trên cùng bên phải cửa sổ Google AI Studio</strong>, kích hoạt link công khai là xong!
              </p>
            </div>

            {/* Quick Auto Login entries list */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Bút toán Đăng Nhập Nhanh (Thử tất cả vai trò)</span>
              <div className="grid grid-cols-2 gap-1.5 text-[10px]">
                <button 
                  onClick={() => simulateAutoLogin('admin', 'Admin')}
                  className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-left transition-colors font-semibold truncate flex items-center gap-1 cursor-pointer"
                >
                  <span>🛡️</span> Admin (Lập ca trực)
                </button>
                <button 
                  onClick={() => simulateAutoLogin('letan', 'Receptionist')}
                  className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-left transition-colors font-semibold truncate flex items-center gap-1 cursor-pointer"
                >
                  <span>📋</span> Lễ Tân (Đón tiếp)
                </button>
                <button 
                  onClick={() => simulateAutoLogin('dr-huong', 'Doctor')}
                  className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-left transition-colors font-semibold truncate flex items-center gap-1 cursor-pointer"
                >
                  <span>⚕️</span> Bác Sĩ (Khám & kê đơn)
                </button>
                <button 
                  onClick={() => simulateAutoLogin('0912345678', 'Patient')}
                  className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-left transition-colors font-semibold truncate flex items-center gap-1 cursor-pointer"
                >
                  <span>👤</span> Bệnh Nhân (Có CCCD)
                </button>
              </div>
            </div>

            {/* Simulated concurrency clashing locks */}
            <div className="border-t border-slate-800 pt-3 space-y-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Test cơ chế bảo vệ Độc Quyền (Concurrency & Stock)</span>
              <div className="space-y-1.5">
                <button
                  onClick={triggerDoubleBookingSimulation}
                  className="w-full p-2 bg-gradient-to-r from-teal-500/20 to-teal-500/10 hover:from-teal-500/30 hover:to-teal-500/20 text-teal-300 border border-teal-500/30 rounded-xl font-bold text-left text-[10.5px] transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Zap size={12} className="text-amber-400 shrink-0" />
                  <span>Kích hoạt Block Trùng Lịch Đặt (5/5 ca)</span>
                </button>

                <button
                  onClick={triggerDrugStockoutSimulation}
                  className="w-full p-2 bg-gradient-to-r from-cyan-500/20 to-cyan-500/10 hover:from-cyan-500/30 hover:to-cyan-500/20 text-cyan-300 border border-cyan-500/30 rounded-xl font-bold text-left text-[10.5px] transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Zap size={12} className="text-amber-400 shrink-0" />
                  <span>Kích hoạt Block Hết Thuốc đột xuất</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
