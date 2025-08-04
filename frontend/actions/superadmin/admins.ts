import axiosAPI from "@/src/lib/axiosAPI";
import {AdminForm, EditAdminForm, User} from "@/src/lib/types";

export const getAllAdmins = async () => {
    const response = await axiosAPI.get<User[]>("/superadmin/admins")
    return response.data;
}

export const createAdmin = async (data: AdminForm) => {
    const res = await axiosAPI.post("/superadmin/admins", data);
    return res.data;
};

export const editAdmin = async (id: string, data: EditAdminForm) => {
    const res = await axiosAPI.patch<{ message: string; user: User }>(`/superadmin/admins/${id}`, data);
    return res.data;
};

export const removeAdmin = async (id: string) => {
    const res = await axiosAPI.delete<{ message: string }>(`/superadmin/admins/${id}`);
    return res.data;
};