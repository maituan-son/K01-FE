import React, { useEffect, useState, useMemo } from "react";
import {
  Card,
  Button,
  Input,
  Select,
  Table,
  Statistic,
  message,
  Radio,
  Spin,
} from "antd";
import {
  CheckCircleOutlined,
  BarChartOutlined,
  CheckOutlined,
  CloseOutlined,
  ExclamationCircleOutlined,
  SearchOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import {
  getAllClasses,
  getClassDetail,
} from "../../common/services/classSercive";
import { getAllSessionsByClassId } from "../../common/services/sessionService";
import {
  getAttendances,
  updateAttendance,
  createAttendance,
} from "../../common/services/attendance";
import { Attendance } from "@/common/types/attendance";

const { Option } = Select;

const AttendanceManagementPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSession, setSelectedSession] = useState("");
  const [classes, setClasses] = useState<any[]>([]);
  const [sessions, setSessions] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [studentsData, setStudentsData] = useState<any[]>([]);
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [allSessionAttendances, setAllSessionAttendances] = useState<any[]>([]);

  // Helper fetch
  const safeFetch = async (fn: () => Promise<any>, fallback: any = []) => {
    try {
      return await fn();
    } catch (e) {
      console.error(e);
      return fallback;
    }
  };

  // Load lớp học
  useEffect(() => {
    (async () => {
      setLoading(true);
      const data = await safeFetch(getAllClasses);
      setClasses(data);
      if (data.length) setSelectedClass(data[0]._id);
      setLoading(false);
    })();
  }, []);

  // Khi chọn lớp => load sessions + students
  useEffect(() => {
    if (!selectedClass) return;
    (async () => {
      setLoading(true);
      const [sessionsData, classDetail] = await Promise.all([
        safeFetch(() => getAllSessionsByClassId(selectedClass)),
        safeFetch(() => getClassDetail(selectedClass)),
      ]);

      // Lấy danh sách attendance cho tất cả sessions của lớp này
      const allAttendances = await Promise.all(
        sessionsData.map(async (session: any) => {
          const response = await safeFetch(() =>
            getAttendances({ sessionId: session._id })
          );
          const existing = Array.isArray(response)
            ? response
            : Array.isArray(response?.data)
            ? response.data
            : [];
          return {
            sessionId: session._id,
            hasAttendance: existing.length > 0,
          };
        })
      );

      setAllSessionAttendances(allAttendances);
      setSessions(sessionsData);
      setStudents(classDetail?.studentIds || []);
      setSelectedSession("");
      setStudentsData([]);
      setLoading(false);
    })();
  }, [selectedClass]);

  // Khi chọn session => load attendance
  useEffect(() => {
    if (!selectedSession || !students.length) return;
    (async () => {
      setLoading(true);

      const response = await safeFetch(() =>
        getAttendances({ sessionId: selectedSession })
      );
      const existing = Array.isArray(response)
        ? response
        : Array.isArray(response?.data)
        ? response.data
        : [];

      setAttendances(existing);

      const map = new Map(existing.map((a) => [a.studentId, a]));
      const merged = students.map((s) => {
        const att = map.get(s.studentId);
        return att
          ? {
              key: att._id,
              _id: att._id,
              studentId: s.studentId,
              fullName: s.fullname,
              status: att.status?.toUpperCase() || "ABSENT",
              note: att.note || "",
              isExisting: true,
            }
          : {
              key: s._id,
              _id: s._id,
              studentId: s.studentId,
              fullName: s.fullname,
              status: "ABSENT",
              note: "",
              isExisting: false,
            };
      });
      setStudentsData(merged);
      setLoading(false);
    })();
  }, [selectedSession, students]);

  // Filtered data + stats
  const filteredStudentsData = useMemo(
    () =>
      studentsData.filter(
        (s) =>
          s.studentId.toLowerCase().includes(searchText.toLowerCase()) ||
          s.fullName.toLowerCase().includes(searchText.toLowerCase())
      ),
    [studentsData, searchText]
  );

  const stats = useMemo(() => {
    const total = filteredStudentsData.length;
    const present = filteredStudentsData.filter(
      (s) => s.status === "PRESENT"
    ).length;
    const absent = filteredStudentsData.filter(
      (s) => s.status === "ABSENT"
    ).length;
    const late = filteredStudentsData.filter((s) => s.status === "LATE").length;
    return {
      total,
      present,
      absent,
      late,
      attendanceRate: total ? Math.round(((present + late) / total) * 100) : 0,
    };
  }, [filteredStudentsData]);

  // Save attendance
  const handleSaveAttendance = async () => {
    if (!selectedSession || !studentsData.length) {
      return message.error("Vui lòng chọn buổi học và có sinh viên");
    }
    setLoading(true);
    const data = studentsData.map((s) => ({
      studentId: s._id,
      status: s.status,
      note: s.note || "",
    }));
    try {
      if (attendances.length)
        await updateAttendance(selectedSession, { attendances: data });
      else
        await createAttendance({
          sessionId: selectedSession,
          attendances: data,
        });

      // Cập nhật danh sách attendance sau khi lưu thành công
      setAllSessionAttendances((prev) =>
        prev.map((item) =>
          item.sessionId === selectedSession
            ? { ...item, hasAttendance: true }
            : item
        )
      );

      // Reset selection để ẩn session đã điểm danh
      setSelectedSession("");
      setStudentsData([]);

      message.success("Lưu điểm danh thành công!");
    } catch (e) {
      console.error(e);
      message.error("Không thể lưu điểm danh");
    }
    setLoading(false);
  };

  // Lọc ra những session chưa có attendance
  const availableSessions = sessions.filter((session) => {
    const attendanceInfo = allSessionAttendances.find(
      (a) => a.sessionId === session._id
    );
    return !attendanceInfo?.hasAttendance;
  });

  // Update local status/note
  const updateStudent = (key: string, patch: any) =>
    setStudentsData((prev) =>
      prev.map((s) => (s.key === key ? { ...s, ...patch } : s))
    );

  const columns = [
    {
      title: "STT",
      render: (_: any, __: any, i: number) => i + 1,
      width: 60,
    },
    {
      title: "Mã SV",
      dataIndex: "studentId",
      render: (t: string) => (
        <span className="font-mono text-blue-600">{t}</span>
      ),
    },
    { title: "Họ tên", dataIndex: "fullName" },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (status: string, r: any) => (
        <Radio.Group
          value={status}
          onChange={(e) => updateStudent(r.key, { status: e.target.value })}
        >
          <Radio.Button value="PRESENT">
            <CheckOutlined className="text-green-600 mr-1" />
            Có mặt
          </Radio.Button>
          <Radio.Button value="LATE">
            <ExclamationCircleOutlined className="text-orange-600 mr-1" />
            Muộn
          </Radio.Button>
          <Radio.Button value="ABSENT">
            <CloseOutlined className="text-red-600 mr-1" />
            Vắng
          </Radio.Button>
        </Radio.Group>
      ),
    },
    {
      title: "Ghi chú",
      dataIndex: "note",
      render: (t: string, r: any) => (
        <Input.TextArea
          value={t}
          onChange={(e) => updateStudent(r.key, { note: e.target.value })}
          autoSize={{ minRows: 1, maxRows: 2 }}
        />
      ),
    },
  ];

  return (
    <Spin spinning={loading}>
      <div className="p-6 max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold mb-2">Quản lý điểm danh</h2>
        <p className="mb-6 text-gray-600">Theo dõi tỷ lệ tham gia sinh viên</p>

        {/* Toolbar */}
        <Card className="mb-6">
          <div className="flex flex-wrap gap-4 items-center">
            <Input
              placeholder="Tìm kiếm..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="max-w-md"
              size="large"
            />
            <Select
              value={selectedClass}
              onChange={setSelectedClass}
              placeholder="Chọn lớp"
              className="w-48"
              size="large"
            >
              {classes.map((c) => (
                <Option key={c._id} value={c._id}>
                  {c.name}
                </Option>
              ))}
            </Select>
            <Select
              value={selectedSession}
              onChange={setSelectedSession}
              placeholder="Chọn buổi học"
              className="w-64"
              size="large"
              disabled={!availableSessions.length}
            >
              {availableSessions.map((s, i) => (
                <Option key={s._id} value={s._id}>
                  Buổi{" "}
                  {sessions.findIndex((session) => session._id === s._id) + 1} -{" "}
                  {s.sessionDate
                    ? new Date(s.sessionDate).toLocaleDateString("vi-VN")
                    : "N/A"}
                </Option>
              ))}
            </Select>
            <Button
              type="primary"
              onClick={handleSaveAttendance}
              disabled={!selectedSession || !studentsData.length}
            >
              Lưu điểm danh
            </Button>
          </div>
        </Card>

        {/* Hiển thị thông báo khi không còn buổi học nào */}
        {selectedClass &&
          sessions.length > 0 &&
          availableSessions.length === 0 && (
            <Card className="mb-6 text-center py-8">
              <p className="text-gray-500">
                Tất cả các buổi học của lớp này đã được điểm danh
              </p>
            </Card>
          )}

        {/* Stats */}
        {selectedSession && studentsData.length > 0 && (
          <div className="grid md:grid-cols-4 gap-6 mb-6">
            <Card>
              <Statistic
                title="Tổng SV"
                value={stats.total}
                prefix={<UserAddOutlined />}
              />
            </Card>
            <Card>
              <Statistic
                title="Có mặt"
                value={stats.present}
                valueStyle={{ color: "#52c41a" }}
                prefix={<CheckCircleOutlined />}
              />
            </Card>
            <Card>
              <Statistic
                title="Vắng"
                value={stats.absent}
                valueStyle={{ color: "#ff4d4f" }}
                prefix={<CloseOutlined />}
              />
            </Card>
            <Card>
              <Statistic
                title="Tỷ lệ"
                value={stats.attendanceRate}
                suffix="%"
                valueStyle={{
                  color: stats.attendanceRate >= 80 ? "#52c41a" : "#ff4d4f",
                }}
                prefix={<BarChartOutlined />}
              />
            </Card>
          </div>
        )}

        {/* Table */}
        {selectedSession && studentsData.length > 0 ? (
          <Card
            title={`Điểm danh lớp ${
              classes.find((c) => c._id === selectedClass)?.name || ""
            }`}
          >
            <Table
              rowKey="key"
              columns={columns}
              dataSource={filteredStudentsData}
              pagination={false}
              scroll={{ x: 1000 }}
            />
          </Card>
        ) : (
          <Card className="text-center py-8 text-gray-500">
            {!selectedSession
              ? "Vui lòng chọn lớp học và buổi học"
              : "Không có sinh viên nào"}
          </Card>
        )}
      </div>
    </Spin>
  );
};

export default AttendanceManagementPage;
