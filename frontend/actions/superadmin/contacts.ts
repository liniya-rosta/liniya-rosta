import {Contact} from '@/src/lib/types';
import kyAPI from "@/src/lib/kyAPI";

export const updateContact = async (id: string, data: Partial<Contact>) => {
    return await kyAPI.patch(`superadmin/contacts/${id}`, {json: data}).json<{ message: string; contact: Contact }>();
};
