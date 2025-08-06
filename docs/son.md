K01-FE
├── index.html                        # File HTML gốc, mount ứng dụng React
├── package.json                      # Quản lý thư viện, script dự án
├── tsconfig.json                     # Cấu hình TypeScript
├── vite.config.ts                    # Cấu hình Vite (build tool)
└── src                               # Thư mục chứa mã nguồn chính
    ├── App.tsx                       # Thành phần gốc của ứng dụng React, nơi gọi các route
    ├── App.css                       # CSS cho App.tsx
    ├── index.css                     # CSS tổng, import các style chung (fonts, tailwind, antd)
    ├── main.tsx                      # Điểm khởi tạo ứng dụng React (render App vào DOM)
    ├── components                    # Chứa các component dùng chung
    │   └── layouts                   # Các layout cho từng vai trò người dùng
    │       ├── AdminLayout.tsx       # Layout cho trang quản trị viên
    │       ├── AuthLayout.tsx        # Layout cho trang xác thực (login/register)
    │       └── TeacherLayout.tsx     # Layout cho trang giáo viên
    ├── pages                         # Chứa các trang chính của ứng dụng
    │   ├── admin                     # Trang dành cho quản trị viên
    │   │   ├── ClassManagementPage.tsx   # Trang quản lý lớp học
    │   │   ├── MajorManagementPage.tsx   # Trang quản lý chuyên ngành
    │   │   ├── SubjectManagementPage.tsx # Trang quản lý môn học
    │   │   └── UserManagementPage.tsx    # Trang quản lý người dùng
    │   ├── auth                      # Trang xác thực
    │   │   ├── login
    │   │   │   └── LoginPage.tsx         # Trang đăng nhập
    │   │   ├── register
    │   │   │   └── RegisterPage.tsx      # Trang đăng ký
    │   │   └── forgot-password
    │   │       └── ForgotPasswordPage.tsx # Trang quên mật khẩu
    │   ├── common                    # Trang chung cho mọi vai trò
    │   │   ├── HomePage.tsx              # Trang chủ
    │   │   ├── NotFoundPage.tsx          # Trang 404 không tìm thấy
    │   │   ├── PrivacyPage.tsx           # Trang chính sách bảo mật
    │   │   └── TermsPage.tsx             # Trang điều khoản sử dụng
    │   ├── student                   # Trang dành cho sinh viên
    │   │   ├── ClassOfStudentPage.tsx    # Trang danh sách lớp của sinh viên
    │   │   └── StudentAttendancePage.tsx # Trang điểm danh của sinh viên
    │   └── teacher                   # Trang dành cho giáo viên
    │       ├── AttendanceManagementPage.tsx # Trang quản lý điểm danh (giảng viên)
    │       └── SessionManagementPage.tsx    # Trang quản lý buổi học (giảng viên)
    ├── routes                        # Định nghĩa các route cho từng vai trò
    │   ├── adminRoutes.tsx           # Định nghĩa route cho admin
    │   ├── authRoutes.tsx            # Định nghĩa route cho xác thực
    │   ├── commonRoutes.tsx          # Định nghĩa route cho các trang chung
    │   ├── index.tsx                 # Tổng hợp và xuất các route
    │   ├── studentRoutes.tsx         # Định nghĩa route cho sinh viên
    │   └── teacherRoutes.tsx         # Định nghĩa route cho giáo viên
    └── common
        └── types.ts                  # Định nghĩa các kiểu dữ liệu chung (type/interface)