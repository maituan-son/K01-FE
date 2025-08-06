import axios, { AxiosError, AxiosResponse } from "axios";
import { refreshToken } from "./authServices";

interface ApiError {
	message: string;
	status?: number;
	data?: any;
}

const apiClient = axios.create({
	baseURL: "http://localhost:8888/api",
	headers: {
		"Content-Type": "application/json",
	},
});

// Xử lý lỗi chung cho tất cả API
const handleApiError = (error: unknown): ApiError => {
	if (error instanceof AxiosError) {
		const response = error.response;
		if (response) {
			// Lỗi từ server (4xx, 5xx)
			return {
				message: response.data?.message || "Có lỗi xảy ra từ server. Vui lòng thử lại.",
				status: response.status,
				data: response.data,
			};
		}
		// Lỗi mạng hoặc không có phản hồi
		return {
			message: "Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.",
		};
	}
	// Lỗi không xác định
	return {
		message: "Đã xảy ra lỗi không xác định. Vui lòng thử lại sau.",
	};
};

let isRefreshing = false;
let refreshSubscribers: Array<(token: string) => void> = [];

function subscribeTokenRefresh(cb: (token: string) => void) {
	refreshSubscribers.push(cb);
}
function onRefreshed(token: string) {
	refreshSubscribers.forEach((cb) => cb(token));
	refreshSubscribers = [];
}

// Interceptor để xử lý response và lỗi
apiClient.interceptors.response.use(
	(response: AxiosResponse) => response,
	async (error: AxiosError) => {
		const originalRequest: any = error.config;
		// Nếu lỗi 401 và chưa thử refresh
		if (error.response?.status === 401 && !originalRequest._retry && localStorage.getItem("refreshToken")) {
			originalRequest._retry = true;
			if (!isRefreshing) {
				isRefreshing = true;
				try {
					const data = await refreshToken();
					localStorage.setItem("accessToken", data.accessToken);
					onRefreshed(data.accessToken);
					isRefreshing = false;
				} catch {
					isRefreshing = false;
					localStorage.removeItem("accessToken");
					localStorage.removeItem("user");
					window.location.href = "/login";
					return Promise.reject(error);
				}
			}
			// Đợi token mới rồi retry
			return new Promise((resolve) => {
				subscribeTokenRefresh((token: string) => {
					originalRequest.headers["Authorization"] = `Bearer ${token}`;
					resolve(apiClient(originalRequest));
				});
			});
		}
		return Promise.reject(handleApiError(error));
	}
);

// Interceptor để tự động đính kèm accessToken vào header Authorization
apiClient.interceptors.request.use((config) => {
	const accessToken = localStorage.getItem("accessToken");
	if (accessToken) {
		config.headers = config.headers || {};
		config.headers["Authorization"] = `Bearer ${accessToken}`;
	}
	return config;
});

export default apiClient;
