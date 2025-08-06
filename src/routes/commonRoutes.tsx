import CommonLayout from "@/components/layouts/CommonLayout";
import HomePage from "@/pages/common/HomePage";
import PrivacyPage from "@/pages/common/PrivacyPage";
import TermsPage from "@/pages/common/TermsPage";
import { RouteObject } from "react-router-dom";

export const commonRoutes: RouteObject[] = [
	{
		element: <CommonLayout />,
		children: [
			{ path: "/", element: <HomePage /> },
			{ path: "/privacy", element: <PrivacyPage /> },
			{ path: "/terms", element: <TermsPage /> },

			{ path: "/about", element: <div>Giới thiệu (Chưa triển khai)</div> },
			{ path: "/courses", element: <div>Khóa học (Chưa triển khai)</div> },
			{ path: "/philosophy", element: <div>Triết lý đào tạo (Chưa triển khai)</div> },
			{ path: "/contact", element: <div>Liên hệ (Chưa triển khai)</div> },
		],
	},
];
