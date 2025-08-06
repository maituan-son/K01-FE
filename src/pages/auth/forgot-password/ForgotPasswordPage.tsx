// src/pages/auth/forgot-password/ForgotPasswordPage.tsx
import { useMutation } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { forgotPassword } from "@/common/services";
import { Form, Input, Button, Card, Typography, Space, Alert, message } from "antd";
import { MailOutlined, ArrowRightOutlined, BookOutlined } from "@ant-design/icons";
import { ForgotPasswordFormData, forgotPasswordSchema } from "@/common/schemas/authSchemas";

const { Title, Text } = Typography;

const ForgotPasswordPage = () => {
	const { mutate, isPending, error } = useMutation({
		mutationFn: forgotPassword,
		onSuccess: () => {
			message.success("Đã gửi email khôi phục mật khẩu. Vui lòng kiểm tra hộp thư!");
		},
		onError: (err: any) => {
			message.error(err?.message || "Gửi yêu cầu thất bại. Vui lòng thử lại!");
		},
	});

	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm<ForgotPasswordFormData>({
		resolver: zodResolver(forgotPasswordSchema),
		defaultValues: { email: "" },
	});

	const onSubmit = (data: ForgotPasswordFormData) => {
		mutate({ email: data.email });
	};

	return (
		<Card
			title={
				<div style={{ textAlign: "center", padding: 24 }}>
					<div
						style={{
							width: 64,
							height: 64,
							background: "var(--gradient)",
							borderRadius: 16,
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							margin: "0 auto",
							marginBottom: 16,
							marginTop: 16,
						}}
					>
						<BookOutlined style={{ fontSize: 32, color: "#fff" }} />
					</div>
					<Title level={3} style={{ marginBottom: 8, color: "#1f1f1f" }}>
						Quên mật khẩu
					</Title>
					<Text style={{ color: "#595959" }}>Nhập email để khôi phục tài khoản</Text>
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
								Gửi yêu cầu
								<ArrowRightOutlined />
							</Space>
						)}
					</Button>
				</Form.Item>

				<div style={{ textAlign: "center", marginBottom: 16 }}>
					<Text style={{ color: "#595959" }}>
						Quay lại{" "}
						<Link to="/login" style={{ color: "#1890ff", fontWeight: 500 }}>
							Đăng nhập
						</Link>
					</Text>
				</div>
			</Form>
		</Card>
	);
};

export default ForgotPasswordPage;
