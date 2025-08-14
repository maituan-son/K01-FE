import { Session } from "../types/session";
import apiClient from "./apiClient";


export const getAllSessionsByClassId = async (classId: string): Promise<Session[]> => {
    const res = await apiClient.get(`/session/classid/${classId}`);
    return res.data.data;
};

export const createSession = async (
    payload: Omit<Session, "_id" | "deletedAt" | "createdAt" | "updatedAt">
): Promise<Session> => {
    const res = await apiClient.post("/session", payload);
    return res.data.data;
};

export const updateSession = async (
    id: string,
    payload: Partial<Omit<Session, "_id" | "deletedAt" | "createdAt" | "updatedAt">>
): Promise<Session> => {
    const res = await apiClient.patch(`/session/${id}`, payload);
    return res.data.data;
};

export const deleteSession = async (id: string): Promise<Session> => {
    const res = await apiClient.delete(`/session/${id}/soft-delete`);
    return res.data.data;
};

export const restoreSession = async (id: string): Promise<Session> => {
    const res = await apiClient.patch(`/session/${id}/restore`);
    return res.data.data;
};
