import React from 'react'
import { useMutation } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useParams } from "react-router-dom";
import { Form, Input, Button, Card, Typography, Space, Alert, message } from "antd";
import { LockOutlined, ArrowRightOutlined, BookOutlined } from "@ant-design/icons";
import { z } from "zod";
import { resetPassword } from '@/common/services';

const { Title, Text } = Typography;

// Schema xác thực cho form reset password
const resetPasswordSchema = z.object({
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Mật khẩu xác nhận không khớp",
  path: ["confirmPassword"],
});

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;



const ResetPassword = () => {
  const { token } = useParams();

  const { mutate, isPending, error, isSuccess } = useMutation({
    mutationFn: ({ newPassword, resetToken }: { newPassword: string; resetToken: string }) =>
      resetPassword(resetToken, newPassword), // truyền 2 tham số
    onSuccess: () => {
      message.success("Đặt lại mật khẩu thành công! Bạn có thể đăng nhập bằng mật khẩu mới.");
    },
    onError: (err: any) => {
      message.error(err?.message || "Đặt lại mật khẩu thất bại. Vui lòng thử lại!");
    },
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const onSubmit = (data: ResetPasswordFormData) => {
    mutate({ newPassword: data.password, resetToken: token });
  };

  return (
    <Card
      title={
        <div style={{ textAlign: "center", padding: 24 }}>
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
              marginTop: 16,
            }}
          >
            <BookOutlined style={{ fontSize: 32, color: "#fff" }} />
          </div>
          <Title level={3} style={{ marginBottom: 8, color: "#1f1f1f" }}>
            Đặt lại mật khẩu
          </Title>
          <Text style={{ color: "#595959" }}>Nhập mật khẩu mới cho tài khoản của bạn</Text>
        </div>
      }
      style={{ boxShadow: "0 8px 24px rgba(0,0,0,0.15)", borderRadius: 8 }}
    >
      <Form layout="vertical" onFinish={handleSubmit(onSubmit)} style={{ padding: "24px" }}>
        <Form.Item
          label={
            <Text strong style={{ color: "#434343" }}>
              Mật khẩu mới
            </Text>
          }
          validateStatus={errors.password ? "error" : ""}
          help={errors.password?.message}
        >
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <Input.Password
                prefix={<LockOutlined style={{ color: "#bfbfbf" }} />}
                placeholder="Nhập mật khẩu mới"
                {...field}
                style={{ height: 40 }}
              />
            )}
          />
        </Form.Item>

        <Form.Item
          label={
            <Text strong style={{ color: "#434343" }}>
              Xác nhận mật khẩu
            </Text>
          }
          validateStatus={errors.confirmPassword ? "error" : ""}
          help={errors.confirmPassword?.message}
        >
          <Controller
            name="confirmPassword"
            control={control}
            render={({ field }) => (
              <Input.Password
                prefix={<LockOutlined style={{ color: "#bfbfbf" }} />}
                placeholder="Nhập lại mật khẩu mới"
                {...field}
                style={{ height: 40 }}
              />
            )}
          />
        </Form.Item>

        {error && <Alert message={error.message} type="error" showIcon style={{ marginBottom: 24 }} />}
        {isSuccess && <Alert message="Đặt lại mật khẩu thành công!" type="success" showIcon style={{ marginBottom: 24 }} />}

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={isPending}
            block
            style={{
              height: 40,
              background: "var(--gradient)",
              border: "none",
            }}
            disabled={isSuccess}
          >
            {isPending ? (
              "Đang xử lý..."
            ) : (
              <Space>
                Đặt lại mật khẩu
                <ArrowRightOutlined />
              </Space>
            )}
          </Button>
        </Form.Item>

        <div style={{ textAlign: "center", marginBottom: 16 }}>
          <Text style={{ color: "#595959" }}>
            Quay lại{" "}
            <Link to="/login" style={{ color: "#1890ff", fontWeight: 500 }}>
              Đăng nhập
            </Link>
          </Text>
        </div>
      </Form>
    </Card>
  );
};

export default ResetPassword