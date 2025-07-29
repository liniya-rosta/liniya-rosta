'use client'

import React, {useEffect} from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faInstagram, faWhatsapp} from "@fortawesome/free-brands-svg-icons";
import {useContactStore} from "@/store/contactsStore";
import {Contact} from "@/src/lib/types";
import Loading from "@/src/components/ui/Loading/Loading";
import ErrorMsg from "@/src/components/ui/ErrorMsg";
import { useLocale } from 'next-intl';
import {Button} from "@/src/components/ui/button";

interface ContactProps {
    contactData: Contact | null;
    contactError: string | null;
}

const FooterContent: React.FC<ContactProps> = ({contactData, contactError}) => {
    const {
        contact,
        setContact,
        setFetchContactError,
        fetchContactLoading,
        setFetchContactLoading,
        fetchContactError
    } = useContactStore();

    const locale = useLocale() as "ru" | "ky";

    useEffect(() => {
        if (contactData) setContact(contactData);
        setFetchContactError(contactError);
        setFetchContactLoading(false);
    }, [contactData, contactError, setContact, setFetchContactError, setFetchContactLoading]);

    if (fetchContactLoading) return <Loading/>;
    if (fetchContactError) return <ErrorMsg error={fetchContactError}/>

    return (
        contact &&
        <div className="flex flex-col gap-2 mb-7 sm:mb-0">
            <div className="space-y-2 text-center sm:text-left">
                <p>
                    <a href={contact.mapLocation}
                       target="_blank"
                       rel="noopener noreferrer"
                       className="hover:underline"
                    >{contact.location[locale]}
                    </a>
                </p>
                <p>
                    <a href={`tel:${contact.phone1}`}
                       target="_blank"
                       className="hover:underline"
                    >{contact.phone1}
                    </a>
                </p>
                <p>
                    <a href={`tel:${contact.phone2}`}
                       target="_blank"
                       className="hover:underline"
                    >{contact.phone2}
                    </a>
                </p>
                <p>
                    <a href={`mailto:${contact.email}`}
                       target="_blank"
                       className="hover:underline"
                    >{contact.email}
                    </a>
                </p>
            </div>

            <div className="flex justify-center sm:justify-normal items-center gap-3 mt-2">
                <Button
                    variant="secondary"
                    size="icon"
                    className="w-9 h-9 rounded-full p-0"
                >
                    <a
                        href={contact.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full h-full flex items-center justify-center text-foreground hover:text-primary transition hover:scale-110"
                    >
                        <FontAwesomeIcon icon={faInstagram} className="w-7 h-7 text-xl"/>
                    </a>
                </Button>

                <Button
                    variant="secondary"
                    size="icon"
                    className="w-9 h-9 rounded-full p-0"
                >
                    <a
                        href={`https://wa.me/${contact.whatsapp.replace('+', '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full h-full flex items-center justify-center text-foreground hover:text-primary transition hover:scale-110"
                    >
                        <FontAwesomeIcon icon={faWhatsapp} className="w-7 h-7 text-xl"/>
                    </a>
                </Button>
            </div>
        </div>
    );
};

export default FooterContent;