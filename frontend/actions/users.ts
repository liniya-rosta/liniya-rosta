import axiosAPI from "@/lib/axios/axiosAPI";
import {UserForm} from "@/lib/types";

export const login = async (data: UserForm) => {
    try {
        const { email, password } = data;

        const response = await axiosAPI.post(
            "/users/sessions",
            { email, password },
            { withCredentials: true });
        return response.data;
    } catch (e) {
       console.log(e);
    }
};

export const refreshAccessToken = async () => {
    try {
        const response = await axiosAPI.post(
            "/users/refresh-token",
            {},
            { withCredentials: true }
        );
        return response.data.accessToken;
    } catch(e) {
        console.log(e);
    }
};

export const logout = async () => {
    try {
        await axiosAPI.delete("/users/logout", { withCredentials: true });
    }catch(e) {
        console.log(e);
    }
}