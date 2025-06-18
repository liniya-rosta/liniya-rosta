import axiosAPI from '@/lib/axiosAPI';
import {Contact} from '@/lib/types';

export const updateContact = async (id: string, data: Partial<Contact>) => {
    const res = await axiosAPI.patch<{ message: string; contact: Contact }>(`/superadmin/contacts/${id}`, data);
    return res.data;
};
