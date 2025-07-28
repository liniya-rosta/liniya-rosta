import React from 'react';
import {Contact} from '@/src/lib/types';
import {fetchContacts} from "@/actions/contacts";
import FooterBtn from "@/src/components/shared/Footer/FooterBtn";
import FooterContent from "@/src/components/shared/Footer/FooterContent";
import {Container} from "@/src/components/shared/Container";

const Footer = async () => {
    let contactData: Contact | null = null;
    let contactError: string | null = null;

    try {
        contactData = await fetchContacts();
    } catch (e) {
        if (e instanceof Error) {
            contactError = e.message;
        } else {
            contactError = 'Неизвестная ошибка на сервере при загрузке товаров.';
        }
    }

    return (
        <>
            <footer className="p-10 mt-10">
                <Container>
                    <div className="flex flex-wrap items-center justify-center sm:justify-between w-full">
                        <FooterContent contactData={contactData} contactError={contactError}/>
                        <FooterBtn/>
                    </div>
                </Container>
            </footer>
        </>
    );
};

export default Footer;