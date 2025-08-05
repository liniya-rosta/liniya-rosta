import React from "react";
import {Contact} from "@/src/lib/types";
import ContactsClient from "@/src/app/(public)/[locale]/contacts/ContactsClient";
import {fetchContacts} from "@/actions/contacts";
import {Metadata} from "next";
import {getTranslations} from "next-intl/server";

export const revalidate = 3600;

export const generateMetadata = async (): Promise<Metadata> => {
    const t = await getTranslations("ContactsPage");
    const tHeader = await getTranslations("Header");

    return {
        title: tHeader("headerLinks.contacts"),
        description: t("descriptionSeo"),
        openGraph: {
            title: t("ogTitle"),
            description: t("ogDescription"),
            url: "/contacts",
            siteName: "Линия Роста",
            images: [
                {
                    url: "/images/services/main-service.JPG",
                    width: 1200,
                    height: 630,
                    alt: t("ogImageAlt"),
                },
            ],
            type: "website",
        },
    };
};

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
            <ContactsClient data={contact} error={contactError}/>
        );
    }
;

export default ContactsPage;