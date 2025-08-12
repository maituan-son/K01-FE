import React, { useEffect, useState } from "react";
import {
  Card,
  Button,
  Input,
  Select,
  Table,
  Statistic,
  Progress,
  Tabs,
  message,
  Breadcrumb,
  Radio,
  Tag,
} from "antd";
import {
  HomeOutlined,
  CheckCircleOutlined,
  BarChartOutlined,
  CheckOutlined,
  CloseOutlined,
  ExclamationCircleOutlined,
  ReloadOutlined,
  ExportOutlined,
  SearchOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
const { Option } = Select;
const { TabPane } = Tabs;

const classes = [
  { value: "cntt01-k15", label: "CNTT01-K15" },
  { value: "cntt02-k15", label: "CNTT02-K15" },
  { value: "ktoan01-k15", label: "KTOAN01-K15" },
  { value: "qtkd01-k15", label: "QTKD01-K15" },
  { value: "nna01-k15", label: "NNA01-K15" },
  { value: "xd01-k15", label: "XD01-K15" },
];
const subjects = [
  { value: "lap-trinh-web", label: "Lập trình Web" },
  { value: "co-so-du-lieu", label: "Cơ sở dữ liệu" },
  { value: "mang-may-tinh", label: "Mạng máy tính" },
  { value: "toan-cao-cap", label: "Toán cao cấp" },
  { value: "tieng-anh", label: "Tiếng Anh" },
];
const sessions = [
  {
    value: "session1",
    label: "Buổi 1 - 07:00-09:30",
    date: "2025-01-13",
    subject: "Lập trình Web",
  },
  {
    value: "session2",
    label: "Buổi 2 - 09:45-12:15",
    date: "2025-01-13",
    subject: "Cơ sở dữ liệu",
  },
  {
    value: "session3",
    label: "Buổi 3 - 13:00-15:30",
    date: "2025-01-14",
    subject: "Mạng máy tính",
  },
  {
    value: "session4",
    label: "Buổi 4 - 15:45-18:15",
    date: "2025-01-15",
    subject: "Toán cao cấp",
  },
  {
    value: "session5",
    label: "Buổi 5 - 18:30-21:00",
    date: "2025-01-16",
    subject: "Tiếng Anh",
  },
];

const initialStudentsData = [
  {
    key: "1",
    studentId: "SV001",
    fullName: "Nguyễn Văn An",
    class: "CNTT01-K15",
    status: "present",
    note: "",
    attendanceRate: 95,
  },
  {
    key: "2",
    studentId: "SV002",
    fullName: "Trần Thị Bình",
    class: "CNTT01-K15",
    status: "present",
    note: "",
    attendanceRate: 88,
  },
  {
    key: "3",
    studentId: "SV003",
    fullName: "Lê Văn Cường",
    class: "CNTT01-K15",
    status: "late",
    note: "Đến muộn 15 phút",
    attendanceRate: 92,
  },
  {
    key: "4",
    studentId: "SV004",
    fullName: "Phạm Thị Dung",
    class: "CNTT01-K15",
    status: "absent",
    note: "Xin phép nghỉ học",
    attendanceRate: 75,
  },
  {
    key: "5",
    studentId: "SV005",
    fullName: "Hoàng Văn Em",
    class: "CNTT01-K15",
    status: "present",
    note: "",
    attendanceRate: 98,
  },
  {
    key: "6",
    studentId: "SV006",
    fullName: "Vũ Thị Phương",
    class: "CNTT01-K15",
    status: "present",
    note: "",
    attendanceRate: 85,
  },
  {
    key: "7",
    studentId: "SV007",
    fullName: "Đỗ Văn Giang",
    class: "CNTT01-K15",
    status: "late",
    note: "Đến muộn 5 phút",
    attendanceRate: 90,
  },
  {
    key: "8",
    studentId: "SV008",
    fullName: "Ngô Thị Hoa",
    class: "CNTT01-K15",
    status: "present",
    note: "",
    attendanceRate: 93,
  },
];

const AttendanceManagementPage: React.FC = () => {
  const [searchText, setSearchText] = useState("");
  const [selectedClass, setSelectedClass] = useState("cntt01-k15");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedSession, setSelectedSession] = useState("");
  const [viewMode, setViewMode] = useState("attendance");
  const [studentsData, setStudentsData] = useState(initialStudentsData);

  const filteredStudentsData = studentsData.filter((student) => {
    const matchesSearch =
      student.fullName.toLowerCase().includes(searchText.toLowerCase()) ||
      student.studentId.toLowerCase().includes(searchText.toLowerCase());
    const matchesClass =
      !selectedClass ||
      student.class === classes.find((c) => c.value === selectedClass)?.label;
    return matchesSearch && matchesClass;
  });

  const handleAttendanceChange = (studentKey: string, status: string) => {
    setStudentsData(
      studentsData.map((student) =>
        student.key === studentKey ? { ...student, status } : student
      )
    );
  };

  const calculateAttendanceStats = () => {
    const total = filteredStudentsData.length;
    const present = filteredStudentsData.filter(
      (s) => s.status === "present"
    ).length;
    const absent = filteredStudentsData.filter(
      (s) => s.status === "absent"
    ).length;
    const late = filteredStudentsData.filter((s) => s.status === "late").length;
    const attendanceRate =
      total > 0 ? Math.round(((present + late) / total) * 100) : 0;
    return { total, present, absent, late, attendanceRate };
  };
  const stats = calculateAttendanceStats();

  const attendanceColumns = [
    {
      title: "STT",
      key: "index",
      width: 60,
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: "Mã SV",
      dataIndex: "studentId",
      key: "studentId",
      width: 100,
      render: (text: string) => (
        <span className="font-mono text-blue-600">{text}</span>
      ),
    },
    {
      title: "Họ và tên",
      dataIndex: "fullName",
      key: "fullName",
      render: (text: string) => <span className="font-medium">{text}</span>,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 200,
      render: (status: string, record: any) => (
        <Radio.Group
          value={status}
          onChange={(e) => handleAttendanceChange(record.key, e.target.value)}
          size="small"
        >
          <Radio.Button value="present" className="cursor-pointer">
            <CheckOutlined className="text-green-600 mr-1" />
            Có mặt
          </Radio.Button>
          <Radio.Button value="late" className="cursor-pointer">
            <ExclamationCircleOutlined className="text-orange-600 mr-1" />
            Muộn
          </Radio.Button>
          <Radio.Button value="absent" className="cursor-pointer">
            <CloseOutlined className="text-red-600 mr-1" />
            Vắng
          </Radio.Button>
        </Radio.Group>
      ),
    },
    {
      title: "Ghi chú",
      dataIndex: "note",
      key: "note",
      render: (text: string, record: any) => (
        <Input.TextArea
          value={text}
          onChange={(e) => {
            const newData = studentsData.map((student) =>
              student.key === record.key
                ? { ...student, note: e.target.value }
                : student
            );
            setStudentsData(newData);
          }}
          placeholder="Nhập ghi chú..."
          autoSize={{ minRows: 1, maxRows: 2 }}
          className="text-sm"
        />
      ),
    },
    {
      title: "Tỷ lệ điểm danh",
      dataIndex: "attendanceRate",
      key: "attendanceRate",
      width: 120,
      render: (rate: number) => (
        <div className="text-center">
          <Progress
            type="circle"
            size={40}
            percent={rate}
            format={() => `${rate}%`}
            strokeColor={
              rate >= 90 ? "#52c41a" : rate >= 70 ? "#faad14" : "#ff4d4f"
            }
          />
        </div>
      ),
    },
  ];

  const statisticsColumns = [
    {
      title: "STT",
      key: "index",
      width: 60,
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: "Mã SV",
      dataIndex: "studentId",
      key: "studentId",
      width: 100,
      render: (text: string) => (
        <span className="font-mono text-blue-600">{text}</span>
      ),
    },
    {
      title: "Họ và tên",
      dataIndex: "fullName",
      key: "fullName",
      render: (text: string) => <span className="font-medium">{text}</span>,
    },
    {
      title: "Tổng buổi học",
      key: "totalSessions",
      width: 120,
      render: () => <span className="text-center block">20</span>,
    },
    {
      title: "Có mặt",
      key: "presentCount",
      width: 100,
      render: (_, record: any) => {
        const presentCount = Math.floor((record.attendanceRate / 100) * 20);
        return (
          <span className="text-green-600 font-medium text-center block">
            {presentCount}
          </span>
        );
      },
    },
    {
      title: "Vắng mặt",
      key: "absentCount",
      width: 100,
      render: (_, record: any) => {
        const absentCount = 20 - Math.floor((record.attendanceRate / 100) * 20);
        return (
          <span className="text-red-600 font-medium text-center block">
            {absentCount}
          </span>
        );
      },
    },
    {
      title: "Tỷ lệ điểm danh",
      dataIndex: "attendanceRate",
      key: "attendanceRate",
      width: 150,
      render: (rate: number) => (
        <div className="flex items-center space-x-2">
          <Progress
            percent={rate}
            size="small"
            strokeColor={
              rate >= 90 ? "#52c41a" : rate >= 70 ? "#faad14" : "#ff4d4f"
            }
            className="flex-1"
          />
          <span className="text-sm font-medium">{rate}%</span>
        </div>
      ),
    },
    {
      title: "Xếp loại",
      key: "grade",
      width: 100,
      render: (_, record: any) => {
        const rate = record.attendanceRate;
        let grade = "";
        let color = "";
        if (rate >= 95) {
          grade = "Xuất sắc";
          color = "green";
        } else if (rate >= 85) {
          grade = "Tốt";
          color = "blue";
        } else if (rate >= 70) {
          grade = "Khá";
          color = "orange";
        } else {
          grade = "Yếu";
          color = "red";
        }
        return <Tag color={color}>{grade}</Tag>;
      },
    },
  ];

  const handleSaveAttendance = () => {
    message.success("Lưu điểm danh thành công!");
  };
  const handleExportReport = () => {
    message.success("Đang xuất báo cáo điểm danh...");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6 max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Quản lý điểm danh
          </h2>
          <p className="text-gray-600">
            Thực hiện điểm danh và theo dõi tỷ lệ tham gia của sinh viên
          </p>
        </div>
        {/* Filter Toolbar */}
        <Card className="mb-6">
          <div className="flex flex-col space-y-4">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 flex-1">
                <div className="relative flex-1 max-w-md">
                  <Input
                    placeholder="Tìm kiếm theo tên, mã sinh viên..."
                    prefix={<SearchOutlined className="text-gray-400" />}
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    className="cursor-pointer"
                    size="large"
                  />
                </div>
                <Select
                  placeholder="Chọn lớp học"
                  value={selectedClass}
                  onChange={setSelectedClass}
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
                  placeholder="Chọn môn học"
                  allowClear
                  value={selectedSubject}
                  onChange={setSelectedSubject}
                  className="w-full sm:w-48 cursor-pointer"
                  size="large"
                >
                  {subjects.map((subject) => (
                    <Option key={subject.value} value={subject.value}>
                      {subject.label}
                    </Option>
                  ))}
                </Select>
                <Select
                  placeholder="Chọn buổi học"
                  allowClear
                  value={selectedSession}
                  onChange={setSelectedSession}
                  className="w-full sm:w-64 cursor-pointer"
                  size="large"
                >
                  {sessions.map((session) => (
                    <Option key={session.value} value={session.value}>
                      <div>
                        <div className="font-medium">{session.label}</div>
                        <div className="text-xs text-gray-500">
                          {session.date} - {session.subject}
                        </div>
                      </div>
                    </Option>
                  ))}
                </Select>
              </div>
              <div className="flex space-x-2">
                <Button
                  icon={<ReloadOutlined />}
                  onClick={() => {
                    setSearchText("");
                    setSelectedSubject("");
                    setSelectedSession("");
                  }}
                  className="cursor-pointer whitespace-nowrap !rounded-button"
                >
                  Làm mới
                </Button>
                <Button
                  type="primary"
                  icon={<ExportOutlined />}
                  onClick={handleExportReport}
                  className="cursor-pointer whitespace-nowrap !rounded-button"
                >
                  Xuất báo cáo
                </Button>
              </div>
            </div>
          </div>
        </Card>
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <Card>
            <Statistic
              title="Tổng số sinh viên"
              value={stats.total}
              prefix={<UserAddOutlined className="text-blue-600" />}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
          <Card>
            <Statistic
              title="Có mặt"
              value={stats.present}
              prefix={<CheckOutlined className="text-green-600" />}
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
          <Card>
            <Statistic
              title="Vắng mặt"
              value={stats.absent}
              prefix={<CloseOutlined className="text-red-600" />}
              valueStyle={{ color: "#ff4d4f" }}
            />
          </Card>
          <Card>
            <Statistic
              title="Tỷ lệ điểm danh"
              value={stats.attendanceRate}
              suffix="%"
              prefix={<BarChartOutlined className="text-orange-600" />}
              valueStyle={{
                color: stats.attendanceRate >= 80 ? "#52c41a" : "#faad14",
              }}
            />
          </Card>
        </div>
        {/* Main Content Tabs */}
        <Card>
          <Tabs
            activeKey={viewMode}
            onChange={setViewMode}
            className="cursor-pointer"
          >
            <TabPane
              tab={
                <span>
                  <CheckCircleOutlined className="mr-2" />
                  Điểm danh
                </span>
              }
              key="attendance"
            >
              <div className="mb-4 flex justify-between items-center">
                <div className="text-lg font-semibold text-gray-800">
                  Danh sách sinh viên lớp{" "}
                  {classes.find((c) => c.value === selectedClass)?.label}
                </div>
                <Button
                  type="primary"
                  icon={<CheckOutlined />}
                  onClick={handleSaveAttendance}
                  size="large"
                  className="cursor-pointer whitespace-nowrap !rounded-button"
                >
                  Lưu điểm danh
                </Button>
              </div>
              <Table
                columns={attendanceColumns}
                dataSource={filteredStudentsData}
                pagination={{
                  total: filteredStudentsData.length,
                  pageSize: 10,
                  showSizeChanger: true,
                  showQuickJumper: true,
                  showTotal: (total, range) =>
                    `${range[0]}-${range[1]} của ${total} sinh viên`,
                }}
                scroll={{ x: 1000 }}
                className="border border-gray-200 rounded-lg"
              />
            </TabPane>
            <TabPane
              tab={
                <span>
                  <BarChartOutlined className="mr-2" />
                  Thống kê
                </span>
              }
              key="statistics"
            >
              <div className="mb-4">
                <div className="text-lg font-semibold text-gray-800 mb-4">
                  Thống kê điểm danh chi tiết
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                  <Card className="text-center">
                    <div className="text-2xl font-bold text-green-600 mb-2">
                      {stats.attendanceRate}%
                    </div>
                    <div className="text-gray-600">
                      Tỷ lệ điểm danh trung bình
                    </div>
                    <Progress
                      percent={stats.attendanceRate}
                      strokeColor="#52c41a"
                      className="mt-2"
                    />
                  </Card>
                  <Card className="text-center">
                    <div className="text-2xl font-bold text-blue-600 mb-2">
                      {
                        studentsData.filter((s) => s.attendanceRate >= 90)
                          .length
                      }
                    </div>
                    <div className="text-gray-600">
                      Sinh viên điểm danh tốt (≥90%)
                    </div>
                  </Card>
                  <Card className="text-center">
                    <div className="text-2xl font-bold text-red-600 mb-2">
                      {studentsData.filter((s) => s.attendanceRate < 70).length}
                    </div>
                    <div className="text-gray-600">
                      Sinh viên cần quan tâm (&lt;70%)
                    </div>
                  </Card>
                </div>
              </div>
              <Table
                columns={statisticsColumns}
                dataSource={filteredStudentsData}
                pagination={{
                  total: filteredStudentsData.length,
                  pageSize: 10,
                  showSizeChanger: true,
                  showQuickJumper: true,
                  showTotal: (total, range) =>
                    `${range[0]}-${range[1]} của ${total} sinh viên`,
                }}
                scroll={{ x: 1000 }}
                className="border border-gray-200 rounded-lg"
              />
            </TabPane>
          </Tabs>
        </Card>
      </div>
      <style jsx>{`
        .!rounded-button {
          border-radius: 8px !important;
        }
      `}</style>
    </div>
  );
};

export default AttendanceManagementPage;
