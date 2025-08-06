import logoSquare from "@/assets/logo-square.png";
import { CheckCircleOutlined } from "@ant-design/icons";
import { Card, Layout, List, Space, Typography } from "antd";
import { Outlet } from "react-router-dom";

const { Content } = Layout;
const { Title, Text } = Typography;

const AuthLayout = () => {
	const benefits = [
		"Truy cập miễn phí các khóa học cơ bản",
		"Tham gia cộng đồng học viên",
		"Nhận chứng chỉ hoàn thành khóa học",
		"Hỗ trợ từ giảng viên 24/7",
	];

	return (
		<Layout style={{ minHeight: "100vh", background: "linear-gradient(135deg, #f0f5ff, #ffffff, #f0f5ff)" }}>
			<Content style={{ padding: "32px 16px" }}>
				<div style={{ maxWidth: 1200, margin: "0 auto" }}>
					<div
						style={{
							display: "flex",
							flexWrap: "wrap",
							alignItems: "center",
							minHeight: "calc(100vh - 64px)",
							gap: "32px",
						}}
					>
						{/* Left side - Benefits */}
						<div style={{ flex: "1 1 400px", display: "flex", flexDirection: "column", gap: "24px" }}>
							<Space align="center">
								<div
									style={{
										width: 80,
										borderRadius: 12,
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
									}}
								>
									<img
										src={logoSquare}
										alt="CodeFarm Logo"
										style={{
											width: "100%",
											borderRadius: 8,
											marginRight: 8,
										}}
									/>
								</div>
								<div>
									<Title level={2} style={{ margin: 0, color: "#112F85" }}>
										CodeFarm
									</Title>
									<Text style={{ color: "#595959" }}>Nền tảng học lập trình hàng đầu</Text>
								</div>
							</Space>

							<div style={{ marginTop: 24 }}>
								<Title level={3} style={{ color: "#1f1f1f" }}>
									Bắt đầu hành trình học lập trình của bạn
								</Title>
								<Text style={{ color: "#595959", fontSize: 16 }}>
									Tham gia cùng hàng nghìn học viên đã thành công trong việc học lập trình
								</Text>
							</div>

							<List
								dataSource={benefits}
								renderItem={(item) => (
									<List.Item>
										<Space>
											<CheckCircleOutlined style={{ color: "#52c41a" }} />
											<Text style={{ color: "#434343" }}>{item}</Text>
										</Space>
									</List.Item>
								)}
							/>

							<Card
								style={{
									background: "var(--gradient)",
									borderRadius: 16,
								}}
							>
								<Title level={4} style={{ color: "#fff", marginBottom: 8 }}>
									Ưu đãi đặc biệt!
								</Title>
								<Text style={{ color: "#e6f7ff" }}>
									Đăng ký ngay hôm nay để nhận 30 ngày học thử miễn phí các khóa học premium
								</Text>
							</Card>
						</div>

						{/* Right side - Auth Content */}
						<div style={{ flex: "1 1 400px", maxWidth: 400, margin: "0 auto" }}>
							<Outlet />
						</div>
					</div>
				</div>
			</Content>
		</Layout>
	);
};

export default AuthLayout;
