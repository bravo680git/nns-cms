import axios from "axios";

const axiosClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BASE_URL,
    headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.NEXT_PUBLIC_APP_KEY,
    },
});

axiosClient.interceptors.request.use((config) => {
    if (typeof window !== "undefined") {
        config.headers["x-api-token"] =
            "Bearer " + localStorage.getItem("token");
    }

    return config;
});

axiosClient.interceptors.response.use(
    (response) => {
        const data: BaseResponse<any> = response.data;

        if (!data.status) {
            return Promise.reject(data);
        }

        return data as any;
    },
    (error) => {
        const message = error.data?.message ?? "Error";
        const status = error.data?.status ?? 500;

        return Promise.reject({ message, status });
    }
);

export { axiosClient };
