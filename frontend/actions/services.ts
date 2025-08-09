import {ServiceResponse} from "@/src/lib/types";
import kyAPI from "@/src/lib/kyAPI";

export const fetchAllServices = async () => {
    return await kyAPI("services").json<ServiceResponse>();
}