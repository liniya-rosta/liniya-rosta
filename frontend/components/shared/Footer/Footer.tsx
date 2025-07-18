import React from 'react';
import {Contact} from '@/lib/types';
import {fetchContacts} from "@/actions/contacts";
import FooterBtn from "@/components/shared/Footer/FooterBtn";
import FooterContent from "@/components/shared/Footer/FooterContent";
import {Container} from "@/components/shared/Container";

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
                    <div className="flex flex-wrap items-center justify-between w-full">
                        <FooterContent contactData={contactData} contactError={contactError}/>
                        <FooterBtn/>
                    </div>
                </Container>
            </footer>
        </>
    );
};

export default Footer;