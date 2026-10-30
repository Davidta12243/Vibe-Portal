import type { SubSystem, CloudTool } from './types';

export const subSystems: SubSystem[] = [
  {
    id: 'lms',
    name: '5. Vibe Edu (LMS)',
    category: 'Giáo Dục Trực Tuyến',
    port: 3005,
    liveUrl: 'https://5lms.vercel.app',
    adminUrl: 'https://5lms.vercel.app/admin',
    adminPath: '/admin',
    adminActionLabel: 'Mở Trang Quản Trị LMS',
    database: 'Internal Models & APIs',
    framework: 'Next.js 16',
    color: '#8b5cf6',
    iconName: 'GraduationCap',
    badgeText: 'Admin Dashboard Hoàn Chỉnh',
    description: 'Bảng điều khiển quản lý toàn diện: học viên, mã kích hoạt khóa học, audit logs và doanh thu.',
    adminFeatures: ['Quản lý người dùng & phân quyền', 'Tạo & giới hạn mã mời khóa học', 'Nhật ký bảo mật Audit Logs', 'Báo cáo doanh thu & học viên']
  },
  {
    id: 'food',
    name: '2. Vibe Farm / Food',
    category: 'Nông Sản & Thực Phẩm',
    port: 3002,
    liveUrl: 'https://2food.vercel.app',
    adminUrl: 'https://2food.vercel.app/addItem',
    adminPath: '/addItem',
    adminActionLabel: 'Đăng & Quản Lý Nông Sản',
    database: 'Firebase Firestore & Storage',
    framework: 'Vite + React',
    color: '#10b981',
    iconName: 'Apple',
    badgeText: 'Kho Nông Sản Realtime',
    description: 'Giao diện quản trị kho: Đăng thực phẩm tươi mới, tải ảnh trực tiếp lên Firebase Storage và định giá bán.',
    adminFeatures: ['Tải ảnh sản phẩm lên Firebase Storage', 'Phân loại rau củ, quả, thịt cá', 'Định lượng calo và giá niêm yết', 'Cập nhật kho hàng theo thời gian thực']
  },
  {
    id: 'live',
    name: '6. Vibe Live Studio',
    category: 'Livestream WebRTC',
    port: 3006,
    liveUrl: 'https://6livestream.vercel.app',
    adminUrl: 'https://6livestream.vercel.app/host',
    adminPath: '/host',
    adminActionLabel: 'Phòng Điều Khiển Host',
    database: 'LiveKit Cloud Server',
    framework: 'Next.js 14',
    color: '#f43f5e',
    iconName: 'Video',
    badgeText: 'Studio Livestreaming',
    description: 'Trạm điều khiển phát sóng trực tiếp: Host kiểm soát camera, mic, chia sẻ màn hình và duyệt khán giả.',
    adminFeatures: ['Tạo phòng livestream bảo mật', 'Điều khiển thiết bị video/audio chuẩn Studio', 'Quản lý người xem thời gian thực', 'Công nghệ WebRTC độ trễ siêu thấp']
  },
  {
    id: 'travel',
    name: '4. Vibe Travel',
    category: 'Đặt Vé & Du Lịch',
    port: 3004,
    liveUrl: 'https://4travelling.vercel.app',
    adminUrl: 'https://4travelling.vercel.app/dashboard',
    adminPath: '/dashboard',
    adminActionLabel: 'Bảng Điều Khiển Đặt Vé',
    database: 'MongoDB Atlas',
    framework: 'Next.js 14',
    color: '#06b6d4',
    iconName: 'Plane',
    badgeText: 'Hệ Thống Booking',
    description: 'Nền tảng quản lý đặt chỗ: Chuyến bay, phòng khách sạn, combo du lịch kết nối cơ sở dữ liệu MongoDB.',
    adminFeatures: ['Quản lý vé máy bay nội địa & quốc tế', 'Theo dõi đặt phòng khách sạn', 'Kết nối MongoDB Atlas models', 'Cổng hỗ trợ khách hàng và điều khoản']
  },
  {
    id: 'shop',
    name: '1. Vibe Shop',
    category: 'Sàn TMĐT Đa Ngành Hàng',
    port: 3001,
    liveUrl: 'https://1shop-virid.vercel.app',
    adminUrl: 'https://1shop-virid.vercel.app/user/profile',
    adminPath: '/user/profile',
    adminActionLabel: 'Quản Trị Người Dùng & Đơn Hàng',
    database: 'RESTful API / Shopee Backend',
    framework: 'Vite + React + TS',
    color: '#f97316',
    iconName: 'ShoppingBag',
    badgeText: 'Thương Mại Điện Tử',
    description: 'Sàn mua sắm trực tuyến: Xem giỏ hàng, flash sale, quản lý lịch sử mua sắm và thông tin khách hàng.',
    adminFeatures: ['Quản lý hồ sơ người dùng', 'Lịch sử mua hàng & trạng thái đơn', 'Hệ thống giỏ hàng và thanh toán', 'Bộ lọc sản phẩm đa tiêu chí']
  },
  {
    id: 'pc',
    name: '3. Vibe Tech / PC',
    category: 'Linh Kiện Máy Tính',
    port: 3003,
    liveUrl: 'https://3computer.vercel.app',
    adminUrl: 'https://3computer.vercel.app/pcbuilder',
    adminPath: '/pcbuilder',
    adminActionLabel: 'Cấu Hình Ráp PC',
    database: 'Local JSON API (db.json)',
    framework: 'Next.js 13',
    color: '#3b82f6',
    iconName: 'Cpu',
    badgeText: 'PC Builder Hub',
    description: 'Hệ thống ráp PC và quản lý danh mục CPU, Mainboard, VGA, RAM với thuật toán kiểm tra tương thích.',
    adminFeatures: ['Quản lý kho linh kiện qua API nội bộ', 'Công cụ tự build cấu hình máy tính', 'Kiểm tra tương thích phần cứng', 'Chi tiết thông số kỹ thuật sản phẩm']
  },
  {
    id: 'portal',
    name: '0. Vibe Portal Hub',
    category: 'Cổng Kết Nối Hệ Sinh Thái',
    port: 3000,
    liveUrl: 'https://0vibe-landingpage.vercel.app',
    adminUrl: 'https://0vibe-landingpage.vercel.app/#ecosystem',
    adminPath: '/#ecosystem',
    adminActionLabel: 'Quản Lý Điều Hướng Cổng',
    database: 'Static Environment Config',
    framework: 'Vite + Shadcn UI',
    color: '#a855f7',
    iconName: 'Globe',
    badgeText: 'Cổng Trung Tâm',
    description: 'Trang chủ kết nối toàn bộ hệ sinh thái 6 phân hệ con và đóng vai trò cổng chào tổng cho khách hàng.',
    adminFeatures: ['Cổng điều hướng tập trung', 'Kiểm tra trạng thái các phân hệ con', 'Tích hợp đăng nhập Vibe ID', 'Giao diện tương thích đa thiết bị']
  }
];

