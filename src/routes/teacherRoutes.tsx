import { RouteObject } from "react-router-dom";
import { RoleEnum } from "../common/types";
import AttendanceManagermentPage from "../pages/teacher/AttendanceManagementPage";
import ProtectedRoute from "./components/ProtectedRoute";
import TeacherLayout from "../components/layouts/TeacherLayout";
import SessionManagementPage from "../pages/teacher/SessionManagementPage";
import AttendanceDetailPage from "@/pages/teacher/AttendanceDetailPage";
import AttendancaSessionPage from "@/pages/teacher/AttendancaSessionPage";

const teacherRoutes: RouteObject[] = [
  {
    path: "/teacher",
    element: (
      // Sau này sẽ chỉnh sửa chỉ cho giảng viên truy cập
      <ProtectedRoute allowedRoles={[RoleEnum.TEACHER, RoleEnum.SUPER_ADMIN]}>
        <TeacherLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "sessions",
        element: <SessionManagementPage />,
      },
      {
        path: "attendances",
        element: <AttendanceManagermentPage />,
      },
      {
        path: "attendance-session/:sessionId",
        element: <AttendancaSessionPage />,
      },
      {
        path: "attendance-detail/:classId",
        element: <AttendanceDetailPage />,
      },
    ],
  },
];

export default teacherRoutes;
