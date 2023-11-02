export type LoginPayload = {
    email: string;
    password: string;
};

export type LoginResponse = BaseResponse<{
    access_token: string;
    refresh_token: string;
    user: {
        _id: string;
        email: string;
        name: string;
        avatar: string;
        role: string;
    };
}>;
