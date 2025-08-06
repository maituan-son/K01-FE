// Định nghĩa Enum
Enum RoleEnum {
  superAdmin // Phòng đào tạo
  teacher // Giảng viên
  student // Sinh viên
}

Enum StatusEnum {
  PRESENT // Có mặt
  ABSENT // Vắng mặt
  LATE // Muộn
}

Enum SchoolYearEnum {
  K2501
  K2502
  K2503
  K2601
  K2602
  K2603
  K2701
  K2702
  K2703
  K2801
  K2802
  K2803
  K2901
  K2902
  K2903
  K2001
  K2002
  K2003
}

Enum ShiftEnum {
  "1"
  "2"
  "3"
  "4"
  "5"
  "6"
}

// Collection Users
Table Users {
  _id ObjectId [pk]
  role RoleEnum [note: "Vai trò: superAdmin, teacher, student"]
  fullname string [note: "Tên người dùng"]
  username string [unique, note: "Tự sinh, VD: hoangnm06"]
  email string [unique, note: "Email duy nhất"]
  password string [note: "Mật khẩu đã mã hóa"]
  phone string [note: "Số điện thoại, tùy chọn"]
  schoolYear SchoolYearEnum [note: "Niên khóa, ví dụ: K2501 - khóa 01 năm 2025"]
  majorId ObjectId [ref: > Major._id, note: "Tham chiếu đến ngành học, chỉ áp dụng cho role student"] // Thêm mối quan hệ với Major
  studentId string [note: "Mã sinh viên, chỉ áp dụng cho role student, format: YYXXXX (YY: năm, XXXX: số thứ tự, ví dụ: 250001)"]
  createdAt date [note: "Ngày tạo"]
  updatedAt date [note: "Ngày cập nhật"]
  Indexes {
    email [unique]
    username [unique]
    studentId [unique, note: "Chỉ áp dụng cho role student"]
  }
}

// Collection Major
Table Major {
  _id ObjectId [pk]
  name string [note: "Tên ngành học, ví dụ: Công nghệ thông tin"]
  description string [note: "Mô tả ngành học"]
  code string [unique, note: "Mã ngành học, ví dụ: IT, WD"]
  createdAt date
  updatedAt date
  Indexes {
    code [unique]
  }
}

// Collection Subjects
Table Subjects {
  _id ObjectId [pk]
  name string [note: "Tên môn học, ví dụ: Toán Cao Cấp"]
  englishName string [note: "Tên tiếng Anh, ví dụ: Advanced Mathematics"]
  code string [unique, note: "Mã môn học, ví dụ: MAT001 - chữ cái đầu của englishName + 3 số tăng dần"]
  description string [note: "Mô tả môn học, tùy chọn"]
  createdAt date
  updatedAt date
  Indexes {
    code [unique]
  }
}

// Collection Classes
Table Classes {
  _id ObjectId [pk]
  subjectId ObjectId [ref: > Subjects._id, note: "Tham chiếu đến môn học"]
  majorId ObjectId [ref: > Major._id, note: "Lớp học thuộc chuyên ngành nào"]
  name string [unique, note: "Tự sinh: 2 chữ cái đầu từ Major.code + 2 số năm + 2 số thứ tự, ví dụ: WD2506"]
  teacherId ObjectId [ref: > Users._id, note: "Tham chiếu đến giảng viên"]
  studentIds ObjectId[] [ref: > Users._id, note: "Danh sách sinh viên"]
  startDate date [note: "Ngày bắt đầu lớp học"]
  totalSessions int [note: "Tổng số buổi học"]
  shift ShiftEnum [note: "Ca học: 1-6 (7h-9h, 9h-11h, ..., 17h-19h)"] // Sửa shiftb thành shift
  createdAt date
  updatedAt date
  Indexes {
    name [unique]
    subjectId
    teacherId
    majorId
  }
}

Enum RoomEnum {
  "Online"
  "A101"
  "F204"
}

// Collection Sessions
Table Sessions {
  _id ObjectId [pk]
  classId ObjectId [ref: > Classes._id, note: "Tham chiếu đến lớp học"]
  sessionDate date [note: "Ngày diễn ra buổi học"]
  shift ShiftEnum [note: "Ca học: 1-6, kế thừa từ Classes"] // Thống nhất kiểu ShiftEnum
  room RoomEnum [note: "Phòng học, ví dụ: A101"] // Thêm trường phòng học, Toà A, tầng 1, phòng 1.
  createdAt date
  updatedAt date
  Indexes {
    classId
    sessionDate
  }
}

// Collection Attendances
Table Attendances {
  _id ObjectId [pk]
  sessionId ObjectId [ref: > Sessions._id, note: "Tham chiếu đến buổi học"]
  studentId ObjectId [ref: > Users._id, note: "Tham chiếu đến sinh viên"]
  status StatusEnum [note: "Trạng thái: PRESENT, ABSENT, LATE"]
  note string [note: "Ghi chú, tùy chọn"]
  createdAt date
  updatedAt date
  Indexes {
    sessionId
    studentId
  }
}

// Lưu ý:
// một số vấn đề như 1 phòng học tại 1 ca  trong 1 ngày không thể có 2 lớp học, hay 1 giáo viên không thể dạy 2 lớp trong cùng 1 ca của 1 ngày
// Khi tạo API endpoint:
// chỉ trả về danh sách các phòng học trống khi thêm lớp học.
// Thêm lớp cần lựa chọn ưu tiên lịch giảng viên hay ưu tiên ca của lớp học, nếu ưu tiên cái nào thì chọn cái đó trước
// Nếu ưu tiên giảng viên, viết API chỉ trả về các ca mà giảng viên đó không bận để hiển thị ra lựa chọn ca học khi tạo lớp.
// Nếu ưu tiên ca của lớp học, chọn ca xong lấy danh sách giảng viên ca đó không có lớp.

Ref: "Classes"."_id" < "Classes"."subjectId"