import { BookOutlined } from "@ant-design/icons";
import { Card, Typography } from "antd";
import { Link } from "react-router-dom";

const { Title, Text, Paragraph } = Typography;

const TermsPage = () => {
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
						Điều khoản sử dụng
					</Title>
					<Text style={{ color: "#595959" }}>Quy định khi sử dụng dịch vụ của CodeFarm</Text>
				</div>

				<div style={{ padding: "24px" }}>
					<Paragraph>
						Chào mừng bạn đến với <strong>CodeFarm</strong>, trung tâm đào tạo lập trình viên số một. Khi sử dụng
						website, ứng dụng, hoặc các dịch vụ của chúng tôi, bạn đồng ý tuân thủ các điều khoản sử dụng dưới đây. Vui
						lòng đọc kỹ trước khi sử dụng.
					</Paragraph>

					<Title level={4}>1. Chấp nhận điều khoản</Title>
					<Paragraph>
						Bằng việc đăng ký tài khoản, truy cập website, hoặc tham gia khóa học, bạn xác nhận đã đọc, hiểu, và đồng ý
						với các điều khoản này. Nếu bạn không đồng ý, vui lòng không sử dụng dịch vụ của chúng tôi.
					</Paragraph>

					<Title level={4}>2. Sử dụng dịch vụ</Title>
					<Paragraph>
						Bạn đồng ý:
						<ul>
							<li>Cung cấp thông tin chính xác khi đăng ký và tham gia khóa học.</li>
							<li>Không sử dụng dịch vụ cho các mục đích bất hợp pháp, lừa đảo, hoặc gây hại.</li>
							<li>Không sao chép, phân phối, hoặc sửa đổi nội dung khóa học mà không có sự cho phép của CodeFarm.</li>
							<li>Tuân thủ các quy định về bản quyền và sở hữu trí tuệ của nội dung học tập.</li>
						</ul>
					</Paragraph>

					<Title level={4}>3. Tài khoản và bảo mật</Title>
					<Paragraph>
						<ul>
							<li>Bạn chịu trách nhiệm bảo mật thông tin tài khoản, bao gồm email và mật khẩu.</li>
							<li>
								Thông báo ngay cho CodeFarm qua <a href="mailto:support@codefarm.edu.vn">support@codefarm.edu.vn</a> nếu
								phát hiện truy cập trái phép.
							</li>
							<li>CodeFarm không chịu trách nhiệm cho các thiệt hại do bạn tiết lộ thông tin tài khoản.</li>
						</ul>
					</Paragraph>

					<Title level={4}>4. Thanh toán và hoàn tiền</Title>
					<Paragraph>
						<ul>
							<li>
								Các khóa học có thể yêu cầu thanh toán học phí. Thông tin thanh toán sẽ được cung cấp rõ ràng trước khi
								đăng ký.
							</li>
							<li>
								Chính sách hoàn tiền (nếu có) sẽ được thông báo trong từng khóa học. Vui lòng liên hệ{" "}
								<a href="mailto:support@codefarm.edu.vn">support@codefarm.edu.vn</a> để biết thêm chi tiết.
							</li>
						</ul>
					</Paragraph>

					<Title level={4}>5. Chấm dứt dịch vụ</Title>
					<Paragraph>
						CodeFarm có quyền tạm ngưng hoặc chấm dứt tài khoản của bạn nếu:
						<ul>
							<li>Bạn vi phạm điều khoản sử dụng.</li>
							<li>Có hành vi gây hại đến hệ thống hoặc người dùng khác.</li>
							<li>Cần thiết để tuân thủ pháp luật.</li>
						</ul>
					</Paragraph>

					<Title level={4}>6. Giới hạn trách nhiệm</Title>
					<Paragraph>
						CodeFarm không chịu trách nhiệm cho:
						<ul>
							<li>Các thiệt hại gián tiếp, ngẫu nhiên, hoặc do sử dụng sai dịch vụ.</li>
							<li>Các gián đoạn dịch vụ do lỗi kỹ thuật hoặc bảo trì.</li>
						</ul>
					</Paragraph>

					<Title level={4}>7. Thay đổi điều khoản</Title>
					<Paragraph>
						CodeFarm có quyền cập nhật điều khoản sử dụng này. Mọi thay đổi sẽ được thông báo qua email hoặc trên
						website.
					</Paragraph>

					<Title level={4}>8. Liên hệ</Title>
					<Paragraph>
						Nếu bạn có câu hỏi về điều khoản sử dụng, vui lòng liên hệ:
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

export default TermsPage;
