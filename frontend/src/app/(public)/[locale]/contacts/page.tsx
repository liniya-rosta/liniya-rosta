import React from "react";
import {Contact} from "@/src/lib/types";
import ContactsClient from "@/src/app/(public)/[locale]/contacts/ContactsClient";
import {fetchContacts} from "@/actions/contacts";
import {Metadata} from "next";
import {getTranslations} from "next-intl/server";

export const revalidate = 3600;

export const generateMetadata = async (): Promise<Metadata> => ({
    title: "Контакты",
    description: "Контактная информация компании Линия Роста: адрес, телефоны, мессенджеры и соцсети. Свяжитесь с нами для консультации или заказа.",
    openGraph: {
        title: "Контакты | Линия Роста",
        description: "Адрес и контакты компании Линия Роста. Работаем в Бишкеке и по области. Ответим на любые вопросы по потолкам и ламинату.",
        url: "/contacts",
        siteName: "Линия Роста",
        type: "website",
    },
});

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