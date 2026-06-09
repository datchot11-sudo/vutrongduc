/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Department {
  id: string;
  name: string;
  icon: string; // lucide icon name
  description: string;
  highlights: string[];
  imageUrl: string;
}

export interface Doctor {
  id: string;
  name: string;
  title: string; // e.g. BSCKI, Thạc sĩ, Thầy thuốc ưu tú
  specialtyId: string;
  specialtyName: string;
  imageUrl: string;
  experience: string;
  rating: number;
  room?: string; // Phòng khám
  currentSchedule?: string[]; // Danh sách các ngày làm việc, ví dụ: ["T2", "T3", "T4", "T5", "T6"]
}

export interface Booking {
  id: string;
  patientName: string;
  patientPhone: string;
  patientEmail: string;
  dob: string;
  gender: 'Nam' | 'Nữ' | 'Khác';
  cccd?: string; // Số CCCD
  appointmentDate: string;
  appointmentTime: string;
  departmentId: string;
  departmentName: string;
  doctorId: string;
  doctorName: string;
  reason: string;
  status: 'Pending' | 'Confirmed' | 'Checked-In' | 'Completed' | 'Cancelled';
  insuranceCode?: string;
  queueNumber: string; // Số thứ tự phòng khám (STT) sinh tự động, ví dụ: 05, 12...
  createdAt: string;
  paymentStatus: 'Unpaid' | 'Paid';
  paymentMethod?: 'Tiền mặt' | 'Chuyển khoản' | 'Ví điện tử';
  paymentAmount?: number;
  scheduleId?: string; // Khóa phụ liên kết dịch vụ lịch làm việc
  examinationResult?: {
    symptoms: string;
    diagnosis: string;
    doctorNote: string;
    medicines?: PrescriptionItem[];
  };
}

export interface Schedule {
  id: string;
  doctorId: string;
  doctorName: string;
  date: string; // yyyy-mm-dd
  timeSlot: '07:30-08:30' | '08:30-09:30' | '09:30-10:30' | '13:30-14:30' | '14:30-15:30' | '15:30-16:30';
  maxPatients: number; // default 5
  currentPatients: number; // default 0
}

export interface PrescriptionItem {
  medicineId: string;
  name: string;
  quantity: number;
  dosage: string; // Liều lượng: ví dụ "Sáng 1 viên, Tối 1 viên"
  instruction: string; // Cách dùng: "Uống sau ăn", "Uống trước ăn"
}

export interface Medicine {
  id: string; // Mã thuốc
  name: string; // Tên thuốc
  type: string; // Loại thuốc (Kháng sinh, Giảm đau, Tim mạch...)
  unit: string; // Đơn vị tính (Viên, Hộp, Chai...)
  stock: number; // Số lượng tồn kho
  price: number; // Đơn giá bán lẻ
  usage: string; // Hướng dẫn cách dùng mặc định
  specialtyId?: string; // Phân bổ theo Khoa lâm sàng
  specialtyName?: string; // Tên khoa lâm sàng tương ứng
  entryDate?: string; // Ngày nhập kho (yyyy-mm-dd)
  expiryDate?: string; // Hạn sử dụng (yyyy-mm-dd)
}

export interface HospitalContact {
  hotline: string;
  emergency: string;
  email: string;
  address: string;
}

export interface UserAccount {
  id: string;
  username: string; // Số điện thoại đối với bệnh nhân
  fullName: string;
  role: 'Patient' | 'Doctor' | 'Receptionist' | 'Admin';
  phone?: string;
  email?: string;
  cccd?: string; // Số căn cước công dân
  gender?: 'Nam' | 'Nữ' | 'Khác';
  dob?: string;
  address?: string;
  specialtyId?: string; // dành cho bác sĩ
  status: 'Active' | 'Locked';
}

export interface ParameterResult {
  parameter: string;
  value: string;
  unit: string;
  referenceRange: string;
  status: 'normal' | 'high' | 'low';
}

export interface TestResult {
  patientId: string;
  patientName: string;
  patientPhone: string;
  dob: string;
  gender: 'Nam' | 'Nữ';
  testDate: string;
  department: string;
  doctor: string;
  parameters: ParameterResult[];
  imagingReport?: {
    type: string; // Siêu âm, X-Quang, CT, MRI
    conclusion: string;
    details: string;
    imageUrl?: string;
  };
  conclusion: string;
  doctorNote: string;
}

export interface NewsArticle {
  id: string;
  title: string;
  category: 'tin-tuc' | 'kien-thuc' | 'thong-bao';
  summary: string;
  content: string;
  publishDate: string;
  readTime: string;
  imageUrl: string;
}
