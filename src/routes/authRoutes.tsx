import { RouteObject } from "react-router-dom";
import AuthLayout from "../components/layouts/AuthLayout";
import LoginPage from "../pages/auth/login/LoginPage";
import RegisterPage from "../pages/auth/register/RegisterPage";
import ForgotPasswordPage from "@/pages/auth/forgot-password/ForgotPasswordPage";
import ResetPassword from "@/pages/auth/reset-password/ResetPassword";

const authRoutes: RouteObject[] = [
	{
		element: <AuthLayout />,
		children: [
			{ path: "/login", element: <LoginPage /> },
			{ path: "/register", element: <RegisterPage /> },
			{ path: "/forgot-password", element: <ForgotPasswordPage /> },
			{ path: "/reset-password/:token", element: <ResetPassword /> },
		],
	},
];

export default authRoutes;
