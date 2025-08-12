import React, { useState, useMemo } from "react";
import {
  Table,
  Button,
  Input,
  Select,
  Tag,
  Avatar,
  Progress,
  Space,
  Card,
  Row,
  Col,
  DatePicker,
  Modal,
  Form,
  InputNumber,
  Tooltip,
  Dropdown,
  Menu,
  Popconfirm,
  message,
} from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  ExportOutlined,
  UserOutlined,
  CalendarOutlined,
  BookOutlined,
  HomeOutlined,
  ClockCircleOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllClasses,
  createClass,
  updateClass,
  deleteClass,
  restoreClass,
} from "@/common/services/classSercive";
import { getAllSubjects } from "@/common/services/subjectService";
import { getAllMajors } from "@/common/services/majorServices";
import { getAllUsers } from "@/common/services/userService";
import { Class } from "@/common/types/Class";
import dayjs from "dayjs";
import { RoomEnum } from "@/common/types";
import { useNavigate } from "react-router-dom";

const { Option } = Select;
const { RangePicker } = DatePicker;

const shiftOptions = [
  { label: "Ca 1 (7h-9h)", value: "1" },
  { label: "Ca 2 (9h-11h)", value: "2" },
  { label: "Ca 3 (11h-13h)", value: "3" },
  { label: "Ca 4 (13h-15h)", value: "4" },
  { label: "Ca 5 (15h-17h)", value: "5" },
  { label: "Ca 6 (17h-19h)", value: "6" },
];

const shiftLabel = (v: string) => {
  const found = shiftOptions.find((s) => s.value === v);
  return found ? found.label : v;
};

const getStatusColor = (deletedAt: string | null) =>
  deletedAt ? "gray" : "green";
const getStatusText = (deletedAt: string | null) =>
  deletedAt ? "Đã xóa" : "Đang hoạt động";

