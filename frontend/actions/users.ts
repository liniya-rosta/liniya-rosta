import {EditProfileForm, User, UserForm} from "@/src/lib/types";
import kyAPI from "@/src/lib/kyAPI";

type LoginResponse = {
    user: User;
    accessToken: string;
};

export const login = async (data: UserForm): Promise<LoginResponse> => {
    try {
        const {email, password, confirmPassword} = data;

        return await kyAPI.post("users/sessions", {
            json: {email, password, confirmPassword}
        }).json<LoginResponse>();
    } catch (e) {
        console.log(e);
        throw e;
    }
};

export const refreshAccessToken = async () => {
    try {
        const res = await kyAPI.post("users/refresh-token").json<{ accessToken: string }>();
        return res.accessToken;
    } catch (e) {
        console.log(e);
    }
};

export const logout = async () => {
    try {
        await kyAPI.delete("users/logout");
    } catch (e) {
        console.log(e);
    }
}

export const editProfile = async (data: EditProfileForm) => {
    return await kyAPI.patch("users/profile", {
        json: data
    }).json();
};