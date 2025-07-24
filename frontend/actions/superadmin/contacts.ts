import axiosAPI from '@/src/lib/axiosAPI';
import {Contact} from '@/src/lib/types';

export const updateContact = async (id: string, data: Partial<Contact>) => {
    const res = await axiosAPI.patch<{ message: string; contact: Contact }>(`/superadmin/contacts/${id}`, data);
    return res.data;
};
