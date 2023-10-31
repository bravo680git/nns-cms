import { axiosClient } from "./axiosClient";
import {
    ResourcePayload,
    GetResourcesResponse,
    GetResourceByIdResponse,
} from "./type/resource";

const resourceApi = {
    getAll: () => axiosClient.get<any, GetResourcesResponse>("/admin/page"),
    getById: (id: string) =>
        axiosClient.get<any, GetResourceByIdResponse>(`/admin/page/${id}`),
    create: (payload: ResourcePayload) =>
        axiosClient.post<any, BaseResponse<null>>("/admin/page", payload),
    edit: (id: string, payload: ResourcePayload) =>
        axiosClient.put<any, BaseResponse<null>>(`/admin/page/${id}`, payload),
    delete: (id: string) =>
        axiosClient.delete<any, BaseResponse<null>>(`/admin/page/${id}`),
};

export { resourceApi };
