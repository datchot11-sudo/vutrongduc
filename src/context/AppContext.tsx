/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Booking, Doctor, Department, Medicine, UserAccount, PrescriptionItem, Schedule, NewsArticle, HospitalContact } from '../types';
import { DEPARTMENTS, DOCTORS, NEWS_ARTICLES, INITIAL_MEDICINES } from '../data';

interface AppContextType {
  currentUser: UserAccount | null;
  bookings: Booking[];
  medicines: Medicine[];
  doctors: Doctor[];
  departments: Department[];
  accounts: UserAccount[];
  schedules: Schedule[];
  login: (username: string, role: string) => Promise<UserAccount>;
  logout: () => void;
  registerPatient: (
    username: string,
    fullName: string,
    phone: string,
    email: string,
    cccd?: string,
    gender?: 'Nam' | 'Nữ' | 'Khác',
    dob?: string,
    address?: string
  ) => Promise<UserAccount>;
  addBooking: (bookingData: Omit<Booking, 'id' | 'createdAt' | 'status' | 'paymentStatus' | 'queueNumber'>) => Booking;
  updateBookingStatus: (bookingId: string, status: Booking['status']) => void;
  checkInPatient: (bookingId: string) => Booking;
  recordExamination: (bookingId: string, symptoms: string, diagnosis: string, note: string, items: PrescriptionItem[]) => void;
  confirmPayment: (bookingId: string, method: Booking['paymentMethod'], amount: number) => void;
  addDoctor: (doc: Omit<Doctor, 'id'>) => void;
  updateDoctor: (doc: Doctor) => void;
  deleteDoctor: (id: string) => void;
  addMedicine: (med: Medicine) => void;
  updateMedicine: (med: Medicine) => void;
  deleteMedicine: (id: string) => void;
  addUserAccount: (acc: Omit<UserAccount, 'id'>) => void;
  updateUserAccount: (acc: UserAccount) => void;
  deleteUserAccount: (id: string) => void;
  addSchedule: (sch: Omit<Schedule, 'id'>) => void;
  updateSchedule: (sch: Schedule) => void;
  deleteSchedule: (id: string) => void;
  newsArticles: NewsArticle[];
  hospitalContact: HospitalContact;
  addNewsArticle: (news: NewsArticle) => void;
  updateNewsArticle: (news: NewsArticle) => void;
  deleteNewsArticle: (id: string) => void;
  updateHospitalContact: (contact: HospitalContact) => void;
  paymentQrCode: string;
  updatePaymentQrCode: (qr: string) => void;
  adminUpdateMedicalRecord: (bookingId: string, symptoms: string, diagnosis: string, doctorNote: string) => void;
  adminDeleteMedicalRecord: (bookingId: string) => void;
  updateDepartmentName: (id: string, newName: string) => void;
  addDepartment: (dept: Omit<Department, 'id' | 'imageUrl'> & { id?: string; imageUrl?: string }) => void;
  deleteDepartment: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const INITIAL_SCHEDULES: Schedule[] = [
  // Dr. Hoai (dr-hoai) - Khoa Kham Benh
  { id: 'SCH-001', doctorId: 'dr-hoai', doctorName: 'BSCKI. Đỗ Thị Hoài', date: new Date().toISOString().split('T')[0], timeSlot: '07:30-08:30', maxPatients: 5, currentPatients: 2 },
  { id: 'SCH-002', doctorId: 'dr-hoai', doctorName: 'BSCKI. Đỗ Thị Hoài', date: new Date().toISOString().split('T')[0], timeSlot: '08:30-09:30', maxPatients: 5, currentPatients: 4 },
  { id: 'SCH-003', doctorId: 'dr-hoai', doctorName: 'BSCKI. Đỗ Thị Hoài', date: new Date().toISOString().split('T')[0], timeSlot: '09:30-10:30', maxPatients: 5, currentPatients: 5 },
  { id: 'SCH-013', doctorId: 'dr-hoai', doctorName: 'BSCKI. Đỗ Thị Hoài', date: new Date().toISOString().split('T')[0], timeSlot: '13:30-14:30', maxPatients: 5, currentPatients: 1 },

  // Dr. Thanh (dr-thanh) - Khoa Cap Cuu
  { id: 'SCH-006', doctorId: 'dr-thanh', doctorName: 'BSCKI. Chu Hồng Thanh', date: new Date().toISOString().split('T')[0], timeSlot: '07:30-08:30', maxPatients: 5, currentPatients: 1 },
  { id: 'SCH-007', doctorId: 'dr-thanh', doctorName: 'BSCKI. Chu Hồng Thanh', date: new Date().toISOString().split('T')[0], timeSlot: '08:30-09:30', maxPatients: 5, currentPatients: 0 },
  { id: 'SCH-008', doctorId: 'dr-thanh', doctorName: 'BSCKI. Chu Hồng Thanh', date: new Date().toISOString().split('T')[0], timeSlot: '09:30-10:30', maxPatients: 5, currentPatients: 3 },

  // Dr. Nghia (dr-nghia) - Khoa San
  { id: 'SCH-009', doctorId: 'dr-nghia', doctorName: 'BSCKII. Phạm Hữu Nghĩa', date: new Date().toISOString().split('T')[0], timeSlot: '08:30-09:30', maxPatients: 5, currentPatients: 4 },
  { id: 'SCH-010', doctorId: 'dr-nghia', doctorName: 'BSCKII. Phạm Hữu Nghĩa', date: new Date().toISOString().split('T')[0], timeSlot: '09:30-10:30', maxPatients: 5, currentPatients: 2 },

  // Dr. Yen (dr-yen) - Khoa Nhi
  { id: 'SCH-011', doctorId: 'dr-yen', doctorName: 'BSCKII. Đinh Thị Yến', date: new Date().toISOString().split('T')[0], timeSlot: '08:30-09:30', maxPatients: 5, currentPatients: 1 },
  { id: 'SCH-012', doctorId: 'dr-yen', doctorName: 'BSCKII. Đinh Thị Yến', date: new Date().toISOString().split('T')[0], timeSlot: '09:30-10:30', maxPatients: 5, currentPatients: 5 },
];

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [departments, setDepartments] = useState<Department[]>(DEPARTMENTS);
  const [accounts, setAccounts] = useState<UserAccount[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [newsArticles, setNewsArticles] = useState<NewsArticle[]>([]);
  const [hospitalContact, setHospitalContact] = useState<HospitalContact>({
    hotline: '1900 9095',
    emergency: '0225 3859 135',
    email: 'bvdkthuynguyen@gmail.com',
    address: 'Thôn Bạch Đằng, Xã Thủy Sơn, Huyện Thủy Nguyên, Thành phố Hải Phòng, Việt Nam'
  });
  const [paymentQrCode, setPaymentQrCode] = useState<string>('https://images.unsplash.com/photo-1614741118887-7a4ee193a5fa?auto=format&fit=crop&q=80&w=300');

  // Load initial state from local storage or defaults on mount
  useEffect(() => {
    // 1. Medicines
    const storedMeds = localStorage.getItem('thuy_nguyen_medicines');
    if (storedMeds) {
      setMedicines(JSON.parse(storedMeds));
    } else {
      setMedicines(INITIAL_MEDICINES);
      localStorage.setItem('thuy_nguyen_medicines', JSON.stringify(INITIAL_MEDICINES));
    }

    // 2. Doctors
    const storedDocs = localStorage.getItem('thuy_nguyen_doctors');
    if (storedDocs) {
      try {
        const parsed = JSON.parse(storedDocs);
        // Clean up or restore accurate rooms from DOCTORS dataset
        const verified = parsed.map((pDoc: any) => {
          const matched = DOCTORS.find((d) => d.id === pDoc.id);
          if (matched) {
            return {
              ...pDoc,
              room: matched.room || pDoc.room || 'Phòng khám',
              experience: matched.experience || pDoc.experience,
              title: matched.title || pDoc.title,
              specialtyName: matched.specialtyName || pDoc.specialtyName,
            };
          }
          return pDoc;
        });
        setDoctors(verified);
        localStorage.setItem('thuy_nguyen_doctors', JSON.stringify(verified));
      } catch (err) {
        // Fallback if JSON parse failed
        const formattedDoctors = DOCTORS.map((doc, idx) => ({
          ...doc,
          room: doc.room || `Phòng ${101 + idx * 5}`,
          currentSchedule: ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6'],
        }));
        setDoctors(formattedDoctors);
        localStorage.setItem('thuy_nguyen_doctors', JSON.stringify(formattedDoctors));
      }
    } else {
      // Add default values for doctors
      const formattedDoctors = DOCTORS.map((doc, idx) => ({
        ...doc,
        room: doc.room || `Phòng ${101 + idx * 5}`,
        currentSchedule: ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6'],
      }));
      setDoctors(formattedDoctors);
      localStorage.setItem('thuy_nguyen_doctors', JSON.stringify(formattedDoctors));
    }

    // 3. User Accounts (for testing logins)
    const storedAccs = localStorage.getItem('thuy_nguyen_accounts');
    if (storedAccs) {
      setAccounts(JSON.parse(storedAccs));
    } else {
      const defaultAccounts: UserAccount[] = [
        { id: 'ACC-001', username: 'admin', fullName: 'Phòng CNTT - Admin', role: 'Admin', status: 'Active' },
        { id: 'ACC-002', username: 'letan', fullName: 'Lễ tân Nguyễn Thị Hoa', role: 'Receptionist', status: 'Active' },
        { id: 'ACC-003', username: 'dr-huy', fullName: 'ThS.BS. Nguyễn Văn Huy', role: 'Doctor', specialtyId: 'ngoai-tong-hop', status: 'Active' },
        { id: 'ACC-004', username: 'dr-hoai', fullName: 'BSCKI. Đỗ Thị Hoài', role: 'Doctor', specialtyId: 'kham-benh', status: 'Active' },
        { id: 'ACC-005', username: 'dr-nghia', fullName: 'BSCKII. Phạm Hữu Nghĩa', role: 'Doctor', specialtyId: 'san-phu', status: 'Active' },
        { id: 'ACC-006', username: 'dr-yen', fullName: 'BSCKII. Đinh Thị Yến', role: 'Doctor', specialtyId: 'nhi-khoa', status: 'Active' },
        { id: 'ACC-007', username: '0912345678', fullName: 'Nguyễn Văn Mạnh', role: 'Patient', status: 'Active', phone: '0912345678', email: 'manhnguyen@gmail.com' },
        { id: 'ACC-008', username: '0987654321', fullName: 'Trần Thị Thảo', role: 'Patient', status: 'Active', phone: '0987654321', email: 'thaotran@gmail.com' },
      ];
      setAccounts(defaultAccounts);
      localStorage.setItem('thuy_nguyen_accounts', JSON.stringify(defaultAccounts));
    }

    // 4. Bookings
    const storedBookings = localStorage.getItem('thuy_nguyen_bookings');
    if (storedBookings) {
      setBookings(JSON.parse(storedBookings));
    } else {
      // Seed initial dummy appointments for doctors
      const defaultBookings: Booking[] = [
        {
          id: 'DK-020420',
          patientName: 'Nguyễn Văn Mạnh',
          patientPhone: '0912345678',
          patientEmail: 'manhnguyen@gmail.com',
          dob: '1988-10-15',
          gender: 'Nam',
          appointmentDate: new Date().toISOString().split('T')[0],
          appointmentTime: '08:30',
          departmentId: 'noi-tong-hop',
          departmentName: 'Khoa Nội Tổng Hợp',
          doctorId: 'dr-duy',
          doctorName: 'BSCKI. Phạm Văn Duy',
          reason: 'Ấn ngực tức nhói, muốn kiểm tra men gan mỡ máu định kỳ',
          status: 'Completed',
          insuranceCode: 'GD431154213567',
          queueNumber: 'N-01',
          createdAt: new Date().toLocaleDateString('vi-VN'),
          paymentStatus: 'Paid',
          paymentMethod: 'Chuyển khoản',
          paymentAmount: 120000,
          examinationResult: {
            symptoms: 'Ngực tức nhói nhẹ vùng mỏm tim, ăn uống khó tiêu, người mệt mỏi',
            diagnosis: 'Rối loạn chuyển hóa mỡ máu tăng nhẹ, men gan tăng độ 1, lo dạ dày nhẹ',
            doctorNote: 'Tránh bia rượu nước ngọt, sáng tập thể dục 30p, uống nhiều nước ấm. Tái khám sau 3 tháng.',
            medicines: [
              { medicineId: 'NTH008', name: 'Omeprazole 20mg - NTH', quantity: 15, dosage: 'Sáng uống 1 viên trước ăn 30p', instruction: 'Uống trước ăn sáng 30 phút' }
            ] as PrescriptionItem[]
          }
        },
        {
          id: 'DK-020425',
          patientName: 'Trần Thị Thảo',
          patientPhone: '0987654321',
          patientEmail: 'thaotran@gmail.com',
          dob: '1995-04-20',
          gender: 'Nữ',
          appointmentDate: new Date().toISOString().split('T')[0],
          appointmentTime: '09:30',
          departmentId: 'san-phu',
          departmentName: 'Khoa Phụ Sản',
          doctorId: 'dr-nghia',
          doctorName: 'BSCKII. Phạm Hữu Nghĩa',
          reason: 'Khám thai hành trình tháng thứ 5 định kỳ',
          status: 'Checked-In',
          insuranceCode: 'TE111245621354',
          queueNumber: 'S-03',
          createdAt: new Date().toLocaleDateString('vi-VN'),
          paymentStatus: 'Paid',
          paymentMethod: 'Tiền mặt',
          paymentAmount: 150000,
        },
        {
          id: 'DK-020430',
          patientName: 'Lê Hoàng Minh',
          patientPhone: '0945623789',
          patientEmail: 'minhhoang@gmail.com',
          dob: '2019-12-05',
          gender: 'Nam',
          appointmentDate: new Date().toISOString().split('T')[0],
          appointmentTime: '10:30',
          departmentId: 'nhi-khoa',
          departmentName: 'Khoa Nhi',
          doctorId: 'dr-yen',
          doctorName: 'BSCKII. Đinh Thị Yến',
          reason: 'Trẻ sốt cao ban đêm, ho khò khè kéo dài',
          status: 'Confirmed',
          queueNumber: 'NH-05',
          createdAt: new Date().toLocaleDateString('vi-VN'),
          paymentStatus: 'Unpaid',
        },
        {
          id: 'DK-020440',
          patientName: 'Hoàng Văn Thắng',
          patientPhone: '0952147863',
          patientEmail: 'thanghoang@gmail.com',
          dob: '1975-08-30',
          gender: 'Nam',
          appointmentDate: new Date().toISOString().split('T')[0],
          appointmentTime: '14:30',
          departmentId: 'ngoai-tong-hop',
          departmentName: 'Khoa Ngoại Tổng Hợp',
          doctorId: 'dr-trung',
          doctorName: 'BSCKII. Lê Khắc Trung',
          reason: 'Đau tức hông sườn phải dữ dội xuyên ra sau lưng',
          status: 'Pending',
          queueNumber: 'NG-12',
          createdAt: new Date().toLocaleDateString('vi-VN'),
          paymentStatus: 'Unpaid',
        }
      ];
      setBookings(defaultBookings);
      localStorage.setItem('thuy_nguyen_bookings', JSON.stringify(defaultBookings));
    }

    // 5. Check if some user session is active
    const storedUser = sessionStorage.getItem('thuy_nguyen_active_user');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }

    // 6. Schedules
    const storedSchedules = localStorage.getItem('thuy_nguyen_schedules');
    if (storedSchedules) {
      setSchedules(JSON.parse(storedSchedules));
    } else {
      setSchedules(INITIAL_SCHEDULES);
      localStorage.setItem('thuy_nguyen_schedules', JSON.stringify(INITIAL_SCHEDULES));
    }

    // 7. News Articles
    const storedNews = localStorage.getItem('thuy_nguyen_news');
    if (storedNews) {
      setNewsArticles(JSON.parse(storedNews));
    } else {
      setNewsArticles(NEWS_ARTICLES);
      localStorage.setItem('thuy_nguyen_news', JSON.stringify(NEWS_ARTICLES));
    }

    // 8. Hospital Contact Settings
    const storedContact = localStorage.getItem('thuy_nguyen_hospital_contact_settings');
    if (storedContact) {
      setHospitalContact(JSON.parse(storedContact));
    } else {
      const defaultContact = {
        hotline: '1900 9095',
        emergency: '0225 3859 135',
        email: 'bvdkthuynguyen@gmail.com',
        address: 'Thôn Bạch Đằng, Xã Thủy Sơn, Huyện Thủy Nguyên, Thành phố Hải Phòng, Việt Nam'
      };
      setHospitalContact(defaultContact);
      localStorage.setItem('thuy_nguyen_hospital_contact_settings', JSON.stringify(defaultContact));
    }

    // 9. Payment QR Code Settings
    const storedQr = localStorage.getItem('thuy_nguyen_payment_qr');
    if (storedQr) {
      setPaymentQrCode(storedQr);
    } else {
      const defaultQr = 'https://images.unsplash.com/photo-1614741118887-7a4ee193a5fa?auto=format&fit=crop&q=80&w=300';
      setPaymentQrCode(defaultQr);
      localStorage.setItem('thuy_nguyen_payment_qr', defaultQr);
    }

    // 10. Departments
    const storedDepts = localStorage.getItem('thuy_nguyen_departments');
    if (storedDepts) {
      setDepartments(JSON.parse(storedDepts));
    } else {
      setDepartments(DEPARTMENTS);
      localStorage.setItem('thuy_nguyen_departments', JSON.stringify(DEPARTMENTS));
    }
  }, []);

