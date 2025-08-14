// The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work.

import React, { useState } from "react";
import {
  Card,
  Tabs,
  Modal,
  Select,
  message,
  Button,
  Tag,
  Space,
  Tooltip,
  Statistic,
  Row,
  Col,
  Avatar,
  Progress,
  Table,
  Input,
} from "antd";
import {
  CalendarOutlined,
  TeamOutlined,
  CheckCircleOutlined,
  FileTextOutlined,
  StarOutlined,
  PlusOutlined,
  EyeOutlined,
  EditOutlined,
  UserOutlined,
  BookOutlined,
  HomeOutlined,
  ClockCircleOutlined,
  ArrowLeftOutlined,
  DeleteOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useParams, useNavigate } from "react-router-dom";
import { getClassDetail, updateClass } from "@/common/services/classSercive";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllUsers } from "@/common/services/userService";
import { getAllSessionsByClassId } from "@/common/services/sessionService";
import User from "@/common/types/User";

// Import components
import ClassDetailHeader from "@/components/admin/ClassDetailHeader";
import ClassBasicInfo from "@/components/admin/ClassBasicInfo";
import ClassStatistics from "@/components/admin/ClassStatistics";
import SessionTable from "@/components/admin/SessionTable";
import StudentTable from "@/components/admin/StudentTable";

const { TabPane } = Tabs;



interface Schedule {
  _id: string;
  sessionNumber: number;
  sessionDate: string;
  note: string;
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
  const navigate = useNavigate();

  // Lấy chi tiết lớp học từ API
  const { data: classDetail, isLoading } = useQuery({
    queryKey: ["class-detail", id],
    queryFn: () => getClassDetail(id!),
    enabled: !!id,
  });
  //lấy sang sách sinh viên
  const { data: students = [] } = useQuery({
    queryKey: ["students"],
    queryFn: () => getAllUsers({ role: "student", includeDeleted: false }),
  });

  // Lấy danh sách buổi học từ API
  const { data: sessions = [], isLoading: sessionsLoading } = useQuery({
    queryKey: ["sessions", id],
    queryFn: () => getAllSessionsByClassId(id!),
    enabled: !!id,
  });


  const [assignments] = useState<Assignment[]>([]);
  const [attendances] = useState<Attendance[]>([]);
  const [activeTab, setActiveTab] = useState("schedule");

