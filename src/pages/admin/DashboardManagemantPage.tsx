// The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work.
import React, { useState } from "react";
import {
  Card,
  Button,
  Avatar,
  Dropdown,
  Menu,
  Badge,
  Statistic,
  Row,
  Col,
} from "antd";
import {
  DashboardOutlined,
  BookOutlined,
  UserOutlined,
  CalendarOutlined,
  BarChartOutlined,
  SettingOutlined,
  BellOutlined,
  MenuOutlined,
  LogoutOutlined,
  TeamOutlined,
  HomeOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";

const userMenu = (
  <Menu>
    <Menu.Item key="profile" icon={<UserOutlined />}>
      Thông tin cá nhân
    </Menu.Item>
    <Menu.Item key="settings" icon={<SettingOutlined />}>
      Cài đặt
    </Menu.Item>
    <Menu.Divider />
    <Menu.Item key="logout" icon={<LogoutOutlined />}>
      Đăng xuất
    </Menu.Item>
  </Menu>
);

const statsData = [
  {
    title: "Lớp học",
    value: 45,
    icon: <TeamOutlined style={{ color: "#1677ff" }} />,
  },
  {
    title: "Sinh viên",
    value: 1250,
    icon: <UserOutlined style={{ color: "#52c41a" }} />,
  },
  {
    title: "Giảng viên",
    value: 85,
    icon: <UserOutlined style={{ color: "#722ed1" }} />,
  },
  {
    title: "Buổi học hôm nay",
    value: 12,
    icon: <CalendarOutlined style={{ color: "#faad14" }} />,
  },
];

const recentClasses = [
  {
    id: 1,
    name: "Lập trình Web",
    teacher: "TS. Nguyễn Văn A",
    time: "08:00 - 10:00",
    room: "P201",
    status: "active",
  },
  {
    id: 2,
    name: "Cơ sở dữ liệu",
    teacher: "ThS. Trần Thị B",
    time: "10:15 - 12:15",
    room: "P105",
    status: "upcoming",
  },
  {
    id: 3,
    name: "Mạng máy tính",
    teacher: "TS. Lê Văn C",
    time: "13:30 - 15:30",
    room: "P302",
    status: "completed",
  },
];

const notifications = [
  {
    id: 1,
    title: "Thông báo nghỉ học",
    content: "Lớp Lập trình Web sẽ nghỉ học vào thứ 6 tuần này",
    time: "2 giờ trước",
  },
  {
    id: 2,
    title: "Cập nhật lịch thi",
    content: "Lịch thi cuối kỳ môn Cơ sở dữ liệu đã được cập nhật",
    time: "5 giờ trước",
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "active":
      return "success";
    case "upcoming":
      return "processing";
    case "completed":
      return "default";
    default:
      return "default";
  }
};
const getStatusText = (status: string) => {
  switch (status) {
    case "active":
      return "Đang diễn ra";
    case "upcoming":
      return "Sắp tới";
    case "completed":
      return "Đã kết thúc";
    default:
      return "";
  }
};

const DashboardManagementPage: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div style={{ minHeight: "100vh", background: "#f5f7fa" }}>
      {/* Header */}
      <div
        style={{
          background: "#fff",
          borderBottom: "1px solid #f0f0f0",
          padding: "0 32px",
          height: 64,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <Button
            type="text"
            icon={<MenuOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ fontSize: 20 }}
          />
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div
              style={{
                width: 36,
                height: 36,
                background: "#1677ff",
                borderRadius: 8,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <HomeOutlined style={{ color: "#fff", fontSize: 20 }} />
            </div>
            <span style={{ fontWeight: 700, fontSize: 20, color: "#222" }}>
              EduManage
            </span>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <Badge count={notifications.length} size="small">
            <Button
              type="text"
              icon={<BellOutlined />}
              style={{ fontSize: 20 }}
            />
          </Badge>
          <Dropdown overlay={userMenu} placement="bottomRight">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                cursor: "pointer",
                padding: "4px 12px",
                borderRadius: 8,
                transition: "background 0.2s",
              }}
            >
              <Avatar size="small" icon={<UserOutlined />} />
              <span style={{ fontWeight: 500, color: "#444" }}>Admin User</span>
            </div>
          </Dropdown>
        </div>
      </div>
      {/* Main Content */}
      <div style={{ maxWidth: 1200, margin: "32px auto" }}>
        {/* Stats */}
        <Row gutter={[24, 24]} style={{ marginBottom: 32 }}>
          {statsData.map((stat, idx) => (
            <Col xs={24} sm={12} md={6} key={idx}>
              <Card bordered={false} style={{ borderRadius: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <div style={{ fontSize: 32 }}>{stat.icon}</div>
                  <div>
                    <Statistic
                      title={stat.title}
                      value={stat.value}
                      valueStyle={{ fontWeight: 700, fontSize: 24 }}
                    />
                  </div>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
        {/* Recent Classes & Notifications */}
        <Row gutter={[24, 24]}>
          <Col xs={24} md={16}>
            <Card
              title="Lịch học hôm nay"
              bordered={false}
              style={{ borderRadius: 12, minHeight: 320 }}
            >
              {recentClasses.map((classItem) => (
                <div
                  key={classItem.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "16px 0",
                    borderBottom: "1px solid #f0f0f0",
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 16 }}>
                      {classItem.name}
                    </div>
                    <div style={{ color: "#888", fontSize: 14 }}>
                      Giảng viên: {classItem.teacher}
                    </div>
                    <div style={{ color: "#888", fontSize: 13, marginTop: 4 }}>
                      <ClockCircleOutlined /> {classItem.time} &nbsp;|&nbsp;
                      <HomeOutlined /> {classItem.room}
                    </div>
                  </div>
                  <Badge
                    status={getStatusColor(classItem.status) as any}
                    text={getStatusText(classItem.status)}
                  />
                </div>
              ))}
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card
              title="Thông báo mới"
              bordered={false}
              style={{ borderRadius: 12, minHeight: 320 }}
            >
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  style={{
                    borderBottom: "1px solid #f0f0f0",
                    padding: "12px 0",
                  }}
                >
                  <div style={{ fontWeight: 500 }}>{notification.title}</div>
                  <div style={{ color: "#888", fontSize: 13 }}>
                    {notification.content}
                  </div>
                  <div style={{ color: "#bbb", fontSize: 12 }}>
                    {notification.time}
                  </div>
                </div>
              ))}
              <Button type="link" style={{ padding: 0, marginTop: 8 }}>
                Xem tất cả thông báo
              </Button>
            </Card>
          </Col>
        </Row>
        {/* Quick Actions */}
        <Row gutter={[24, 24]} style={{ marginTop: 32 }}>
          <Col xs={24}>
            <Card
              title="Thao tác nhanh"
              bordered={false}
              style={{ borderRadius: 12 }}
            >
              <Row gutter={[16, 16]}>
                <Col xs={12} md={6}>
                  <Button
                    type="primary"
                    icon={<TeamOutlined />}
                    size="large"
                    block
                    style={{ height: 64, borderRadius: 8 }}
                  >
                    Tạo lớp mới
                  </Button>
                </Col>
                <Col xs={12} md={6}>
                  <Button
                    icon={<UserOutlined />}
                    size="large"
                    block
                    style={{ height: 64, borderRadius: 8 }}
                  >
                    Thêm sinh viên
                  </Button>
                </Col>
                <Col xs={12} md={6}>
                  <Button
                    icon={<CalendarOutlined />}
                    size="large"
                    block
                    style={{ height: 64, borderRadius: 8 }}
                  >
                    Xếp lịch học
                  </Button>
                </Col>
                <Col xs={12} md={6}>
                  <Button
                    icon={<BarChartOutlined />}
                    size="large"
                    block
                    style={{ height: 64, borderRadius: 8 }}
                  >
                    Xem báo cáo
                  </Button>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default DashboardManagementPage;
