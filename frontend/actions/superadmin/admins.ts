import axiosAPI from "@/lib/axiosAPI";
import {AdminForm, User} from "@/lib/types";

export const getAllAdmins = async () => {
    const response = await axiosAPI.get<User[]>("/superadmin/admins")
    return response.data;
}

export const createAdmin = async (data: AdminForm) => {
    const res = await axiosAPI.post<{ message: string; user: User }>("/superadmin/admins", data);
    return res.data;
};

export const editAdminRole = async (id: string, role: "admin" | "superadmin") => {
    const res = await axiosAPI.patch<{ message: string; user: User }>(`/superadmin/admins/${id}/role`, {role});
    return res.data;
};

export const removeAdmin = async (id: string) => {
    const res = await axiosAPI.delete<{ message: string }>(`/superadmin/admins/${id}`);
    return res.data;
};
