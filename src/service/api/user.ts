import { axiosClient } from "./axiosClient";
import {
    GetUserByIdResponse,
    GetUserListResponse,
    UserPayload,
} from "./type/user";

export const userApi = {
    getAll: () => axiosClient.get<any, GetUserListResponse>("/admin/user"),
    getById: (id: string) =>
        axiosClient.get<any, GetUserByIdResponse>(`/admin/user/${id}`),
    create: (payload: UserPayload) =>
        axiosClient.post<any, BaseResponse<null>>("/admin/user", payload),
    edit: (id: string, payload: UserPayload) =>
        axiosClient.put<any, BaseResponse<null>>(`/admin/user/${id}`, payload),
    delete: (id: string) =>
        axiosClient.delete<any, BaseResponse<null>>(`/admin/user/${id}`),
};