  const login = async (username: string, role: string): Promise<UserAccount> => {
    // Find credentials (pretend all match if password matches accounts, password-check is skipped for easy mock)
    const match = accounts.find(
      (acc) => acc.username.toLowerCase() === username.toLowerCase() && acc.role === role
    );
    if (match) {
      if (match.status === 'Locked') {
        throw new Error('Tài khoản của bạn đã bị khóa bởi quản trị vị!');
      }
      setCurrentUser(match);
      sessionStorage.setItem('thuy_nguyen_active_user', JSON.stringify(match));
      return match;
    } else {
      // Mock-create/fallback patient logic if typing standard phone logic directly
      if (role === 'Patient' && /^[0-9+]{9,11}$/.test(username)) {
        const newPatient: UserAccount = {
          id: `ACC-${Date.now().toString().slice(-4)}`,
          username,
          fullName: 'Bệnh Nhân Mới',
          role: 'Patient',
          phone: username,
          status: 'Active',
        };
        const updatedAccs = [...accounts, newPatient];
        setAccounts(updatedAccs);
        localStorage.setItem('thuy_nguyen_accounts', JSON.stringify(updatedAccs));
        setCurrentUser(newPatient);
        sessionStorage.setItem('thuy_nguyen_active_user', JSON.stringify(newPatient));
        return newPatient;
      }
      throw new Error('Tài khoản không chính xác hoặc không đúng vai trò lựa chọn!');
    }
  };