  // State cho modal thêm sinh viên
  const [addStudentModalOpen, setAddStudentModalOpen] = useState(false);
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);

  const queryClient = useQueryClient();

  // Mutation updateClass bằng react-query
  const { mutate: mutateUpdateClass, isLoading: adding } = useMutation({
    mutationFn: (studentIds: string[]) =>
      updateClass(classDetail._id, { studentIds }),
    onSuccess: () => {
      message.success("Cập nhật danh sách sinh viên thành công!");
      setAddStudentModalOpen(false);
      setSelectedStudentIds([]);
      queryClient.invalidateQueries({
        queryKey: ["class-detail", id],
      });
    },
    onError: () => {
      message.error("Cập nhật danh sách sinh viên thất bại!");
    },
  });

  // Hàm thêm sinh viên
  const handleAddStudents = () => {
    if (!selectedStudentIds.length) return;
    // Lấy current student IDs từ objects
    const currentIds = (classDetail.studentIds || []).map((sid: { _id: string }) => sid._id);
    // Chỉ thêm những sinh viên chưa có trong lớp
    const newIds = Array.from(
      new Set([...currentIds, ...selectedStudentIds.map(String)])
    );
    mutateUpdateClass(newIds);
  };

  // Hàm xóa sinh viên khỏi lớp
  const handleRemoveStudent = (studentId: string) => {
    const currentIds = (classDetail.studentIds || []).map((sid: { _id: string }) => sid._id);
    const newIds = currentIds.filter((id: string) => id !== studentId);
    mutateUpdateClass(newIds);
  };

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

  // Hàm chuyển đổi ca học thành thời gian
  const getShiftTime = (shift: string) => {
    switch (shift) {
      case "1":
        return "7h-9h";
      case "2":
        return "9h-11h";
      case "3":
        return "11h-13h";
      case "4":
        return "13h-15h";
      case "5":
        return "15h-17h";
      case "6":
        return "17h-19h";
      default:
        return "Chưa có thời gian";
    }
  };

  const studentColumns = [
    {
      title: "Mã SV",
      dataIndex: "studentId",
      key: "studentId",
      width: 100,
    },
    {
      title: "Tên đăng nhập",
      dataIndex: "username",
      key: "username",
      width: 170,
    },
    {
      title: "Năm học",
      dataIndex: "schoolYear",
      key: "schoolYear",
      width: 100,
    },
    {
      title: "Họ và Tên",
      dataIndex: "fullname",
      key: "fullname",
      width: 250,
    },
    {
      title: "Email",
      key: "email",
      render: (record: User) => (
        <div className="flex items-center space-x-2">
          <Avatar size={40} icon={<UserOutlined />} />
          <div>
            <div className="text-sm text-gray-500">{record.email}</div>
          </div>
        </div>
      ),
    },
    {
      title: "Trạng thái",
      key: "status",
      width: 150,
      render: (record: User) => (
        <div>
          <Tag color={record.isBlocked ? "red" : "green"}>
            {record.isBlocked ? "Bị khóa" : "Hoạt động"}
          </Tag>
        </div>
      ),
    },
    {
      title: "Thao tác",
      key: "actions",
      width: 100,
      render: (record: User) => (
        <Space size="small">
          <Tooltip title="Xóa khỏi lớp">
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              size="small"
              className="!rounded-button cursor-pointer whitespace-nowrap"
              onClick={() => handleRemoveStudent(record._id)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const scheduleColumns = [
    {
      title: "Buổi",
      key: "sessionNumber",
      width: 60,
      render: (_: unknown, __: unknown, index: number) => (
        <div className="text-center font-medium text-blue-600">#{index + 1}</div>
      ),
    },
    {
      title: "Ngày học",
      dataIndex: "sessionDate",
      key: "sessionDate",
      width: 100,
      render: (date: string) => (
        <div className="text-gray-700">
          {date ? new Date(date).toLocaleDateString('vi-VN') : "Chưa có"}
        </div>
      ),
    },
    {
      title: "Thời gian",
      key: "time",
      width: 150,
      render: (record: Schedule) => (
        <div className="text-gray-700">
          <ClockCircleOutlined className="mr-1" />
          <div>
            <div className="font-medium">Ca {classDetail.shift}</div>
            <div className="text-xs text-gray-500">
              {getShiftTime(classDetail.shift)}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Ghi chú",
      dataIndex: "note",
      key: "note",
      render: (note: string) => (
        <div className="text-gray-700">
          {note || "Không có ghi chú"}
        </div>
      ),
    },
    {
      title: "Phòng học",
      key: "room",
      width: 80,
      render: () => (
        <span className="text-gray-700">
          <HomeOutlined className="mr-1" />
          {classDetail.room || "Chưa có"}
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
              {record.attendanceCount}/{classDetail.studentIds?.length || 0}
            </div>
            <div className="text-xs text-gray-500">
              {Math.round((record.attendanceCount / (classDetail.studentIds?.length || 1)) * 100)}%
            </div>
          </div>
        ) : (
          <span className="text-gray-500">-</span>
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
      <ClassDetailHeader
        onBack={() => navigate("/super-admin/classes")}
        onEdit={() => console.log("Edit class")}
        onDelete={() => console.log("Delete class")}
      />

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Basic Information */}
        <ClassBasicInfo
          classDetail={classDetail}
          getStatusColor={getStatusColor}
          getStatusText={getStatusText}
        />

        {/* Statistics */}
        <ClassStatistics classDetail={classDetail} />

        {/* Tabs Content */}
        <Card>
          <Tabs activeKey={activeTab} onChange={setActiveTab} size="large">
            <TabPane tab="Lịch học" key="schedule" icon={<CalendarOutlined />}>
              <SessionTable
                sessions={sessions}
                classDetail={classDetail}
                sessionsLoading={sessionsLoading}
                getStatusColor={getStatusColor}
                getStatusText={getStatusText}
                onCreateSession={() => console.log("Create session")}
              />
            </TabPane>

            <TabPane tab="Sinh viên" key="students" icon={<TeamOutlined />}>
              <StudentTable
                students={students}
                classDetail={classDetail}
                onAddStudent={() => setAddStudentModalOpen(true)}
                onRemoveStudent={handleRemoveStudent}
              />
              {/* Modal chọn sinh viên */}
              <Modal
                title="Thêm sinh viên vào lớp"
                open={addStudentModalOpen}
                onCancel={() => setAddStudentModalOpen(false)}
                onOk={handleAddStudents}
                confirmLoading={adding}
                okText="Thêm"
                cancelText="Hủy"
              >
                <Select
                  mode="multiple"
                  style={{ width: "100%" }}
                  placeholder="Nhập hoặc chọn mã sinh viên"
                  value={selectedStudentIds}
                  onChange={(ids) => setSelectedStudentIds(ids.map(String))}
                  options={students
                    .filter((s) => {
                      const currentIds = (classDetail.studentIds || []).map((sid: { _id: string }) => sid._id);
                      return !currentIds.includes(s._id);
                    })
                    .map((s) => ({
                      label: `${s.fullname} (${s.studentId})`,
                      value: String(s._id),
                    }))}
                  notFoundContent="Không có sinh viên nào để thêm"
                />
              </Modal>
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
                  {/* <Col span={8}>
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
                  </Col> */}
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
