
import { Subject } from "../types/SubJect";
import apiClient from "./apiClient";


export const createSubject = async ( payload: Omit<Subject, "_id" | "createdAt" | "updatedAt">) => {
	const res = await apiClient.post("/subject", payload);
	return res.data.data;
}
export const getAllSubjects = async (params?: { includeDeleted?: boolean }): Promise<Subject[]> => {
    const res = await apiClient.get("/subject", { params });
    return res.data.data;
};
export const updateSubject = async (
    id: string,
    payload: Partial<Omit<Subject, "_id" | "createdAt" | "updatedAt">>
): Promise<Subject> => {
    const res = await apiClient.patch(`/subject/${id}`, payload);
    return res.data.data;
};
export const deleteSubject = async (id: string): Promise<Subject> => {
    const res = await apiClient.delete(`/subject/${id}/soft-delete`);
    return res.data.data;
};
export const restoreSubject = async (id: string): Promise<Subject> => {
    const res = await apiClient.patch(`/subject/${id}/restore`);
    return res.data.data;
};