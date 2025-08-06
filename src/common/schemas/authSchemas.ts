import { z } from "zod";

export const registerSchema = z
	.object({
		email: z.string().min(1, "Email là bắt buộc").email("Email không hợp lệ"),
		password: z
			.string()
			.min(8, "Mật khẩu phải có ít nhất 8 ký tự")
			.regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/, "Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường và 1 số"),
		confirmPassword: z.string(),
		phoneNumber: z.string().optional(),
		fullname: z.string().min(6, "Họ và tên tối thiểu 6 ký tự"),

	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Mật khẩu xác nhận không khớp",
		path: ["confirmPassword"],
	});

export type RegisterFormData = {
	email: string;
	password: string;
	confirmPassword: string;
	phoneNumber?: string;
	fullname: string;
	username: string;
};

export const loginSchema = z.object({
	email: z.string().email("Email không hợp lệ"),
	password: z
		.string()
		.min(8, "Mật khẩu phải có ít nhất 8 ký tự")
		.regex(
			/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
			"Mật khẩu phải chứa ít nhất 1 chữ cái in hoa, 1 chữ cái thường, 1 số và 1 ký tự đặc biệt"
		),
});
export type LoginFormData = z.infer<typeof loginSchema>;

export const forgotPasswordSchema = z.object({
	email: z.string().email("Email không hợp lệ"),
});
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
