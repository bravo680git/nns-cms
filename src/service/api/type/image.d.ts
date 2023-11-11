export type UploadImagePayload = {
    name?: string;
    image: File;
};

export type GetImageListResponse = BaseResponse<{
    images: {
        _id: string;
        name: string;
        image: string;
        public_id: string;
        url: string;
    }[];
}>;

export type GetImageResponse = BaseResponse<{
    image: GetImageListResponse["data"]["images"][number];
}>;

export type UploadImageSuccessResponse = BaseResponse<
    GetImageListResponse["data"]["images"][number]
>;
