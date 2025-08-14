import React from "react";
import { Card, Row, Col, Avatar, Tag } from "antd";
import {
  UserOutlined,
  BookOutlined,
  ClockCircleOutlined,
  HomeOutlined,
} from "@ant-design/icons";

interface ClassBasicInfoProps {
  classDetail: any;
  getStatusColor: (status: string) => string;
  getStatusText: (status: string) => string;
}

const ClassBasicInfo: React.FC<ClassBasicInfoProps> = ({
  classDetail,
  getStatusColor,
  getStatusText,
}) => {
  return (
    <Card className="mb-6">
      <Row gutter={24}>
        <Col span={16}>
          <div className="space-y-4">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {classDetail.name}
              </h2>
              <div className="flex items-center space-x-4 text-gray-600">
                <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                  {classDetail.code}
                </span>
                <Tag
                  color={getStatusColor(classDetail.status)}
                  className="!rounded-button"
                >
                  {getStatusText(classDetail.status)}
                </Tag>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <div className="text-sm text-gray-500 mb-1">Môn học</div>
                <div className="flex items-center text-blue-600">
                  <BookOutlined className="mr-2" />
                  <span className="font-medium">
                    {classDetail.name || ""}
                  </span>
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">Ngành học</div>
                <div className="font-medium text-gray-700">
                  {classDetail.name || ""}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">Ca học</div>
                <div className="flex items-center text-gray-700">
                  <ClockCircleOutlined className="mr-2" />
                  <span className="font-medium">{classDetail.shift}</span>
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">Phòng học</div>
                <div className="flex items-center text-gray-700">
                  <HomeOutlined className="mr-2" />
                  <span className="font-medium">{classDetail.room}</span>
                </div>
              </div>
            </div>

            <div>
              <div className="text-sm text-gray-500 mb-2">Mô tả</div>
              <p className="text-gray-700 leading-relaxed">
                {classDetail.description}
              </p>
            </div>
          </div>
        </Col>
        <Col span={8}>
          <div className="space-y-6">
            <div className="text-center">
              <div className="text-sm text-gray-500 mb-2">Giảng viên</div>
              <div className="flex flex-col items-center space-y-3">
                <Avatar
                  size={80}
                  src={classDetail.teacher?.avatar}
                  icon={<UserOutlined />}
                />
                <div className="font-bold text-lg text-gray-900">
                  {classDetail.teacher?.name || ""}
                </div>
                <div className="text-sm text-gray-500">
                  {classDetail.teacher?.email || ""}
                </div>
                <div className="text-sm text-gray-500">
                  {classDetail.teacher?.phone || ""}
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="text-sm text-gray-500">Thời gian học</div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Bắt đầu:</span>
                  <span className="font-medium">
                    {classDetail.startDate}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm mt-1">
                  <span className="text-gray-600">Kết thúc:</span>
                  <span className="font-medium">{classDetail.endDate}</span>
                </div>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </Card>
  );
};

export default ClassBasicInfo; 