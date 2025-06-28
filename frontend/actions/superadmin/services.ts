import {ServiceForm, ServiceUpdate} from "@/lib/types";
import axiosAPI from "@/lib/axiosAPI";

export const fetchServiceById = async (id: string) => {
    const response =  await  axiosAPI.get(`/services/${id}`);
    return response.data;
}

export const createService = async (data: ServiceForm) => {
    await axiosAPI.post("/superadmin/services", data)
}

export const updateService = async (id: string, data: ServiceUpdate) => {
    await axiosAPI.patch(`/superadmin/services/${id}`, data);
};

export const deleteService = async (id: string) => {
    await axiosAPI.delete(`/superadmin/services/${id}`);
};