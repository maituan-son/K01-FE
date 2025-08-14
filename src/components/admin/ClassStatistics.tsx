import React from "react";
import { Row, Col, Card, Statistic, Progress } from "antd";
import {
  TeamOutlined,
  BookOutlined,
  CheckCircleOutlined,
  FileTextOutlined,
} from "@ant-design/icons";

interface ClassStatisticsProps {
  classDetail: any;
}

const ClassStatistics: React.FC<ClassStatisticsProps> = ({ classDetail }) => {
  return (
    <Row gutter={16} className="mb-6">
      <Col span={6}>
        <Card className="text-center">
          <Statistic
            title="Sĩ số hiện tại"
            value={classDetail.studentIds?.length || 0}
            suffix={`/ ${classDetail.maxStudents || 0}`}
            valueStyle={{ color: "#1890ff" }}
            prefix={<TeamOutlined />}
          />
          <Progress
            percent={
              classDetail.maxStudents
                ? Math.round(
                    ((classDetail.studentIds?.length || 0) /
                      classDetail.maxStudents) *
                      100
                  )
                : 0
            }
            size="small"
            strokeColor="#1890ff"
            className="mt-2"
          />
        </Card>
      </Col>
      <Col span={6}>
        <Card className="text-center">
          <Statistic
            title="Tiến độ học tập"
            value={classDetail.completedSessions}
            suffix={`/ ${classDetail.totalSessions}`}
            valueStyle={{ color: "#52c41a" }}
            prefix={<BookOutlined />}
          />
          <Progress
            percent={Math.round(
              (classDetail.completedSessions / classDetail.totalSessions) *
                100
            )}
            size="small"
            strokeColor="#52c41a"
            className="mt-2"
          />
        </Card>
      </Col>
      <Col span={6}>
        <Card className="text-center">
          <Statistic
            title="Tỷ lệ điểm danh"
            value={classDetail.attendanceRate}
            suffix="%"
            valueStyle={{ color: "#faad14" }}
            prefix={<CheckCircleOutlined />}
          />
        </Card>
      </Col>
      <Col span={6}>
        <Card className="text-center">
          <Statistic
            title="Tỷ lệ nộp bài"
            value={classDetail.assignmentSubmissionRate}
            suffix="%"
            valueStyle={{ color: "#722ed1" }}
            prefix={<FileTextOutlined />}
          />
        </Card>
      </Col>
    </Row>
  );
};

export default ClassStatistics; 