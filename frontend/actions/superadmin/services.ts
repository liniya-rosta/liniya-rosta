import {Service, ServiceForm, ServiceUpdate} from "@/src/lib/types";
import kyAPI from "@/src/lib/kyAPI";

export const fetchServiceById = async (id: string) => {
    return await kyAPI.get(`services/${id}`).json<Service>();
}

export const createService = async (data: ServiceForm) => {
    await kyAPI.post("superadmin/services", {json: data});
}

export const updateService = async (id: string, data: ServiceUpdate) => {
    await kyAPI.patch(`superadmin/services/${id}`, {json: data});
};

export const deleteService = async (id: string) => {
    await kyAPI.delete(`superadmin/services/${id}`).json<{ message: string }>();
};