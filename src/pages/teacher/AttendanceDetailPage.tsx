import React, { useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getAttendances } from "@/common/services/attendance";
import { getClassDetail } from "@/common/services/classSercive";
import { getAllSessionsByClassId } from "@/common/services/sessionService";
import {
  Table,
  Input,
  DatePicker,
  Select,
  Button,
  Card,
  Tag,
  Statistic,
  Space,
  Typography,
  Row,
  Col,
  Spin,
  TableColumnsType,
} from "antd";
import {
  SearchOutlined,
  ExportOutlined,
  ReloadOutlined,
  UserOutlined,
  BookOutlined,
  CalendarOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

// Types
interface Student {
  _id: string;
  studentId?: string;
  code?: string;
  fullname: string;
}

interface Session {
  _id: string;
  sessionNumber: number;
  sessionDate?: string;
  date?: string;
  createdAt: string;
}

interface AttendanceItem {
  sessionId: { _id: string };
  studentId: { _id: string };
  status: "PRESENT" | "ABSENT" | "LATE" | "NOT_TAKEN";
}

interface AttendanceRecord {
  key: string;
  studentId: string;
  studentName: string;
  sessions: { [key: string]: "PRESENT" | "ABSENT" | "LATE" | "NOT_TAKEN" };
  totalAbsent: number;
  attendanceRate: number;
}

interface ClassDetail {
  _id: string;
  name: string;
  studentIds: Student[];
  teacherId?: { fullname: string };
  subjectId?: { name: string };
  totalSessions?: number;
}

// Constants
const STATUS_CONFIG = {
  PRESENT: { color: "success", text: "Có mặt", icon: "✓" },
  ABSENT: { color: "error", text: "Vắng", icon: "✗" },
  LATE: { color: "warning", text: "Muộn", icon: "△" },
  NOT_TAKEN: { color: "default", text: "", icon: "__" },
} as const;

const ATTENDANCE_THRESHOLDS = {
  GOOD: 80,
  WARNING: 60,
} as const;

// Utility functions
const getStatusConfig = (status: string) =>
  STATUS_CONFIG[status as keyof typeof STATUS_CONFIG] ||
  STATUS_CONFIG.NOT_TAKEN;

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("vi-VN");
};

const getAttendanceLevel = (rate: number) => {
  if (rate >= ATTENDANCE_THRESHOLDS.GOOD) return "good";
  if (rate >= ATTENDANCE_THRESHOLDS.WARNING) return "warning";
  return "danger";
};

// Components
const LoadingSpinner: React.FC = () => (
  <div className="flex justify-center items-center h-64">
    <Spin size="large" />
  </div>
);

const ErrorMessage: React.FC<{ message: string }> = ({ message }) => (
  <Card>
    <div className="text-center py-8">
      <p className="text-gray-500">{message}</p>
    </div>
  </Card>
);

const ClassInfoCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  value: string;
  bgColor: string;
}> = ({ icon, title, value, bgColor }) => (
  <div className={`flex items-center space-x-4 p-4 ${bgColor} rounded-lg`}>
    <div className={`p-3 bg-opacity-20 rounded-full`}>{icon}</div>
    <div>
      <div className="text-sm text-gray-500 mb-1">{title}</div>
      <div className="font-semibold text-gray-800 text-lg">{value}</div>
    </div>
  </div>
);

const StatisticCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  value: number;
  suffix?: string;
  precision?: number;
  color: string;
}> = ({ icon, title, value, suffix, precision, color }) => (
  <Card className="text-center border-0 shadow-md hover:shadow-lg transition-shadow duration-300">
    <div className="p-4">
      <div className="mb-4">{icon}</div>
      <Statistic
        title={<span className="text-gray-600 text-base">{title}</span>}
        value={value}
        precision={precision}
        suffix={suffix}
        valueStyle={{
          fontSize: "2rem",
          fontWeight: "bold",
          color,
        }}
      />
    </div>
  </Card>
);

const LegendTag: React.FC<{ status: keyof typeof STATUS_CONFIG }> = ({
  status,
}) => {
  const config = STATUS_CONFIG[status];
  return (
    <div className="flex items-center space-x-3">
      <Tag color={config.color} className="px-3 py-1 text-sm font-medium">
        {config.icon} {config.text || "Chưa điểm danh"}
      </Tag>
    </div>
  );
};

