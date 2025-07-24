import axiosAPI from "@/src/lib/axiosAPI";
import {ServiceResponse} from "@/src/lib/types";

export const fetchAllServices = async () => {
    const response = await axiosAPI<ServiceResponse>("/services");
    return response.data;
}