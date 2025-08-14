import React from "react";
import { Table, Button, Input, Space, Tooltip, Avatar, Tag } from "antd";
import {
  UserOutlined,
  SearchOutlined,
  PlusOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import User from "@/common/types/User";

interface StudentTableProps {
  students: User[];
  classDetail: any;
  onAddStudent: () => void;
  onRemoveStudent: (studentId: string) => void;
}

const StudentTable: React.FC<StudentTableProps> = ({
  students,
  classDetail,
  onAddStudent,
  onRemoveStudent,
}) => {
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
              onClick={() => onRemoveStudent(record._id)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          Danh sách sinh viên ({classDetail.studentIds?.length || 0})
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
            onClick={onAddStudent}
          >
            Thêm sinh viên
          </Button>
        </div>
      </div>
      <Table
        columns={studentColumns}
        dataSource={students.filter((student) => 
          classDetail.studentIds?.some((sid: { _id: string }) => sid._id === student._id)
        )}
        rowKey="_id"
        scroll={{ x: 900 }}
        pagination={false}
      />
    </div>
  );
};

export default StudentTable; 