import {Contact} from '@/src/lib/types';
import kyAPI from "@/src/lib/kyAPI";

export const fetchContacts = async (): Promise<Contact> => {
    return await kyAPI.get('contacts').json<Contact>();
};