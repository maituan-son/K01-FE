import { Params } from "../types/api";
import { Class } from "../types/Class";
import apiClient from "./apiClient";
export const getAllClasses = async (params?: Params): Promise<Class[]> => {
  const response = await apiClient.get("/class", {params});
  return response.data.data || response.data;
}
export const getClassDetail = async (id: string) => {
  const response = await apiClient.get(`/class/${id}`);
  return response.data.data;
};
export const createClass = async (payload: Omit<Class, "_id" | "deletedAt" | "createdAt">): Promise<Class> => {
  const response = await apiClient.post("/class", payload);
  return response.data.data;
}

export const updateClass = async (
	id: string,
	payload: Partial<Omit<Class, "_id" | "deletedAt" | "createdAt" | "updatedAt">>
): Promise<Class> => {
	const res = await apiClient.put(`/class/${id}`, payload);
	return res.data.data;
};

export const deleteClass = async (id: string): Promise<Class> => {
	const res = await apiClient.delete(`/class/${id}/soft-delete`);
	return res.data.data;
};

export const restoreClass = async (id: string): Promise<Class> => {
	const res = await apiClient.patch(`/class/${id}/restore`);
	return res.data.data;
};
