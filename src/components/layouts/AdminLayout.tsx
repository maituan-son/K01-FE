import { Layout, theme } from "antd";
import { useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import HeaderBar from "../common/HeaderBar";
import ContentWrapper from "../common/ContentWrapper";
import {
  UserOutlined,
  BookOutlined,
  ApartmentOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import SiderMenu from "../common/SideBarMenu";
import BreadcrumbNav from "../common/BreadcrumNav";

const adminMenu = [
  {
    key: "/super-admin/users",
    icon: <TeamOutlined />,
    label: <Link to="/super-admin/users">Quản lý người dùng</Link>,
  },
  {
    key: "/super-admin/majors",
    icon: <ApartmentOutlined />,
    label: <Link to="/super-admin/majors">Quản lý chuyên ngành</Link>,
  },
  {
    key: "/super-admin/subjects",
    icon: <BookOutlined />,
    label: <Link to="/super-admin/subjects">Quản lý môn học</Link>,
  },
  {
    key: "/super-admin/classes",
    icon: <UserOutlined />,
    label: <Link to="/super-admin/classes">Quản lý lớp học</Link>,
  },
  {
    key: "/super-admin/dashboard",
    icon: <UserOutlined />,
    label: <Link to="/super-admin/dashboard">Dashboard</Link>,
  },
];

const getBreadcrumb = (pathname: string) => {
  const map: Record<string, string> = {
    "/super-admin/users": "Người dùng",
    "/super-admin/majors": "Chuyên ngành",
    "/super-admin/subjects": "Môn học",
    "/super-admin/classes": "Lớp học",
    "/super-admin/dashboard": "Dashboard",
  };
  const paths = pathname.split("/").filter(Boolean);
  const crumbs = [
    { path: "/super-admin", label: "Dashboard" },
    ...(paths[1]
      ? [
          {
            path: `/super-admin/${paths[1]}`,
            label: map[`/super-admin/${paths[1]}`] || paths[1],
          },
        ]
      : []),
  ];
  return crumbs;
};

const AdminLayout = () => {
  const location = useLocation();
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const selectedKeys = useMemo(() => {
    const match = adminMenu.find((item) =>
      location.pathname.startsWith(item.key)
    );
    return match ? [match.key] : [];
  }, [location.pathname]);

  const breadcrumbs = getBreadcrumb(location.pathname);

  useEffect(() => {
    document.title = "Admin Dashboard | CodeFarm";
  }, []);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <SiderMenu
        menuItems={adminMenu}
        selectedKeys={selectedKeys}
        logoText="CodeFarm Admin"
      />
      <Layout>
        <HeaderBar />
        <div
          style={{ padding: "16px 24px 0 24px", background: colorBgContainer }}
        >
          <BreadcrumbNav items={breadcrumbs} />
          <ContentWrapper bgColor={colorBgContainer} />
        </div>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
