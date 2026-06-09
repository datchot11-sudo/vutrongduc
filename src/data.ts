import { Department, Doctor, TestResult, NewsArticle, Medicine } from './types';

export const DEPARTMENTS: Department[] = [
  {
    id: 'kham-benh',
    name: 'Khoa Khám Bệnh',
    icon: 'Stethoscope',
    description: 'Nơi tiếp nhận, phân loại và tổ chức khám bệnh toàn diện cho nhân dân có bảo hiểm y tế và dịch vụ tự nguyện.',
    highlights: [
      'Phòng khám chuyên khoa: Tầng 2 – Khu nhà G',
      'Phát số và phân luồng khám tự động thông minh',
      'Đội ngũ BSCKI ưu tú phục vụ mọi ngày trong tuần',
      'Thủ tục hạch toán bảo hiểm xã hội nhanh gọn'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 'cap-cuu',
    name: 'Khoa Cấp Cứu Hồi Sức Tích Cực Chống Độc',
    icon: 'Activity',
    description: 'Hoạt động liên tục 24/7, sẵn sàng ứng phó trong mọi tình huống tai nạn, ngộ độc, suy hô hấp cấp.',
    highlights: [
      'Phòng cấp cứu: Tầng 1 – khu nhà C; Tầng 1 – khu nhà B',
      'Đội ngũ trực chiến phản ứng nhanh liên tục 24/24',
      'Trang bị máy thở cao tần và monitor đa thông số',
      'Khu phân luồng cấp cứu thảm họa hiện đại'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 'san-phu',
    name: 'Khoa Phụ Sản',
    icon: 'Baby',
    description: 'Dịch vụ nâng niu thai sản trọn gói, tầm soát chu sinh kỹ lưỡng và đỡ đẻ không đau an toàn tuyệt đối.',
    highlights: [
      'Phòng khám - Phòng sinh: Tầng 3,4 - Khu nhà G',
      'Kỹ thuật gây tê ngoài màng cứng sinh đẻ không đau',
      'Hệ thống phòng nội trú gia đình tiện nghi',
      'Tầm soát dị tật thai nhi trước sinh chính xác'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1584824486509-112e4181ff6b?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 'nhi-khoa',
    name: 'Khoa Nhi',
    icon: 'Smile',
    description: 'Điều trị tốt các bệnh lý tai nhi khoa, dinh dưỡng phát triển thể trạng cho trẻ nhỏ.',
    highlights: [
      'Phòng khám chuyên nhi: Tầng 2, 3 – Khu nhà B',
      'Không gian vui chơi giảm lo âu cho bé trước khi khám',
      'Tiêm chủng đầy đủ chứng chỉ vắc xin sạch gốc',
      'Chương trình phục hồi thể trạng suy dinh dưỡng'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 'rang-ham-mat',
    name: 'Khoa Răng Hàm Mặt',
    icon: 'Sparkles',
    description: 'Nha khoa tổng quát, điều trị nha khoa học đường phục hình thẩm mỹ và chỉnh hình hàm mặt.',
    highlights: [
      'Phòng khám chuyên khoa: Tầng 2 – khu nhà B',
      'Dịch vụ nắn răng lệch hàm công nghệ hiện đại',
      'Cụm ghế nha cao cấp kèm trợ thủ khử vi khuẩn',
      'Bảo tồn răng thật tối đa theo phác đồ hiện đại'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1587351021355-a479a299d2f9?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 'noi-tim-mach-ho-hap',
    name: 'Khoa Nội Tim Mạch – Hô Hấp',
    icon: 'Heart',
    description: 'Thăm khám, phát hiện sớm và điều hòa nhịp tim, mạch vành, ho hen phế quản co thắt mãn tính.',
    highlights: [
      'Khu phòng khám: Khu nhà D',
      'Quản lý huyết áp, đường tim toàn thể người cao tuổi',
      'Máy chụp động mạch xóa nền và máy siêu âm tim màu',
      'Phác đồ chống đông và dự phòng xơ vữa tối ưu'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 'tai-mui-hong',
    name: 'Khoa Tai – Mũi – Họng',
    icon: 'Scan',
    description: 'Nội soi ống mềm chuẩn đoán hầu họng, u vòm, viêm xoang trán mủ nguy cơ.',
    highlights: [
      'Khu phòng khám: Khu nhà E',
      'Nội soi camera độ phân giải cao không gây khó thở',
      'Điều trị xông khí mũi họng bổ trợ tự nhiên',
      'Hút xoang phục hồi không cần can thiệp dao kéo'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 'noi-tong-hop',
    name: 'Khoa Nội Tổng Hợp',
    icon: 'Stethoscope',
    description: 'Điều trị nội trú, ngoại trú các bệnh tiểu đường, khớp mãn tính, dạ dày suy nhược người bệnh.',
    highlights: [
      'Phòng nội trú ấm áp: Tầng 4 – Khu nhà C',
      'Chương trình dinh dưỡng nội sinh lý tưởng',
      'Kiểm soát đường máu ổn định thần tốc',
      'Hạn chế tối đa dùng kháng sinh tràn lan'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 'ngoai-tong-hop',
    name: 'Khoa Ngoại Tổng Hợp',
    icon: 'Scissors',
    description: 'Mổ nội soi dạ dày sỏi tiết niệu mật, bó bột cố định xương gãy chấn thương.',
    highlights: [
      'Cụm phòng mổ vô khuẩn: Tầng 3 – Khu nhà C',
      'Phẫu thuật ít xâm lấn đau sau mổ tối thiểu',
      'Phục hồi chức năng sau mổ chủ động',
      'Đỡ đau tự động kiểm soát liều lượng an toàn'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1579684389782-64d84b5e902a?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 'xet-nghiem',
    name: 'Khoa Xét Nghiệm',
    icon: 'Activity',
    description: 'Phân tích định mức máu, tủy, đường huyết, sinh hóa phẩm nước tiểu chuẩn mực khoa học.',
    highlights: [
      'Cơ sở xét nghiệm: Tầng 1 - Khu nhà G',
      'Hệ thống tủ tủ lạnh giữ mẫu chuẩn ISO 15189',
      'Kết quả chính xác sau 45-60 phút tự động',
      'Tra cứu kết quả qua mã QR Code tiện lợi bảo mật'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 'khoa-mat',
    name: 'Khoa Mắt',
    icon: 'Scan',
    description: 'Mổ thay thủy tinh thể đục đẹo Phaco, đo giác mạc khúc xạ cận loãn học sinh.',
    highlights: [
      'Cơ sở mắt chuyên nhập: Tầng 3 – Khu nhà B',
      'Khu kiểm tra thị lực kĩ thuật số chuẩn quốc tế',
      'Cắt kính thuốc chính hãng uy tín cao',
      'Hỗ trợ can thiệp mổ đục người già Thủy Nguyên'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1587351021355-a479a299d2f9?auto=format&fit=crop&q=80&w=800',
  }
];

export const DOCTORS: Doctor[] = [
  // Khoa Khám Bệnh
  {
    id: 'dr-hoai',
    name: 'BSCKI. Đỗ Thị Hoài',
    title: 'Thầy thuốc ưu tú',
    specialtyId: 'kham-benh',
    specialtyName: 'Khoa Khám Bệnh',
    imageUrl: 'https://images.unsplash.com/photo-1594824813573-246434de83fb?auto=format&fit=crop&q=80&w=400',
    experience: 'Hơn 22 năm kinh nghiệm trong chuẩn đoán phân loại lâm sàng tại Khoa Khám Bệnh.',
    rating: 4.9,
    room: 'Tầng 2 – Khu nhà G'
  },
  {
    id: 'dr-que',
    name: 'BSCKI. Phạm Thị Quế',
    title: 'Bác sĩ chuyên khoa I',
    specialtyId: 'kham-benh',
    specialtyName: 'Khoa Khám Bệnh',
    imageUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=405',
    experience: '18 năm công tác trị trị thực nghiệm phác đồ lâm y học.',
    rating: 4.8,
    room: 'Tầng 2 – Khu nhà G'
  },
  {
    id: 'dr-thuan',
    name: 'BSCKI. Trần Thị Thuần',
    title: 'Bác sĩ chuyên khoa I',
    specialtyId: 'kham-benh',
    specialtyName: 'Khoa Khám Bệnh',
    imageUrl: 'https://images.unsplash.com/photo-1594824813573-246434de83fb?auto=format&fit=crop&q=80&w=400',
    experience: '16 năm nghiên cứu kiểm soát miễn dịch và dị ứng cấp.',
    rating: 4.9,
    room: 'Tầng 2 – Khu nhà G'
  },
  {
    id: 'dr-luan',
    name: 'BSCKI. Bùi Thị Luận',
    title: 'Bác sĩ chuyên khoa I',
    specialtyId: 'kham-benh',
    specialtyName: 'Khoa Khám Bệnh',
    imageUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=400',
    experience: '20 năm tư vấn dự báo và phòng ngừa tai biến nội lồng ngực.',
    rating: 5,
    room: 'Tầng 2 – Khu nhà G'
  },
  {
    id: 'dr-hai',
    name: 'BSCKI. Bùi Văn Hải',
    title: 'Bác sĩ chuyên khoa I',
    specialtyId: 'kham-benh',
    specialtyName: 'Khoa Khám Bệnh',
    imageUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=405',
    experience: '15 năm nhiệt huyết vì sức khỏe cộng đồng hải đảo Thủy Nguyên.',
    rating: 4.7,
    room: 'Tầng 2 – Khu nhà G'
  },
  // Khoa Cấp Cứu
  {
    id: 'dr-thanh',
    name: 'BSCKI. Chu Hồng Thanh',
    title: 'Phó Trưởng khoa - Phụ trách cấp cứu',
    specialtyId: 'cap-cuu',
    specialtyName: 'Khoa Cấp Cứu Hồi Sức Tích Cực Chống Độc',
    imageUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400',
    experience: 'Hơn 25 năm chỉ đạo hồi sức tích cực tuyến đầu Thủy Nguyên.',
    rating: 5,
    room: 'Tầng 1 – khu nhà C'
  },
  {
    id: 'dr-lam',
    name: 'BSCKI. Vũ Văn Lâm',
    title: 'Bác sĩ chuyên khoa I',
    specialtyId: 'cap-cuu',
    specialtyName: 'Khoa Cấp Cứu Hồi Sức Tích Cực Chống Độc',
    imageUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=405',
    experience: '12 năm can thiệp điều trị ngộ độc thảo mộc và dị ứng chất.',
    rating: 4.8,
    room: 'Tầng 1 – khu nhà B'
  },
  // Khoa Sản
  {
    id: 'dr-nghia',
    name: 'BSCKII. Phạm Hữu Nghĩa',
    title: 'Trưởng khoa Sản Phụ',
    specialtyId: 'san-phu',
    specialtyName: 'Khoa Phụ Sản',
    imageUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400',
    experience: '24 năm hỗ trợ thành công hàng ngàn thai kỳ nguy cơ cao sinh con an toàn.',
    rating: 4.9,
    room: 'Tầng 3,4 - Khu nhà G'
  },
  {
    id: 'dr-thuy-san',
    name: 'BSCKI. Phạm Thanh Thủy',
    title: 'Bác sĩ chuyên khoa I',
    specialtyId: 'san-phu',
    specialtyName: 'Khoa Phụ Sản',
    imageUrl: 'https://images.unsplash.com/photo-1594824813573-246434de83fb?auto=format&fit=crop&q=80&w=400',
    experience: '17 năm chuyên sâu siêu âm dị tật thai 4D chất lượng.',
    rating: 4.8,
    room: 'Tầng 3,4 - Khu nhà G'
  },
  {
    id: 'dr-bich-thuy',
    name: 'BSCKI. Hà Thị Bích Thủy',
    title: 'Bác sĩ chuyên khoa I',
    specialtyId: 'san-phu',
    specialtyName: 'Khoa Phụ Sản',
    imageUrl: 'https://images.unsplash.com/photo-1594824813573-246434de83fb?auto=format&fit=crop&q=80&w=400',
    experience: '14 năm chỉ dẫn chuẩn trị bệnh phụ khoa lành mạnh.',
    rating: 4.8,
    room: 'Tầng 3,4 - Khu nhà G'
  },
  // Khoa Nhi
  {
    id: 'dr-yen',
    name: 'BSCKII. Đinh Thị Yến',
    title: 'Trưởng khoa Nhi',
    specialtyId: 'nhi-khoa',
    specialtyName: 'Khoa Nhi',
    imageUrl: 'https://images.unsplash.com/photo-1594824813573-246434de83fb?auto=format&fit=crop&q=80&w=400',
    experience: '26 năm đồng hành phục phục hồi nhi khoa và viêm phổi cấp.',
    rating: 5,
    room: 'Tầng 2, 3 – Khu nhà B'
  },
  {
    id: 'dr-hong-nhi',
    name: 'BSCKI. Nguyễn Thị Hồng',
    title: 'Bác sĩ chuyên khoa I',
    specialtyId: 'nhi-khoa',
    specialtyName: 'Khoa Nhi',
    imageUrl: 'https://images.unsplash.com/photo-1594824813573-246434de83fb?auto=format&fit=crop&q=80&w=400',
    experience: '15 năm chăm sóc y học nhi khoa dịu nhẹ, tâm lý.',
    rating: 4.9,
    room: 'Tầng 2, 3 – Khu nhà B'
  },
  {
    id: 'dr-vinh',
    name: 'BSCKI. Hoàng Thị Hồng Vĩnh',
    title: 'Bác sĩ chuyên khoa I',
    specialtyId: 'nhi-khoa',
    specialtyName: 'Khoa Nhi',
    imageUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=400',
    experience: '11 năm công tác chữa trị dị ứng trẻ sơ sinh Thủy Nguyên.',
    rating: 4.8,
    room: 'Tầng 2, 3 – Khu nhà B'
  },
  // Khoa Răng Hàm Mặt
  {
    id: 'dr-lieu',
    name: 'PGS.TS.BS. Nguyễn Văn Liệu',
    title: 'Phó Giáo Sư - Cố vấn hàm mặt',
    specialtyId: 'rang-ham-mat',
    specialtyName: 'Khoa Răng Hàm Mặt',
    imageUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400',
    experience: 'Hơn 30 năm nghiên cứu giảng dạy, can thiệp phẫu thuật hàm mặt phức tạp.',
    rating: 5,
    room: 'Tầng 2 – khu nhà B'
  },
  {
    id: 'dr-huong-rhm',
    name: 'BSCKI. Vũ Thị Hương',
    title: 'Bác sĩ chuyên khoa I',
    specialtyId: 'rang-ham-mat',
    specialtyName: 'Khoa Răng Hàm Mặt',
    imageUrl: 'https://images.unsplash.com/photo-1594824813573-246434de83fb?auto=format&fit=crop&q=80&w=400',
    experience: '13 năm nằn chỉnh răng hàm thẩm mỹ cho giới trẻ.',
    rating: 4.8,
    room: 'Tầng 2 – khu nhà B'
  },
  // Khoa Nội Tim Mạch - Hô Hấp
  {
    id: 'dr-khanh',
    name: 'BSCKI. Lê Văn Khánh',
    title: 'Trưởng khoa tim mạch',
    specialtyId: 'noi-tim-mach-ho-hap',
    specialtyName: 'Khoa Nội Tim Mạch – Hô Hấp',
    imageUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=405',
    experience: '22 năm tầm soát điều hòa bóng gan tim mạch mạch máu.',
    rating: 4.9,
    room: 'Khu nhà D'
  },
  {
    id: 'dr-huyen',
    name: 'BSCKI. Hoàng Thị Huyền',
    title: 'Bác sĩ chuyên khoa I',
    specialtyId: 'noi-tim-mach-ho-hap',
    specialtyName: 'Khoa Nội Tim Mạch – Hô Hấp',
    imageUrl: 'https://images.unsplash.com/photo-1594824813573-246434de83fb?auto=format&fit=crop&q=80&w=400',
    experience: '14 năm chăm sóc người bệnh giảm thở tắc nghẽn CODP.',
    rating: 4.8,
    room: 'Khu nhà D'
  },
  // Khoa Tai Mũi Họng
  {
    id: 'dr-hien',
    name: 'BSCKI. Bùi Thị Hiền',
    title: 'Trưởng khoa tai mũi họng',
    specialtyId: 'tai-mui-hong',
    specialtyName: 'Khoa Tai – Mũi – Họng',
    imageUrl: 'https://images.unsplash.com/photo-1594824813573-246434de83fb?auto=format&fit=crop&q=80&w=400',
    experience: '20 năm nội soi ống mềm phát hiện viêm Amidan nước, ù tai.',
    rating: 4.9,
    room: 'Khu nhà E'
  },
  {
    id: 'dr-huan',
    name: 'BSCKI. Nguyễn Văn Huấn',
    title: 'Bác sĩ chuyên khoa I',
    specialtyId: 'tai-mui-hong',
    specialtyName: 'Khoa Tai – Mũi – Họng',
    imageUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400',
    experience: '16 năm kinh nghiệm điều trị xoang sàng mủ lệch vách ngăn.',
    rating: 4.8,
    room: 'Khu nhà E'
  },
  {
    id: 'dr-xuong',
    name: 'BSCC. Ngô Đức Xương',
    title: 'Bác sĩ Cao cấp',
    specialtyId: 'tai-mui-hong',
    specialtyName: 'Khoa Tai – Mũi – Họng',
    imageUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=405',
    experience: 'Hơn 28 năm trị liệu vòm họng thanh quản người lớn.',
    rating: 5,
    room: 'Khu nhà E'
  },
  // Khoa Nội Tổng Hợp
  {
    id: 'dr-duy',
    name: 'BSCKI. Phạm Văn Duy',
    title: 'Bác sĩ chuyên khoa I',
    specialtyId: 'noi-tong-hop',
    specialtyName: 'Khoa Nội Tổng Hợp',
    imageUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400',
    experience: '18 năm chăm sóc ổn định mỡ gan dạ dày mãn tính.',
    rating: 4.8,
    room: 'Tầng 4 – Khu nhà C'
  },
  {
    id: 'dr-hang',
    name: 'BSCKI. Đỗ Thị Hằng',
    title: 'Bác sĩ chuyên khoa I',
    specialtyId: 'noi-tong-hop',
    specialtyName: 'Khoa Nội Tổng Hợp',
    imageUrl: 'https://images.unsplash.com/photo-1594824813573-246434de83fb?auto=format&fit=crop&q=80&w=400',
    experience: '14 năm chỉ đạo phác đồ khớp tim đái tháo dưỡng.',
    rating: 4.9,
    room: 'Tầng 4 – Khu nhà C'
  },
  // Khoa Ngoại Tổng Hợp
  {
    id: 'dr-huy',
    name: 'ThS.BS. Nguyễn Văn Huy',
    title: 'Trưởng khoa Ngoại',
    specialtyId: 'ngoai-tong-hop',
    specialtyName: 'Khoa Ngoại Tổng Hợp',
    imageUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400',
    experience: '19 năm phẫu thuật nội soi ổ bụng, ruột thừa sỏi thận.',
    rating: 4.9,
    room: 'Tầng 3 – Khu nhà C'
  },
  {
    id: 'dr-diep',
    name: 'BSCKII. Đào Văn Điệp',
    title: 'Bác sĩ chuyên khoa II',
    specialtyId: 'ngoai-tong-hop',
    specialtyName: 'Khoa Ngoại Tổng Hợp',
    imageUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=405',
    experience: '25 năm kinh nghiệm chấn thương chỉnh hình đóng đinh gãy xương.',
    rating: 5,
    room: 'Tầng 3 – Khu nhà C'
  },
  {
    id: 'dr-tuat',
    name: 'BSCKI. Nguyễn Văn Tuất',
    title: 'Bác sĩ chuyên khoa I',
    specialtyId: 'ngoai-tong-hop',
    specialtyName: 'Khoa Ngoại Tổng Hợp',
    imageUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=400',
    experience: '15 năm tiết niệu tán sỏi qua da không đau.',
    rating: 4.8,
    room: 'Tầng 3 – Khu nhà C'
  },
  // Khoa Xét Nghiệm
  {
    id: 'dr-tuong',
    name: 'BSCKI. Nguyễn Thị Tưởng',
    title: 'Phó Trưởng khoa',
    specialtyId: 'xet-nghiem',
    specialtyName: 'Khoa Xét Nghiệm',
    imageUrl: 'https://images.unsplash.com/photo-1594824813573-246434de83fb?auto=format&fit=crop&q=80&w=400',
    experience: '22 năm kiểm duyệt an toàn phân tích máu tủy sinh hóa học.',
    rating: 4.9,
    room: 'Tầng 1 - Khu nhà G'
  },
  // Khoa Mắt
  {
    id: 'dr-duoc',
    name: 'ThS.BS. Nguyễn Văn Được',
    title: 'Trưởng khoa Mắt',
    specialtyId: 'khoa-mat',
    specialtyName: 'Khoa Mắt',
    imageUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400',
    experience: '18 năm mổ cườm thủy tinh thể Phaco hiện đại nhất.',
    rating: 4.9,
    room: 'Tầng 3 – Khu nhà B'
  },
  {
    id: 'dr-mo',
    name: 'BSCKI. Nguyễn Thị Mơ',
    title: 'Bác sĩ chuyên khoa I',
    specialtyId: 'khoa-mat',
    specialtyName: 'Khoa Mắt',
    imageUrl: 'https://images.unsplash.com/photo-1594824813573-246434de83fb?auto=format&fit=crop&q=80&w=400',
    experience: '12 năm đo đạc giác mạc kính khúc xạ học đường Thủy Nguyên.',
    rating: 4.8,
    room: 'Tầng 3 – Khu nhà B'
  },
  {
    id: 'dr-hong-mat',
    name: 'BSCKI. Nguyễn Thị Hồng',
    title: 'Bác sĩ chuyên khoa I',
    specialtyId: 'khoa-mat',
    specialtyName: 'Khoa Mắt',
    imageUrl: 'https://images.unsplash.com/photo-1594824813573-246434de83fb?auto=format&fit=crop&q=80&w=400',
    experience: '15 năm chăm sóc trị thị lực bảo tồn sau mổ.',
    rating: 4.8,
    room: 'Tầng 3 – Khu nhà B'
  }
];

// Medicines database generator schema patterns
const MEDICINE_PATTERNS = [
  { name: 'Paracetamol 500mg', stock: 80, unit: 'Viên', price: 5000, entryDate: '2025-01-01', expiryDate: '2028-01-01', type: 'Giảm đau - hạ sốt', usage: 'Uống sau ăn dặm, 1 viên/lần, tối đa 4 lần/ngày' },
  { name: 'Ibuprofen 400mg', stock: 97, unit: 'Vỉ', price: 8500, entryDate: '2026-02-02', expiryDate: '2029-02-02', type: 'Kháng viêm', usage: 'Uống sau ăn no ấm, 1 viên/lần, ngày 2 lần' },
  { name: 'Amoxicillin 500mg', stock: 114, unit: 'Chai', price: 12000, entryDate: '2025-03-03', expiryDate: '2028-03-03', type: 'Kháng sinh', usage: 'Uống sau ăn dặm, ngày 2-3 lần, mỗi lần 1 viên' },
  { name: 'Cefuroxime 500mg', stock: 131, unit: 'Ống', price: 15500, entryDate: '2026-04-04', expiryDate: '2029-04-04', type: 'Kháng sinh', usage: 'Dùng theo chỉ định cụ thể của Thầy thuốc chuyên môn' },
  { name: 'Azithromycin 500mg', stock: 148, unit: 'Lọ', price: 19000, entryDate: '2025-05-05', expiryDate: '2028-05-05', type: 'Kháng sinh', usage: 'Uống trước bữa ăn 1 giờ hoặc sau khi ăn 2 giờ, ngày 1 lần' },
  { name: 'Loratadine 10mg', stock: 165, unit: 'Tuýp', price: 22500, entryDate: '2026-06-06', expiryDate: '2029-06-06', type: 'Chống dị ứng', usage: 'Uống dứt điểm 1 viên buổi tối trước khi đi ngủ' },
  { name: 'Cetirizine 10mg', stock: 182, unit: 'Viên', price: 26000, entryDate: '2025-07-07', expiryDate: '2028-07-07', type: 'Chống dị ứng', usage: 'Uống ổn định 1 viên vào một thời điểm tối cố định' },
  { name: 'Omeprazole 20mg', stock: 199, unit: 'Vỉ', price: 29500, entryDate: '2026-08-08', expiryDate: '2029-08-08', type: 'Dạ dày', usage: 'Uống 1 viên vào sáng sớm trước ăn 30 phút' },
  { name: 'Esomeprazole 40mg', stock: 216, unit: 'Chai', price: 33000, entryDate: '2025-09-09', expiryDate: '2028-09-09', type: 'Dạ dày', usage: 'Uống 1 viên vào sáng sớm khi dạ dày rỗng rảnh' },
  { name: 'Domperidone 10mg', stock: 233, unit: 'Ống', price: 36500, entryDate: '2026-10-10', expiryDate: '2029-10-10', type: 'Tiêu hóa', usage: 'Uống trước bữa ăn ấm 15-30 phút, ngày 2-3 lần' },
  { name: 'Vitamin C 500mg', stock: 250, unit: 'Lọ', price: 40000, entryDate: '2025-11-11', expiryDate: '2028-11-11', type: 'Vitamin', usage: 'Uống sau ăn sáng hoặc sau ăn trưa, tránh uống tối muộn' },
  { name: 'Vitamin B Complex', stock: 267, unit: 'Tuýp', price: 43500, entryDate: '2026-12-12', expiryDate: '2029-12-12', type: 'Vitamin', usage: 'Uống 1 viên hằng ngày sau bữa ăn sáng ấm áp' },
  { name: 'Kẽm Gluconate', stock: 284, unit: 'Viên', price: 47000, entryDate: '2025-01-13', expiryDate: '2028-01-13', type: 'Khoáng chất', usage: 'Uống sau ăn bổ trợ 1-2 giờ, uống kèm nhiều nước' },
  { name: 'Methylprednisolone 16mg', stock: 301, unit: 'Vỉ', price: 50500, entryDate: '2026-02-14', expiryDate: '2029-02-14', type: 'Corticosteroid', usage: 'Uống no sau ăn sáng, 1 ngày/lần chỉ định' },
  { name: 'Dexamethasone', stock: 318, unit: 'Chai', price: 54000, entryDate: '2025-03-15', expiryDate: '2028-03-15', type: 'Corticosteroid', usage: 'Sử dụng tuyệt đối tuân thủ chỉ định cụ thể bác sĩ' },
  { name: 'Salbutamol', stock: 335, unit: 'Ống', price: 57500, entryDate: '2026-04-16', expiryDate: '2029-04-16', type: 'Hô hấp', usage: 'Dùng xịt hít hoặc uống tức thời khi phát cơn khó thở' },
  { name: 'Ambroxol', stock: 352, unit: 'Lọ', price: 61000, entryDate: '2025-05-17', expiryDate: '2028-05-17', type: 'Long đờm', usage: 'Uống sau ăn, xoa dịu ho, ngày 2-3 lần x 1 viên' },
  { name: 'Acetylcysteine', stock: 369, unit: 'Tuýp', price: 64500, entryDate: '2026-06-18', expiryDate: '2029-06-18', type: 'Long đờm', usage: 'Hòa tan sủi bọt vào 150ml nước lọc nguội sau ăn' },
  { name: 'Alpha Chymotrypsin', stock: 386, unit: 'Viên', price: 68000, entryDate: '2025-07-19', expiryDate: '2028-07-19', type: 'Chống phù nề', usage: 'Ngậm dưới lưỡi tan từ từ, ngày 3-4 lần' },
  { name: 'Clorpheniramin', stock: 403, unit: 'Vỉ', price: 71500, entryDate: '2026-08-20', expiryDate: '2029-08-20', type: 'Chống dị ứng', usage: 'Uống 1 viên vào buổi tối ngủ, tránh vận hành máy móc' },
  { name: 'Meloxicam', stock: 420, unit: 'Chai', price: 75000, entryDate: '2025-09-21', expiryDate: '2028-09-21', type: 'Kháng viêm', usage: 'Uống sau ăn no nhiều, ổn định xoa dịu nhức cơ xương' },
  { name: 'Diclofenac', stock: 437, unit: 'Ống', price: 78500, entryDate: '2026-10-22', expiryDate: '2029-10-22', type: 'Kháng viêm', usage: 'Bôi ngoài da hoặc sử dụng theo chỉ dẫn cấp cứu' },
  { name: 'Oresol', stock: 454, unit: 'Lọ', price: 82000, entryDate: '2025-11-23', expiryDate: '2028-11-23', type: 'Bù điện giải', usage: 'Hòa tan đúng tỉ lệ 1 gói vào nước uống bù đắp mất chất' },
  { name: 'Ceftriaxone', stock: 471, unit: 'Tuýp', price: 85500, entryDate: '2026-12-24', expiryDate: '2029-12-24', type: 'Kháng sinh', usage: 'Sử dụng cấp dưỡng trực tiếp vô trùng nội trú y khoa' },
  { name: 'Metronidazole', stock: 488, unit: 'Viên', price: 89000, entryDate: '2025-01-25', expiryDate: '2028-01-25', type: 'Kháng khuẩn', usage: 'Uống no sau ăn cơm dẻo, uống ngày 2 lần' }
];

const SPECIALTY_PREFIX_MAP: { [key: string]: { prefix: string; name: string } } = {
  'kham-benh': { prefix: 'KB', name: 'Khoa Khám Bệnh' },
  'cap-cuu': { prefix: 'CC', name: 'Khoa Cấp Cứu Hồi Sức Tích Cực Chống Độc' },
  'san-phu': { prefix: 'PS', name: 'Khoa Phụ Sản' },
  'nhi-khoa': { prefix: 'NHI', name: 'Khoa Nhi' },
  'rang-ham-mat': { prefix: 'RHM', name: 'Khoa Răng Hàm Mặt' },
  'noi-tim-mach-ho-hap': { prefix: 'TMH', name: 'Khoa Nội Tim Mạch – Hô Hấp' },
  'tai-mui-hong': { prefix: 'TMHO', name: 'Khoa Tai – Mũi – Họng' },
  'noi-tong-hop': { prefix: 'NTH', name: 'Khoa Nội Tổng Hợp' },
  'ngoai-tong-hop': { prefix: 'NGT', name: 'Khoa Ngoại Tổng Hợp' },
  'xet-nghiem': { prefix: 'XN', name: 'Khoa Xét Nghiệm' },
  'khoa-mat': { prefix: 'MAT', name: 'Khoa Mắt' }
};

// programmatically build the complete lists of 275 items!
export const INITIAL_MEDICINES: Medicine[] = [];

Object.entries(SPECIALTY_PREFIX_MAP).forEach(([specialtyId, spec]) => {
  MEDICINE_PATTERNS.forEach((pattern, index) => {
    const sequenceNum = String(index + 1).padStart(3, '0');
    INITIAL_MEDICINES.push({
      id: `${spec.prefix}${sequenceNum}`,
      name: `${pattern.name} - ${spec.prefix}`,
      type: pattern.type,
      unit: pattern.unit,
      stock: pattern.stock,
      price: pattern.price,
      usage: pattern.usage,
      specialtyId: specialtyId,
      specialtyName: spec.name,
      entryDate: pattern.entryDate,
      expiryDate: pattern.expiryDate,
    });
  });
});

export const TEST_RESULTS: TestResult[] = [
  {
    patientId: 'BN2026',
    patientName: 'Nguyễn Văn Mạnh',
    patientPhone: '0912345678',
    dob: '1988-10-15',
    gender: 'Nam',
    testDate: '2026-06-05',
    department: 'Khoa Khám Bệnh - Phòng khám Nội G',
    doctor: 'BSCKI. Đỗ Thị Hoài',
    parameters: [
      { parameter: 'Đường huyết đói (Glucose)', value: '5.2', unit: 'mmol/L', referenceRange: '3.9 - 6.4', status: 'normal' },
      { parameter: 'Cholesterol Toàn Phần', value: '4.8', unit: 'mmol/L', referenceRange: '2.8 - 5.2', status: 'normal' },
      { parameter: 'Triglycerides (Mỡ máu)', value: '2.4', unit: 'mmol/L', referenceRange: '0.46 - 1.88', status: 'high' },
      { parameter: 'AST (Men gan GOT)', value: '32', unit: 'U/L', referenceRange: '< 40', status: 'normal' },
      { parameter: 'ALT (Men gan GPT)', value: '45', unit: 'U/L', referenceRange: '< 41', status: 'high' },
      { parameter: 'Creatinine (Chức năng thận)', value: '78', unit: 'µmol/L', referenceRange: '62 - 115', status: 'normal' },
    ],
    imagingReport: {
      type: 'Siêu âm ổ bụng tổng quát',
      conclusion: 'Gan nhiễm mỡ độ 1. Thận tiết niệu bình thường.',
      details: 'Kích thước gan trong giới hạn bình thường, nhu mô tăng âm lan tỏa nhẹ đặc trưng của gan nhiễm mỡ. Hệ thống đường mật không giãn, không sỏi. Tụy cố định, lách bình thường.',
      imageUrl: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=300'
    },
    conclusion: 'Xét nghiệm máu cho thấy tình trạng mỡ máu (Triglyceride) và men gan ALT tăng nhẹ so với mức chuẩn. Siêu âm ổ bụng ghi nhận gan nhiễm mỡ độ 1.',
    doctorNote: 'Nên hạn chế sử dụng bia rượu, nước ngọt và thức ăn nhanh chiên xào nhiều mỡ. Tăng cường vận động thể dục thể thao tối thiểu 30 phút mỗi ngày. Tái khám kiểm tra sau 3 tháng.'
  },
  {
    patientId: 'BN7890',
    patientName: 'Trần Thị Thảo',
    patientPhone: '0987654321',
    dob: '1995-04-20',
    gender: 'Nữ',
    testDate: '2026-06-04',
    department: 'Khoa Ngoại Tổng Hợp - Phòng khám Ngoại C',
    doctor: 'ThS.BS. Nguyễn Văn Huy',
    parameters: [
      { parameter: 'Số lượng hồng cầu (RBC)', value: '4.2', unit: 'T/L', referenceRange: '3.8 - 5.0', status: 'normal' },
      { parameter: 'Huyết sắc tố (Hemoglobin)', value: '118', unit: 'g/L', referenceRange: '120 - 150', status: 'low' },
      { parameter: 'Số lượng bạch cầu (WBC)', value: '6.9', unit: 'G/L', referenceRange: '4.0 - 10.0', status: 'normal' },
      { parameter: 'Số lượng tiểu cầu (PLT)', value: '254', unit: 'G/L', referenceRange: '150 - 400', status: 'normal' }
    ],
    imagingReport: {
      type: 'X-Quang Thẳng Ngực',
      conclusion: 'Hình ảnh bóng tim và phế trường hai phổi bình thường, không tổn thương nhu mô cấp.',
      details: 'Không thấy vôi hóa bất thường màng phổi, lồng ngực cân đối. Vòm hoành hai bên sắc nét.',
    },
    conclusion: 'Chỉ số hồng cầu trung bình, huyết sắc tố hơi thấp nhẹ tương đương thiếu máu nhẹ thoáng qua (có thể do chu kỳ sinh lý hoặc dinh dưỡng bổ trợ). Chụp X-Quang ngực cho kết quả phổi tim khỏe mạnh.',
    doctorNote: 'Bổ sung các thực phẩm giàu sắt như thịt bò, rau lá xanh đậm, hạt ngũ cốc. Nghỉ ngơi điều độ đúng giờ.'
  }
];

export const NEWS_ARTICLES: NewsArticle[] = [
  {
    id: 'news-1',
    title: 'Bệnh viện Đa khoa Thủy Nguyên nâng cấp hệ thống đăng ký khám bệnh tự động qua mã QR',
    category: 'tin-tuc',
    summary: 'Giải pháp chuyển đổi số toàn diện giúp người bệnh rút ngắn thời gian xếp hàng chờ đến 80%, tối ưu hóa quy trình khám chữa bệnh tại khoa Khám Bệnh.',
    content: `Nhằm mang lại trải nghiệm y tế thuận lơi, hướng tới mô hình bệnh viện thông minh, Bệnh viện Đa khoa Thủy Nguyên đã chính thức triển khai phần mềm tiếp đón tự động và nhận diện thẻ BHYT thông qua ứng dụng VssID và căn cước công dân gắn chíp.\n\nNgười bệnh khi đến khám chỉ cần quét mã QR tại ki-ốt tự động độc lập, máy sẽ tự động truy vấn thông tin bảo hiểm y tế hiển thị trên màn hình cảm ứng để người bệnh xác nhận tiện lợi và in phiếu thứ tự chỉ trong 10 giây. Hệ thống cũng liên kết trực tiếp với cổng đặt lịch trực tuyến của website để ưu tiên gọi tên đúng giờ hẹn của người bệnh đăng ký trước.`,
    publishDate: '01/06/2026',
    readTime: '3 phút đọc',
    imageUrl: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: 'news-2',
    title: 'Chương trình khám sức khỏe học đường định kỳ toàn diện năm học 2025 - 2026',
    category: 'thong-bao',
    summary: 'Phối hợp cùng Phòng Giáo dục huyện Thủy Nguyên, ban giám đốc tổ chức đội bác sĩ lưu động khám sức khỏe chủ động cho học sinh mầm non và tiểu học trên địa bàn.',
    content: `Trong tháng 5 vừa qua, đội ngũ bác sĩ chuyên khoa Nhi, Răng Hàm Mặt, Tai Mũi Họng, và Mắt của Bệnh viện Đa khoa Thủy Nguyên đã thực hiện tầm soát sức khỏe học đường định kỳ cho hơn 5000 học sinh tiểu học.\n\nKết quả thăm khám chỉ ra xu hướng tăng của các tật khúc xạ mắt (gần 28% học sinh được chuẩn đoán mắt yếu/cận) và vấn đề sâu răng học đường. Nhà trường và bệnh viện đã đồng gửi phiếu kết luận kèm tư vấn trực tiếp về cho từng phụ huynh để có biện pháp can thiệp sớm nhất, tránh ảnh hưởng lâu dài đến việc học tập của các con.`,
    publishDate: '26/05/2026',
    readTime: '4 phút đọc',
    imageUrl: 'https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: 'news-3',
    title: 'Những kiến thức bắt buộc phải biết về bệnh Sốt xuất huyết lúc giao mùa',
    category: 'kien-thuc',
    summary: 'Cách nhận biết đúng các triệu chứng sốt xuất huyết Dengue sớm, hướng dẫn chăm sóc y tế tại chỗ lành mạnh và thời điểm quyết định để đưa bệnh nhân nhập viện.',
    content: `Sốt xuất huyết Dengue là bệnh truyền nhiễm cấp tính do virus Dengue gây ra qua vật trung gian truyền bệnh là muỗi vằn. Bệnh xảy ra quanh năm nhưng thường bùng phát thành dịch lớn vào mùa mưa nhiệt đới ẩm thấp.\n\nCác chuyên gia y tế tại Bệnh viện Đa khoa Thủy Nguyên khuyến cáo:\n1. Triệu chứng lâm sàng điển hình: Sốt cao đột ngột liên tục từ 2 đến 7 ngày, nhức đầu hai thái dương dữ dội, mỏi khớp cơ vai mông lớn, xuất hiện chấm xuất huyết dưới da hoặc chảy máu nướu răng.\n2. Sai lầm cực kỳ nguy hiểm: Tự ý mua thuốc kháng sinh uống (vô tác dụng với virus) hoặc dùng Aspirin, Ibuprofen to hạ sốt cho người bệnh vì những hoạt chất này tăng nguy cơ xuất huyết tiêu hóa dữ dội khó cầm.\n3. Hãy chỉ dùng Paracetamol đơn chất liều 10-15mg/kg cân nặng mỗi 4-6 tiếng và bù nước điện giải oresol tích cực. Nếu thấy bệnh nhân nôn mửa liên tục, đau bụng vùng gan dữ dội, lờ đờ hoặc chảy máu cam thì ngay lập tức phải chuyển viện khẩn cấp.`,
    publishDate: '15/05/2026',
    readTime: '5 phút đọc',
    imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=400',
  }
];