  const logout = () => {
    setCurrentUser(null);
    sessionStorage.removeItem('thuy_nguyen_active_user');
  };

  const registerPatient = async (
    username: string,
    fullName: string,
    phone: string,
    email: string,
    cccd?: string,
    gender?: 'Nam' | 'Nữ' | 'Khác',
    dob?: string,
    address?: string
  ): Promise<UserAccount> => {
    const exists = accounts.some((acc) => acc.username.toLowerCase() === username.toLowerCase());
    if (exists) {
      throw new Error('Số điện thoại/Tên đăng nhập này đã tồn tại trên hệ thống!');
    }
    const newPatient: UserAccount = {
      id: `ACC-PAT-${Date.now().toString().slice(-4)}`,
      username,
      fullName,
      role: 'Patient',
      phone,
      email,
      cccd,
      gender,
      dob,
      address,
      status: 'Active',
    };
    const updated = [...accounts, newPatient];
    setAccounts(updated);
    localStorage.setItem('thuy_nguyen_accounts', JSON.stringify(updated));
    setCurrentUser(newPatient);
    sessionStorage.setItem('thuy_nguyen_active_user', JSON.stringify(newPatient));
    return newPatient;
  };

  const addBooking = (bookingData: Omit<Booking, 'id' | 'createdAt' | 'status' | 'paymentStatus' | 'queueNumber'>) => {
    // 1. Check schedule constraints (Tránh chồng lấn lịch)
    if (bookingData.scheduleId) {
      const schIdx = schedules.findIndex((s) => s.id === bookingData.scheduleId);
      if (schIdx !== -1) {
        const sch = schedules[schIdx];
        if (sch.currentPatients >= sch.maxPatients) {
          throw new Error(
            `Lỗi chồng lấn lịch đăng ký: Khung giờ "${sch.timeSlot}" của bác sĩ "${sch.doctorName}" đã đầy (${sch.maxPatients}/${sch.maxPatients} bệnh nhân). Vui lòng chọn khung giờ hoặc bác sĩ khác!`
          );
        }
        
        // Cập nhật số lượng chỗ trống trong slot đó
        const updatedSchedules = [...schedules];
        updatedSchedules[schIdx] = {
          ...sch,
          currentPatients: sch.currentPatients + 1,
        };
        setSchedules(updatedSchedules);
        localStorage.setItem('thuy_nguyen_schedules', JSON.stringify(updatedSchedules));
      }
    }

    const id = `DK-${Date.now().toString().slice(-6)}`;
    const randomCode = Math.floor(10 + Math.random() * 89);
    const departmentInitialsMap: Record<string, string> = {
      'noi-tong-hop': 'N',
      'ngoai-tong-hop': 'NG',
      'san-phu': 'S',
      'nhi-khoa': 'NH',
      'kham-benh': 'KB',
      'tai-mui-hong': 'TMH',
      'chan-doan-hinh-anh': 'HA',
    };
    const prefix = departmentInitialsMap[bookingData.departmentId] || 'QT';
    const queueNumber = `${prefix}-${randomCode}`;

    const newBooking: Booking = {
      ...bookingData,
      id,
      status: 'Pending',
      paymentStatus: 'Unpaid',
      queueNumber,
      createdAt: new Date().toLocaleDateString('vi-VN'),
    };

    const updated = [newBooking, ...bookings];
    setBookings(updated);
    localStorage.setItem('thuy_nguyen_bookings', JSON.stringify(updated));
    return newBooking;
  };

