import {AdminForm, EditAdminForm, User} from "@/src/lib/types";
import kyAPI from "@/src/lib/kyAPI";

export const getAllAdmins = async () => {
    return await kyAPI.get("superadmin/admins").json<User[]>();
}

export const createAdmin = async (data: AdminForm) => {
    return await kyAPI
        .post("superadmin/admins", {json: data})
        .json<{ message: string; user: User }>();
};

export const editAdmin = async (id: string, data: EditAdminForm) => {
    return await kyAPI
        .patch(`superadmin/admins/${id}`, {json: data})
        .json<{ message: string; user: User }>();
};

export const removeAdmin = async (id: string) => {
    return await kyAPI
        .delete(`superadmin/admins/${id}`)
        .json<{ message: string }>();
};