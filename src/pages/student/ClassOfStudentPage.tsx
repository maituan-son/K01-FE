import React, { useEffect, useState } from "react";
import { Card, Button, Input, Select, Form, message, Tabs } from "antd";
import {
  CalendarOutlined,
  FilterOutlined,
  SearchOutlined,
  LeftOutlined,
  RightOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";

const { Option } = Select;
const { TabPane } = Tabs;

const faculties = [
  { value: "cntt", label: "Công nghệ thông tin" },
  { value: "ktoan", label: "Kế toán" },
  { value: "qtkd", label: "Quản trị kinh doanh" },
  { value: "nna", label: "Ngoại ngữ Anh" },
  { value: "xd", label: "Xây dựng" },
  { value: "co-khi", label: "Cơ khí" },
];

const classes = [
  { value: "cntt01-k15", label: "CNTT01-K15" },
  { value: "cntt02-k15", label: "CNTT02-K15" },
  { value: "ktoan01-k15", label: "KTOAN01-K15" },
  { value: "qtkd01-k15", label: "QTKD01-K15" },
  { value: "nna01-k15", label: "NNA01-K15" },
  { value: "xd01-k15", label: "XD01-K15" },
];

const teachers = [
  { value: "nguyen-van-a", label: "Nguyễn Văn A" },
  { value: "tran-thi-b", label: "Trần Thị B" },
  { value: "le-van-c", label: "Lê Văn C" },
  { value: "pham-thi-d", label: "Phạm Thị D" },
  { value: "hoang-van-e", label: "Hoàng Văn E" },
];

const subjects = [
  { value: "lap-trinh-web", label: "Lập trình Web" },
  { value: "co-so-du-lieu", label: "Cơ sở dữ liệu" },
  { value: "mang-may-tinh", label: "Mạng máy tính" },
  { value: "toan-cao-cap", label: "Toán cao cấp" },
  { value: "tieng-anh", label: "Tiếng Anh" },
];

const rooms = [
  { value: "a101", label: "Phòng A101" },
  { value: "a102", label: "Phòng A102" },
  { value: "b201", label: "Phòng B201" },
  { value: "c301", label: "Phòng C301" },
  { value: "lab01", label: "Phòng Lab 01" },
];

type ShiftEnum = 1 | 2 | 3 | 4 | 5 | 6;
type RoomEnum = "Online" | "A101" | "F204";

interface Class {
  _id: string;
  subjectId: string;
  majorId: string;
  name: string;
  teacherId: string;
  studentIds: string[];
  startDate: string;
  totalSessions: number;
  shift: ShiftEnum;
  deletedAt?: string;
  createdAt: string;
  updatedAt: string;
}

const shiftOptions = [
  { label: "Ca 1 (7h-9h)", value: 1 },
  { label: "Ca 2 (9h-11h)", value: 2 },
  { label: "Ca 3 (11h-13h)", value: 3 },
  { label: "Ca 4 (13h-15h)", value: 4 },
  { label: "Ca 5 (15h-17h)", value: 5 },
  { label: "Ca 6 (17h-19h)", value: 6 },
];

const timeOptions = [
  { value: "next7", label: "7 ngày tới" },
  { value: "next14", label: "14 ngày tới" },
  { value: "next30", label: "30 ngày tới" },
  { value: "next60", label: "60 ngày tới" },
  { value: "next90", label: "90 ngày tới" },
  { value: "prev7", label: "7 ngày trước" },
  { value: "prev14", label: "14 ngày trước" },
  { value: "prev30", label: "30 ngày trước" },
  { value: "prev60", label: "60 ngày trước" },
  { value: "prev90", label: "90 ngày trước" },
];

const scheduleData = [
  {
    key: "1",
    subject: "Lập trình Web",
    teacher: "Nguyễn Văn A",
    room: "Phòng A101",
    class: "CNTT01-K15",
    type: "theory",
    day: 1, // Thứ 2 (0: Chủ nhật, 1: Thứ 2, ...)
    timeSlot: 0, // 0: 07:00 - 09:30
  },
  {
    key: "2",
    subject: "Cơ sở dữ liệu",
    teacher: "Trần Thị B",
    room: "Phòng Lab 01",
    class: "CNTT01-K15",
    type: "practice",
    day: 2,
    timeSlot: 1,
  },
  {
    key: "3",
    subject: "Toán cao cấp",
    teacher: "Phạm Thị D",
    room: "Phòng A102",
    class: "KTOAN01-K15",
    type: "theory",
    day: 4,
    timeSlot: 0,
  },
  {
    key: "4",
    subject: "Mạng máy tính",
    teacher: "Lê Văn C",
    room: "Phòng B201",
    class: "CNTT02-K15",
    type: "theory",
    day: 2,
    timeSlot: 2,
  },
  {
    key: "5",
    subject: "Tiếng Anh",
    teacher: "Hoàng Văn E",
    room: "Phòng C301",
    class: "NNA01-K15",
    type: "theory",
    day: 6,
    timeSlot: 3,
  },
];

const ClassOfStudentPage: React.FC = () => {
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [timeFilter, setTimeFilter] = useState("next7");

  const [modalVisible, setModalVisible] = useState(false);
  const [editing, setEditing] = useState<Class | null>(null);

  const [form] = Form.useForm();

  // Fake API
  const fetchClasses = async () => {
    setLoading(true);
    // TODO: Replace with real API, filter by timeFilter
    setTimeout(() => {
      setClasses([
        {
          _id: "1",
          subjectId: "SUB1",
          majorId: "MJ1",
          name: "WD2506",
          teacherId: "T1",
          studentIds: ["S1", "S2"],
          startDate: "2024-08-01",
          totalSessions: 20,
          shift: 1,
          createdAt: "2024-07-29",
          updatedAt: "2024-07-29",
        },
      ]);
      setTotal(1);
      setLoading(false);
    }, 500);
  };

  useEffect(() => {
    fetchClasses();
  }, [search, page, pageSize, timeFilter]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleAdd = () => {
    setEditing(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record: Class) => {
    setEditing(record);
    form.setFieldsValue({
      ...record,
      startDate: dayjs(record.startDate),
    });
    setModalVisible(true);
  };

  const handleDelete = async (_id: string) => {
    // TODO: Call API to delete
    message.success("Xóa thành công!");
    fetchClasses();
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      if (editing) {
        // TODO: Call API update
        message.success("Cập nhật thành công!");
      } else {
        // TODO: Call API create
        message.success("Thêm mới thành công!");
      }
      setModalVisible(false);
      fetchClasses();
    } catch {}
  };

  const columns = [
    {
      title: "STT",
      render: (_: any, __: any, idx: number) => (page - 1) * pageSize + idx + 1,
      width: 60,
    },
    { title: "Ngày", dataIndex: "startDate" },
    { title: "Phòng", dataIndex: "room" },
    { title: "Giảng đường", dataIndex: "hall" },
    { title: "Mã môn", dataIndex: "subjectId" },
    { title: "Môn", dataIndex: "subjectName" },
    { title: "Lớp", dataIndex: "name" },
    { title: "Giảng viên", dataIndex: "teacherId" },
    {
      title: "Ca",
      dataIndex: "shift",
      render: (shift: ShiftEnum) =>
        shiftOptions.find((s) => s.value === shift)?.label,
    },
    { title: "Thời gian", dataIndex: "time" },
  ];

  const [viewMode, setViewMode] = useState("week");
  const [currentDate, setCurrentDate] = useState(new Date());

  const getWeekDays = (date: Date) => {
    const week = [];
    const startDate = new Date(date);
    const day = startDate.getDay();
    const diff = startDate.getDate() - day + (day === 0 ? -6 : 1);
    startDate.setDate(diff);

    for (let i = 0; i < 7; i++) {
      const currentDay = new Date(startDate);
      currentDay.setDate(startDate.getDate() + i);
      week.push(currentDay);
    }
    return week;
  };

  const weekDays = getWeekDays(currentDate);
  const timeSlots = [
    "07:00 - 09:30",
    "09:45 - 12:15",
    "13:00 - 15:30",
    "15:45 - 18:15",
    "18:30 - 21:00",
  ];

  const dayNames = [
    "Thứ 2",
    "Thứ 3",
    "Thứ 4",
    "Thứ 5",
    "Thứ 6",
    "Thứ 7",
    "Chủ nhật",
  ];

  const filteredScheduleData = scheduleData.filter((item) => {
    // Có thể thêm filter theo search nếu muốn
    return (
      item.subject.toLowerCase().includes(search.toLowerCase()) ||
      item.teacher.toLowerCase().includes(search.toLowerCase()) ||
      item.class.toLowerCase().includes(search.toLowerCase())
    );
  });

  const getScheduleForTimeSlot = (dayIndex: number, timeSlotIndex: number) => {
    return filteredScheduleData.filter(
      (schedule) =>
        schedule.day === dayIndex && schedule.timeSlot === timeSlotIndex
    );
  };

  const handleSubmit = (values: any) => {
    const subjectLabel = subjects.find(
      (s) => s.value === values.subject
    )?.label;
    const teacherLabel = teachers.find(
      (t) => t.value === values.teacher
    )?.label;
    const classLabel = classes.find((c) => c.value === values.class)?.label;
    const roomLabel = rooms.find((r) => r.value === values.room)?.label;

    if (editing) {
      setClasses(
        classes.map((item) =>
          item._id === editing._id
            ? {
                ...item,
                subjectId: values.subject,
                teacherId: values.teacher,
                name: values.class,
                room: values.room,
                shift: values.shift,
                startDate: values.startDate.format("YYYY-MM-DD"),
                totalSessions: values.totalSessions,
              }
            : item
        )
      );
      message.success("Cập nhật lớp học thành công!");
    } else {
      const newClass = {
        _id: Date.now().toString(),
        subjectId: values.subject,
        teacherId: values.teacher,
        name: values.class,
        room: values.room,
        shift: values.shift,
        startDate: values.startDate.format("YYYY-MM-DD"),
        totalSessions: values.totalSessions,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setClasses([...classes, newClass]);
      message.success("Thêm mới lớp học thành công!");
    }
    setModalVisible(false);
    form.resetFields();
  };

  const navigateWeek = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + (direction === "next" ? 7 : -7));
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const getScheduleTypeColor = (type: string) => {
    switch (type) {
      case "theory":
        return "bg-blue-100 border-blue-300 text-blue-800";
      case "practice":
        return "bg-green-100 border-green-300 text-green-800";
      case "exam":
        return "bg-red-100 border-red-300 text-red-800";
      default:
        return "bg-gray-100 border-gray-300 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        {/* Page Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Lịch học</h2>
          <p className="text-gray-600">
            Quản lý và xem lịch học theo tuần hoặc tháng
          </p>
        </div>

        {/* Toolbar */}
        <Card className="mb-6">
          <div className="flex flex-col space-y-4">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 flex-1">
                <div className="relative flex-1 max-w-md">
                  <Input
                    placeholder="Tìm kiếm theo môn học, giáo viên, lớp..."
                    prefix={<SearchOutlined className="text-gray-400" />}
                    value={search}
                    onChange={handleSearch}
                    className="cursor-pointer"
                    size="large"
                  />
                </div>
                <Select
                  placeholder="Lọc theo khoa"
                  allowClear
                  value={timeFilter}
                  onChange={setTimeFilter}
                  className="w-full sm:w-48 cursor-pointer"
                  size="large"
                  suffixIcon={<FilterOutlined />}
                >
                  {faculties.map((faculty) => (
                    <Option key={faculty.value} value={faculty.value}>
                      {faculty.label}
                    </Option>
                  ))}
                </Select>
                <Select
                  placeholder="Lọc theo lớp"
                  allowClear
                  value={timeFilter}
                  onChange={setTimeFilter}
                  className="w-full sm:w-48 cursor-pointer"
                  size="large"
                >
                  {classes.map((cls) => (
                    <Option key={cls.value} value={cls.value}>
                      {cls.label}
                    </Option>
                  ))}
                </Select>
                <Select
                  placeholder="Lọc theo giáo viên"
                  allowClear
                  value={timeFilter}
                  onChange={setTimeFilter}
                  className="w-full sm:w-48 cursor-pointer"
                  size="large"
                >
                  {teachers.map((teacher) => (
                    <Option key={teacher.value} value={teacher.value}>
                      {teacher.label}
                    </Option>
                  ))}
                </Select>
              </div>
            </div>
          </div>
        </Card>

        {/* Calendar View */}
        <Card>
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <div className="flex items-center space-x-4">
                <Button
                  icon={<LeftOutlined />}
                  onClick={() => navigateWeek("prev")}
                  className="cursor-pointer !rounded-button"
                />
                <Button
                  onClick={goToToday}
                  className="cursor-pointer whitespace-nowrap !rounded-button"
                >
                  Hôm nay
                </Button>
                <Button
                  icon={<RightOutlined />}
                  onClick={() => navigateWeek("next")}
                  className="cursor-pointer !rounded-button"
                />
                <div className="text-lg font-semibold text-gray-800">
                  {weekDays[0].toLocaleDateString("vi-VN", {
                    day: "2-digit",
                    month: "2-digit",
                  })}{" "}
                  -{" "}
                  {weekDays[6].toLocaleDateString("vi-VN", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                </div>
              </div>
              <Tabs
                activeKey={viewMode}
                onChange={setViewMode}
                className="cursor-pointer"
              >
                <TabPane tab="Tuần" key="week" />
                <TabPane tab="Tháng" key="month" />
              </Tabs>
            </div>
          </div>

          {/* Week View */}
          {viewMode === "week" && (
            <div className="overflow-x-auto">
              <div className="min-w-full">
                <div className="grid grid-cols-8 gap-px bg-gray-200">
                  {/* Header */}
                  <div className="bg-gray-50 p-4 font-semibold text-center">
                    <ClockCircleOutlined className="mr-2" />
                    Thời gian
                  </div>
                  {weekDays.map((day, index) => (
                    <div key={index} className="bg-gray-50 p-4 text-center">
                      <div className="font-semibold text-gray-800">
                        {dayNames[index]}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        {day.toLocaleDateString("vi-VN", {
                          day: "2-digit",
                          month: "2-digit",
                        })}
                      </div>
                    </div>
                  ))}

                  {/* Time Slots */}
                  {timeSlots.map((timeSlot, timeIndex) => (
                    <React.Fragment key={timeIndex}>
                      <div className="bg-white p-4 text-center font-medium text-gray-700 border-r border-gray-200">
                        {timeSlot}
                      </div>
                      {weekDays.map((day, dayIndex) => (
                        <div
                          key={dayIndex}
                          className="bg-white p-2 min-h-24 border-r border-gray-200"
                        >
                          {getScheduleForTimeSlot(dayIndex, timeIndex).map(
                            (schedule) => (
                              <div
                                key={schedule.key}
                                className={`p-2 rounded-lg border-l-4 mb-2 cursor-pointer hover:shadow-md transition-shadow ${getScheduleTypeColor(
                                  schedule.type
                                )}`}
                                onClick={() => handleEdit(schedule)}
                              >
                                <div className="font-semibold text-xs mb-1">
                                  {schedule.subject}
                                </div>
                                <div className="text-xs opacity-75">
                                  {schedule.teacher}
                                </div>
                                <div className="text-xs opacity-75">
                                  {schedule.room}
                                </div>
                                <div className="text-xs opacity-75">
                                  {schedule.class}
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      ))}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Month View */}
          {viewMode === "month" && (
            <div className="text-center text-gray-500 py-20">
              <CalendarOutlined className="text-4xl mb-4" />
              <p>Chế độ xem tháng đang được phát triển</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default ClassOfStudentPage;
