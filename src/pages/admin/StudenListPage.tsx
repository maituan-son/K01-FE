// The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work.

import React, { useState } from "react";
import {
  Card,
  Row,
  Col,
  Avatar,
  Tag,
  Progress,
  Tabs,
  Table,
  Button,
  Input,
  DatePicker,
  Select,
  Space,
  Tooltip,
  Modal,
  Form,
  Rate,
  Statistic,
} from "antd";
import {
  ArrowLeftOutlined,
  EditOutlined,
  DeleteOutlined,
  UserOutlined,
  BookOutlined,
  HomeOutlined,
  ClockCircleOutlined,
  TeamOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  FileTextOutlined,
  StarOutlined,
  SearchOutlined,
  PlusOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { useParams } from "react-router-dom";
import { getClassDetail } from "@/common/services/classSercive";
import { useQuery } from "@tanstack/react-query";

const { TabPane } = Tabs;
const { TextArea } = Input;
const { Option } = Select;

interface ClassDetailData {
  id: string;
  name: string;
  code: string;
  subject: {
    id: string;
    name: string;
  };
  major: {
    id: string;
    name: string;
  };
  teacher: {
    id: string;
    name: string;
    avatar?: string;
    email: string;
    phone: string;
  };
  shift: string;
  room: string;
  startDate: string;
  endDate: string;
  totalSessions: number;
  completedSessions: number;
  currentStudents: number;
  maxStudents: number;
  status: "active" | "upcoming" | "completed";
  description: string;
  attendanceRate: number;
  assignmentSubmissionRate: number;
}

interface Student {
  id: string;
  studentCode: string;
  name: string;
  avatar?: string;
  email: string;
  phone: string;
  major: string;
  enrollDate: string;
  attendanceRate: number;
  averageScore: number;
}

interface Schedule {
  id: string;
  sessionNumber: number;
  date: string;
  startTime: string;
  endTime: string;
  topic: string;
  room: string;
  status: "completed" | "upcoming" | "cancelled";
  attendanceCount?: number;
}

interface Assignment {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  totalSubmissions: number;
  status: "active" | "overdue" | "completed";
  type: "homework" | "project" | "quiz";
}

interface Attendance {
  id: string;
  sessionNumber: number;
  date: string;
  topic: string;
  totalStudents: number;
  presentStudents: number;
  absentStudents: number;
  lateStudents: number;
}

const StudenList: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  // Lấy chi tiết lớp học từ API
  const { data: classDetail, isLoading } = useQuery({
    queryKey: ["class-detail", id],
    queryFn: () => getClassDetail(id!),
    enabled: !!id,
  });

  const [students, setStudents] = useState<Student[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [activeTab, setActiveTab] = useState("schedule");
  const [loading, setLoading] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "green";
      case "upcoming":
        return "blue";
      case "completed":
        return "gray";
      case "cancelled":
        return "red";
      case "overdue":
        return "red";
      default:
        return "default";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "Đang hoạt động";
      case "upcoming":
        return "Sắp diễn ra";
      case "completed":
        return "Đã hoàn thành";
      case "cancelled":
        return "Đã hủy";
      case "overdue":
        return "Quá hạn";
      default:
        return status;
    }
  };

  const getAssignmentTypeText = (type: string) => {
    switch (type) {
      case "homework":
        return "Bài tập";
      case "project":
        return "Dự án";
      case "quiz":
        return "Kiểm tra";
      default:
        return type;
    }
  };

  const getAssignmentTypeColor = (type: string) => {
    switch (type) {
      case "homework":
        return "blue";
      case "project":
        return "purple";
      case "quiz":
        return "orange";
      default:
        return "default";
    }
  };

  const studentColumns = [
    {
      title: "Mã SV",
      dataIndex: "studentCode",
      key: "studentCode",
      width: 100,
    },
    {
      title: "Họ và tên",
      key: "name",
      render: (record: Student) => (
        <div className="flex items-center space-x-3">
          <Avatar size={40} src={record.avatar} icon={<UserOutlined />} />
          <div>
            <div className="font-medium text-gray-900">{record.name}</div>
            <div className="text-sm text-gray-500">{record.email}</div>
          </div>
        </div>
      ),
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
      width: 120,
    },
    {
      title: "Ngày nhập học",
      dataIndex: "enrollDate",
      key: "enrollDate",
      width: 120,
    },
    {
      title: "Tỷ lệ điểm danh",
      key: "attendanceRate",
      width: 150,
      render: (record: Student) => (
        <div>
          <div className="text-sm font-medium mb-1">
            {record.attendanceRate}%
          </div>
          <Progress
            percent={record.attendanceRate}
            size="small"
            strokeColor={record.attendanceRate >= 80 ? "#52c41a" : "#faad14"}
          />
        </div>
      ),
    },
    {
      title: "Điểm TB",
      key: "averageScore",
      width: 100,
      render: (record: Student) => (
        <div className="text-center">
          <div className="text-lg font-bold text-blue-600">
            {record.averageScore}
          </div>
          <Rate
            disabled
            defaultValue={Math.round(record.averageScore / 2)}
            className="text-xs"
          />
        </div>
      ),
    },
    {
      title: "Thao tác",
      key: "actions",
      width: 100,
      render: (record: Student) => (
        <Space size="small">
          <Tooltip title="Xem chi tiết">
            <Button
              type="text"
              icon={<EyeOutlined />}
              size="small"
              className="!rounded-button cursor-pointer whitespace-nowrap"
            />
          </Tooltip>
          <Tooltip title="Chỉnh sửa">
            <Button
              type="text"
              icon={<EditOutlined />}
              size="small"
              className="!rounded-button cursor-pointer whitespace-nowrap"
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const scheduleColumns = [
    {
      title: "Buổi",
      dataIndex: "sessionNumber",
      key: "sessionNumber",
      width: 60,
      render: (session: number) => (
        <div className="text-center font-medium text-blue-600">#{session}</div>
      ),
    },
    {
      title: "Ngày",
      dataIndex: "date",
      key: "date",
      width: 100,
    },
    {
      title: "Thời gian",
      key: "time",
      width: 120,
      render: (record: Schedule) => (
        <div className="text-gray-700">
          <ClockCircleOutlined className="mr-1" />
          {record.startTime} - {record.endTime}
        </div>
      ),
    },
    {
      title: "Chủ đề",
      dataIndex: "topic",
      key: "topic",
    },
    {
      title: "Phòng học",
      dataIndex: "room",
      key: "room",
      width: 80,
      render: (room: string) => (
        <span className="text-gray-700">
          <HomeOutlined className="mr-1" />
          {room}
        </span>
      ),
    },
    {
      title: "Điểm danh",
      key: "attendance",
      width: 100,
      render: (record: Schedule) =>
        record.attendanceCount !== undefined ? (
          <div className="text-center">
            <div className="text-sm font-medium">
              {record.attendanceCount}/42
            </div>
            <div className="text-xs text-gray-500">
              {Math.round((record.attendanceCount / 42) * 100)}%
            </div>
          </div>
        ) : (
          <span className="text-gray-400">-</span>
        ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status: string) => (
        <Tag color={getStatusColor(status)} className="!rounded-button">
          {getStatusText(status)}
        </Tag>
      ),
    },
  ];

  const assignmentColumns = [
    {
      title: "Tiêu đề",
      dataIndex: "title",
      key: "title",
      render: (title: string, record: Assignment) => (
        <div>
          <div className="font-medium text-gray-900 cursor-pointer hover:text-blue-600">
            {title}
          </div>
          <div className="text-sm text-gray-500 mt-1">{record.description}</div>
        </div>
      ),
    },
    {
      title: "Loại",
      dataIndex: "type",
      key: "type",
      width: 100,
      render: (type: string) => (
        <Tag color={getAssignmentTypeColor(type)} className="!rounded-button">
          {getAssignmentTypeText(type)}
        </Tag>
      ),
    },
    {
      title: "Hạn nộp",
      dataIndex: "dueDate",
      key: "dueDate",
      width: 120,
      render: (date: string) => (
        <div className="text-gray-700">
          <CalendarOutlined className="mr-1" />
          {date}
        </div>
      ),
    },
    {
      title: "Đã nộp",
      key: "submissions",
      width: 100,
      render: (record: Assignment) => (
        <div className="text-center">
          <div className="text-sm font-medium">
            {record.totalSubmissions}/42
          </div>
          <div className="text-xs text-gray-500">
            {Math.round((record.totalSubmissions / 42) * 100)}%
          </div>
        </div>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status: string) => (
        <Tag color={getStatusColor(status)} className="!rounded-button">
          {getStatusText(status)}
        </Tag>
      ),
    },
    {
      title: "Thao tác",
      key: "actions",
      width: 100,
      render: (record: Assignment) => (
        <Space size="small">
          <Tooltip title="Xem chi tiết">
            <Button
              type="text"
              icon={<EyeOutlined />}
              size="small"
              className="!rounded-button cursor-pointer whitespace-nowrap"
            />
          </Tooltip>
          <Tooltip title="Chỉnh sửa">
            <Button
              type="text"
              icon={<EditOutlined />}
              size="small"
              className="!rounded-button cursor-pointer whitespace-nowrap"
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const attendanceColumns = [
    {
      title: "Buổi",
      dataIndex: "sessionNumber",
      key: "sessionNumber",
      width: 60,
      render: (session: number) => (
        <div className="text-center font-medium text-blue-600">#{session}</div>
      ),
    },
    {
      title: "Ngày",
      dataIndex: "date",
      key: "date",
      width: 100,
    },
    {
      title: "Chủ đề",
      dataIndex: "topic",
      key: "topic",
    },
    {
      title: "Có mặt",
      dataIndex: "presentStudents",
      key: "presentStudents",
      width: 80,
      render: (count: number) => (
        <div className="text-center text-green-600 font-medium">{count}</div>
      ),
    },
    {
      title: "Vắng mặt",
      dataIndex: "absentStudents",
      key: "absentStudents",
      width: 80,
      render: (count: number) => (
        <div className="text-center text-red-600 font-medium">{count}</div>
      ),
    },
    {
      title: "Đi muộn",
      dataIndex: "lateStudents",
      key: "lateStudents",
      width: 80,
      render: (count: number) => (
        <div className="text-center text-orange-600 font-medium">{count}</div>
      ),
    },
    {
      title: "Tỷ lệ",
      key: "rate",
      width: 150,
      render: (record: Attendance) => (
        <div>
          <div className="text-sm font-medium mb-1">
            {Math.round((record.presentStudents / record.totalStudents) * 100)}%
          </div>
          <Progress
            percent={Math.round(
              (record.presentStudents / record.totalStudents) * 100
            )}
            size="small"
            strokeColor="#52c41a"
          />
        </div>
      ),
    },
    {
      title: "Thao tác",
      key: "actions",
      width: 100,
      render: (record: Attendance) => (
        <Space size="small">
          <Tooltip title="Xem chi tiết">
            <Button
              type="text"
              icon={<EyeOutlined />}
              size="small"
              className="!rounded-button cursor-pointer whitespace-nowrap"
            />
          </Tooltip>
          <Tooltip title="Chỉnh sửa">
            <Button
              type="text"
              icon={<EditOutlined />}
              size="small"
              className="!rounded-button cursor-pointer whitespace-nowrap"
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  if (isLoading || !classDetail) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <a href="/super-admin/classes" data-readdy="true">
                <Button
                  type="text"
                  icon={<ArrowLeftOutlined />}
                  className="!rounded-button cursor-pointer whitespace-nowrap"
                >
                  Quay lại
                </Button>
              </a>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Chi tiết lớp học
                </h1>
                <p className="text-gray-600 mt-1">
                  Thông tin chi tiết và quản lý lớp học
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                icon={<EditOutlined />}
                className="!rounded-button cursor-pointer whitespace-nowrap"
              >
                Chỉnh sửa
              </Button>
              <Button
                danger
                icon={<DeleteOutlined />}
                className="!rounded-button cursor-pointer whitespace-nowrap"
              >
                Xóa lớp
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Basic Information */}
        <Card className="mb-6">
          <Row gutter={24}>
            <Col span={16}>
              <div className="space-y-4">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    {classDetail.name}
                  </h2>
                  <div className="flex items-center space-x-4 text-gray-600">
                    <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                      {classDetail.code}
                    </span>
                    <Tag
                      color={getStatusColor(classDetail.status)}
                      className="!rounded-button"
                    >
                      {getStatusText(classDetail.status)}
                    </Tag>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Môn học</div>
                    <div className="flex items-center text-blue-600">
                      <BookOutlined className="mr-2" />
                      <span className="font-medium">
                        {classDetail.name || ""}
                      </span>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Ngành học</div>
                    <div className="font-medium text-gray-700">
                      {classDetail.name || ""}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Ca học</div>
                    <div className="flex items-center text-gray-700">
                      <ClockCircleOutlined className="mr-2" />
                      <span className="font-medium">{classDetail.shift}</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Phòng học</div>
                    <div className="flex items-center text-gray-700">
                      <HomeOutlined className="mr-2" />
                      <span className="font-medium">{classDetail.room}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="text-sm text-gray-500 mb-2">Mô tả</div>
                  <p className="text-gray-700 leading-relaxed">
                    {classDetail.description}
                  </p>
                </div>
              </div>
            </Col>
            <Col span={8}>
              <div className="space-y-6">
                <div className="text-center">
                  <div className="text-sm text-gray-500 mb-2">Giảng viên</div>
                  <div className="flex flex-col items-center space-y-3">
                    <Avatar
                      size={80}
                      src={classDetail.teacher?.avatar}
                      icon={<UserOutlined />}
                    />
                    <div className="font-bold text-lg text-gray-900">
                      {classDetail.teacher?.name || ""}
                    </div>
                    <div className="text-sm text-gray-500">
                      {classDetail.teacher?.email || ""}
                    </div>
                    <div className="text-sm text-gray-500">
                      {classDetail.teacher?.phone || ""}
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="text-sm text-gray-500">Thời gian học</div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Bắt đầu:</span>
                      <span className="font-medium">
                        {classDetail.startDate}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm mt-1">
                      <span className="text-gray-600">Kết thúc:</span>
                      <span className="font-medium">{classDetail.endDate}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Card>

        {/* Statistics */}
        <Row gutter={16} className="mb-6">
          <Col span={6}>
            <Card className="text-center">
              <Statistic
                title="Sĩ số hiện tại"
                value={classDetail.studentIds?.length || 0}
                suffix={`/ ${classDetail.maxStudents || 0}`}
                valueStyle={{ color: "#1890ff" }}
                prefix={<TeamOutlined />}
              />
              <Progress
                percent={
                  classDetail.maxStudents
                    ? Math.round(
                        ((classDetail.studentIds?.length || 0) /
                          classDetail.maxStudents) *
                          100
                      )
                    : 0
                }
                size="small"
                strokeColor="#1890ff"
                className="mt-2"
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card className="text-center">
              <Statistic
                title="Tiến độ học tập"
                value={classDetail.completedSessions}
                suffix={`/ ${classDetail.totalSessions}`}
                valueStyle={{ color: "#52c41a" }}
                prefix={<BookOutlined />}
              />
              <Progress
                percent={Math.round(
                  (classDetail.completedSessions / classDetail.totalSessions) *
                    100
                )}
                size="small"
                strokeColor="#52c41a"
                className="mt-2"
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card className="text-center">
              <Statistic
                title="Tỷ lệ điểm danh"
                value={classDetail.attendanceRate}
                suffix="%"
                valueStyle={{ color: "#faad14" }}
                prefix={<CheckCircleOutlined />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card className="text-center">
              <Statistic
                title="Tỷ lệ nộp bài"
                value={classDetail.assignmentSubmissionRate}
                suffix="%"
                valueStyle={{ color: "#722ed1" }}
                prefix={<FileTextOutlined />}
              />
            </Card>
          </Col>
        </Row>

        {/* Tabs Content */}
        <Card>
          <Tabs activeKey={activeTab} onChange={setActiveTab} size="large">
            <TabPane tab="Lịch học" key="schedule" icon={<CalendarOutlined />}>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Lịch học chi tiết
                  </h3>
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    className="!rounded-button cursor-pointer whitespace-nowrap"
                  >
                    Thêm buổi học
                  </Button>
                </div>
                <Table
                  columns={scheduleColumns}
                  dataSource={schedules}
                  rowKey="id"
                  pagination={false}
                  scroll={{ x: 800 }}
                />
              </div>
            </TabPane>

            <TabPane tab="Sinh viên" key="students" icon={<TeamOutlined />}>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Danh sách sinh viên ({students.length})
                  </h3>
                  <div className="flex items-center space-x-3">
                    <Input
                      placeholder="Tìm kiếm sinh viên..."
                      prefix={<SearchOutlined />}
                      className="w-64 !rounded-button"
                    />
                    <Button
                      type="primary"
                      icon={<PlusOutlined />}
                      className="!rounded-button cursor-pointer whitespace-nowrap"
                    >
                      Thêm sinh viên
                    </Button>
                  </div>
                </div>
                <Table
                  columns={studentColumns}
                  dataSource={students}
                  rowKey="id"
                  pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total, range) =>
                      `${range[0]}-${range[1]} của ${total} sinh viên`,
                  }}
                  scroll={{ x: 900 }}
                />
              </div>
            </TabPane>

            <TabPane
              tab="Điểm danh"
              key="attendance"
              icon={<CheckCircleOutlined />}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Quản lý điểm danh
                  </h3>
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    className="!rounded-button cursor-pointer whitespace-nowrap"
                  >
                    Điểm danh mới
                  </Button>
                </div>
                <Table
                  columns={attendanceColumns}
                  dataSource={attendances}
                  rowKey="id"
                  pagination={false}
                  scroll={{ x: 800 }}
                />
              </div>
            </TabPane>

            <TabPane
              tab="Bài tập"
              key="assignments"
              icon={<FileTextOutlined />}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Quản lý bài tập ({assignments.length})
                  </h3>
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    className="!rounded-button cursor-pointer whitespace-nowrap"
                  >
                    Tạo bài tập
                  </Button>
                </div>
                <Table
                  columns={assignmentColumns}
                  dataSource={assignments}
                  rowKey="id"
                  pagination={false}
                  scroll={{ x: 900 }}
                />
              </div>
            </TabPane>

            <TabPane tab="Đánh giá" key="evaluation" icon={<StarOutlined />}>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Thống kê đánh giá
                  </h3>
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    className="!rounded-button cursor-pointer whitespace-nowrap"
                  >
                    Tạo đánh giá
                  </Button>
                </div>

                <Row gutter={16}>
                  <Col span={8}>
                    <Card className="text-center">
                      <Statistic
                        title="Điểm trung bình lớp"
                        value={8.2}
                        precision={1}
                        valueStyle={{ color: "#1890ff", fontSize: "2rem" }}
                        suffix="/ 10"
                      />
                      <Rate disabled defaultValue={4} className="mt-2" />
                    </Card>
                  </Col>
                  <Col span={8}>
                    <Card className="text-center">
                      <Statistic
                        title="Số sinh viên đạt"
                        value={38}
                        suffix="/ 42"
                        valueStyle={{ color: "#52c41a", fontSize: "2rem" }}
                      />
                      <div className="text-sm text-gray-500 mt-2">
                        Tỷ lệ: 90.5%
                      </div>
                    </Card>
                  </Col>
                  <Col span={8}>
                    <Card className="text-center">
                      <Statistic
                        title="Số bài đánh giá"
                        value={5}
                        valueStyle={{ color: "#722ed1", fontSize: "2rem" }}
                      />
                      <div className="text-sm text-gray-500 mt-2">
                        Đã hoàn thành
                      </div>
                    </Card>
                  </Col>
                </Row>

                <Card title="Phân bố điểm số" className="mt-6">
                  <div className="grid grid-cols-5 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-red-500">2</div>
                      <div className="text-sm text-gray-500">Dưới 5.0</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-orange-500">
                        8
                      </div>
                      <div className="text-sm text-gray-500">5.0 - 6.5</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-yellow-500">
                        15
                      </div>
                      <div className="text-sm text-gray-500">6.5 - 8.0</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-500">
                        12
                      </div>
                      <div className="text-sm text-gray-500">8.0 - 9.0</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-blue-500">5</div>
                      <div className="text-sm text-gray-500">Trên 9.0</div>
                    </div>
                  </div>
                </Card>
              </div>
            </TabPane>
          </Tabs>
        </Card>
      </div>

      <style jsx global>{`
        .!rounded-button {
          border-radius: 8px !important;
        }
        .ant-table-thead > tr > th {
          background-color: #fafafa;
          font-weight: 600;
        }
        .ant-table-tbody > tr:hover > td {
          background-color: #f5f5f5;
        }
        .ant-progress-inner {
          border-radius: 4px;
        }
        .ant-tag {
          border-radius: 6px;
        }
        .ant-btn {
          border-radius: 8px;
        }
        .ant-input {
          border-radius: 8px;
        }
        .ant-select-selector {
          border-radius: 8px !important;
        }
        .ant-picker {
          border-radius: 8px;
        }
        .ant-input-number {
          border-radius: 8px;
        }
        .ant-tabs-tab {
          font-weight: 500;
        }
        .ant-tabs-tab-active {
          font-weight: 600;
        }
      `}</style>
    </div>
  );
};

export default StudenList;
