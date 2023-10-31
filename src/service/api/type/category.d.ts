export type GetCategoriesResponse = BaseResponse<{
    categories: {
        _id: string;
        name: string;
        page: string;
        key: Record<string, any>;
        value: any[];
    }[];
}>;

export type GetCategoryByIdResponse = BaseResponse<{
    category: GetCategoriesResponse["data"]["categories"][number];
}>;

export type CategoryPayload = {
    name: string;
    page: string;
    key: Record<string, any>;
};
