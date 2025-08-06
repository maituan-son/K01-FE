import { Table, Select, Typography, Button } from "antd";
import { useState } from "react";

const { Option } = Select;

const attendanceData = [
  {
    key: 1,
    lesson: 1,
    date: "07/01/2025 - Tuesday",
    shift: 6,
    checker: "trangnt253",
    description: "Tích hợp(LT+TH)",
    status: "Present",
  },
  {
    key: 2,
    lesson: 2,
    date: "09/01/2025 - Thursday",
    shift: 6,
    checker: "hienpg",
    description: "Tích hợp(LT+TH)",
    status: "Present",
  },
  //...
];

const columns = [
  { title: "Bài học", dataIndex: "lesson", key: "lesson" },
  { title: "Ngày", dataIndex: "date", key: "date" },
  { title: "Ca", dataIndex: "shift", key: "shift" },
  { title: "Người điểm danh", dataIndex: "checker", key: "checker" },
  { title: "Mô tả", dataIndex: "description", key: "description" },
  {
    title: "Trạng thái đi học",
    dataIndex: "status",
    key: "status",
    render: (status) => (
      <span style={{ color: status === "Present" ? "green" : "red" }}>
        {status}
      </span>
    ),
  },
];

const StudentAttendancePage = () => {
  const [semester, setSemester] = useState("Spring 2025");

  return (
    <div>
      <Typography.Title level={3}>Điểm danh</Typography.Title>
      <div style={{ marginBottom: 20 }}>
        <label>Học kỳ: </label>
        <Select value={semester} onChange={setSemester} style={{ width: 200 }}>
          <Option value="Spring 2025">Spring 2025</Option>
          <Option value="Fall 2025">Fall 2025</Option>
        </Select>
      </div>

      <Typography.Title level={5}>Tiếng Anh 2.2 (ENT2227) - ENT2227.12</Typography.Title>

      <Table columns={columns} dataSource={attendanceData} pagination={false} />

      <div style={{ marginTop: 20 }}>
        <Button type="primary" style={{ marginRight: 10 }}>
          Export PDF
        </Button>
        <Button>Export Excel</Button>
      </div>
    </div>
  );
};

export default StudentAttendancePage;
