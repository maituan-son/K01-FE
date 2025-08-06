import { RouteObject } from "react-router-dom";
import { RoleEnum } from "../common/types";
import AdminLayout from "../components/layouts/AdminLayout";
import ProtectedRoute from "./components/ProtectedRoute";

import UserManagermentPage from "../pages/admin/UserManagementPage";
import MajorManagermentPage from "../pages/admin/MajorManagementPage";
import SubjectManagermentPage from "../pages/admin/SubjectManagementPage";
import ClassManagermentPage from "../pages/admin/ClassManagementPage";

const adminRoutes: RouteObject[] = [
	// * SuperAdmin Routes (Phòng đào tạo)
	{
		path: "/super-admin",
		element: (
			<ProtectedRoute allowedRoles={[RoleEnum.SUPER_ADMIN]}>
				<AdminLayout />
			</ProtectedRoute>
		),
		children: [
			{
				path: "users",
				element: <UserManagermentPage />,
			},
			{
				path: "majors",
				element: <MajorManagermentPage />,
			},
			{
				path: "subjects",
				element: <SubjectManagermentPage />,
			},
			{
				path: "classes",
				element: <ClassManagermentPage />,
			},
		],
	},
];

export default adminRoutes;
