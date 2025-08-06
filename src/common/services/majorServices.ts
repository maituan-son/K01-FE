import apiClient from "./apiClient";
import { Major } from "@/common/types/Major";

export const getAllMajors = async (params?: { includeDeleted?: boolean }): Promise<Major[]> => {
	const res = await apiClient.get("/major", { params });
	return res.data.data;
};

export const createMajor = async (
	payload: Omit<Major, "_id" | "deletedAt" | "createdAt" | "updatedAt">
): Promise<Major> => {
	const res = await apiClient.post("/major", payload);
	return res.data.data;
};

export const updateMajor = async (
	id: string,
	payload: Partial<Omit<Major, "_id" | "deletedAt" | "createdAt" | "updatedAt">>
): Promise<Major> => {
	const res = await apiClient.patch(`/major/${id}`, payload);
	return res.data.data;
};

export const deleteMajor = async (id: string): Promise<Major> => {
	const res = await apiClient.delete(`/major/${id}/soft-delete`);
	return res.data.data;
};

export const restoreMajor = async (id: string): Promise<Major> => {
	const res = await apiClient.patch(`/major/${id}/restore`);
	return res.data.data;
};