  const updateBookingStatus = (bookingId: string, status: Booking['status']) => {
    const updated = bookings.map((b) => {
      if (b.id === bookingId) {
        return { ...b, status };
      }
      return b;
    });
    setBookings(updated);
    localStorage.setItem('thuy_nguyen_bookings', JSON.stringify(updated));
  };

  const checkInPatient = (bookingId: string) => {
    let targetBooking!: Booking;
    const updated = bookings.map((b) => {
      if (b.id === bookingId) {
        // Sinh STT số nhỏ ví dụ: N-02, NG-04
        const departmentInitialsMap: Record<string, string> = {
          'noi-tong-hop': 'N',
          'ngoai-tong-hop': 'NG',
          'san-phu': 'S',
          'nhi-khoa': 'NH',
          'kham-benh': 'KB',
          'tai-mui-hong': 'TMH',
          'chan-doan-hinh-anh': 'HA',
        };
        const prefix = departmentInitialsMap[b.departmentId] || 'QT';
        const num = Math.floor(1 + Math.random() * 20).toString().padStart(2, '0');
        const queueNumber = `${prefix}-${num}`;
        
        targetBooking = { ...b, status: 'Checked-In' as const, queueNumber };
        return targetBooking;
      }
      return b;
    });
    setBookings(updated);
    localStorage.setItem('thuy_nguyen_bookings', JSON.stringify(updated));
    return targetBooking;
  };

