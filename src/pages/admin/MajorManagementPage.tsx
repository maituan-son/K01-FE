import { createMajor, deleteMajor, getAllMajors, restoreMajor, updateMajor } from "@/common/services";
import { Major } from "@/common/types/Major";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Form, Input, message, Modal, Popconfirm, Space, Table, Tag } from "antd";
import { useState } from "react";

const MajorManagementPage = () => {
	const queryClient = useQueryClient();
	const [modalOpen, setModalOpen] = useState(false);
	const [editingMajor, setEditingMajor] = useState<Major | null>(null);
	const [form] = Form.useForm();

	// Query danh sách chuyên ngành
	const { data: majors = [], isLoading } = useQuery({
		queryKey: ["majors"],
		queryFn: () => getAllMajors({ includeDeleted: true }),
	});

	// Mutation thêm mới
	const createMutation = useMutation({
		mutationFn: createMajor,
		onSuccess: () => {
			message.success("Thêm chuyên ngành thành công");
			queryClient.invalidateQueries({ queryKey: ["majors"] });
			setModalOpen(false);
			form.resetFields();
		},
		onError: () => message.error("Thêm chuyên ngành thất bại"),
	});

	// Mutation cập nhật
	const updateMutation = useMutation({
		mutationFn: ({ id, payload }: { id: string; payload: Partial<Major> }) => updateMajor(id, payload),
		onSuccess: () => {
			message.success("Cập nhật chuyên ngành thành công");
			queryClient.invalidateQueries({ queryKey: ["majors"] });
			setModalOpen(false);
			setEditingMajor(null);
			form.resetFields();
		},
		onError: () => message.error("Cập nhật chuyên ngành thất bại"),
	});

	// Mutation xóa mềm
	const deleteMutation = useMutation({
		mutationFn: deleteMajor,
		onSuccess: () => {
			message.success("Xóa chuyên ngành thành công");
			queryClient.invalidateQueries({ queryKey: ["majors"] });
		},
		onError: () => message.error("Xóa chuyên ngành thất bại"),
	});

	// Mutation khôi phục
	const restoreMutation = useMutation({
		mutationFn: restoreMajor,
		onSuccess: () => {
			message.success("Khôi phục chuyên ngành thành công");
			queryClient.invalidateQueries({ queryKey: ["majors"] });
		},
		onError: () => message.error("Khôi phục chuyên ngành thất bại"),
	});

	// Xử lý submit form
	const handleOk = () => {
		form.validateFields().then((values) => {
			if (editingMajor) {
				updateMutation.mutate({ id: editingMajor._id, payload: values });
			} else {
				createMutation.mutate(values);
			}
		});
	};

	// Xử lý mở modal sửa
	const handleEdit = (major: Major) => {
		setEditingMajor(major);
		setModalOpen(true);
		form.setFieldsValue(major);
	};

	// Xử lý mở modal thêm mới
	const handleAdd = () => {
		setEditingMajor(null);
		setModalOpen(true);
		form.resetFields();
	};

	// Cột bảng
	const columns = [
		{
			title: "Mã chuyên ngành",
			dataIndex: "code",
			key: "code",
			width: 120,
		},
		{
			title: "Tên chuyên ngành",
			dataIndex: "name",
			key: "name",
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
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			render: (_: any, record: Major) => (
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
			<h2 style={{ marginBottom: 16 }}>Quản lý chuyên ngành</h2>
			<Button type="primary" onClick={handleAdd} style={{ marginBottom: 16 }}>
				Thêm chuyên ngành
			</Button>
			<Table columns={columns} dataSource={majors} rowKey="_id" loading={isLoading} bordered />
			<Modal
				title={editingMajor ? "Cập nhật chuyên ngành" : "Thêm chuyên ngành"}
				open={modalOpen}
				onOk={handleOk}
				onCancel={() => {
					setModalOpen(false);
					setEditingMajor(null);
					form.resetFields();
				}}
				okText={editingMajor ? "Cập nhật" : "Thêm mới"}
				cancelText="Hủy"
				destroyOnClose
			>
				<Form form={form} layout="vertical" initialValues={{ name: "", description: "", code: "" }}>
					<Form.Item
						label="Mã chuyên ngành"
						name="code"
						rules={[
							{ required: true, message: "Vui lòng nhập mã chuyên ngành" },
							{ pattern: /^[A-Z]{2,}$/, message: "Chỉ nhập chữ in hoa, tối thiểu 2 ký tự" },
						]}
					>
						<Input placeholder="VD: IT, CS, SE..." maxLength={10} />
					</Form.Item>
					<Form.Item
						label="Tên chuyên ngành"
						name="name"
						rules={[{ required: true, message: "Vui lòng nhập tên chuyên ngành" }]}
					>
						<Input placeholder="Nhập tên chuyên ngành" />
					</Form.Item>
					<Form.Item label="Mô tả" name="description" rules={[{ required: true, message: "Vui lòng nhập mô tả" }]}>
						<Input.TextArea placeholder="Nhập mô tả chuyên ngành" rows={3} />
					</Form.Item>
				</Form>
			</Modal>
		</div>
	);
};

export default MajorManagementPage;
