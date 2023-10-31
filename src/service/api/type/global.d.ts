type BaseResponse<T> = {
    status: boolean;
    message: string;
    data: T;
    validateError: Record<string, string>;
};
