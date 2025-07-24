import React from "react";
import {Contact} from "@/src/lib/types";
import ContactsClient from "@/src/app/(public)/[locale]/contacts/ContactsClient";
import {fetchContacts} from "@/actions/contacts";
import {getTranslations} from "next-intl/server";

export const revalidate = 3600;

const ContactsPage = async () => {
        let contact: Contact | null = null;
        let contactError: string | null = null;
        const tErrors = await getTranslations("Errors");

        try {
            contact = await fetchContacts();
        } catch (e) {
            if (e instanceof Error) {
                contactError = e.message;
            } else {
                contactError = tErrors("contactsError");
            }
        }

        return (
            <ContactsClient  data={contact} error={contactError} />
        );
    }
;

export default ContactsPage;