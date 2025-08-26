// The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work.

import React, { useState } from "react";
import {
  SearchOutlined,
  FilterOutlined,
  DownloadOutlined,
  ArrowLeftOutlined,
  UserOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import {
  Input,
  Select,
  Button,
  Table,
  Tag,
  Card,
  Statistic,
  Row,
  Col,
  Space,
  Typography,
  Avatar,
} from "antd";

const { Title, Text } = Typography;
const { Option } = Select;

interface Student {
  id: string;
  studentCode: string;
  fullName: string;
  status: "present" | "absent" | "late";
  checkInTime?: string;
  note?: string;
}

const AttendanceStudentPage: React.FC = () => {
  const [searchText, setSearchText] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const studentsData: Student[] = [
    {
      id: "1",
      studentCode: "SV001",
      fullName: "Nguyễn Văn An",
      status: "present",
      checkInTime: "08:15",
      note: "",
    },
    {
      id: "2",
      studentCode: "SV002",
      fullName: "Trần Thị Bình",
      status: "present",
      checkInTime: "08:12",
      note: "",
    },
    {
      id: "3",
      studentCode: "SV003",
      fullName: "Lê Hoàng Cường",
      status: "late",
      checkInTime: "08:25",
      note: "Đi muộn do kẹt xe",
    },
    {
      id: "4",
      studentCode: "SV004",
      fullName: "Phạm Thị Dung",
      status: "absent",
      checkInTime: "",
      note: "Xin phép nghỉ học",
    },
    {
      id: "5",
      studentCode: "SV005",
      fullName: "Hoàng Văn Em",
      status: "present",
      checkInTime: "08:10",
      note: "",
    },
    {
      id: "6",
      studentCode: "SV006",
      fullName: "Võ Thị Phương",
      status: "present",
      checkInTime: "08:18",
      note: "",
    },
    {
      id: "7",
      studentCode: "SV007",
      fullName: "Đặng Minh Giang",
      status: "absent",
      checkInTime: "",
      note: "",
    },
    {
      id: "8",
      studentCode: "SV008",
      fullName: "Bùi Thị Hoa",
      status: "present",
      checkInTime: "08:14",
      note: "",
    },
  ];

  const presentCount = studentsData.filter(
    (s) => s.status === "present"
  ).length;
  const absentCount = studentsData.filter((s) => s.status === "absent").length;
  const lateCount = studentsData.filter((s) => s.status === "late").length;
  const totalStudents = studentsData.length;
  const attendanceRate = Math.round(
    ((presentCount + lateCount) / totalStudents) * 100
  );

  const getStatusTag = (status: string) => {
    switch (status) {
      case "present":
        return (
          <Tag color="green" icon={<CheckCircleOutlined />}>
            Có mặt
          </Tag>
        );
      case "absent":
        return (
          <Tag color="red" icon={<CloseCircleOutlined />}>
            Vắng mặt
          </Tag>
        );
      case "late":
        return (
          <Tag color="orange" icon={<ExclamationCircleOutlined />}>
            Đi muộn
          </Tag>
        );
      default:
        return <Tag>Chưa xác định</Tag>;
    }
  };

  const filteredData = studentsData.filter((student) => {
    const matchesSearch =
      student.fullName.toLowerCase().includes(searchText.toLowerCase()) ||
      student.studentCode.toLowerCase().includes(searchText.toLowerCase());
    const matchesFilter =
      filterStatus === "all" || student.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const columns = [
    {
      title: "STT",
      key: "index",
      width: 60,
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: "Mã SV",
      dataIndex: "studentCode",
      key: "studentCode",
      width: 100,
    },
    {
      title: "Họ và tên",
      dataIndex: "fullName",
      key: "fullName",
      render: (text: string) => (
        <Space>
          <Avatar size="small" icon={<UserOutlined />} />
          <Text strong>{text}</Text>
        </Space>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status: string) => getStatusTag(status),
    },
    {
      title: "Thời gian",
      dataIndex: "checkInTime",
      key: "checkInTime",
      width: 100,
      render: (time: string) => time || "--",
    },
    {
      title: "Ghi chú",
      dataIndex: "note",
      key: "note",
      render: (note: string) => note || "--",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                type="text"
                icon={<ArrowLeftOutlined />}
                className="!rounded-button cursor-pointer whitespace-nowrap"
              >
                Quay lại
              </Button>
              <div>
                <Title level={3} className="m-0">
                  Lập trình Web - IT3080
                </Title>
                <div className="flex items-center space-x-6 mt-2">
                  <Space>
                    <CalendarOutlined className="text-blue-500" />
                    <Text type="secondary">Thứ 2, 24/08/2025</Text>
                  </Space>
                  <Space>
                    <ClockCircleOutlined className="text-blue-500" />
                    <Text type="secondary">Tiết 1-2 (08:00 - 09:30)</Text>
                  </Space>
                  <Space>
                    <UserOutlined className="text-blue-500" />
                    <Text type="secondary">GV: Nguyễn Thị Minh</Text>
                  </Space>
                </div>
              </div>
            </div>
            <div className="flex space-x-3">
              <Button
                icon={<DownloadOutlined />}
                className="!rounded-button cursor-pointer whitespace-nowrap"
              >
                Xuất báo cáo
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Statistics Cards */}
        <Row gutter={[16, 16]} className="mb-6">
          <Col xs={24} sm={12} lg={6}>
            <Card className="text-center">
              <Statistic
                title="Tổng số sinh viên"
                value={totalStudents}
                valueStyle={{ color: "#1890ff" }}
                prefix={<UserOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card className="text-center">
              <Statistic
                title="Có mặt"
                value={presentCount}
                valueStyle={{ color: "#52c41a" }}
                prefix={<CheckCircleOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card className="text-center">
              <Statistic
                title="Vắng mặt"
                value={absentCount}
                valueStyle={{ color: "#ff4d4f" }}
                prefix={<CloseCircleOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card className="text-center">
              <Statistic
                title="Tỷ lệ điểm danh"
                value={attendanceRate}
                suffix="%"
                valueStyle={{
                  color: attendanceRate >= 80 ? "#52c41a" : "#faad14",
                }}
              />
            </Card>
          </Col>
        </Row>

        {/* Search and Filter */}
        <Card className="mb-6">
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} sm={12} md={8}>
              <Input
                placeholder="Tìm kiếm theo tên hoặc mã sinh viên..."
                prefix={<SearchOutlined />}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="!rounded-button"
              />
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Select
                placeholder="Lọc theo trạng thái"
                value={filterStatus}
                onChange={setFilterStatus}
                className="w-full"
                suffixIcon={<FilterOutlined />}
              >
                <Option value="all">Tất cả trạng thái</Option>
                <Option value="present">Có mặt</Option>
                <Option value="absent">Vắng mặt</Option>
                <Option value="late">Đi muộn</Option>
              </Select>
            </Col>
            <Col xs={24} sm={24} md={10}>
              <div className="flex justify-end">
                <Space>
                  <Text type="secondary">
                    Hiển thị {filteredData.length} / {totalStudents} sinh viên
                  </Text>
                </Space>
              </div>
            </Col>
          </Row>
        </Card>

        {/* Attendance Table */}
        <Card>
          <Table
            columns={columns}
            dataSource={filteredData}
            rowKey="id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} của ${total} sinh viên`,
            }}
            scroll={{ x: 800 }}
            className="attendance-table"
          />
        </Card>

        {/* Footer Summary */}
        <Card className="mt-6 bg-blue-50 border-blue-200">
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} md={12}>
              <div className="flex items-center space-x-4">
                <Text strong>Tổng kết điểm danh:</Text>
                <Tag color="green">{presentCount} có mặt</Tag>
                <Tag color="orange">{lateCount} đi muộn</Tag>
                <Tag color="red">{absentCount} vắng mặt</Tag>
              </div>
            </Col>
            <Col xs={24} md={12}>
              <div className="flex justify-end items-center space-x-4">
                <Text type="secondary">
                  Cập nhật lần cuối: 24/08/2025 - 08:30
                </Text>
                <Button
                  type="primary"
                  className="!rounded-button cursor-pointer whitespace-nowrap"
                >
                  Lưu điểm danh
                </Button>
              </div>
            </Col>
          </Row>
        </Card>
      </div>

      <style jsx>{`
        .attendance-table .ant-table-thead > tr > th {
          background-color: #fafafa;
          font-weight: 600;
        }
        .attendance-table .ant-table-tbody > tr:hover > td {
          background-color: #f0f9ff;
        }
      `}</style>
    </div>
  );
};

export default AttendanceStudentPage;
