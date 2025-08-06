import { Typography, Button, Row, Col, Space } from "antd";
import { BookOutlined, ArrowRightOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

const { Title, Text, Paragraph } = Typography;

const HomePage = () => {
	return (
		<div
			style={{
				minHeight: "100vh",
			}}
		>
			{/* Hero Section */}
			<div
				style={{
					maxWidth: 1200,
					margin: "24px auto",
					padding: "48px 24px",
					background: "#fff",
					borderRadius: 8,
					textAlign: "center",
				}}
			>
				<div
					style={{
						width: 80,
						height: 80,
						background: "var(--gradient)",
						borderRadius: 16,
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						margin: "0 auto",
						marginBottom: 24,
					}}
				>
					<BookOutlined style={{ fontSize: 40, color: "#fff" }} />
				</div>
				<Title level={2} style={{ color: "#1f1f1f", marginBottom: 16 }}>
					Chào mừng đến với CodeFarm
				</Title>
				<Paragraph style={{ color: "#595959", fontSize: 18, marginBottom: 24 }}>
					Trung tâm đào tạo lập trình viên số một, mang đến các khóa học thực chiến và cơ hội nghề nghiệp trong ngành
					công nghệ.
				</Paragraph>
				<Button type="primary" size="large" style={{ background: "var(--gradient)", border: "none" }}>
					<Link to="/register" style={{ color: "#fff" }}>
						Bắt đầu học ngay <ArrowRightOutlined />
					</Link>
				</Button>
			</div>

			{/* About Section */}
			<div
				style={{
					maxWidth: 1200,
					margin: "24px auto",
					padding: "24px",
					background: "#fff",
					borderRadius: 8,
				}}
			>
				<Title level={3} style={{ color: "#1f1f1f", marginBottom: 16 }}>
					Về CodeFarm
				</Title>
				<Paragraph style={{ color: "#595959" }}>
					CodeFarm được thành lập với sứ mệnh đào tạo thế hệ lập trình viên trẻ, giúp họ nắm vững kỹ năng thực tế và sẵn
					sàng gia nhập ngành công nghệ. Chúng tôi cung cấp các khóa học từ cơ bản đến nâng cao, được thiết kế bởi các
					chuyên gia hàng đầu.
				</Paragraph>
				<Link to="/about" style={{ color: "#1890ff", fontWeight: 500 }}>
					Tìm hiểu thêm
				</Link>
			</div>

			{/* Benefits Section */}
			<div
				style={{
					maxWidth: 1200,
					margin: "24px auto",
					padding: "24px",
					background: "#fff",
					borderRadius: 8,
				}}
			>
				<Title level={3} style={{ color: "#1f1f1f", marginBottom: 24, textAlign: "center" }}>
					Tại sao chọn CodeFarm?
				</Title>
				<Row gutter={[16, 16]}>
					<Col span={24} md={8}>
						<div style={{ padding: "16px", textAlign: "center" }}>
							<Title level={4} style={{ color: "#1f1f1f" }}>
								Khóa học thực chiến
							</Title>
							<Text style={{ color: "#595959" }}>Học qua dự án thực tế, áp dụng ngay vào công việc.</Text>
						</div>
					</Col>
					<Col span={24} md={8}>
						<div style={{ padding: "16px", textAlign: "center" }}>
							<Title level={4} style={{ color: "#1f1f1f" }}>
								Giảng viên chuyên gia
							</Title>
							<Text style={{ color: "#595959" }}>Được hướng dẫn bởi các lập trình viên giàu kinh nghiệm.</Text>
						</div>
					</Col>
					<Col span={24} md={8}>
						<div style={{ padding: "16px", textAlign: "center" }}>
							<Title level={4} style={{ color: "#1f1f1f" }}>
								Hỗ trợ nghề nghiệp
							</Title>
							<Text style={{ color: "#595959" }}>Kết nối với các công ty công nghệ hàng đầu.</Text>
						</div>
					</Col>
				</Row>
			</div>

			{/* CTA Section */}
			<div
				style={{
					maxWidth: 1200,
					margin: "24px auto",
					padding: "48px 24px",
					background: "#fff",
					borderRadius: 8,
					textAlign: "center",
				}}
			>
				<Title level={3} style={{ color: "#1f1f1f", marginBottom: 16 }}>
					Bắt đầu hành trình lập trình của bạn!
				</Title>
				<Paragraph style={{ color: "#595959", marginBottom: 24 }}>
					Tham gia CodeFarm ngay hôm nay để học các kỹ năng lập trình hiện đại và xây dựng sự nghiệp trong ngành công
					nghệ.
				</Paragraph>
				<Space>
					<Button type="primary" size="large" style={{ background: "var(--gradient)", border: "none" }}>
						<Link to="/register" style={{ color: "#fff" }}>
							Đăng ký ngay
						</Link>
					</Button>
					<Button size="large">
						<Link to="/contact" style={{ color: "#1890ff" }}>
							Liên hệ với chúng tôi
						</Link>
					</Button>
				</Space>
			</div>
		</div>
	);
};

export default HomePage;
