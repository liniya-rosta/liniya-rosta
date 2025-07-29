import React from 'react';
import {Contact} from '@/src/lib/types';
import {fetchContacts} from "@/actions/contacts";
import FooterBtn from "@/src/components/shared/Footer/FooterBtn";
import FooterContent from "@/src/components/shared/Footer/FooterContent";
import {getTranslations} from "next-intl/server";
import { Container } from '../Container';

const Footer = async () => {
    let contactData: Contact | null = null;
    let contactError: string | null = null;
    const tError = await getTranslations('Errors');

    try {
        contactData = await fetchContacts();
    } catch (e) {
        if (e instanceof Error) {
            contactError = e.message;
        } else {
            contactError = tError('contactsError');
        }
    }

    return (
        <footer className="py-10 mt-10">
            <Container>
                <div className="flex flex-wrap items-center justify-center sm:justify-between w-full">
                    <FooterContent contactData={contactData} contactError={contactError}/>
                    <FooterBtn/>
                </div>
            </Container>
        </footer>
    );
};

export default Footer;