import React, { useEffect, useState } from "react";
import {
  Card,
  Button,
  Input,
  message,
  Tabs,
  Modal,
  Descriptions,
  Tag,
  Table,
} from "antd";
import {
  CalendarOutlined,
  SearchOutlined,
  LeftOutlined,
  RightOutlined,
  ClockCircleOutlined,
  BookOutlined,
  UserOutlined,
  HomeOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { getAllSessionsByStudentId } from "@/common/services/sessionService";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import "dayjs/locale/vi";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale("vi");

const { TabPane } = Tabs;

interface Session {
  _id: string;
  classId: {
    _id: string;
    subjectId: {
      _id: string;
      name: string;
    };
    name: string;
    teacherId: { username: string };
    shift: string; // "1"..."5"
    room: string;
  };
  sessionDate: string; // ISO dạng "2025-09-01T17:00:00.000Z"
  note: string;
  createdAt: string;
  updatedAt: string;
}

interface ScheduleItem {
  key: string;
  subject: string;
  teacher: string;
  room: string;
  class: string;
  type: string;
  day: number; // 0..6  (Thứ 2..Chủ nhật)
  timeSlot: number; // 0..4
  sessionDate: string; // "YYYY-MM-DD" (VN)
}

const ClassOfStudentPage: React.FC = () => {
  const [scheduleItems, setScheduleItems] = useState<ScheduleItem[]>([]);
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState("week");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<ScheduleItem | null>(
    null
  );

  // Lấy studentId
  const getStudentId = () => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const user = JSON.parse(userData);
        return user._id || user.id || "";
      } catch {
        return "";
      }
    }
    return localStorage.getItem("studentId") || "";
  };
  const studentId = getStudentId();

  // Fetch sessions
  const { data: sessionsData, isLoading } = useQuery({
    queryKey: ["sessions", studentId],
    queryFn: async () => {
      const res = await getAllSessionsByStudentId(studentId);
      // Tùy API của bạn, có thể là res.data.data || res
      return Array.isArray(res) ? res : res?.data?.data || [];
    },
    enabled: !!studentId,
  });

  // Convert session → scheduleItem (GIỮ NGÀY GỐC THEO VN, không bị +1)
  // 🟢 Convert session → scheduleItem
  const transformSessionsToSchedule = (sessions: Session[]): ScheduleItem[] => {
    return sessions.map((session) => {
      // Cắt chuỗi ngày để tránh lệch múi giờ
      const rawDate = session.sessionDate.split("T")[0]; // "2025-09-01"
      const sessionDate = new Date(rawDate + "T00:00:00"); // ép về local VN

      // Map thứ (0=CN → 6, còn lại -1)
      let dayOfWeek = sessionDate.getDay();
      dayOfWeek = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

      // Map shift → timeslot
      const shift = parseInt(session.classId.shift);
      const timeSlot = Math.max(0, Math.min(4, shift - 1));

      return {
        key: session._id,
        subject: session.classId.subjectId.name,
        teacher: `Giảng viên ${session.classId.teacherId.username}`,
        room: `Phòng ${session.classId.room}`,
        class: `Lớp ${session.classId.name}`,
        type: "theory",
        day: dayOfWeek,
        timeSlot,
        sessionDate: rawDate, // giữ nguyên YYYY-MM-DD
      };
    });
  };

  useEffect(() => {
    if (sessionsData) {
      setScheduleItems(transformSessionsToSchedule(sessionsData));
    }
  }, [sessionsData]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) =>
    setSearch(e.target.value);

  // Tính 7 ngày của tuần hiện tại (bắt đầu từ Thứ 2)
  const getWeekDays = (date: Date) => {
    const week: Date[] = [];
    const start = new Date(date);
    const d = start.getDay();
    const diff = start.getDate() - d + (d === 0 ? -6 : 1);
    start.setDate(diff); // về Thứ 2
    for (let i = 0; i < 7; i++) {
      const curr = new Date(start);
      curr.setDate(start.getDate() + i);
      week.push(curr);
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
  const dayNames = ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "CN"];

  // Lọc theo tuần + search (dùng dayjs cho chuẩn)
  const filteredScheduleData = scheduleItems.filter((item) => {
    const itemDate = dayjs(item.sessionDate, "YYYY-MM-DD");
    const weekStart = dayjs(weekDays[0]).startOf("day");
    const weekEnd = dayjs(weekDays[6]).endOf("day");

    const inCurrentWeek =
      !itemDate.isBefore(weekStart) && !itemDate.isAfter(weekEnd);

    const q = search.trim().toLowerCase();
    const matchesSearch =
      q === "" ||
      item.subject.toLowerCase().includes(q) ||
      item.teacher.toLowerCase().includes(q) ||
      item.class.toLowerCase().includes(q);

    return inCurrentWeek && matchesSearch;
  });

  const getScheduleForTimeSlot = (dayIndex: number, timeSlotIndex: number) =>
    filteredScheduleData.filter(
      (s) => s.day === dayIndex && s.timeSlot === timeSlotIndex
    );

  const navigateWeek = (direction: "prev" | "next") => {
    const next = new Date(currentDate);
    next.setDate(currentDate.getDate() + (direction === "next" ? 7 : -7));
    setCurrentDate(next);
  };
  const goToToday = () => setCurrentDate(new Date());

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

  const getShiftTime = (shift: string) => {
    const shiftTimes = {
      "1": "07:00 - 09:30",
      "2": "09:45 - 12:15",
      "3": "13:00 - 15:30",
      "4": "15:45 - 18:15",
      "5": "18:30 - 21:00",
    };
    return shiftTimes[shift as keyof typeof shiftTimes] || `Ca ${shift}`;
  };

  const handleScheduleClick = (schedule: ScheduleItem) => {
    setSelectedSchedule(schedule);
    setModalVisible(true);
  };

  const handleModalClose = () => {
    setModalVisible(false);
    setSelectedSchedule(null);
  };

  // Get sessions for current month
  const getMonthSessions = () => {
    const currentMonth = dayjs(currentDate);
    return filteredScheduleData
      .filter((item) => {
        const itemDate = dayjs(item.sessionDate, "YYYY-MM-DD");
        return (
          itemDate.month() === currentMonth.month() &&
          itemDate.year() === currentMonth.year()
        );
      })
      .sort((a, b) => {
        // Sort by date first, then by time slot
        const dateCompare =
          dayjs(a.sessionDate).valueOf() - dayjs(b.sessionDate).valueOf();
        if (dateCompare !== 0) return dateCompare;
        return a.timeSlot - b.timeSlot;
      });
  };

  const monthSessions = getMonthSessions();

  const monthTableColumns = [
    {
      title: "Ngày",
      dataIndex: "sessionDate",
      key: "sessionDate",
      width: 120,
      render: (date: string) => (
        <div className="text-center">
          <div className="font-semibold">{dayjs(date).format("DD/MM")}</div>
          <div className="text-xs text-gray-500">
            {dayjs(date).format("dddd")}
          </div>
        </div>
      ),
    },
    {
      title: "Thời gian",
      dataIndex: "timeSlot",
      key: "timeSlot",
      width: 120,
      render: (timeSlot: number) => (
        <Tag color="cyan" className="text-xs">
          Ca {timeSlot + 1}
          <br />
          {timeSlots[timeSlot]}
        </Tag>
      ),
    },
    {
      title: "Môn học",
      dataIndex: "subject",
      key: "subject",
      render: (subject: string) => (
        <Tag color="blue" className="font-medium">
          {subject}
        </Tag>
      ),
    },
    {
      title: "Lớp",
      dataIndex: "class",
      key: "class",
      render: (className: string) => <Tag color="green">{className}</Tag>,
    },
    {
      title: "Phòng",
      dataIndex: "room",
      key: "room",
      render: (room: string) => <Tag color="orange">{room}</Tag>,
    },
    {
      title: "Giảng viên",
      dataIndex: "teacher",
      key: "teacher",
      render: (teacher: string) => <span className="text-sm">{teacher}</span>,
    },
    {
      title: "Loại",
      dataIndex: "type",
      key: "type",
      width: 100,
      render: (type: string) => (
        <Tag
          color={
            type === "theory" ? "blue" : type === "practice" ? "green" : "red"
          }
        >
          {type === "theory"
            ? "Lý thuyết"
            : type === "practice"
            ? "Thực hành"
            : "Kiểm tra"}
        </Tag>
      ),
    },
    {
      title: "Hành động",
      key: "action",
      width: 100,
      render: (_: any, record: ScheduleItem) => (
        <Button
          type="link"
          size="small"
          onClick={() => handleScheduleClick(record)}
        >
          Chi tiết
        </Button>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Lịch học</h2>
          <p className="text-gray-600">Quản lý và xem lịch học theo tuần</p>
        </div>

        {/* Toolbar */}
        <Card className="mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="relative flex-1 max-w-md">
              <Input
                placeholder="Tìm kiếm theo môn học, giáo viên, lớp..."
                prefix={<SearchOutlined className="text-gray-400" />}
                value={search}
                onChange={handleSearch}
                size="large"
              />
            </div>
          </div>
        </Card>

        {/* Calendar */}
        <Card>
          {isLoading && (
            <div className="text-center py-8 text-gray-500">
              Đang tải dữ liệu...
            </div>
          )}

          {/* Toolbar lịch */}
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center space-x-4">
              <Button
                icon={<LeftOutlined />}
                onClick={() => navigateWeek("prev")}
              />
              <Button onClick={goToToday}>Hôm nay</Button>
              <Button
                icon={<RightOutlined />}
                onClick={() => navigateWeek("next")}
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
            <Tabs activeKey={viewMode} onChange={setViewMode}>
              <TabPane tab="Tuần" key="week" />
              <TabPane tab="Tháng" key="month" />
            </Tabs>
          </div>

          {/* Week View */}
          {viewMode === "week" && !isLoading && (
            <div className="overflow-x-auto">
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

                {/* Time slots */}
                {timeSlots.map((timeSlot, timeIndex) => (
                  <React.Fragment key={timeIndex}>
                    <div className="bg-white p-4 text-center font-medium text-gray-700 border-r border-gray-200">
                      {timeSlot}
                    </div>
                    {weekDays.map((_, dayIndex) => (
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
                              onClick={() => handleScheduleClick(schedule)}
                            >
                              <div className="font-semibold text-xs mb-1">
                                {schedule.subject}
                              </div>
                              <div className="text-xs opacity-75 mb-1">
                                {schedule.class}
                              </div>
                              <div className="text-xs opacity-75">
                                {schedule.room}
                              </div>
                              <div className="text-xs opacity-75">
                                {schedule.teacher}
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
          )}

          {/* Month View */}
          {viewMode === "month" && !isLoading && (
            <div>
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800">
                  Danh sách buổi học tháng{" "}
                  {dayjs(currentDate).format("MM/YYYY")}
                </h3>
                <div className="text-sm text-gray-600">
                  Tổng cộng: {monthSessions.length} buổi học
                </div>
              </div>

              <Table
                columns={monthTableColumns}
                dataSource={monthSessions}
                pagination={{
                  pageSize: 10,
                  showSizeChanger: true,
                  showQuickJumper: true,
                  showTotal: (total, range) =>
                    `${range[0]}-${range[1]} của ${total} buổi học`,
                }}
                size="middle"
                className="shadow-sm"
                locale={{
                  emptyText: (
                    <div className="py-8 text-center text-gray-500">
                      <CalendarOutlined className="text-4xl mb-4" />
                      <p>Không có buổi học nào trong tháng này</p>
                    </div>
                  ),
                }}
              />
            </div>
          )}
        </Card>

        {/* Modal Chi tiết lớp học */}
        <Modal
          title={
            <div className="flex items-center space-x-2">
              <InfoCircleOutlined className="text-blue-500" />
              <span>Chi tiết lớp học</span>
            </div>
          }
          open={modalVisible}
          onCancel={handleModalClose}
          footer={[
            <Button key="close" onClick={handleModalClose}>
              Đóng
            </Button>,
          ]}
          width={600}
        >
          {selectedSchedule && (
            <div className="space-y-4">
              <Descriptions
                column={1}
                bordered
                size="small"
                labelStyle={{ width: "30%", fontWeight: "bold" }}
              >
                <Descriptions.Item
                  label={
                    <span className="flex items-center space-x-2">
                      <BookOutlined className="text-blue-500" />
                      <span>Môn học</span>
                    </span>
                  }
                >
                  <Tag color="blue" className="text-sm">
                    {selectedSchedule.subject}
                  </Tag>
                </Descriptions.Item>

                <Descriptions.Item
                  label={
                    <span className="flex items-center space-x-2">
                      <UserOutlined className="text-green-500" />
                      <span>Lớp</span>
                    </span>
                  }
                >
                  <Tag color="green" className="text-sm">
                    {selectedSchedule.class}
                  </Tag>
                </Descriptions.Item>

                <Descriptions.Item
                  label={
                    <span className="flex items-center space-x-2">
                      <UserOutlined className="text-purple-500" />
                      <span>Giảng viên</span>
                    </span>
                  }
                >
                  <span className="text-sm">{selectedSchedule.teacher}</span>
                </Descriptions.Item>

                <Descriptions.Item
                  label={
                    <span className="flex items-center space-x-2">
                      <HomeOutlined className="text-orange-500" />
                      <span>Phòng học</span>
                    </span>
                  }
                >
                  <Tag color="orange" className="text-sm">
                    {selectedSchedule.room}
                  </Tag>
                </Descriptions.Item>

                <Descriptions.Item
                  label={
                    <span className="flex items-center space-x-2">
                      <CalendarOutlined className="text-red-500" />
                      <span>Ngày học</span>
                    </span>
                  }
                >
                  <span className="text-sm font-medium">
                    {dayjs(selectedSchedule.sessionDate).format(
                      "dddd, DD/MM/YYYY"
                    )}
                  </span>
                </Descriptions.Item>

                <Descriptions.Item
                  label={
                    <span className="flex items-center space-x-2">
                      <ClockCircleOutlined className="text-cyan-500" />
                      <span>Thời gian</span>
                    </span>
                  }
                >
                  <Tag color="cyan" className="text-sm">
                    Ca {selectedSchedule.timeSlot + 1} -{" "}
                    {timeSlots[selectedSchedule.timeSlot]}
                  </Tag>
                </Descriptions.Item>

                <Descriptions.Item
                  label={
                    <span className="flex items-center space-x-2">
                      <BookOutlined className="text-gray-500" />
                      <span>Loại học</span>
                    </span>
                  }
                >
                  <Tag
                    color={
                      selectedSchedule.type === "theory"
                        ? "blue"
                        : selectedSchedule.type === "practice"
                        ? "green"
                        : "red"
                    }
                    className="text-sm"
                  >
                    {selectedSchedule.type === "theory"
                      ? "Lý thuyết"
                      : selectedSchedule.type === "practice"
                      ? "Thực hành"
                      : "Kiểm tra"}
                  </Tag>
                </Descriptions.Item>
              </Descriptions>

              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-700 mb-2">
                  Thông tin bổ sung
                </h4>
                <p className="text-sm text-gray-600">
                  Vui lòng có mặt tại {selectedSchedule.room} trước giờ học 15
                  phút để chuẩn bị bài học. Nhớ mang theo sách vở và các dụng cụ
                  học tập cần thiết.
                </p>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default ClassOfStudentPage;
