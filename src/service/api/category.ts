import { axiosClient } from "./axiosClient";
import {
    CategoryPayload,
    GetCategoriesResponse,
    GetCategoryByIdResponse,
} from "./type/category";

const categoryApi = {
    getByPageId: (pageId: string) =>
        axiosClient.get<any, GetCategoriesResponse>(`/admin/category`, {
            params: { page: pageId },
        }),
    getById: (id: string) =>
        axiosClient.get<any, GetCategoryByIdResponse>(`/admin/category/${id}`),
    create: (payload: CategoryPayload) =>
        axiosClient.post<any, BaseResponse<null>>("/admin/category", payload),
    edit: (id: string, payload: CategoryPayload) =>
        axiosClient.put<any, BaseResponse<null>>(
            `/admin/category/${id}`,
            payload
        ),
    delete: (id: string) =>
        axiosClient.delete<any, BaseResponse<null>>(`/admin/category/${id}`),
};

export { categoryApi };
