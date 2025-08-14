import React from "react";
import { Table, Button, Tag } from "antd";
import {
  ClockCircleOutlined,
  HomeOutlined,
  PlusOutlined,
} from "@ant-design/icons";

interface Schedule {
  _id: string;
  sessionNumber: number;
  sessionDate: string;
  note: string;
  status: "completed" | "upcoming" | "cancelled";
  attendanceCount?: number;
}

interface SessionTableProps {
  sessions: Schedule[];
  classDetail: any;
  sessionsLoading: boolean;
  getStatusColor: (status: string) => string;
  getStatusText: (status: string) => string;
  onCreateSession: () => void;
}

const SessionTable: React.FC<SessionTableProps> = ({
  sessions,
  classDetail,
  sessionsLoading,
  getStatusColor,
  getStatusText,
  onCreateSession,
}) => {
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

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          Lịch học chi tiết
        </h3>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          className="!rounded-button cursor-pointer whitespace-nowrap"
          onClick={onCreateSession}
        >
          Thêm buổi học
        </Button>
      </div>
      <Table
        columns={scheduleColumns}
        dataSource={sessions}
        rowKey="_id"
        pagination={false}
        scroll={{ x: 800 }}
        loading={sessionsLoading}
        locale={{
          emptyText: (
            <div className="text-center py-8">
              <div className="text-gray-400 mb-2">Chưa có buổi học nào cho lớp này</div>
              <div className="text-sm text-gray-500 mb-4">
                Bạn có thể tạo buổi học đầu tiên để bắt đầu quản lý lịch học
              </div>
              <Button type="primary" icon={<PlusOutlined />} onClick={onCreateSession}>
                Tạo buổi học đầu tiên
              </Button>
            </div>
          ),
        }}
      />
    </div>
  );
};

export default SessionTable; 