  const recordExamination = (
    bookingId: string,
    symptoms: string,
    diagnosis: string,
    note: string,
    items: PrescriptionItem[]
  ) => {
    // 1. Kiểm tra tồn kho trước khi trừ kho (Tránh hết thuốc đột ngột), bỏ qua thuốc tự nhập ngoài danh mục
    for (const item of items) {
      if (item.medicineId?.startsWith('custom-')) {
        continue;
      }
      const dbMed = medicines.find((m) => m.id === item.medicineId);
      if (!dbMed) {
        throw new Error(`Không thấy thuốc ID "${item.medicineId}" trong danh mục sản phẩm!`);
      }
      if (dbMed.stock < item.quantity) {
        throw new Error(
          `Lỗi trừ kho đồng thời: Thuốc "${item.name}" hiện chỉ còn [ ${dbMed.stock} ] viên trong kho. Không thể hoàn thành đơn thuốc (${item.quantity} viên yêu cầu). Vui lòng điều chỉnh lại chủng loại!`
        );
      }
    }

    // 2. Update Booking status and record details
    const updatedBookings = bookings.map((b) => {
      if (b.id === bookingId) {
        return {
          ...b,
          status: 'Completed' as const,
          examinationResult: {
            symptoms,
            diagnosis,
            doctorNote: note,
            medicines: items,
          },
        };
      }
      return b;
    });
    setBookings(updatedBookings);
    localStorage.setItem('thuy_nguyen_bookings', JSON.stringify(updatedBookings));

    // 3. Reduce medicine stocks SAFELY, ignoring custom non-formulary typed items
    const updatedMeds = medicines.map((med) => {
      const prescribedItem = items.find((itm) => itm.medicineId === med.id);
      if (prescribedItem && !prescribedItem.medicineId?.startsWith('custom-')) {
        const newStock = med.stock - prescribedItem.quantity;
        return { ...med, stock: newStock };
      }
      return med;
    });
    setMedicines(updatedMeds);
    localStorage.setItem('thuy_nguyen_medicines', JSON.stringify(updatedMeds));
  };

