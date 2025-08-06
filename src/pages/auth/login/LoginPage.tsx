import logo from "@/assets/logo-header.png";
import { LoginFormData, loginSchema } from "@/common/schemas/authSchemas";
import { loginUser } from "@/common/services";
import { RoleEnum } from "@/common/types";
import { ArrowRightOutlined, LockOutlined, MailOutlined } from "@ant-design/icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Alert, Button, Card, Form, Input, message, Space, Typography } from "antd";
import { Controller, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

const LoginPage = () => {
	const navigate = useNavigate();
	const { mutate, isPending, error } = useMutation({
		mutationFn: loginUser,
		onSuccess: (data) => {
			console.log(data);
			message.success("Đăng nhập thành công!");
			localStorage.setItem("accessToken", data.accessToken);
			localStorage.setItem("user", JSON.stringify(data.user));
			if (data.refreshToken) {
				localStorage.setItem("refreshToken", data.refreshToken);
			}
			switch (data.user.role) {
				case RoleEnum.SUPER_ADMIN:
					navigate("/super-admin/users");
					break;
				case RoleEnum.TEACHER:
					navigate("/teacher/attendances");
					break;
				case RoleEnum.STUDENT:
					navigate("/student/attendances");
					break;
				default:
					throw new Error("Vai trò không hợp lệ");
			}
		},
		onError: (err: any) => {
			message.error(err?.message || "Đăng nhập thất bại. Vui lòng thử lại!");
		},
	});

	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm<LoginFormData>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	const onSubmit = (data: LoginFormData) => {
		mutate({
			email: data.email,
			password: data.password,
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
						Đăng nhập
					</Title>
					<Text style={{ color: "#595959" }}>Truy cập tài khoản để tiếp tục học tập</Text>
				</div>
			}
			style={{ boxShadow: "0 8px 24px rgba(0,0,0,0.15)", borderRadius: 8 }}
		>
			<Form layout="vertical" onFinish={handleSubmit(onSubmit)} style={{ padding: "24px" }}>
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
								placeholder="Nhập mật khẩu của bạn"
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
								Đăng nhập
								<ArrowRightOutlined />
							</Space>
						)}
					</Button>
				</Form.Item>

				<div style={{ textAlign: "center", marginBottom: 16 }}>
					<Text style={{ color: "#595959" }}>
						Chưa có tài khoản?{" "}
						<Link to="/register" style={{ color: "#1890ff", fontWeight: 500 }}>
							Đăng ký ngay
						</Link>
					</Text>
				</div>

				<div style={{ textAlign: "center", marginBottom: 16 }}>
					<Text style={{ color: "#595959" }}>
						<Link to="/forgot-password" style={{ color: "#1890ff", fontWeight: 500 }}>
							Quên mật khẩu?
						</Link>
					</Text>
				</div>

				<div style={{ textAlign: "center", fontSize: 12, color: "#8c8c8c" }}>
					<Text>Bằng việc đăng nhập, bạn đồng ý với</Text>
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

export default LoginPage;
