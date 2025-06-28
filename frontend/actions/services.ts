import axiosAPI from "@/lib/axiosAPI";
import {ServiceResponse} from "@/lib/types";

export const fetchAllServices = async () => {
    const response = await axiosAPI<ServiceResponse>("/services");
    return response.data;
}