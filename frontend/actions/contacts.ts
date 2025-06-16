import axiosAPI from '@/lib/axiosAPI';
import {Contact} from '@/lib/types';

export const fetchContacts = async () => {
    const res = await axiosAPI.get<Contact>('/contacts');
    return res.data;
};