const AttendanceDetailPage: React.FC = () => {
  const { classId } = useParams<{ classId: string }>();
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Queries
  const {
    data: classDetail,
    isLoading: classDetailLoading,
    error: classError,
  } = useQuery({
    queryKey: ["class-detail", classId],
    queryFn: () => getClassDetail(classId!),
    enabled: !!classId,
  });

  const { data: sessions = [], isLoading: sessionsLoading } = useQuery({
    queryKey: ["sessions", classId],
    queryFn: () => getAllSessionsByClassId(classId!),
    enabled: !!classId,
  });

  const { data: attendanceData = [], isLoading: attendanceLoading } = useQuery({
    queryKey: ["attendance", classId],
    queryFn: () => getAttendances({ limit: 1000 }),
    enabled: !!classId,
  });

  // Memoized processed data
  const processedData = useMemo((): AttendanceRecord[] => {
    if (!classDetail?.studentIds || classDetail.studentIds.length === 0) {
      return [];
    }

    const attendanceArray = Array.isArray(attendanceData)
      ? attendanceData
      : attendanceData?.data || [];

    return classDetail.studentIds.map((student: Student, index: number) => {
      const studentAttendance: {
        [key: string]: "PRESENT" | "ABSENT" | "LATE" | "NOT_TAKEN";
      } = {};
      let totalAbsent = 0;
      let totalPresent = 0;
      let totalSessionsWithAttendance = 0;

      sessions.forEach((session: Session) => {
        const attendance = attendanceArray.find(
          (att: AttendanceItem) =>
            att.sessionId._id === session._id &&
            att.studentId._id === student._id
        );

        const sessionKey = session._id;

        if (attendance) {
          studentAttendance[sessionKey] = attendance.status;
          totalSessionsWithAttendance++;
          if (attendance.status === "ABSENT") totalAbsent++;
          if (attendance.status === "PRESENT") totalPresent++;
        } else {
          studentAttendance[sessionKey] = "NOT_TAKEN";
        }
      });

      const attendanceRate =
        totalSessionsWithAttendance > 0
          ? Math.round((totalPresent / totalSessionsWithAttendance) * 100)
          : 0;

      return {
        key: student._id || index.toString(),
        studentId: student.studentId || student.code || student._id,
        studentName: student.fullname || "N/A",
        sessions: studentAttendance,
        totalAbsent,
        attendanceRate,
      };
    });
  }, [classDetail, sessions, attendanceData]);

  // Memoized statistics
  const statistics = useMemo(() => {
    const totalStudents = processedData.length;
    const averageAttendance =
      totalStudents > 0
        ? Math.round(
            (processedData.reduce(
              (sum, student) => sum + student.attendanceRate,
              0
            ) /
              totalStudents) *
              100
          ) / 100
        : 0;

    const studentsWithExcessiveAbsence = processedData.filter(
      (student) => student.attendanceRate < ATTENDANCE_THRESHOLDS.WARNING
    ).length;

    const goodAttendance = processedData.filter(
      (s) => s.attendanceRate >= ATTENDANCE_THRESHOLDS.GOOD
    ).length;
    const warningAttendance = processedData.filter(
      (s) =>
        s.attendanceRate >= ATTENDANCE_THRESHOLDS.WARNING &&
        s.attendanceRate < ATTENDANCE_THRESHOLDS.GOOD
    ).length;
    const dangerAttendance = processedData.filter(
      (s) => s.attendanceRate < ATTENDANCE_THRESHOLDS.WARNING
    ).length;

    return {
      totalStudents,
      averageAttendance,
      studentsWithExcessiveAbsence,
      goodAttendance,
      warningAttendance,
      dangerAttendance,
    };
  }, [processedData]);

  // Memoized filtered data
  const filteredData = useMemo(() => {
    return processedData.filter((student) => {
      const matchesSearch =
        student.studentName.toLowerCase().includes(searchText.toLowerCase()) ||
        student.studentId.toLowerCase().includes(searchText.toLowerCase());

      if (statusFilter === "all") return matchesSearch;

      // Filter by attendance rate based on status
      const level = getAttendanceLevel(student.attendanceRate);
      return (
        matchesSearch &&
        ((statusFilter === "PRESENT" && level === "good") ||
          (statusFilter === "LATE" && level === "warning") ||
          (statusFilter === "ABSENT" && level === "danger"))
      );
    });
  }, [processedData, searchText, statusFilter]);

  // Memoized table columns
  const columns: TableColumnsType<AttendanceRecord> = useMemo(
    () => [
      {
        title: "Mã sinh viên",
        dataIndex: "studentId",
        key: "studentId",
        width: 150,
        fixed: "left",
        render: (text: string) => (
          <div className="text-center text-sm font-medium text-gray-700">
            {text}
          </div>
        ),
      },
      {
        title: "Họ và tên",
        dataIndex: "studentName",
        key: "studentName",
        width: 200,
        fixed: "left",
        render: (text: string) => (
          <div className="text-center text-sm font-medium text-gray-700">
            {text}
          </div>
        ),
      },
      ...sessions.map((session: Session) => ({
        title: (
          <div className="text-center">
            <div className="text-xs font-medium text-gray-500">
              Buổi học {session.sessionNumber}
            </div>
            <div className="text-xs text-gray-400">
              {formatDate(
                session.sessionDate || session.date || session.createdAt
              )}
            </div>
          </div>
        ),
        key: session._id,
        width: 120,
        render: (record: AttendanceRecord) => {
          const status = record.sessions[session._id];
          const config = getStatusConfig(status);

          return (
            <div className="flex justify-center">
              <Tag color={config.color} className="text-sm font-medium">
                {config.text}
              </Tag>
            </div>
          );
        },
      })),
      {
        title: "Tổng số buổi vắng",
        dataIndex: "totalAbsent",
        key: "totalAbsent",
        width: 150,
        render: (text: number) => (
          <div className="text-center text-sm text-gray-700">{text}</div>
        ),
      },
      {
        title: "Tỷ lệ điểm danh",
        dataIndex: "attendanceRate",
        key: "attendanceRate",
        width: 150,
        render: (text: number) => {
          const level = getAttendanceLevel(text);
          const color =
            level === "good"
              ? "text-green-600"
              : level === "warning"
              ? "text-yellow-600"
              : "text-red-600";

          return (
            <div className={`text-center text-sm font-medium ${color}`}>
              {text >= 0 ? `${text}%` : "-"}
            </div>
          );
        },
      },
    ],
    [sessions]
  );

  // Loading states
  if (classDetailLoading || sessionsLoading || attendanceLoading) {
    return <LoadingSpinner />;
  }

  // Error states
  if (classError || !classDetail) {
    return <ErrorMessage message="Không tìm thấy thông tin lớp học." />;
  }

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleExport = () => {
    // TODO: Implement export functionality
    console.log("Export attendance report");
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <Card className="shadow-sm">
          <div className="p-8">
            <Title level={2} className="!mb-8 text-center text-gray-800">
              Chi tiết điểm danh lớp {classDetail.name}
            </Title>
            <Row gutter={[48, 24]}>
              <Col span={6}>
                <ClassInfoCard
                  icon={<BookOutlined className="text-xl text-blue-600" />}
                  title="Mã lớp"
                  value={classDetail.name || classDetail._id}
                  bgColor="bg-blue-50"
                />
              </Col>
              <Col span={6}>
                <ClassInfoCard
                  icon={<UserOutlined className="text-xl text-green-600" />}
                  title="Giảng viên"
                  value={classDetail.teacherId?.fullname || "N/A"}
                  bgColor="bg-green-50"
                />
              </Col>
              <Col span={6}>
                <ClassInfoCard
                  icon={<BookOutlined className="text-xl text-purple-600" />}
                  title="Môn học"
                  value={classDetail.subjectId?.name || "N/A"}
                  bgColor="bg-purple-50"
                />
              </Col>
              <Col span={6}>
                <ClassInfoCard
                  icon={
                    <CalendarOutlined className="text-xl text-orange-600" />
                  }
                  title="Tổng buổi học"
                  value={`${sessions.length} buổi`}
                  bgColor="bg-orange-50"
                />
              </Col>
            </Row>
          </div>
        </Card>

        {/* Statistics */}
        <Row gutter={[24, 24]}>
          <Col span={6}>
            <StatisticCard
              icon={<UserOutlined className="text-4xl text-blue-500" />}
              title="Tổng số sinh viên"
              value={statistics.totalStudents}
              color="#1f2937"
            />
          </Col>
          <Col span={6}>
            <StatisticCard
              icon={<div className="text-4xl">📊</div>}
              title="Tỷ lệ đi học trung bình"
              value={statistics.averageAttendance}
              precision={1}
              suffix="%"
              color="#059669"
            />
          </Col>
          <Col span={6}>
            <StatisticCard
              icon={<div className="text-4xl">⚠️</div>}
              title="SV vắng quá giới hạn"
              value={statistics.studentsWithExcessiveAbsence}
              color="#dc2626"
            />
          </Col>
          <Col span={6}>
            <StatisticCard
              icon={<CalendarOutlined className="text-4xl text-purple-500" />}
              title="Buổi học đã hoàn thành"
              value={sessions.length}
              suffix={`/${classDetail.totalSessions || sessions.length}`}
              color="#7c3aed"
            />
          </Col>
        </Row>

        {/* Filters */}
        <Card className="shadow-sm">
          <div className="p-6">
            <Row gutter={[24, 24]} align="middle">
              <Col span={6}>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Tìm kiếm
                  </label>
                  <Input
                    placeholder="Tìm kiếm theo tên hoặc mã sinh viên"
                    prefix={<SearchOutlined className="text-gray-400" />}
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    size="large"
                    allowClear
                  />
                </div>
              </Col>
              <Col span={6}>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Khoảng thời gian
                  </label>
                  <RangePicker
                    placeholder={["Từ ngày", "Đến ngày"]}
                    className="w-full"
                    size="large"
                  />
                </div>
              </Col>
              <Col span={6}>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Mức độ điểm danh
                  </label>
                  <Select
                    placeholder="Tất cả mức độ"
                    value={statusFilter}
                    onChange={setStatusFilter}
                    className="w-full"
                    size="large"
                  >
                    <Option value="all">Tất cả mức độ</Option>
                    <Option value="PRESENT">Đạt yêu cầu (≥80%)</Option>
                    <Option value="LATE">Cảnh báo (60-79%)</Option>
                    <Option value="ABSENT">Có nguy cơ (&lt;60%)</Option>
                  </Select>
                </div>
              </Col>
              <Col span={6} className="flex justify-end items-end">
                <Space size="middle">
                  <Button
                    icon={<ReloadOutlined />}
                    size="large"
                    onClick={handleRefresh}
                    className="flex items-center"
                  >
                    Làm mới
                  </Button>
                  <Button
                    type="primary"
                    icon={<ExportOutlined />}
                    size="large"
                    onClick={handleExport}
                    className="flex items-center"
                  >
                    Xuất báo cáo
                  </Button>
                </Space>
              </Col>
            </Row>
          </div>
        </Card>

        {/* Legend */}
        <Card className="shadow-sm">
          <div className="p-6">
            <div className="flex items-center justify-center space-x-12">
              <Text className="font-semibold text-gray-700 text-lg">
                Chú thích:
              </Text>
              <LegendTag status="PRESENT" />
              <LegendTag status="ABSENT" />
              <LegendTag status="LATE" />
              <LegendTag status="NOT_TAKEN" />
            </div>
          </div>
        </Card>

        {/* Attendance Table */}
        <Card className="shadow-sm">
          <div className="p-6">
            <Table
              columns={columns}
              dataSource={filteredData}
              scroll={{ x: 1500, y: 500 }}
              pagination={{
                pageSize: 20,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} của ${total} sinh viên`,
              }}
              className="attendance-table"
              size="middle"
            />
          </div>
        </Card>

        {/* Summary Statistics */}
        <Card className="shadow-sm">
          <div className="p-8">
            <Row gutter={[48, 24]}>
              <Col span={8}>
                <div className="text-center p-6 bg-green-50 rounded-lg">
                  <div className="text-4xl font-bold text-green-600 mb-2">
                    {statistics.goodAttendance}
                  </div>
                  <div className="text-base font-medium text-gray-700">
                    Sinh viên đạt yêu cầu (≥80%)
                  </div>
                </div>
              </Col>
              <Col span={8}>
                <div className="text-center p-6 bg-yellow-50 rounded-lg">
                  <div className="text-4xl font-bold text-yellow-600 mb-2">
                    {statistics.warningAttendance}
                  </div>
                  <div className="text-base font-medium text-gray-700">
                    Sinh viên cảnh báo (60-79%)
                  </div>
                </div>
              </Col>
              <Col span={8}>
                <div className="text-center p-6 bg-red-50 rounded-lg">
                  <div className="text-4xl font-bold text-red-600 mb-2">
                    {statistics.dangerAttendance}
                  </div>
                  <div className="text-base font-medium text-gray-700">
                    Sinh viên có nguy cơ (&lt;60%)
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AttendanceDetailPage;
