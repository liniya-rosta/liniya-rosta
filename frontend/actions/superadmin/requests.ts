import axiosAPI from "@/lib/axiosAPI";
import {IRequest} from "@/lib/types";

export const fetchAllRequests = async () => {
    const response = await axiosAPI.get<IRequest[]>("/superadmin/requests")
    return response.data;
}