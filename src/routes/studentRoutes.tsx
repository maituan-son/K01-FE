import { RouteObject } from "react-router-dom";
import { RoleEnum } from "../common/types";
import ProtectedRoute from "./components/ProtectedRoute";
import StudentLayout from "../components/layouts/StudentLayout";
import StudentAttendancePage from "../pages/student/StudentAttendancePage";
import ClassOfStudentPage from "../pages/student/ClassOfStudentPage";

const studentRoutes: RouteObject[] = [
	// * Student Routes (Sinh viên)
	{
		path: "/student",
		element: (
			// Sau này sẽ chỉnh sửa chỉ cho sinh viên truy cập
			<ProtectedRoute allowedRoles={[RoleEnum.STUDENT, RoleEnum.SUPER_ADMIN, RoleEnum.TEACHER]}>
				<StudentLayout />
			</ProtectedRoute>
		),
		children: [
			{
				path: "classes",
				element: <ClassOfStudentPage />,
			},
			{
				path: "attendances",
				element: <StudentAttendancePage />,
			},
		],
	},
];

export default studentRoutes;
