import { Attendance } from '../types/attendance'
import { Params } from './../types/api';
import apiClient from "./apiClient";

export const createAttendance = async (payload: Omit<Attendance, "_id" | "deletedAt" | "createdAt">): Promise<Attendance>  => {
    const response = await apiClient.post("/attendance", payload);
    return response.data.data;
}

export const getAttendances = async (params?: Params) => {
    const response = await apiClient.get("/attendance", { params });
    return response.data.data;
}
export const updateAttendance = async (sessionId: string, payload: Partial<Omit<Attendance, "deletedAt" | "createdAt" | "updatedAt">>): Promise<Attendance> => {
    const response = await apiClient.patch(`/attendance/${sessionId}`, payload);
    return response.data.data;
}
export const deleteAttendance = async (id: string): Promise<Attendance> => {
    const response = await apiClient.delete(`/attendance/${id}`);
    return response.data.data;
}

export const checkAttendanceStatus = async (sessionId: string): Promise<Attendance> => {
    const response = await apiClient.get(`/attendance/status/${sessionId}`);
    return response.data.data;
}