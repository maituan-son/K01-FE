import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Table,
  Button,
  Input,
  Modal,
  Form,
  Select,
  Popconfirm,
  message,
  Row,
  Col,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import {
  getAllUsers,
  createUser,
  updateRole,
  blockUser,
} from "../../common/services/userService";
import { getAllMajors } from "../../common/services/majorServices";
import User from "../../common/types/User";
import { RoleEnum } from "../../common/types";

const { Option } = Select;

const UserManagementPage: React.FC = () => {
  const [search, setSearch] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [selectedRole, setSelectedRole] = useState<string>();
  const [form] = Form.useForm();
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });

  const queryClient = useQueryClient();

  // Query users
  const { data: users = [], isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: () => getAllUsers(),
  });

  const { data: majors = [] } = useQuery({
    queryKey: ["majors"],
    queryFn: () => getAllMajors(),
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      message.success("Tạo người dùng thành công");
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, values }: { id: string; values: Partial<User> }) => {
      if (!values.role) {
        return Promise.reject(new Error("Vai trò không hợp lệ"));
      }
      return updateRole(id, values.role);
    },
    onSuccess: () => {
      message.success("Cập nhật thành công");
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error: any) => {
      message.error(error.message || "Cập nhật thất bại");
    },
  });

  const blockMutation = useMutation({
    mutationFn: ({ id, isBlocked }: { id: string; isBlocked: boolean }) =>
      blockUser(id, { isBlocked }),
    onSuccess: (_, { isBlocked }) => {
      message.success(
        isBlocked ? "Đã khóa người dùng" : "Đã mở khóa người dùng"
      );
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  // Filter and paginate users
  const filteredUsers = users.filter(
    (u: User) =>
      u.fullname?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase()) ||
      u.username?.toLowerCase().includes(search.toLowerCase())
  );
  const pagedUsers = filteredUsers.slice(
    (pagination.current - 1) * pagination.pageSize,
    pagination.current * pagination.pageSize
  );

  // Handlers
  const handleAdd = () => {
    setEditingUser(null);
    form.resetFields();
    setSelectedRole(undefined);
    setModalVisible(true);
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    form.setFieldsValue(user);
    setSelectedRole(user.role);
    setModalVisible(true);
  };

  const handleBlockToggle = (user: User) => {
    blockMutation.mutate({ id: user._id, isBlocked: !user.isBlocked });
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      // Nếu là teacher thì xóa majorId khỏi values
      if (values.role === "teacher") {
        delete values.majorId;
      }
      if (editingUser) {
        updateMutation.mutate({ id: editingUser._id, values });
      } else {
        createMutation.mutate(values);
      }
      setModalVisible(false);
    } catch (error) {
      message.error("Vui lòng kiểm tra lại thông tin nhập.");
    }
  };

  const handleTableChange = (pag: any) => {
    setPagination(pag);
  };

  const columns = [
    { title: "Họ tên", dataIndex: "fullname", key: "fullname" },
    { title: "Username", dataIndex: "username", key: "username" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Vai trò", dataIndex: "role", key: "role" },
    { title: "Năm học", dataIndex: "schoolYear", key: "schoolYear" },
    { title: "Mã SV", dataIndex: "studentId", key: "studentId" },
    {
      title: "Trạng thái",
      dataIndex: "isBlocked",
      key: "isBlocked",
      render: (isBlocked: boolean) =>
        isBlocked ? (
          <span style={{ color: "red" }}>Đã khóa</span>
        ) : (
          <span style={{ color: "green" }}>Hoạt động</span>
        ),
    },
    {
      title: "Chuyên ngành",
      dataIndex: "majorId",
      key: "majorId",
      render: (majorId: string) => {
        const major = majors.find((m: any) => m._id === majorId);
        return <span>{major ? major.name : ""}</span>;
      },
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_: any, record: User) => (
        <>
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Popconfirm
            title={
              record.isBlocked
                ? "Mở khóa người dùng này?"
                : "Khóa người dùng này?"
            }
            onConfirm={() => handleBlockToggle(record)}
          >
            <Button
              icon={record.isBlocked ? <PlusOutlined /> : <DeleteOutlined />}
              danger={!record.isBlocked}
              style={{ marginLeft: 8 }}
            >
              {record.isBlocked ? "Mở khóa" : "Khóa"}
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16, display: "flex", gap: 8 }}>
        <Input
          placeholder="Tìm kiếm tên, email, username..."
          prefix={<SearchOutlined />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: 300 }}
        />
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          Thêm người dùng
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={pagedUsers}
        rowKey="_id"
        loading={isLoading}
        pagination={{
          ...pagination,
          total: filteredUsers.length,
        }}
        onChange={handleTableChange}
      />
      <Modal
        title={editingUser ? "Sửa người dùng" : "Thêm người dùng"}
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={() => setModalVisible(false)}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="fullname"
                label="Họ tên"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="username"
                label="Username"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="email"
                label="Email"
                rules={[{ required: true, type: "email" }]}
              >
                <Input />
              </Form.Item>
              {!editingUser && (
                <Form.Item
                  name="password"
                  label="Mật khẩu"
                  rules={[{ required: true }]}
                >
                  <Input.Password />
                </Form.Item>
              )}
            </Col>
            <Col span={12}>
              <Form.Item
                name="role"
                label="Vai trò"
                rules={[{ required: true }]}
              >
                <Select onChange={(value) => setSelectedRole(value)}>
                  {Object.values(RoleEnum).map((role) => (
                    <Option key={role} value={role}>
                      {role}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item name="schoolYear" label="Năm học">
                <Input />
              </Form.Item>
              <Form.Item name="studentId" label="Mã SV">
                <Input />
              </Form.Item>
              <Form.Item name="phone" label="Số điện thoại">
                <Input />
              </Form.Item>
              {selectedRole !== "teacher" && (
                <Form.Item name="majorId" label="Chuyên ngành">
                  <Select placeholder="Chọn chuyên ngành">
                    {majors.map((major: any) => (
                      <Option key={major._id} value={major._id}>
                        {major.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              )}
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default UserManagementPage;
