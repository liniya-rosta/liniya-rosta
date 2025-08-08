import React from 'react';
import {Contact} from '@/src/lib/types';
import {fetchContacts} from "@/actions/contacts";
import FooterBtn from "@/src/components/shared/Footer/FooterBtn";
import FooterContent from "@/src/components/shared/Footer/FooterContent";
import {getTranslations} from "next-intl/server";
import {Container} from '../Container';
import {handleKyError} from "@/src/lib/handleKyError";

const Footer = async () => {
    let contactData: Contact | null = null;
    let contactError: string | null = null;
    const tError = await getTranslations('Errors');

    try {
        contactData = await fetchContacts();
    } catch (e) {
        contactError = await handleKyError(e, tError('contactsError'));
    }

    return (
        <footer className="py-20 mt-10">
            <Container>
                <div className="flex flex-wrap items-center justify-center sm:justify-between w-full">
                    <FooterContent contactData={contactData} contactError={contactError}/>

                    <div className="w-full sm:w-auto">
                        <div className="flex justify-center sm:block">
                            <FooterBtn/>
                        </div>
                    </div>
                </div>
            </Container>
        </footer>
    );
};

export default Footer;