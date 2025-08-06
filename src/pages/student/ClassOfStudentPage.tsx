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
  DatePicker,
} from "antd";
import dayjs from "dayjs";

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

const ClassOfStudentPage = () => {
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
    { title: "STT", render: (_: any, __: any, idx: number) => (page - 1) * pageSize + idx + 1, width: 60 },
    { title: "Ngày", dataIndex: "startDate" },
    { title: "Phòng", dataIndex: "room" },
    { title: "Giảng đường", dataIndex: "hall" },
    { title: "Mã môn", dataIndex: "subjectId" },
    { title: "Môn", dataIndex: "subjectName" },
    { title: "Lớp", dataIndex: "name" },
    { title: "Giảng viên", dataIndex: "teacherId" },
    { title: "Ca", dataIndex: "shift", render: (shift: ShiftEnum) => shiftOptions.find((s) => s.value === shift)?.label },
    { title: "Thời gian", dataIndex: "time" },
  ];

  return (
    <div>
      <h2>Lịch học</h2>
      <div style={{ marginBottom: 16 }}>
        <span style={{ marginRight: 8 }}>Thời gian</span>
        <Select
          style={{ width: 200 }}
          value={timeFilter}
          onChange={setTimeFilter}
          options={timeOptions}
        />
      </div>
      <Space style={{ marginBottom: 16 }}>
        <Input.Search
          placeholder="Tìm kiếm theo tên lớp, mã môn, mã chuyên ngành"
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
        dataSource={classes}
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
        title={editing ? "Cập nhật lớp học" : "Thêm mới lớp học"}
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={() => setModalVisible(false)}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Tên lớp"
            name="name"
            rules={[{ required: true, message: "Bắt buộc" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Mã chuyên ngành"
            name="majorId"
            rules={[{ required: true, message: "Bắt buộc" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Mã môn học"
            name="subjectId"
            rules={[{ required: true, message: "Bắt buộc" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Giảng viên"
            name="teacherId"
            rules={[{ required: true, message: "Bắt buộc" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Ngày bắt đầu"
            name="startDate"
            rules={[{ required: true, message: "Bắt buộc" }]}
          >
            <DatePicker format="YYYY-MM-DD" style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            label="Số buổi"
            name="totalSessions"
            rules={[{ required: true, message: "Bắt buộc" }]}
          >
            <Input type="number" min={1} />
          </Form.Item>
          <Form.Item
            label="Ca học"
            name="shift"
            rules={[{ required: true, message: "Bắt buộc" }]}
          >
            <Select options={shiftOptions} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ClassOfStudentPage;
