import { Card, Typography } from "antd";
import { BookOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

const { Title, Text, Paragraph } = Typography;

const PrivacyPage = () => {
	return (
		<>
			<div
				style={{
					maxWidth: 800,
					margin: "24px auto",
					padding: "32px",
					background: "#fff",
					borderRadius: 8,
				}}
			>
				<div style={{ textAlign: "center", marginBottom: 32 }}>
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
						}}
					>
						<BookOutlined style={{ fontSize: 32, color: "#fff" }} />
					</div>
					<Title level={3} style={{ marginBottom: 8, color: "#1f1f1f" }}>
						Chính sách bảo mật
					</Title>
					<Text style={{ color: "#595959" }}>Thông tin về cách CodeFarm bảo vệ dữ liệu của bạn</Text>
				</div>
				<div style={{ padding: "24px" }}>
					<Paragraph>
						Tại <strong>CodeFarm</strong>, chúng tôi cam kết bảo vệ quyền riêng tư và dữ liệu cá nhân của học viên,
						giảng viên, và người dùng. Chính sách bảo mật này giải thích cách chúng tôi thu thập, sử dụng, lưu trữ, và
						bảo vệ thông tin của bạn khi bạn sử dụng các dịch vụ của chúng tôi, bao gồm website, ứng dụng, và các khóa
						học lập trình.
					</Paragraph>

					<Title level={4}>1. Thông tin chúng tôi thu thập</Title>
					<Paragraph>
						Chúng tôi thu thập các thông tin sau:
						<ul>
							<li>
								<strong>Thông tin cá nhân</strong>: Họ tên, email, số điện thoại, và các thông tin bạn cung cấp khi đăng
								ký tài khoản hoặc tham gia khóa học.
							</li>
							<li>
								<strong>Thông tin học tập</strong>: Tiến độ học tập, bài tập, điểm số, và tương tác của bạn với nội dung
								khóa học.
							</li>
							<li>
								<strong>Dữ liệu kỹ thuật</strong>: Địa chỉ IP, loại trình duyệt, thiết bị, và thông tin truy cập khi bạn
								sử dụng website hoặc ứng dụng.
							</li>
						</ul>
					</Paragraph>

					<Title level={4}>2. Cách chúng tôi sử dụng thông tin</Title>
					<Paragraph>
						Thông tin của bạn được sử dụng để:
						<ul>
							<li>Cung cấp và quản lý các khóa học lập trình, bao gồm đăng ký, điểm danh, và cấp chứng chỉ.</li>
							<li>Cá nhân hóa trải nghiệm học tập, đề xuất nội dung phù hợp.</li>
							<li>Cải thiện dịch vụ, phân tích dữ liệu để nâng cao chất lượng giảng dạy.</li>
							<li>Gửi thông báo về khóa học, cập nhật, hoặc chương trình khuyến mãi (nếu bạn đồng ý).</li>
						</ul>
					</Paragraph>

					<Title level={4}>3. Chia sẻ thông tin</Title>
					<Paragraph>
						Chúng tôi không bán hoặc chia sẻ thông tin cá nhân của bạn với bên thứ ba, trừ các trường hợp:
						<ul>
							<li>Được sự đồng ý của bạn.</li>
							<li>Cần thiết để tuân thủ pháp luật hoặc bảo vệ quyền lợi của CodeFarm.</li>
							<li>
								Với các đối tác cung cấp dịch vụ (như thanh toán, lưu trữ), nhưng chỉ giới hạn trong phạm vi cần thiết
								và có thỏa thuận bảo mật.
							</li>
						</ul>
					</Paragraph>

					<Title level={4}>4. Bảo mật thông tin</Title>
					<Paragraph>
						Chúng tôi áp dụng các biện pháp bảo mật tiên tiến, bao gồm mã hóa SSL, để bảo vệ dữ liệu của bạn. Tuy nhiên,
						không có hệ thống nào an toàn tuyệt đối, và chúng tôi khuyến nghị bạn sử dụng mật khẩu mạnh và không chia sẻ
						thông tin tài khoản.
					</Paragraph>

					<Title level={4}>5. Quyền của bạn</Title>
					<Paragraph>
						Bạn có quyền:
						<ul>
							<li>Yêu cầu truy cập, chỉnh sửa, hoặc xóa thông tin cá nhân của mình.</li>
							<li>Từ chối nhận email tiếp thị.</li>
							<li>
								Liên hệ với chúng tôi qua <a href="mailto:support@codefarm.edu.vn">support@codefarm.edu.vn</a> để thực
								hiện các quyền này.
							</li>
						</ul>
					</Paragraph>

					<Title level={4}>6. Thay đổi chính sách</Title>
					<Paragraph>
						CodeFarm có quyền cập nhật chính sách bảo mật này. Mọi thay đổi sẽ được thông báo qua email hoặc trên
						website của chúng tôi.
					</Paragraph>

					<Title level={4}>7. Liên hệ</Title>
					<Paragraph>
						Nếu bạn có câu hỏi về chính sách bảo mật, vui lòng liên hệ:
						<ul>
							<li>
								Email: <a href="mailto:support@codefarm.edu.vn">support@codefarm.edu.vn</a>
							</li>
							<li>Địa chỉ: Công ty cổ phần công nghệ và giáo dục CodeFarm, Kim Hoàng, Sơn Đồng, TP.Hà Nội</li>
						</ul>
					</Paragraph>

					<div style={{ textAlign: "center", marginTop: 24 }}>
						<Text style={{ color: "#595959" }}>
							Quay lại{" "}
							<Link to="/login" style={{ color: "#1890ff", fontWeight: 500 }}>
								Đăng nhập
							</Link>{" "}
							hoặc{" "}
							<Link to="/register" style={{ color: "#1890ff", fontWeight: 500 }}>
								Đăng ký
							</Link>
						</Text>
					</div>
				</div>
			</div>
		</>
	);
};

export default PrivacyPage;
