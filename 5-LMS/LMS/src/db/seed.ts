import { getDb } from './schema';
import crypto from 'crypto';

export function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password + 'lms_secret_salt_2026').digest('hex');
}

export function seedDatabase(force: boolean = false) {
  const db = getDb();

  // Kiểm tra nếu đã có khóa học mới với tác giả TS. Tạ Minh Quang thì không cần seed lại (trừ khi force = true)
  const existingNewCourse = db.prepare("SELECT id, instructor_name FROM courses WHERE id = 'crs_data_collection'").get() as any;
  if (existingNewCourse && existingNewCourse.instructor_name === 'Tiến sĩ Tạ Minh Quang' && !force) {
    return;
  }

  const transaction = db.transaction(() => {
    // 1. Dọn dẹp các khóa học, bài giảng và sản phẩm cũ nếu có
    const oldCourseIds = ['crs_ai_agent_001', 'crs_arch_002', 'crs_nextjs_003', 'crs_uiux_004'];
    for (const oldId of oldCourseIds) {
      db.prepare('DELETE FROM courses WHERE id = ?').run(oldId);
      db.prepare('DELETE FROM entitlements WHERE course_id = ?').run(oldId);
    }
    db.prepare("DELETE FROM products WHERE id IN ('prd_course_ai', 'prd_course_arch')").run();

    // 2. Tạo tài khoản mẫu (nếu chưa có)
    const adminId = 'usr_admin_001';
    const studentId = 'usr_student_001';

    const insertProfile = db.prepare(`
      INSERT OR IGNORE INTO profiles (id, email, password_hash, full_name, avatar_url, role, bio)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    insertProfile.run(
      adminId,
      'admin@lms.edu.vn',
      hashPassword('admin123'),
      'GS. Vũ Đình Trọng (Quản Trị)',
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
      'admin',
      'Giám đốc học thuật và Tổng quản trị hệ thống LMS Private.'
    );

    insertProfile.run(
      studentId,
      'student@lms.edu.vn',
      hashPassword('student123'),
      'Nguyễn Văn An (Học Viên)',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      'student',
      'Học viên theo định hướng Data Science & Statistics.'
    );

    // 3. Tạo mã mời hợp lệ (Invitations)
    const insertInvite = db.prepare(`
      INSERT OR IGNORE INTO invitations (id, code, created_by, role, max_uses, used_count, expires_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    insertInvite.run(
      'inv_vip_001',
      'LMS-VIP-2026',
      adminId,
      'student',
      100,
      1,
      '2027-01-01 00:00:00'
    );

    insertInvite.run(
      'inv_pro_002',
      'ACADEMIC-PRO',
      adminId,
      'student',
      20,
      0,
      '2026-12-31 00:00:00'
    );

    // 4. Tạo 2 Khóa học THẬT từ 2 Video trong folder test
    const insertCourse = db.prepare(`
      INSERT OR REPLACE INTO courses (
        id, slug, title, subtitle, description, thumbnail_url,
        instructor_name, instructor_title, instructor_avatar,
        learning_outcomes, target_audience, category, level,
        duration_minutes, price, is_published,
        demo_5m_url, demo_5m_title, demo_5m_duration,
        demo_20m_url, demo_20m_title, demo_20m_duration
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    // KHÓA 1: Data Collection Methods
    const c1Id = 'crs_data_collection';
    insertCourse.run(
      c1Id,
      'phuong-phap-thu-thap-du-lieu',
      'Phương Pháp Thu Thập Dữ Liệu (Data Collection Methods)',
      'Khảo sát toàn bộ, điều tra mẫu, quan sát và thực nghiệm trong Thống kê học',
      'Bài giảng cung cấp cái nhìn toàn diện và so sánh các phương pháp thu thập dữ liệu trong thống kê: Census (Điều tra toàn bộ), Sample Survey (Khảo sát mẫu), Observational Method (Phương pháp quan sát) và Experiment (Thực nghiệm). Phân tích ưu và nhược điểm của từng phương pháp để ứng dụng chuẩn xác vào nghiên cứu thực tế.',
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80',
      'Tiến sĩ Tạ Minh Quang',
      'Khoa Quản trị Kinh doanh - NEU',
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
      JSON.stringify([
        'Phân biệt rõ ràng 4 phương pháp thu thập dữ liệu: Census, Survey, Observation, Experiment',
        'Đánh giá ưu điểm, nhược điểm và chi phí của từng phương pháp',
        'Lựa chọn phương pháp thu thập dữ liệu tối ưu cho từng bài toán nghiên cứu thực tế',
        'Tránh các sai số chọn mẫu (Sampling Bias) phổ biến'
      ]),
      JSON.stringify([
        'Sinh viên, học viên ngành Khoa học dữ liệu, Thống kê, Kinh tế',
        'Nhà nghiên cứu thị trường, Data Analyst cần thiết kế bảng hỏi và thu thập dữ liệu'
      ]),
      'Khoa Học Dữ Liệu & Thống Kê',
      'beginner',
      8,
      350000,
      1,
      '/videos/data-collection-demo-5m.mp4',
      'Demo 5 phút: Khảo sát mẫu và Phương pháp quan sát thực địa',
      300,
      '/videos/data-collection-full.mp4',
      'Video bài giảng đầy đủ: Toàn bộ 4 phương pháp & Sai số chọn mẫu',
      442
    );

    // KHÓA 2: Influential Points in Regression
    const c2Id = 'crs_influential_points';
    insertCourse.run(
      c2Id,
      'diem-anh-huong-trong-hoi-quy',
      'Điểm Ảnh Hưởng Trong Hồi Quy (Influential Points in Regression)',
      'Nhận diện và xử lý các điểm dữ liệu dị biệt làm thay đổi độ dốc của đường hồi quy',
      'Đi sâu vào kỹ thuật phân tích hồi quy tuyến tính trong thống kê. Học cách phát hiện các điểm ảnh hưởng (Influential Points), phân biệt chúng với Outliers thông thường và đánh giá mức độ tác động của chúng đối với hệ số góc và độ tin cậy của mô hình dự báo.',
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80',
      'Tiến sĩ Tạ Minh Quang',
      'Khoa Quản trị Kinh doanh - NEU',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      JSON.stringify([
        'Hiểu bản chất của Điểm ảnh hưởng (Influential Points) trong hồi quy tuyến tính',
        'Phân biệt chính xác giữa Outlier (Điểm dị biệt) và Leverage Point (Điểm đòn bẩy)',
        'Biết cách kiểm định và đo lường sự thay đổi của hệ số góc (Slope) khi loại bỏ điểm ảnh hưởng',
        'Đưa ra quyết định giữ lại hay loại bỏ dữ liệu dị biệt một cách có cơ sở khoa học'
      ]),
      JSON.stringify([
        'Data Analyst, Data Scientist muốn xây dựng mô hình hồi quy chuẩn xác',
        'Kỹ sư Machine Learning tối ưu hóa tiền xử lý dữ liệu (Data Preprocessing)'
      ]),
      'Khoa Học Dữ Liệu & Thống Kê',
      'intermediate',
      6,
      450000,
      1,
      '/videos/influential-points-demo-5m.mp4',
      'Demo 5 phút: Nhận diện Điểm Ảnh Hưởng & Điểm Đòn Bẩy',
      300,
      '/videos/influential-points-full.mp4',
      'Video bài giảng đầy đủ: Đo lường tác động đến hệ số góc mô hình',
      353
    );

    // 5. Tạo Sections & Lessons cho Course 1 (Data Collection)
    const sec1Id = 'sec_dc_01';
    db.prepare('DELETE FROM course_sections WHERE course_id = ?').run(c1Id);
    db.prepare('INSERT INTO course_sections (id, course_id, title, order_index) VALUES (?, ?, ?, ?)').run(
      sec1Id, c1Id, 'Chương 1: Các Phương Pháp Thu Thập Dữ Liệu Thống Kê', 1
    );

    const insertLesson = db.prepare(`
      INSERT OR REPLACE INTO lessons (
        id, section_id, title, description, content_markdown,
        video_url, video_duration_seconds, is_free_preview, order_index
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const l1Id = 'lsn_dc_01';
    insertLesson.run(
      l1Id,
      sec1Id,
      'Bài 1: Phân Tích & So Sánh 4 Phương Pháp Thu Thập Dữ Liệu Thống Kê',
      'Khám phá chi tiết phương pháp Census, Sample Survey, Observation và Experiment.',
      `# Bài 1: Các Phương Pháp Thu Thập Dữ Liệu Thống Kê
(Giảng viên: TS. Tạ Minh Quang - Khoa Quản trị Kinh doanh - NEU)

Trong bài học này, chúng ta sẽ tìm hiểu 4 phương pháp cốt lõi để thu thập số liệu nghiên cứu:

### 1. Census (Điều tra toàn bộ)
- **Định nghĩa:** Thu thập dữ liệu từ toàn bộ cá thể trong quần thể mục tiêu.
- **Ưu điểm:** Độ chính xác tối đa, không có sai số chọn mẫu.
- **Nhược điểm:** Chi phí cực kỳ tốn kém và mất rất nhiều thời gian.

### 2. Sample Survey (Khảo sát mẫu)
- **Định nghĩa:** Thu thập dữ liệu từ một tập con đại diện của quần thể.
- **Ưu điểm:** Nhanh chóng, tiết kiệm chi phí, khả thi trên quy mô lớn.
- **Thách thức:** Cần kỹ thuật chọn mẫu ngẫu nhiên để tránh Bias (sai lệch).

### 3. Observational Study (Nghiên cứu quan sát)
- **Định nghĩa:** Quan sát và ghi nhận hành vi tự nhiên mà không can thiệp hay áp đặt xử lý.
- **Hạn chế:** Chỉ phát hiện được mối tương quan (Correlation), không chứng minh được quan hệ nhân quả (Causation).

### 4. Experiment (Thực nghiệm kiểm chứng)
- **Định nghĩa:** Áp đặt các điều kiện can thiệp (Treatments) lên các nhóm đối tượng được phân bổ ngẫu nhiên để đo lường phản ứng.
- **Ưu điểm lớn nhất:** Là phương pháp duy nhất có thể thiết lập quan hệ nhân quả vững chắc.`,
      '/videos/data-collection-full.mp4',
      442,
      1,
      1
    );

    // Tạo Sections & Lessons cho Course 2 (Influential Points)
    const sec2Id = 'sec_ip_01';
    db.prepare('DELETE FROM course_sections WHERE course_id = ?').run(c2Id);
    db.prepare('INSERT INTO course_sections (id, course_id, title, order_index) VALUES (?, ?, ?, ?)').run(
      sec2Id, c2Id, 'Chương 1: Phân Tích Dữ Liệu Dị Biệt Trong Hồi Quy Tuyến Tính', 1
    );

    const l2Id = 'lsn_ip_01';
    insertLesson.run(
      l2Id,
      sec2Id,
      'Bài 1: Phát Hiện & Đánh Giá Tác Động Của Điểm Ảnh Hưởng (Influential Points)',
      'Phân biệt Outlier và Leverage Point, đo lường sự thay đổi của độ dốc đường hồi quy.',
      `# Bài 1: Điểm Ảnh Hưởng Trong Hồi Quy (Influential Points)
(Giảng viên: TS. Tạ Minh Quang - Khoa Quản trị Kinh doanh - NEU)

### Điểm ảnh hưởng (Influential Point) là gì?
Một điểm dữ liệu được gọi là **Influential Point** nếu việc loại bỏ nó ra khỏi tập dữ liệu làm thay đổi đáng kể phương trình hồi quy, đặc biệt là **hệ số góc (Slope)** của đường hồi quy tuyến tính.

### Phân biệt Outlier vs Influential Point:
1. **Outlier (Điểm dị biệt):** Điểm có phần dư (residual) lớn, nằm xa đường hồi quy theo phương thẳng đứng (trục Y).
2. **High Leverage Point (Điểm đòn bẩy cao):** Điểm có giá trị X nằm xa giá trị trung bình của X.
3. **Influential Point:** Thường là điểm kết hợp cả hai yếu tố trên: vừa có giá trị X cực trị, vừa kéo đường hồi quy nghiêng hẳn về phía nó.

> **Quy tắc vàng:** Không được tùy tiện xóa bỏ điểm ảnh hưởng chỉ vì nó làm xấu mô hình; cần điều tra xem đó là lỗi nhập liệu hay là một hiện tượng khoa học thực tế!`,
      '/videos/influential-points-full.mp4',
      353,
      1,
      1
    );

    // 6. Thêm Tài liệu đính kèm
    const insertRes = db.prepare(`
      INSERT OR REPLACE INTO lesson_resources (id, lesson_id, title, resource_type, file_url, file_size_bytes, order_index)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    insertRes.run('res_dc_01', l1Id, 'Tài liệu tóm tắt: So sánh 4 phương pháp thu thập dữ liệu (PDF)', 'pdf', '/materials/Data_Collection_Summary.pdf', 1250000, 1);
    insertRes.run('res_ip_01', l2Id, 'Sổ tay công thức: Phát hiện Outlier & Leverage Points (PDF)', 'pdf', '/materials/Influential_Points_Guide.pdf', 980000, 1);

    // 7. Thêm Bài tập trắc nghiệm (Quizzes)
    const quiz1Id = 'qz_dc_01';
    db.prepare('DELETE FROM quizzes WHERE id = ?').run(quiz1Id);
    db.prepare(`
      INSERT INTO quizzes (id, lesson_id, title, description, passing_score, max_attempts)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(quiz1Id, l1Id, 'Bài Kiểm Tra: Phương Pháp Thu Thập Dữ Liệu', 'Đánh giá mức độ thấu hiểu về 4 phương pháp thu thập dữ liệu thống kê.', 80, 5);

    const insertQ = db.prepare(`
      INSERT OR REPLACE INTO quiz_questions (id, quiz_id, question_text, explanation, order_index, points)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    const insertOpt = db.prepare(`
      INSERT OR REPLACE INTO quiz_options (id, question_id, option_text, is_correct, order_index)
      VALUES (?, ?, ?, ?, ?)
    `);

    // Câu hỏi 1 - Data Collection
    const q1Id = 'q_dc_01';
    insertQ.run(q1Id, quiz1Id, 'Phương pháp nào sau đây là phương pháp duy nhất có thể chứng minh mối quan hệ nhân quả (Cause-and-Effect)?', 'Chỉ có phương pháp thực nghiệm (Experiment) với việc phân bổ ngẫu nhiên các can thiệp mới có thể chứng minh quan hệ nhân quả.', 1, 10);
    insertOpt.run('opt_dc_1a', q1Id, 'Khảo sát mẫu (Sample Survey)', 0, 1);
    insertOpt.run('opt_dc_1b', q1Id, 'Nghiên cứu quan sát (Observational Study)', 0, 2);
    insertOpt.run('opt_dc_1c', q1Id, 'Thực nghiệm (Experiment)', 1, 3);
    insertOpt.run('opt_dc_1d', q1Id, 'Điều tra toàn bộ (Census)', 0, 4);

    // Câu hỏi 2 - Data Collection
    const q2Id = 'q_dc_02';
    insertQ.run(q2Id, quiz1Id, 'Nhược điểm lớn nhất của phương pháp điều tra toàn bộ (Census) là gì?', 'Census đòi hỏi ngân sách khổng lồ và thời gian thực hiện kéo dài do phải tiếp cận toàn bộ quần thể.', 2, 10);
    insertOpt.run('opt_dc_2a', q2Id, 'Chi phí rất tốn kém và mất nhiều thời gian', 1, 1);
    insertOpt.run('opt_dc_2b', q2Id, 'Không thể thu thập dữ liệu chính xác', 0, 2);
    insertOpt.run('opt_dc_2c', q2Id, 'Sai số chọn mẫu quá cao', 0, 3);
    insertOpt.run('opt_dc_2d', q2Id, 'Không áp dụng được cho con người', 0, 4);

    // 8. Tạo Products cho 2 khóa học mới
    const insertProd = db.prepare(`
      INSERT OR REPLACE INTO products (id, title, description, type, price, original_price, is_active, features_list, duration_days)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const insertProdEnt = db.prepare(`
      INSERT OR REPLACE INTO product_entitlements (id, product_id, course_id)
      VALUES (?, ?, ?)
    `);

    // Sản phẩm mua lẻ Khóa 1 (Data Collection)
    const p1Id = 'prd_course_dc';
    insertProd.run(p1Id, 'Khóa Học: Phương Pháp Thu Thập Dữ Liệu (Mua lẻ)', 'Sở hữu vĩnh viễn khóa học, video bài giảng, tài liệu đính kèm và bài tập trắc nghiệm.', 'single_course', 350000, 500000, 1, JSON.stringify([
      'Truy cập vĩnh viễn toàn bộ bài giảng Data Collection Methods',
      'Xem video chất lượng cao không giới hạn',
      'Làm bài tập trắc nghiệm đánh giá kiến thức',
      'Tải tài liệu tóm tắt học thuật PDF'
    ]), null);
    insertProdEnt.run('pe_dc', p1Id, c1Id);

    // Sản phẩm mua lẻ Khóa 2 (Influential Points)
    const p2Id = 'prd_course_ip';
    insertProd.run(p2Id, 'Khóa Học: Điểm Ảnh Hưởng Trong Hồi Quy (Mua lẻ)', 'Sở hữu vĩnh viễn khóa học phân tích hồi quy chuyên sâu.', 'single_course', 450000, 650000, 1, JSON.stringify([
      'Truy cập vĩnh viễn bài giảng Influential Points in Regression',
      'Xem video chi tiết phân tích điểm dị biệt và đòn bẩy',
      'Làm bài tập trắc nghiệm và tải tài liệu PDF'
    ]), null);
    insertProdEnt.run('pe_ip', p2Id, c2Id);

    // Gói Membership Tháng
    const pMemberMonth = 'prd_membership_month';
    insertProd.run(pMemberMonth, 'Gói Hội Viên Chuyên Sâu (Tháng)', 'Mở khóa toàn bộ thư viện bài giảng trong 30 ngày.', 'membership_monthly', 490000, 790000, 1, JSON.stringify([
      'Không giới hạn truy cập TOÀN BỘ khóa học trong 30 ngày',
      'Xem cả hai video demo và toàn bộ video full bài giảng',
      'Tham gia làm bài tập và tải tài liệu độc quyền',
      'Hủy gia hạn bất kỳ lúc nào chỉ với một cú nhấp chuột'
    ]), 30);
    insertProdEnt.run('pe_mem_m', pMemberMonth, null);

    // Gói Membership Năm
    const pMemberYear = 'prd_membership_year';
    insertProd.run(pMemberYear, 'Gói Hội Viên Toàn Diện (Năm) - Best Value', 'Trọn gói 365 ngày tiếp cận mọi tri thức học thuật đỉnh cao với chi phí tiết kiệm 35%.', 'membership_yearly', 3990000, 5880000, 1, JSON.stringify([
      'Không giới hạn truy cập TOÀN BỘ khóa học trong 365 ngày',
      'Mở khóa ngay tất cả các khóa học mới phát hành trong năm',
      'Quyền tham gia các buổi trao đổi học thuật trực tuyến',
      'Chứng chỉ hoàn thành từng khóa học có mã xác thực',
      'Tiết kiệm hơn 35% so với thanh toán theo tháng'
    ]), 365);
    insertProdEnt.run('pe_mem_y', pMemberYear, null);

    // 9. Cấp quyền truy cập sẵn cho tài khoản `student@lms.edu.vn` vào Khóa 1 để học viên vào xem được ngay Video Full
    db.prepare(`
      INSERT OR REPLACE INTO entitlements (id, user_id, course_id, source_type, source_id, expires_at, is_active)
      VALUES (?, ?, ?, 'purchase', 'ord_initial_grant', null, 1)
    `).run('ent_student_dc', studentId, c1Id);
  });

  transaction();
}
