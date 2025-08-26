import SessionTable from "@/components/admin/SessionTable";
import { getAllSessionsByClassId } from "@/common/services/sessionService";
import { getAllClasses } from "@/common/services/classSercive";
import { useQuery } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import { getClassDetail } from "@/common/services/classSercive";
import { Select, Card, Spin, Row, Col, Badge, Button } from "antd";
import { useState, useEffect } from "react";
import {
  BookOutlined,
  UserOutlined,
  CalendarOutlined,
} from "@ant-design/icons";

const { Option } = Select;

export const SessionManagementPage = () => {
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const navigate = useNavigate();

  // Lấy thông tin user từ localStorage
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const teacherId = user._id;

  // Lấy danh sách lớp học của giáo viên
  const { data: classes = [], isLoading: classesLoading } = useQuery({
    queryKey: ["teacher-classes", teacherId],
    queryFn: () => getAllClasses({ teacherId }),
    enabled: !!teacherId,
  });

  // Lấy chi tiết lớp học được chọn
  const { data: classDetail, isLoading: classDetailLoading } = useQuery({
    queryKey: ["class-detail", selectedClassId],
    queryFn: () => getClassDetail(selectedClassId!),
    enabled: !!selectedClassId,
  });

  // Lấy danh sách buổi học của lớp được chọn
  const { data: sessions = [], isLoading: sessionsLoading } = useQuery({
    queryKey: ["sessions", selectedClassId],
    queryFn: () => getAllSessionsByClassId(selectedClassId!),
    enabled: !!selectedClassId,
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "green";
      case "upcoming":
        return "blue";
      case "cancelled":
        return "red";
      default:
        return "default";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "Đang hoạt động";
      case "upcoming":
        return "Sắp diễn ra";
      case "completed":
        return "Đã hoàn thành";
      case "cancelled":
        return "Đã hủy";
      case "overdue":
        return "Quá hạn";
      default:
        return status;
    }
  };

  const handleClassSelect = (classId: string) => {
    setSelectedClassId(classId);
  };

  const handleBackToClasses = () => {
    setSelectedClassId(null);
  };

  const handleViewAttendance = (classId: string) => {
    navigate(`/teacher/attendance-detail/${classId}`);
  };

  if (classesLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  if (classes.length === 0) {
    return (
      <Card>
        <div className="text-center py-8">
          <p className="text-gray-500">Bạn chưa được phân công dạy lớp nào.</p>
        </div>
      </Card>
    );
  }

  // Hiển thị danh sách lớp học
  if (!selectedClassId) {
    return (
      <div>
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Danh sách lớp học
          </h2>
          <p className="text-gray-600">Chọn lớp học để quản lý buổi học</p>
        </div>

        <Row gutter={[16, 16]}>
          {classes.map((cls: any) => (
            <Col xs={24} sm={12} md={8} lg={6} key={cls._id}>
              <Card
                hoverable
                className="h-full cursor-pointer transition-all duration-300 hover:shadow-lg"
                onClick={() => handleClassSelect(cls._id)}
                bodyStyle={{ padding: "20px" }}
              >
                <div className="text-center">
                  <div className="mb-3">
                    <BookOutlined className="text-3xl text-blue-500" />
                  </div>

                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {cls.name}
                  </h3>

                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center justify-center">
                      <BookOutlined className="mr-2" />
                      <span>{cls.subjectId?.name || "Chưa có môn học"}</span>
                    </div>
                    <div className="flex items-center justify-center">
                      <UserOutlined className="mr-2" />
                      <span>{cls.studentIds?.length || 0} học sinh</span>
                    </div>
                    {/* Buổi học */}
                    <div className="flex items-center justify-center">
                      <span className="font-semibold">Buổi học:</span>{" "}
                      {cls.totalSessions || 0} buổi
                    </div>
                    <div className="flex items-center justify-center">
                      <CalendarOutlined className="mr-2" />
                      <Badge
                        status={cls.status === "active" ? "success" : "default"}
                        text={getStatusText(cls.status)}
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <Row gutter={8}>
                      <Col span={12}>
                        <Button type="primary" size="small" block>
                          Xem buổi học
                        </Button>
                      </Col>
                      <Col span={12}>
                        <Button
                          type="default"
                          size="small"
                          block
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewAttendance(cls._id);
                          }}
                        >
                          Xem Điểm Danh
                        </Button>
                      </Col>
                    </Row>
                  </div>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    );
  }

  // Hiển thị chi tiết buổi học của lớp được chọn
  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <Button onClick={handleBackToClasses} className="mb-3">
              ← Quay lại danh sách lớp
            </Button>
            <h2 className="text-2xl font-bold text-gray-800">
              Quản lý buổi học
            </h2>
            {classDetail && (
              <p className="text-gray-600">
                Lớp: {classDetail.name} -{" "}
                {classDetail.subjectId?.name || "Chưa có môn học"}
              </p>
            )}
          </div>
        </div>
      </div>

      {classDetail ? (
        <SessionTable
          sessions={sessions}
          classDetail={classDetail}
          sessionsLoading={sessionsLoading || classDetailLoading}
          getStatusColor={getStatusColor}
          getStatusText={getStatusText}
          onCreateSession={() => console.log("Create session")}
        />
      ) : (
        <Card>
          <div className="text-center py-8">
            <Spin size="large" />
            <p className="text-gray-500 mt-4">Đang tải thông tin lớp học...</p>
          </div>
        </Card>
      )}
    </div>
  );
};

export default SessionManagementPage;
