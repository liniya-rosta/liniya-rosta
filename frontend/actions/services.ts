import axiosAPI from "@/lib/axiosAPI";
import {ServiceResponse} from "@/lib/types";

export const fetchAllServices = async (title?: string) => {
    const params = new URLSearchParams();
    if (title) params.append("title", title);

    const response = await axiosAPI<ServiceResponse>(
        `/services${params.toString() ? `?${params.toString()}` : ""}`
    );

    return response.data;
}