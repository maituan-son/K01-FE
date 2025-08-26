import React from "react";

const NotFoundPage: React.FC = () => {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f8fafc 0%, #e0e7ef 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "32px",
      }}
    >
      <svg
        width="180"
        height="180"
        viewBox="0 0 180 180"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ marginBottom: 32 }}
      >
        <circle cx="90" cy="90" r="90" fill="#e0e7ef" />
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dy=".35em"
          fontSize="64"
          fontWeight="bold"
          fill="#3b82f6"
        >
          404
        </text>
      </svg>
      <h1
        style={{
          fontSize: 36,
          fontWeight: 700,
          color: "#1e293b",
          marginBottom: 12,
        }}
      >
        Không tìm thấy trang
      </h1>
      <p
        style={{
          fontSize: 18,
          color: "#64748b",
          marginBottom: 32,
          textAlign: "center",
        }}
      >
        Trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
        <br />
        Vui lòng kiểm tra lại đường dẫn hoặc quay về trang chủ.
      </p>
      <a
        href="/"
        style={{
          display: "inline-block",
          padding: "12px 32px",
          background: "#3b82f6",
          color: "#fff",
          borderRadius: 8,
          fontWeight: 600,
          fontSize: 16,
          textDecoration: "none",
          boxShadow: "0 2px 8px rgba(59,130,246,0.08)",
          transition: "background 0.2s",
        }}
      >
        Quay về trang chủ
      </a>
    </div>
  );
};

export default NotFoundPage;