  const confirmPayment = (bookingId: string, method: Booking['paymentMethod'], amount: number) => {
    const updated = bookings.map((b) => {
      if (b.id === bookingId) {
        return {
          ...b,
          paymentStatus: 'Paid' as const,
          paymentMethod: method,
          paymentAmount: amount,
        };
      }
      return b;
    });
    setBookings(updated);
    localStorage.setItem('thuy_nguyen_bookings', JSON.stringify(updated));
  };

  // Admin Tools - Doctors CRUD
  const addDoctor = (doc: Omit<Doctor, 'id'>) => {
    const id = `dr-${Date.now().toString().slice(-4)}`;
    const newDoc: Doctor = {
      ...doc,
      id,
      room: doc.room || `Phòng ${101 + Math.floor(Math.random() * 20)}`,
      currentSchedule: doc.currentSchedule || ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6'],
    };
    const updated = [...doctors, newDoc];
    setDoctors(updated);
    localStorage.setItem('thuy_nguyen_doctors', JSON.stringify(updated));
  };

  const updateDoctor = (doc: Doctor) => {
    const updated = doctors.map((d) => (d.id === doc.id ? doc : d));
    setDoctors(updated);
    localStorage.setItem('thuy_nguyen_doctors', JSON.stringify(updated));
  };

