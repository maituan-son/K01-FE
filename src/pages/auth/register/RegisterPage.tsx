import { useMutation } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, Link } from "react-router-dom";
import { RoleEnum } from "@/common/types";
import { registerSchema, RegisterFormData } from "@/common/schemas/authSchemas";
import { registerUser } from "@/common/services";
import { Form, Input, Button, Card, Typography, Space, Alert, message } from "antd";
import { MailOutlined, LockOutlined, PhoneOutlined, ArrowRightOutlined, BookOutlined } from "@ant-design/icons";
import logo from "@/assets/logo-header.png";

const { Title, Text } = Typography;

const RegisterPage = () => {
	const navigate = useNavigate();
	const { mutate, isPending, error } = useMutation({
		mutationFn: registerUser,
		onSuccess: () => {
			message.success("Đăng ký thành công! Vui lòng đăng nhập.");
			navigate("/login");
		},
		onError: (err: any) => {
			message.error(err?.message || "Đăng ký thất bại. Vui lòng thử lại!");
		},
	});

	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm<RegisterFormData>({
		resolver: zodResolver(registerSchema),
		defaultValues: {
			email: "",
			password: "",
			confirmPassword: "",
			phoneNumber: "",
			fullname: "",
			username: "",
		},
	});

	const onSubmit = (data: RegisterFormData) => {
		mutate({
			role: RoleEnum.STUDENT,
			email: data.email,
			password: data.password,
			fullname: data.fullname,
			username: data.username,
			phone: data.phoneNumber || undefined,
		});
	};

	return (
		<Card
			title={
				<div style={{ textAlign: "center", padding: 24 }}>
					<div
						style={{
							width: 160,
							height: 64,
							// background: "var(--gradient)",
							borderRadius: 16,
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							margin: "0 auto",
							marginBottom: 16,
							marginTop: 16,
						}}
					>
						<img
							src={logo}
							alt="CodeFarm Logo"
							style={{
								width: "100%",
							}}
						/>
					</div>
					<Title level={3} style={{ marginBottom: 8, color: "#1f1f1f" }}>
						Tạo tài khoản
					</Title>
					<Text style={{ color: "#595959" }}>Điền thông tin để bắt đầu học tập</Text>
				</div>
			}
			style={{ boxShadow: "0 8px 24px rgba(0,0,0,0.15)", borderRadius: 8 }}
		>
			<Form layout="vertical" onFinish={handleSubmit(onSubmit)} style={{ padding: "24px" }}>
				<Form.Item
					label={
						<Text strong style={{ color: "#434343" }}>
							Họ và tên
						</Text>
					}
					validateStatus={errors.fullname ? "error" : ""}
					help={errors.fullname?.message}
				>
					<Controller
						name="fullname"
						control={control}
						render={({ field }) => (
							<Input
								prefix={<BookOutlined style={{ color: "#bfbfbf" }} />}
								placeholder="Nhập họ và tên"
								{...field}
								style={{ height: 40 }}
							/>
						)}
					/>
				</Form.Item>
				<Form.Item
					label={
						<Text strong style={{ color: "#434343" }}>
							Email
						</Text>
					}
					validateStatus={errors.email ? "error" : ""}
					help={errors.email?.message}
				>
					<Controller
						name="email"
						control={control}
						render={({ field }) => (
							<Input
								prefix={<MailOutlined style={{ color: "#bfbfbf" }} />}
								placeholder="your.email@example.com"
								{...field}
								style={{ height: 40 }}
							/>
						)}
					/>
				</Form.Item>

				<Form.Item
					label={
						<Text strong style={{ color: "#434343" }}>
							Tên đăng nhập
						</Text>
					}
					validateStatus={errors.username ? "error" : ""}
					help={errors.username?.message}
				>
					<Controller
						name="username"
						control={control}
						render={({ field }) => (
							<Input
								prefix={<BookOutlined style={{ color: "#bfbfbf" }} />}
								placeholder="Nhập tên đăng nhập"
								{...field}
								style={{ height: 40 }}
							/>
						)}
					/>
				</Form.Item>

				<Form.Item
					label={
						<Space>
							<Text strong style={{ color: "#434343" }}>
								Số điện thoại
							</Text>
							<Text style={{ color: "#8c8c8c" }}>(tùy chọn)</Text>
						</Space>
					}
					validateStatus={errors.phoneNumber ? "error" : ""}
					help={errors.phoneNumber?.message}
				>
					<Controller
						name="phoneNumber"
						control={control}
						render={({ field }) => (
							<Input
								prefix={<PhoneOutlined style={{ color: "#bfbfbf" }} />}
								placeholder="0123 456 789"
								{...field}
								style={{ height: 40 }}
							/>
						)}
					/>
				</Form.Item>

				<Form.Item
					label={
						<Text strong style={{ color: "#434343" }}>
							Mật khẩu
						</Text>
					}
					validateStatus={errors.password ? "error" : ""}
					help={errors.password?.message}
				>
					<Controller
						name="password"
						control={control}
						render={({ field }) => (
							<Input.Password
								prefix={<LockOutlined style={{ color: "#bfbfbf" }} />}
								placeholder="Tối thiểu 8 ký tự"
								{...field}
								style={{ height: 40 }}
							/>
						)}
					/>
				</Form.Item>

				<Form.Item
					label={
						<Text strong style={{ color: "#434343" }}>
							Xác nhận mật khẩu
						</Text>
					}
					validateStatus={errors.confirmPassword ? "error" : ""}
					help={errors.confirmPassword?.message}
				>
					<Controller
						name="confirmPassword"
						control={control}
						render={({ field }) => (
							<Input.Password
								prefix={<LockOutlined style={{ color: "#bfbfbf" }} />}
								placeholder="Nhập lại mật khẩu"
								{...field}
								style={{ height: 40 }}
							/>
						)}
					/>
				</Form.Item>

				{error && <Alert message={error.message} type="error" showIcon style={{ marginBottom: 24 }} />}

				<Form.Item>
					<Button
						type="primary"
						htmlType="submit"
						loading={isPending}
						block
						style={{
							height: 40,
							background: "var(--gradient)",
							border: "none",
						}}
					>
						{isPending ? (
							"Đang xử lý..."
						) : (
							<Space>
								Tạo tài khoản
								<ArrowRightOutlined />
							</Space>
						)}
					</Button>
				</Form.Item>

				<div style={{ textAlign: "center", marginBottom: 16 }}>
					<Text style={{ color: "#595959" }}>
						Đã có tài khoản?{" "}
						<Link to="/login" style={{ color: "#1890ff", fontWeight: 500 }}>
							Đăng nhập ngay
						</Link>
					</Text>
				</div>

				<div style={{ textAlign: "center", fontSize: 12, color: "#8c8c8c" }}>
					<Text>Bằng việc đăng ký, bạn đồng ý với</Text>
					<div style={{ marginTop: 4 }}>
						<Space>
							<Link to="/terms" style={{ color: "#1890ff" }}>
								Điều khoản sử dụng
							</Link>
							<Text>và</Text>
							<Link to="/privacy" style={{ color: "#1890ff" }}>
								Chính sách bảo mật
							</Link>
						</Space>
					</div>
				</div>
			</Form>
		</Card>
	);
};

export default RegisterPage;
