import React, { useState } from "react";
import { Button, Table, Modal, Form, Input, Space, Tag, Popconfirm, message, Select } from "antd";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createSubject,
  getAllSubjects,
  updateSubject,
  deleteSubject,
  restoreSubject,
} from "@/common/services/subjectService";
import { Subject } from "@/common/types/SubJect";
import { useSoftDeleteFilter } from "@/hooks/useSoftDeleteFilter";

const SubjectManagementPage = () => {
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [form] = Form.useForm();
  const { filter, setFilter, filterParams } = useSoftDeleteFilter();

  // Lấy danh sách môn học theo trạng thái lọc
  const { data: subjects = [], isLoading } = useQuery({
    queryKey: ["subjects", filter],
    queryFn: () => getAllSubjects(filterParams),
  });

  // Thêm mới
  const createMutation = useMutation({
    mutationFn: createSubject,
    onSuccess: () => {
      message.success("Thêm môn học thành công");
      queryClient.invalidateQueries({ queryKey: ["subjects"] });
      setModalOpen(false);
      form.resetFields();
    },
    onError: () => message.error("Thêm môn học thất bại"),
  });

  // Sửa
  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<Subject> }) =>
      updateSubject(id, payload),
    onSuccess: () => {
      message.success("Cập nhật môn học thành công");
      queryClient.invalidateQueries({ queryKey: ["subjects"] });
      setModalOpen(false);
      setEditingSubject(null);
      form.resetFields();
    },
    onError: () => message.error("Cập nhật môn học thất bại"),
  });

  // Xóa mềm
  const deleteMutation = useMutation({
    mutationFn: deleteSubject,
    onSuccess: () => {
      message.success("Xóa môn học thành công");
      queryClient.invalidateQueries({ queryKey: ["subjects"] });
    },
    onError: () => message.error("Xóa môn học thất bại"),
  });

  // Khôi phục
  const restoreMutation = useMutation({
    mutationFn: restoreSubject,
    onSuccess: () => {
      message.success("Khôi phục môn học thành công");
      queryClient.invalidateQueries({ queryKey: ["subjects"] });
    },
    onError: () => message.error("Khôi phục môn học thất bại"),
  });

  // Xử lý submit form
  const handleOk = () => {
    form.validateFields().then((values) => {
      if (editingSubject) {
        updateMutation.mutate({ id: editingSubject._id, payload: values });
      } else {
        createMutation.mutate(values);
      }
    });
  };

  // Mở modal sửa
  const handleEdit = (subject: Subject) => {
    setEditingSubject(subject);
    setModalOpen(true);
    form.setFieldsValue(subject);
  };

  // Mở modal thêm mới
  const handleAdd = () => {
    setEditingSubject(null);
    setModalOpen(true);
    form.resetFields();
  };

  // Cột bảng
  const columns = [
    {
      title: "Mã môn học",
      dataIndex: "code",
      key: "code",
      width: 120,
    },
    {
      title: "Tên môn học",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Tên tiếng Anh",
      dataIndex: "englishName",
      key: "englishName",
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Trạng thái",
      dataIndex: "deletedAt",
      key: "deletedAt",
      width: 120,
      render: (deletedAt: string | null) =>
        deletedAt ? <Tag color="red">Đã xóa</Tag> : <Tag color="green">Hoạt động</Tag>,
    },
    {
      title: "Hành động",
      key: "action",
      width: 200,
      render: (_: any, record: Subject) => (
        <Space>
          <Button type="link" onClick={() => handleEdit(record)} disabled={!!record.deletedAt}>
            Sửa
          </Button>
          {!record.deletedAt ? (
            <Popconfirm
              title="Bạn chắc chắn muốn xóa?"
              onConfirm={() => deleteMutation.mutate(record._id)}
              okText="Xóa"
              cancelText="Hủy"
            >
              <Button type="link" danger>
                Xóa
              </Button>
            </Popconfirm>
          ) : (
            <Button type="link" onClick={() => restoreMutation.mutate(record._id)}>
              Khôi phục
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div>
      <h2 style={{ marginBottom: 16 }}>Quản lý môn học</h2>
      <Space style={{ marginBottom: 16 }}>
        <Button type="primary" onClick={handleAdd}>
          Thêm môn học
        </Button>
        <Select
          value={filter}
          onChange={setFilter}
          style={{ width: 160 }}
          options={[
            { value: "all", label: "Tất cả" },
            { value: "active", label: "Hoạt động" },
            { value: "deleted", label: "Đã xóa mềm" },
          ]}
        />
      </Space>
      <Table columns={columns} dataSource={subjects} rowKey="_id" loading={isLoading} bordered />
      <Modal
        title={editingSubject ? "Cập nhật môn học" : "Thêm môn học"}
        open={modalOpen}
        onOk={handleOk}
        onCancel={() => {
          setModalOpen(false);
          setEditingSubject(null);
          form.resetFields();
        }}
        okText={editingSubject ? "Cập nhật" : "Thêm mới"}
        cancelText="Hủy"
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Mã môn học"
            name="code"
            rules={[{ required: true, message: "Vui lòng nhập mã môn học" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Tên môn học"
            name="name"
            rules={[{ required: true, message: "Vui lòng nhập tên môn học" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Tên tiếng Anh"
            name="englishName"
            rules={[{ required: true, message: "Vui lòng nhập tên tiếng Anh" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="Mô tả" name="description">
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default SubjectManagementPage;
