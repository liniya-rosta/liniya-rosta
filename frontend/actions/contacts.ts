import axiosAPI from '@/lib/axiosAPI';
import {Contact} from '@/lib/types';
import {isAxiosError} from "axios";

export const fetchContacts = async () => {
    try {
        const res = await axiosAPI.get<Contact>('/contacts');
        return res.data;
    } catch (e) {
        if (isAxiosError(e)) {
            throw new Error(e.response?.data || 'Произошла ошибка при получении контактной информации');
        }
        throw e;
    }
};
