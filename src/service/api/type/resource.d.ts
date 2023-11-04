export type GetResourcesResponse = BaseResponse<{
    pages: {
        _id: string;
        name: string;
        url: string;
    }[];
}>;

export type GetResourceByIdResponse = BaseResponse<{
    page: {
        _id: string;
        name: string;
        url: string;
    };
}>;

export type ResourcePayload = {
    name: string;
    url: string;
};

export type GetManagerDashboardResponse = BaseResponse<{
    categories: number;
    total_content: number;
    contents: Record<string, number>;
}>;
