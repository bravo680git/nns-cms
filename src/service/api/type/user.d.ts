export type GetUserListResponse = BaseResponse<{
    users: {
        _id: string;
        email: string;
        name: string;
        avatar: string;
        role: string;
        page: {
            _id: string;
            name: string;
            url: string;
        };
    }[];
}>;

export type GetUserByIdResponse = BaseResponse<{
    user: GetUserListResponse["data"]["users"][0];
}>;

export type UserPayload = {
    email: string;
    password: string;
    name: string;
    page: string;
};
