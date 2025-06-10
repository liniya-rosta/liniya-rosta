import axiosAPI from "@/lib/axiosAPI";
import {IRequestMutation} from "@/lib/types";

export const createRequest = async (data: IRequestMutation) => {
    try {
        await axiosAPI.post('/requests', data);
        return null
    } catch (e: any) {
        return e.response?.data?.message;
    }
}