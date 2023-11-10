import { axiosClient } from "./axiosClient";
import {
    GetImageListResponse,
    GetImageResponse,
    UploadImagePayload,
    UploadImageSuccessResponse,
} from "./type/image";

const imageApi = {
    upload: (payload: UploadImagePayload) => {
        const imgName = payload.name ?? payload.image.name.replace(/\.\w+/, "");
        const formData = new FormData();
        formData.append("name", imgName);
        formData.append("image", payload.image);

        return axiosClient.post<any, UploadImageSuccessResponse>(
            "/manager/image",
            formData,
            {
                headers: { "Content-Type": "multipart/form-data" },
            }
        );
    },
    getList: () => axiosClient.get<any, GetImageListResponse>("/manager/image"),
    getById: (id: string) =>
        axiosClient.get<any, GetImageResponse>(`/manager/image/${id}`),
    edit: (id: string, name: string) =>
        axiosClient.put<any, BaseResponse<null>>(`/manager/image/${id}`, {
            name,
        }),
    delete: (id: string) =>
        axiosClient.delete<any, BaseResponse<null>>(`/manager/image/${id}`),
};

export { imageApi };
