import { Params } from "../types/api";
import User from "../types/User";
import apiClient from "./apiClient";
export const getAllUsers = async (params?: Params): Promise<User[]> => {
  const response = await apiClient.get("/user", {params});
  return response.data.data;
};
export const getUser = async (userId: string): Promise<User> =>  {
    const response = await apiClient.get(`/user/${userId}`);
    return response.data.data;
};
export const createUser = async (payload: Omit<User, "_id" | "deletedAt" | "createdAt">): Promise<User> => {
  const response = await apiClient.post("/user", payload);
  return response.data.data;
};

export const getProfile = async (): Promise<User> => {
  const response = await apiClient.get("/user/profile/me");
  return response.data.data;
};
export const updateProfile = async (payload: Partial<User>): Promise<User> => {
  const response = await apiClient.patch("/user/profile/update", payload);
  return response.data.data;
};
export const updateRole = async (userId: string, role: string): Promise<User> => {
  const response = await apiClient.patch(`/user/role/${userId}`, { role });
  return response.data.data;
};

export const blockUser = async (
    userId: string,
    payload: { isBlocked: boolean }
): Promise<User> => {
    const response = await apiClient.patch(`/user/block/${userId}`, payload);
    return response.data.data;
};