  const deleteDoctor = (id: string) => {
    const updated = doctors.filter((d) => d.id !== id);
    setDoctors(updated);
    localStorage.setItem('thuy_nguyen_doctors', JSON.stringify(updated));
  };

  // Admin Tools - Medicines CRUD
  const addMedicine = (med: Medicine) => {
    const defaultId = `MED-${Math.floor(Math.random() * 8999 + 1000)}`;
    const newMed: Medicine = { 
      ...med, 
      id: med.id?.trim() || defaultId 
    };
    const updated = [...medicines, newMed];
    setMedicines(updated);
    localStorage.setItem('thuy_nguyen_medicines', JSON.stringify(updated));
  };

  const updateMedicine = (med: Medicine) => {
    const updated = medicines.map((m) => (m.id === med.id ? med : m));
    setMedicines(updated);
    localStorage.setItem('thuy_nguyen_medicines', JSON.stringify(updated));
  };

  const deleteMedicine = (id: string) => {
    const updated = medicines.filter((m) => m.id !== id);
    setMedicines(updated);
    localStorage.setItem('thuy_nguyen_medicines', JSON.stringify(updated));
  };

  // Admin Tools - User Accounts CRUD
  const addUserAccount = (acc: Omit<UserAccount, 'id'>) => {
    const id = `ACC-${Date.now().toString().slice(-4)}`;
    const newAcc: UserAccount = { ...acc, id };
    const updated = [...accounts, newAcc];
    setAccounts(updated);
    localStorage.setItem('thuy_nguyen_accounts', JSON.stringify(updated));
  };

  const updateUserAccount = (acc: UserAccount) => {
    const updated = accounts.map((a) => (a.id === acc.id ? acc : a));
    setAccounts(updated);
    localStorage.setItem('thuy_nguyen_accounts', JSON.stringify(updated));
  };

  const deleteUserAccount = (id: string) => {
    const updated = accounts.filter((a) => a.id !== id);
    setAccounts(updated);
    localStorage.setItem('thuy_nguyen_accounts', JSON.stringify(updated));
  };

  const addSchedule = (sch: Omit<Schedule, 'id'>) => {
    const id = `SCH-${Date.now().toString().slice(-4)}`;
    const newSch: Schedule = { ...sch, id };
    const updated = [...schedules, newSch];
    setSchedules(updated);
    localStorage.setItem('thuy_nguyen_schedules', JSON.stringify(updated));
  };

  const updateSchedule = (sch: Schedule) => {
    const updated = schedules.map((s) => (s.id === sch.id ? sch : s));
    setSchedules(updated);
    localStorage.setItem('thuy_nguyen_schedules', JSON.stringify(updated));
  };

  const deleteSchedule = (id: string) => {
    const updated = schedules.filter((s) => s.id !== id);
    setSchedules(updated);
    localStorage.setItem('thuy_nguyen_schedules', JSON.stringify(updated));
  };

