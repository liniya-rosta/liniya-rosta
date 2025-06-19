import axios from "axios";
import {API_BASE_URL} from "@/lib/globalConstants";
import {refreshAccessToken} from "@/actions/users";
import useUserStore from "@/store/usersStore";

const axiosAPI = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
});

axiosAPI.interceptors.request.use(config => {
    const {accessToken} = useUserStore.getState();
    if (accessToken && config.headers) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
});

axiosAPI.interceptors.response.use(
    res => res,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const newToken = await refreshAccessToken();
                useUserStore.getState().setAccessToken(newToken);

                if (originalRequest.headers) {
                    originalRequest.headers.Authorization = `Bearer ${newToken}`;
                }

                return axiosAPI(originalRequest);
            } catch (e) {
                useUserStore.getState().setAccessToken(null);
                useUserStore.getState().setLogout();
                return Promise.reject(e);
            }
        }

        return Promise.reject(error);
    }
);


export default axiosAPI;
