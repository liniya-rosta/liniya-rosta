import axiosAPI from '@/src/lib/axiosAPI';
import {Contact} from '@/src/lib/types';

export const fetchContacts = async () => {
    const res = await axiosAPI.get<Contact>('/contacts');
    return res.data;
};