  // Admin Tools - News Articles CRUD
  const addNewsArticle = (newArticle: NewsArticle) => {
    const id = newArticle.id?.trim() || `news-${Date.now()}`;
    const formatted: NewsArticle = {
      ...newArticle,
      id,
      publishDate: newArticle.publishDate || new Date().toLocaleDateString('vi-VN'),
      readTime: newArticle.readTime || '3 phút đọc'
    };
    const updated = [...newsArticles, formatted];
    setNewsArticles(updated);
    localStorage.setItem('thuy_nguyen_news', JSON.stringify(updated));
  };

  const updateNewsArticle = (article: NewsArticle) => {
    const updated = newsArticles.map((item) => (item.id === article.id ? article : item));
    setNewsArticles(updated);
    localStorage.setItem('thuy_nguyen_news', JSON.stringify(updated));
  };

  const deleteNewsArticle = (id: string) => {
    const updated = newsArticles.filter((item) => item.id !== id);
    setNewsArticles(updated);
    localStorage.setItem('thuy_nguyen_news', JSON.stringify(updated));
  };

  // Hospital Contact setter
  const updateHospitalContact = (contact: HospitalContact) => {
    setHospitalContact(contact);
    localStorage.setItem('thuy_nguyen_hospital_contact_settings', JSON.stringify(contact));
  };

  // Admin and Medical controls
  const adminUpdateMedicalRecord = (bookingId: string, symptoms: string, diagnosis: string, doctorNote: string) => {
    const updated = bookings.map((b) => {
      if (b.id === bookingId) {
        return {
          ...b,
          examinationResult: b.examinationResult ? {
            ...b.examinationResult,
            symptoms,
            diagnosis,
            doctorNote,
          } : {
            symptoms,
            diagnosis,
            doctorNote,
            medicines: [],
          }
        };
      }
      return b;
    });
    setBookings(updated);
    localStorage.setItem('thuy_nguyen_bookings', JSON.stringify(updated));
  };

  const adminDeleteMedicalRecord = (bookingId: string) => {
    const updated = bookings.filter((b) => b.id !== bookingId);
    setBookings(updated);
    localStorage.setItem('thuy_nguyen_bookings', JSON.stringify(updated));
  };

  const updateDepartmentName = (id: string, newName: string) => {
    const updated = departments.map((d) => {
      if (d.id === id) {
        return { ...d, name: newName };
      }
      return d;
    });
    setDepartments(updated);
    localStorage.setItem('thuy_nguyen_departments', JSON.stringify(updated));
  };

  const addDepartment = (dept: Omit<Department, 'id' | 'imageUrl'> & { id?: string; imageUrl?: string }) => {
    // Generate simple slug (ID) from department name if not supplied
    const fallbackId = dept.name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D")
      .replace(/[^a-z0-9]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
    
    const newDept: Department = {
      id: dept.id || fallbackId || `dept-${Date.now()}`,
      name: dept.name,
      icon: dept.icon || 'HeartPulse',
      description: dept.description || '',
      highlights: dept.highlights || [],
      imageUrl: dept.imageUrl || 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=800',
    };
    const updated = [...departments, newDept];
    setDepartments(updated);
    localStorage.setItem('thuy_nguyen_departments', JSON.stringify(updated));
  };

  const deleteDepartment = (id: string) => {
    const updated = departments.filter((d) => d.id !== id);
    setDepartments(updated);
    localStorage.setItem('thuy_nguyen_departments', JSON.stringify(updated));
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        bookings,
        medicines,
        doctors,
        departments,
        accounts,
        schedules,
        newsArticles,
        hospitalContact,
        login,
        logout,
        registerPatient,
        addBooking,
        updateBookingStatus,
        checkInPatient,
        recordExamination,
        confirmPayment,
        addDoctor,
        updateDoctor,
        deleteDoctor,
        addMedicine,
        updateMedicine,
        deleteMedicine,
        addUserAccount,
        updateUserAccount,
        deleteUserAccount,
        addSchedule,
        updateSchedule,
        deleteSchedule,
        addNewsArticle,
        updateNewsArticle,
        deleteNewsArticle,
        updateHospitalContact,
        paymentQrCode,
        updatePaymentQrCode: (qr: string) => {
          setPaymentQrCode(qr);
          localStorage.setItem('thuy_nguyen_payment_qr', qr);
        },
        adminUpdateMedicalRecord,
        adminDeleteMedicalRecord,
        updateDepartmentName,
        addDepartment,
        deleteDepartment,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used inside an AppProvider');
  }
  return context;
}
