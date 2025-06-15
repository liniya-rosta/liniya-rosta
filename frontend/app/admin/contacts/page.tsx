import { Contact } from '@/lib/types';
import {fetchContacts} from "@/actions/contacts";
import AdminContactsClient from "@/app/admin/contacts/AdminContactsClient";

const AdminContactsPage = async () => {
    let contact: Contact | null = null;
    let contactError: string | null = null;

    try {
        contact = await fetchContacts();
    } catch (e) {
        contactError = e instanceof Error ? e.message : 'Неизвестная ошибка на сервере.';
    }

    return <AdminContactsClient data={contact} error={contactError} />;
};

export default AdminContactsPage;
