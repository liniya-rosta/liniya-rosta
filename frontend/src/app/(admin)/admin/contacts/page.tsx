import {Contact} from '@/src/lib/types';
import {fetchContacts} from "@/actions/contacts";
import AdminContactsClient from "@/src/app/(admin)/admin/contacts/AdminContactsClient";
import {handleKyError} from "@/src/lib/handleKyError";
import {getTranslations} from "next-intl/server";

const AdminContactsPage = async () => {
    let contact: Contact | null = null;
    let contactError: string | null = null;
    const tError = await getTranslations("Errors");

    try {
        contact = await fetchContacts();
    } catch (e) {
        contactError = await handleKyError(e, tError('contactsError'));
    }

    return <AdminContactsClient data={contact} error={contactError}/>;
};

export default AdminContactsPage;
