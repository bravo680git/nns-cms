import { axiosClient } from "./axiosClient";
import { LoginPayload, LoginResponse } from "./type/auth";

const authApi = {
    login: (data: LoginPayload) =>
        axiosClient.post<any, LoginResponse>("/auth/login", data),
};

export { authApi };
