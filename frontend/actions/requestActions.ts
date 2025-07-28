import axiosAPI from "@/src/lib/axiosAPI";
import {IRequestMutation} from "@/src/lib/types";

export const createRequest = async (data: IRequestMutation) => {
    try {
        await axiosAPI.post('/requests', data);
        return null
    } catch (e: any) {
        return e.response?.data?.message;
    }
}