const ClassManagementPage = () => {
  const queryClient = useQueryClient();
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState("");
  const [selectedMajor, setSelectedMajor] = useState<string>();
  const [selectedShift, setSelectedShift] = useState<string>();
  const [selectedStatus, setSelectedStatus] = useState<string>();
  const [dateRange, setDateRange] = useState<any>();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingClass, setEditingClass] = useState<Class | null>(null);
  const nav = useNavigate();

  // Queries
  const { data: classes = [], isLoading } = useQuery({
    queryKey: ["classes"],
    queryFn: () => getAllClasses({ includeDeleted: true }),
  });
  const { data: subjects = [] } = useQuery({
    queryKey: ["subjects"],
    queryFn: () => getAllSubjects({ includeDeleted: false }),
  });
  const { data: majors = [] } = useQuery({
    queryKey: ["majors"],
    queryFn: () => getAllMajors({ includeDeleted: false }),
  });
  const { data: teachers = [] } = useQuery({
    queryKey: ["teachers"],
    queryFn: () => getAllUsers({ role: "teacher", includeDeleted: false }),
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: createClass,
    onSuccess: () => {
      message.success("Thêm lớp thành công");
      queryClient.invalidateQueries({ queryKey: ["classes"] });
      setIsModalVisible(false);
      form.resetFields();
    },
    onError: () => message.error("Thêm lớp thất bại"),
  });
  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<Class> }) =>
      updateClass(id, payload),
    onSuccess: () => {
      message.success("Cập nhật lớp thành công");
      queryClient.invalidateQueries({ queryKey: ["classes"] });
      setIsModalVisible(false);
      setEditingClass(null);
      form.resetFields();
    },
    onError: () => message.error("Cập nhật lớp thất bại"),
  });
  const deleteMutation = useMutation({
    mutationFn: deleteClass,
    onSuccess: () => {
      message.success("Xóa lớp thành công");
      queryClient.invalidateQueries({ queryKey: ["classes"] });
    },
    onError: () => message.error("Xóa lớp thất bại"),
  });
  const restoreMutation = useMutation({
    mutationFn: restoreClass,
    onSuccess: () => {
      message.success("Khôi phục lớp thành công");
      queryClient.invalidateQueries({ queryKey: ["classes"] });
    },
    onError: () => message.error("Khôi phục lớp thất bại"),
  });

  // Filtered data
  const filteredClasses = useMemo(() => {
    return classes.filter((cls: Class) => {
      const subject =
        typeof cls.subjectId === "object"
          ? cls.subjectId
          : subjects.find((s) => s._id === cls.subjectId);
      const major =
        typeof cls.majorId === "object"
          ? cls.majorId
          : majors.find((m) => m._id === cls.majorId);
      const teacher =
        typeof cls.teacherId === "object"
          ? cls.teacherId
          : teachers.find((t) => t._id === cls.teacherId);

      const matchesSearch =
        !searchText ||
        cls.name?.toLowerCase().includes(searchText.toLowerCase()) ||
        subject?.name?.toLowerCase().includes(searchText.toLowerCase()) ||
        teacher?.fullname?.toLowerCase().includes(searchText.toLowerCase());

      const matchesMajor = !selectedMajor || major?.name === selectedMajor;
      const matchesShift =
        !selectedShift || shiftLabel(cls.shift) === selectedShift;
      const matchesStatus =
        !selectedStatus ||
        (selectedStatus === "active" && !cls.deletedAt) ||
        (selectedStatus === "deleted" && !!cls.deletedAt);

      const matchesDate =
        !dateRange ||
        (!cls.startDate
          ? true
          : dayjs(cls.startDate).isBetween(
              dateRange[0],
              dateRange[1],
              "day",
              "[]"
            ));

      return (
        matchesSearch &&
        matchesMajor &&
        matchesShift &&
        matchesStatus &&
        matchesDate
      );
    });
  }, [
    classes,
    searchText,
    selectedMajor,
    selectedShift,
    selectedStatus,
    dateRange,
    subjects,
    majors,
    teachers,
  ]);

  // Table columns
  const columns = [
    {
      title: "Tên lớp",
      dataIndex: "name",
      key: "name",
      width: 200,
      render: (name: string, record: Class) => (
        <div>
          <div className="font-medium text-blue-600 hover:text-blue-800">
            {name}
          </div>
          <div className="text-xs text-gray-500 mt-1">{record.description}</div>
        </div>
      ),
    },
    {
      title: "Môn học",
      dataIndex: "subjectId",
      key: "subjectId",
      width: 150,
      render: (subjectId: any) => {
        const subject =
          typeof subjectId === "object"
            ? subjectId
            : subjects.find((s) => s._id === subjectId);
        return (
          <span className="text-blue-600 cursor-pointer hover:text-blue-800">
            <BookOutlined className="mr-1" />
            {subject?.name}
          </span>
        );
      },
    },
    {
      title: "Ngành học",
      dataIndex: "majorId",
      key: "majorId",
      width: 150,
      render: (majorId: any) => {
        const major =
          typeof majorId === "object"
            ? majorId
            : majors.find((m) => m._id === majorId);
        return <span className="text-gray-700">{major?.name}</span>;
      },
    },
    {
      title: "Giảng viên",
      dataIndex: "teacherId",
      key: "teacherId",
      width: 180,
      render: (teacherId: any) => {
        const teacher =
          typeof teacherId === "object"
            ? teacherId
            : teachers.find((t) => t._id === teacherId);
        return (
          <div className="flex items-center space-x-2">
            <Avatar size={32} icon={<UserOutlined />} />
            <span className="text-gray-700">{teacher?.fullname}</span>
          </div>
        );
      },
    },
    {
      title: "Ca học",
      dataIndex: "shift",
      key: "shift",
      width: 140,
      render: (shift: string) => (
        <Tag color="#1890ff" className="!rounded-button">
          <ClockCircleOutlined className="mr-1" />
          {shiftLabel(shift)}
        </Tag>
      ),
    },
    {
      title: "Phòng học",
      dataIndex: "room",
      key: "room",
      width: 120,
      render: (room: any) => (
        <span className="text-gray-700">
          <HomeOutlined className="mr-1" />
          {Array.isArray(room) ? room.join(", ") : room}
        </span>
      ),
    },
    {
      title: "Ngày bắt đầu",
      dataIndex: "startDate",
      key: "startDate",
      width: 120,
      render: (date: string) => (
        <Tooltip title="Ngày bắt đầu khóa học">
          <span className="text-gray-700">
            <CalendarOutlined className="mr-1" />
            {date ? dayjs(date).format("DD/MM/YYYY") : ""}
          </span>
        </Tooltip>
      ),
    },
    {
      title: "Số buổi học",
      dataIndex: "totalSessions",
      key: "totalSessions",
      width: 100,
      align: "center" as const,
      render: (sessions: number) => (
        <span className="font-medium text-gray-700">{sessions}</span>
      ),
    },
    {
      title: "Sĩ số",
      key: "students",
      width: 120,
      render: (record: Class) => (
        <div>
          <div className="text-sm font-medium text-gray-700 mb-1">
            <TeamOutlined className="mr-1" />
            {record.studentIds?.length || 0}/{record.maxStudents}
          </div>
          <Progress
            percent={
              record.maxStudents
                ? Math.round(
                    ((record.studentIds?.length || 0) / record.maxStudents) *
                      100
                  )
                : 0
            }
            size="small"
            strokeColor={
              record.studentIds?.length >= record.maxStudents
                ? "#ff4d4f"
                : "#52c41a"
            }
          />
        </div>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "deletedAt",
      key: "deletedAt",
      width: 120,
      render: (deletedAt: string | null) => (
        <Tag color={getStatusColor(deletedAt)} className="!rounded-button">
          {getStatusText(deletedAt)}
        </Tag>
      ),
    },
    {
      title: "Thao tác",
      key: "actions",
      width: 160,
      fixed: "right" as const,
      render: (record: Class) => (
        <Space size="small">
          <Tooltip title="Xem chi tiết">
            <Button
              type="text"
              icon={<EyeOutlined />}
              size="small"
              onClick={() => handleViewClass(record)}
              className="!rounded-button cursor-pointer whitespace-nowrap"
            />
          </Tooltip>
          <Tooltip title="Chỉnh sửa">
            <Button
              type="text"
              icon={<EditOutlined />}
              size="small"
              className="!rounded-button cursor-pointer whitespace-nowrap"
              onClick={() => handleEditClass(record)}
              disabled={!!record.deletedAt}
            />
          </Tooltip>
          {!record.deletedAt ? (
            <Tooltip title="Xóa">
              <Popconfirm
                title="Bạn chắc chắn muốn xóa?"
                onConfirm={() => deleteMutation.mutate(record._id)}
                okText="Xóa"
                cancelText="Hủy"
              >
                <Button
                  type="text"
                  danger
                  icon={<DeleteOutlined />}
                  size="small"
                  className="!rounded-button cursor-pointer whitespace-nowrap"
                />
              </Popconfirm>
            </Tooltip>
          ) : (
            <Tooltip title="Khôi phục">
              <Button
                type="text"
                icon={<PlusOutlined />}
                size="small"
                className="!rounded-button cursor-pointer whitespace-nowrap"
                onClick={() => restoreMutation.mutate(record._id)}
              />
            </Tooltip>
          )}
        </Space>
      ),
    },
  ];

  // Modal handlers
  const handleAddClass = () => {
    setEditingClass(null);
    form.resetFields();
    setIsModalVisible(true);
  };
  const handleEditClass = (cls: Class) => {
    setEditingClass(cls);
    form.setFieldsValue({
      ...cls,
      subjectId:
        typeof cls.subjectId === "object" ? cls.subjectId._id : cls.subjectId,
      majorId: typeof cls.majorId === "object" ? cls.majorId._id : cls.majorId,
      teacherId:
        typeof cls.teacherId === "object" ? cls.teacherId._id : cls.teacherId,
      startDate: cls.startDate ? dayjs(cls.startDate) : undefined,
      studentIds: Array.isArray(cls.studentIds)
        ? cls.studentIds.map((s: any) => (typeof s === "string" ? s : s._id))
        : [],
    });
    setIsModalVisible(true);
  };
  const handleViewClass = (record: Class) => {
    // Navigate to the student list page for the selected class
    nav(`/super-admin/classes/${record._id}`);
  };
  const handleModalOk = () => {
    form.validateFields().then((values) => {
      const payload = {
        ...values,
        startDate: values.startDate
          ? values.startDate.format("YYYY-MM-DD")
          : undefined,
        daysOfWeek:
          values.daysOfWeek !== undefined
            ? String(values.daysOfWeek)
            : undefined,
      };
      if (editingClass) {
        updateMutation.mutate({ id: editingClass._id, payload });
      } else {
        createMutation.mutate(payload);
      }
    });
  };

  // Export menu
  const exportMenu = (
    <Menu>
      <Menu.Item
        key="excel"
        icon={<i className="fas fa-file-excel text-green-600" />}
      >
        Xuất Excel
      </Menu.Item>
      <Menu.Item
        key="pdf"
        icon={<i className="fas fa-file-pdf text-red-600" />}
      >
        Xuất PDF
      </Menu.Item>
    </Menu>
  );

  // Stats
  const total = classes.length;
  const active = classes.filter((c: Class) => !c.deletedAt).length;
  const deleted = classes.filter((c: Class) => !!c.deletedAt).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Quản lý Lớp học
              </h1>
              <p className="text-gray-600 mt-1">
                Quản lý thông tin các lớp học trong hệ thống
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Dropdown overlay={exportMenu} placement="bottomRight">
                <Button
                  icon={<ExportOutlined />}
                  className="!rounded-button cursor-pointer whitespace-nowrap"
                >
                  Xuất dữ liệu
                </Button>
              </Dropdown>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleAddClass}
                className="!rounded-button cursor-pointer whitespace-nowrap"
              >
                Thêm lớp học
              </Button>
            </div>
          </div>
        </div>
      </div>
      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <Row gutter={16} className="mb-6">
          <Col span={6}>
            <Card className="text-center">
              <div className="text-2xl font-bold text-blue-600">{total}</div>
              <div className="text-gray-600">Tổng số lớp</div>
            </Card>
          </Col>
          <Col span={6}>
            <Card className="text-center">
              <div className="text-2xl font-bold text-green-600">{active}</div>
              <div className="text-gray-600">Đang hoạt động</div>
            </Card>
          </Col>
          <Col span={6}>
            <Card className="text-center">
              <div className="text-2xl font-bold text-gray-600">{deleted}</div>
              <div className="text-gray-600">Đã xóa</div>
            </Card>
          </Col>
          <Col span={6}>
            <Card className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {
                  classes.filter(
                    (c: Class) =>
                      c.startDate && dayjs(c.startDate).isAfter(dayjs())
                  ).length
                }
              </div>
              <div className="text-gray-600">Chưa bắt đầu</div>
            </Card>
          </Col>
        </Row>
        {/* Filters */}
        <Card className="mb-6">
          <Row gutter={16} align="middle">
            <Col span={6}>
              <Input
                placeholder="Tìm kiếm lớp học, môn học, giảng viên..."
                prefix={<SearchOutlined />}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="!rounded-button"
              />
            </Col>
            <Col span={4}>
              <Select
                placeholder="Chọn ngành học"
                value={selectedMajor}
                onChange={setSelectedMajor}
                allowClear
                className="w-full"
              >
                {majors.map((m) => (
                  <Option key={m._id} value={m.name}>
                    {m.name}
                  </Option>
                ))}
              </Select>
            </Col>
            <Col span={4}>
              <Select
                placeholder="Chọn ca học"
                value={selectedShift}
                onChange={setSelectedShift}
                allowClear
                className="w-full"
              >
                {shiftOptions.map((s) => (
                  <Option
                    key={s.label.split(" ")[0]}
                    value={s.label.split(" ")[0]}
                  >
                    {s.label.split(" ")[0]}
                  </Option>
                ))}
              </Select>
            </Col>
            <Col span={4}>
              <Select
                placeholder="Chọn trạng thái"
                value={selectedStatus}
                onChange={setSelectedStatus}
                allowClear
                className="w-full"
              >
                <Option value="active">Đang hoạt động</Option>
                <Option value="deleted">Đã xóa</Option>
              </Select>
            </Col>
            <Col span={6}>
              <RangePicker
                placeholder={["Từ ngày", "Đến ngày"]}
                className="w-full"
                value={dateRange}
                onChange={setDateRange}
              />
            </Col>
          </Row>
        </Card>
        {/* Table */}
        <Card>
          <Table
            columns={columns}
            dataSource={filteredClasses}
            rowKey="_id"
            loading={isLoading}
            scroll={{ x: 1400 }}
            pagination={{
              total: filteredClasses.length,
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} của ${total} lớp học`,
            }}
            className="overflow-hidden"
          />
        </Card>
      </div>
      {/* Add/Edit Modal */}
      <Modal
        title={editingClass ? "Cập nhật lớp" : "Thêm lớp"}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingClass(null);
          form.resetFields();
        }}
        width={800}
        okText={editingClass ? "Cập nhật" : "Thêm mới"}
        cancelText="Hủy"
        destroyOnClose
      >
        <Form form={form} layout="vertical" className="mt-4">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Tên lớp"
                name="name"
                rules={[{ required: true, message: "Vui lòng nhập tên lớp" }]}
              >
                <Input
                  placeholder="Nhập tên lớp học"
                  className="!rounded-button"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Môn học"
                name="subjectId"
                rules={[{ required: true, message: "Vui lòng chọn môn học" }]}
              >
                <Select
                  showSearch
                  placeholder="Chọn môn học"
                  optionFilterProp="children"
                  options={subjects.map((s) => ({
                    value: s._id,
                    label: `${s.code} - ${s.name}`,
                  }))}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Ngành"
                name="majorId"
                rules={[{ required: true, message: "Vui lòng chọn ngành" }]}
              >
                <Select
                  showSearch
                  placeholder="Chọn ngành"
                  optionFilterProp="children"
                  options={majors.map((m) => ({
                    value: m._id,
                    label: `${m.code} - ${m.name}`,
                  }))}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Giảng viên"
                name="teacherId"
                rules={[
                  { required: true, message: "Vui lòng chọn giảng viên" },
                ]}
              >
                <Select
                  showSearch
                  placeholder="Chọn Giảng Viên"
                  optionFilterProp="children"
                  options={teachers.map((t) => ({
                    value: t._id,
                    label: `${t.fullname} - ${t.email}`,
                  }))}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                label="Ca học"
                name="shift"
                rules={[{ required: true, message: "Vui lòng chọn ca học" }]}
              >
                <Select
                  options={shiftOptions.map((s) => ({
                    value: s.value,
                    label: s.label,
                  }))}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Phòng học"
                name="room"
                rules={[{ required: true, message: "Vui lòng chọn phòng học" }]}
              >
                <Select
                  options={Object.values(RoomEnum).map((room) => ({
                    value: room,
                    label: room,
                  }))}
                  allowClear
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Số buổi học"
                name="totalSessions"
                rules={[
                  { required: true, message: "Vui lòng nhập số buổi học" },
                ]}
              >
                <InputNumber
                  min={1}
                  max={100}
                  placeholder="Số buổi học"
                  className="w-full !rounded-button"
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                label="Số ngày trong tuần"
                name="daysOfWeek"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập số ngày trong tuần",
                  },
                  { type: "number", min: 1, max: 7, message: "Từ 1 đến 7" },
                ]}
              >
                <InputNumber
                  min={1}
                  max={7}
                  placeholder="Nhập số ngày học trong tuần"
                  className="w-full !rounded-button"
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Ngày bắt đầu"
                name="startDate"
                rules={[
                  { required: true, message: "Vui lòng chọn ngày bắt đầu" },
                ]}
              >
                <DatePicker
                  format="DD/MM/YYYY"
                  className="w-full !rounded-button"
                  placeholder="Chọn ngày bắt đầu"
                />
              </Form.Item>
            </Col>
            <Col span={8}>{/* ...các trường khác nếu có... */}</Col>
          </Row>
          <Form.Item label="Mô tả" name="description">
            <Input.TextArea
              rows={3}
              placeholder="Nhập mô tả về lớp học..."
              className="!rounded-button"
            />
          </Form.Item>
        </Form>
      </Modal>
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
      `}</style>
    </div>
  );
};

export default ClassManagementPage;
