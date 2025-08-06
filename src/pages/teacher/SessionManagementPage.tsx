import { useState, useEffect, FormEvent } from "react";
import { ShiftEnum, RoomEnum } from "../../common/types";
import { Table, Button, Form, Select, DatePicker, Alert, Spin, Card, Typography, Space } from "antd";
import dayjs from "dayjs";

const { Title } = Typography;

interface Class {
    _id: string;
    name: string;
    subjectId: string;
    majorId: string;
    teacherId: string;
    startDate: string;
    totalSessions: number;
    shift: ShiftEnum;
}

interface Session {
    _id: string;
    classId: string;
    sessionDate: string;
    shift: ShiftEnum;
    room: RoomEnum;
    createdAt: string;
}

const SessionManagementPage = () => {
    const [sessions, setSessions] = useState<Session[]>([]);
    const [classes, setClasses] = useState<Class[]>([]);
    const [form] = Form.useForm();
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [prioritizeTeacher, setPrioritizeTeacher] = useState(true);

    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const teacherId = user._id;

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const classesResponse = await fetch(`/api/classes?teacherId=${teacherId}`);
                if (!classesResponse.ok) throw new Error("Không thể lấy danh sách lớp học");
                const classesData = await classesResponse.json();
                setClasses(classesData);

                const sessionsResponse = await fetch(`/api/sessions?teacherId=${teacherId}`);
                if (!sessionsResponse.ok) throw new Error("Không thể lấy danh sách buổi học");
                const sessionsData = await sessionsResponse.json();
                setSessions(sessionsData);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [teacherId]);

    const fetchAvailableOptions = async (sessionDate: string, shift: ShiftEnum) => {
        try {
            if (prioritizeTeacher) {
                const response = await fetch(`/api/available-shifts?teacherId=${teacherId}&date=${sessionDate}`);
                if (!response.ok) throw new Error("Không thể lấy ca học khả dụng");
                return await response.json();
            } else {
                const response = await fetch(`/api/available-rooms?date=${sessionDate}&shift=${shift}`);
                if (!response.ok) throw new Error("Không thể lấy phòng học khả dụng");
                return await response.json();
            }
        } catch (err: any) {
            setError(err.message);
            return [];
        }
    };

    const handleSubmit = async (values: any) => {
        setLoading(true);
        setError(null);
        try {
            const sessionDate = values.sessionDate.format("YYYY-MM-DD");
            const availableOptions = await fetchAvailableOptions(sessionDate, values.shift);
            if (prioritizeTeacher && !availableOptions.includes(values.shift)) {
                throw new Error("Giảng viên đã có lịch trong ca này");
            } else if (!prioritizeTeacher && !availableOptions.includes(values.room)) {
                throw new Error("Phòng học không khả dụng trong ca này");
            }
            const response = await fetch("/api/sessions", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...values, sessionDate, teacherId }),
            });
            if (!response.ok) throw new Error("Không thể tạo buổi học");
            const newSession = await response.json();
            setSessions([...sessions, newSession]);
            form.resetFields();
            setShowForm(false);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        {
            title: "Lớp học",
            dataIndex: "classId",
            key: "classId",
            render: (id: string) => classes.find((c) => c._id === id)?.name || "N/A",
        },
        {
            title: "Ngày học",
            dataIndex: "sessionDate",
            key: "sessionDate",
            render: (date: string) => dayjs(date).format("DD/MM/YYYY"),
        },
        {
            title: "Ca học",
            dataIndex: "shift",
            key: "shift",
        },
        {
            title: "Phòng học",
            dataIndex: "room",
            key: "room",
        },
    ];

    return (
        <div style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}>
            <Card>
                <Title level={3} style={{ marginBottom: 16 }}>Quản lý buổi học</Title>
                {error && <Alert message={error} type="error" showIcon style={{ marginBottom: 16 }} />}
                {loading && <Spin style={{ marginBottom: 16 }} />}
                <Space direction="vertical" style={{ width: "100%" }} size="large">
                    <Table
                        dataSource={sessions}
                        columns={columns}
                        rowKey="_id"
                        pagination={false}
                        locale={{ emptyText: "Chưa có buổi học nào." }}
                        bordered
                        size="middle"
                    />
                    <Button type={showForm ? "default" : "primary"} onClick={() => setShowForm(!showForm)}>
                        {showForm ? "Hủy" : "Thêm buổi học"}
                    </Button>
                    {showForm && (
                        <Form
                            form={form}
                            layout="vertical"
                            onFinish={handleSubmit}
                            initialValues={{
                                classId: "",
                                sessionDate: null,
                                shift: ShiftEnum.ONE,
                                room: RoomEnum.ONLINE,
                            }}
                            style={{ background: "#fafcff", padding: 24, borderRadius: 8, boxShadow: "0 2px 8px #f0f1f2" }}
                        >
                            <Form.Item
                                label="Lớp học"
                                name="classId"
                                rules={[{ required: true, message: "Vui lòng chọn lớp học" }]}
                            >
                                <Select placeholder="Chọn lớp học">
                                    {classes.map((cls) => (
                                        <Select.Option key={cls._id} value={cls._id}>
                                            {cls.name}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                            <Form.Item
                                label="Ngày học"
                                name="sessionDate"
                                rules={[{ required: true, message: "Vui lòng chọn ngày học" }]}
                            >
                                <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" />
                            </Form.Item>
                            <Form.Item
                                label="Ca học"
                                name="shift"
                                rules={[{ required: true, message: "Vui lòng chọn ca học" }]}
                            >
                                <Select>
                                    {Object.values(ShiftEnum).map((shift) => (
                                        <Select.Option key={shift} value={shift}>
                                            Ca {shift} (
                                            {shift === "1"
                                                ? "7h-9h"
                                                : shift === "2"
                                                ? "9h-11h"
                                                : shift === "3"
                                                ? "11h-13h"
                                                : shift === "4"
                                                ? "13h-15h"
                                                : shift === "5"
                                                ? "15h-17h"
                                                : "17h-19h"}
                                            )
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                            <Form.Item
                                label="Phòng học"
                                name="room"
                                rules={[{ required: true, message: "Vui lòng chọn phòng học" }]}
                            >
                                <Select>
                                    {Object.values(RoomEnum).map((room) => (
                                        <Select.Option key={room} value={room}>
                                            {room}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                            <Form.Item label="Ưu tiên">
                                <Select
                                    value={prioritizeTeacher ? "teacher" : "shift"}
                                    onChange={(v) => setPrioritizeTeacher(v === "teacher")}
                                >
                                    <Select.Option value="teacher">Ưu tiên lịch giảng viên</Select.Option>
                                    <Select.Option value="shift">Ưu tiên ca học</Select.Option>
                                </Select>
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" htmlType="submit" block loading={loading}>
                                    Tạo buổi học
                                </Button>
                            </Form.Item>
                        </Form>
                    )}
                </Space>
            </Card>
        </div>
    );
};

export default SessionManagementPage;
