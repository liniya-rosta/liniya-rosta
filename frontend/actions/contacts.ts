import {ContactDataDTO} from "@/lib/types";
import axiosAPI from "@/lib/axiosAPI";

export const fetchContactsData = async () => {
    return axiosAPI.get<ContactDataDTO>('/localhost:8000/contacts')
}