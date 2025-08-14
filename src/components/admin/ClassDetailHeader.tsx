import React from "react";
import { Button } from "antd";
import { ArrowLeftOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";

interface ClassDetailHeaderProps {
  onBack: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const ClassDetailHeader: React.FC<ClassDetailHeaderProps> = ({
  onBack,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="bg-white shadow-sm border-b sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              type="text"
              icon={<ArrowLeftOutlined />}
              className="!rounded-button cursor-pointer whitespace-nowrap"
              onClick={onBack}
            >
              Quay lại
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Chi tiết lớp học
              </h1>
              <p className="text-gray-600 mt-1">
                Thông tin chi tiết và quản lý lớp học
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              icon={<EditOutlined />}
              className="!rounded-button cursor-pointer whitespace-nowrap"
              onClick={onEdit}
            >
              Chỉnh sửa
            </Button>
            <Button
              danger
              icon={<DeleteOutlined />}
              className="!rounded-button cursor-pointer whitespace-nowrap"
              onClick={onDelete}
            >
              Xóa lớp
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassDetailHeader; 