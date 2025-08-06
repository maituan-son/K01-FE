import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Input,
  Modal,
  Form,
  Select,
  Pagination,
  Space,
  Popconfirm,
  message,
} from "antd";

type StatusEnum = "PRESENT" | "ABSENT" | "LATE";

interface Attendance {
  _id: string;
  sessionId: string;
  studentId: string;
  status: StatusEnum;
  note?: string;
  createdAt: string;
  updatedAt: string;
}

const statusOptions = [
  { label: "Có mặt", value: "PRESENT" },
  { label: "Vắng", value: "ABSENT" },
  { label: "Đi trễ", value: "LATE" },
];

const AttendanceManagementPage = () => {
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [pageSize] = useState(10);

  const [modalVisible, setModalVisible] = useState(false);
  const [editing, setEditing] = useState<Attendance | null>(null);

  const [form] = Form.useForm();

  // Fake API calls
  const fetchAttendances = async () => {
    setLoading(true);
    // TODO: Replace with real API
    // Simulate API
    setTimeout(() => {
      setAttendances([
        {
          _id: "1",
          sessionId: "S1",
          studentId: "U1",
          status: "PRESENT",
          note: "Đúng giờ",
          createdAt: "2024-07-29",
          updatedAt: "2024-07-29",
        },
      ]);
      setTotal(1);
      setLoading(false);
    }, 500);
  };

  useEffect(() => {
    fetchAttendances();
  }, [search, page]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleAdd = () => {
    setEditing(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record: Attendance) => {
    setEditing(record);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const handleDelete = async (_id: string) => {
    // TODO: Call API to delete
    message.success("Xóa thành công!");
    fetchAttendances();
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
      fetchAttendances();
    } catch {}
  };

  const columns = [
    { title: "Session ID", dataIndex: "sessionId" },
    { title: "Student ID", dataIndex: "studentId" },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (status: StatusEnum) =>
        statusOptions.find((s) => s.value === status)?.label,
    },
    { title: "Ghi chú", dataIndex: "note" },
    { title: "Ngày tạo", dataIndex: "createdAt" },
    {
      title: "Hành động",
      render: (_: any, record: Attendance) => (
        <Space>
          <Button onClick={() => handleEdit(record)} type="link">
            Sửa
          </Button>
          <Popconfirm
            title="Bạn chắc chắn xóa?"
            onConfirm={() => handleDelete(record._id)}
          >
            <Button danger type="link">
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <h2>Quản lý điểm danh</h2>
      <Space style={{ marginBottom: 16 }}>
        <Input.Search
          placeholder="Tìm kiếm theo Student ID hoặc Session ID"
          value={search}
          onChange={handleSearch}
          allowClear
        />
        <Button type="primary" onClick={handleAdd}>
          Thêm mới
        </Button>
      </Space>
      <Table
        columns={columns}
        dataSource={attendances}
        rowKey="_id"
        loading={loading}
        pagination={false}
      />
      <Pagination
        current={page}
        pageSize={pageSize}
        total={total}
        onChange={setPage}
        style={{ marginTop: 16, textAlign: "right" }}
      />

      <Modal
        title={editing ? "Cập nhật điểm danh" : "Thêm mới điểm danh"}
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={() => setModalVisible(false)}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Session ID"
            name="sessionId"
            rules={[{ required: true, message: "Bắt buộc" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Student ID"
            name="studentId"
            rules={[{ required: true, message: "Bắt buộc" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Trạng thái"
            name="status"
            rules={[{ required: true, message: "Bắt buộc" }]}
          >
            <Select options={statusOptions} />
          </Form.Item>
          <Form.Item label="Ghi chú" name="note">
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AttendanceManagementPage;
