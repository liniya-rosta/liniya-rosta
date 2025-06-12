import React from "react";
import {Contact} from "@/lib/types";
import ContactsClient from "@/app/contacts/ContactsClient";
import {fetchContacts} from "@/actions/contacts";

const ContactsPage = async () => {
        let contact: Contact | null = null;
        let contactError: string | null = null;

        try {
            contact = await fetchContacts();
        } catch (e) {
            if (e instanceof Error) {
                contactError = e.message;
            } else {
                contactError = 'Неизвестная ошибка на сервере при загрузке контактной информации.';
            }
        }

        return (
            <ContactsClient data={contact} error={contactError}/>
        );
    }
;

export default ContactsPage;