export const cloudTools: CloudTool[] = [
  {
    name: 'Vercel Deployment Dashboard',
    type: 'Hosting & CI/CD',
    url: 'https://vercel.com/dashboard',
    description: 'Quản lý toàn bộ 7 dự án web, xem logs build, cấu hình domain và rollback phiên bản.',
    iconColor: '#ffffff'
  },
  {
    name: 'MongoDB Atlas',
    type: 'Cloud Database (Web 4)',
    url: 'https://cloud.mongodb.com',
    description: 'Xem bảng dữ liệu, chỉnh sửa trực tiếp thông tin vé máy bay và phòng khách sạn của Vibe Travel.',
    iconColor: '#10b981'
  },
  {
    name: 'Firebase Console',
    type: 'Storage & Database (Web 2)',
    url: 'https://console.firebase.google.com',
    description: 'Xem kho ảnh nông sản (Firebase Storage) và cơ sở dữ liệu thực phẩm (Firestore).',
    iconColor: '#f59e0b'
  },
  {
    name: 'LiveKit Cloud',
    type: 'WebRTC Server (Web 6)',
    url: 'https://cloud.livekit.io',
    description: 'Giám sát các phòng livestream đang phát sóng, kiểm tra băng thông và số lượng người xem.',
    iconColor: '#06b6d4'
  },
  {
    name: 'GitHub Repository',
    type: 'Mã Nguồn Tập Trung',
    url: 'https://github.com/Davidta12243/Vibe-Portal',
    description: 'Kho lưu trữ git monorepo đồng bộ toàn bộ 7 web và hệ thống quản trị Vibe Studio.',
    iconColor: '#c084fc'
  }
];
