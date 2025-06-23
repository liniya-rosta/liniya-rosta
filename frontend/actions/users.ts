import axiosAPI from "@/lib/axiosAPI";
import {EditProfileForm, UserForm} from "@/lib/types";

export const login = async (data: UserForm) => {
    try {
        const { email, password, confirmPassword } = data;

        const response = await axiosAPI.post("/users/sessions",
            { email, password, confirmPassword });
        return response.data;
    } catch (e) {
       console.log(e);
    }
};

export const refreshAccessToken = async () => {
    try {
        const response = await axiosAPI.post("/users/refresh-token",);
        return response.data.accessToken;
    } catch(e) {
        console.log(e);
    }
};

export const logout = async () => {
    try {
        await axiosAPI.delete("/users/logout");
    }catch(e) {
        console.log(e);
    }
}

export const editProfile = async (data: EditProfileForm) => {
    const response = await axiosAPI.patch('/users/profile', data);
    return response.data;
};