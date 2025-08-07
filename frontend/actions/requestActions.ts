import {IRequestMutation} from "@/src/lib/types";
import kyAPI from "@/src/lib/kyAPI";

export const createRequest = async (data: IRequestMutation) => {
    await kyAPI.post('requests', {json: data});
    return null
}