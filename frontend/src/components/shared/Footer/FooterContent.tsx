'use client'

import React, {useEffect} from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faInstagram, faWhatsapp} from "@fortawesome/free-brands-svg-icons";
import {useContactStore} from "@/store/contactsStore";
import {Contact} from "@/src/lib/types";
import Loading from "@/src/components/ui/Loading/Loading";
import ErrorMsg from "@/src/components/ui/ErrorMsg";
import { useLocale } from 'next-intl';

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
        <div className="flex flex-col gap-2">
            <p><a href={contact.mapLocation} target="_blank"
                  rel="noopener noreferrer">{contact.location[locale]}</a></p>
            <p><a href={`tel:${contact.phone1}`} target="_blank">{contact.phone1}</a></p>
            <p><a href={`tel:${contact.phone2}`} target="_blank">{contact.phone2}</a></p>
            <p><a href={`mailto:${contact.email}`} target="_blank">{contact.email}</a></p>
            <div className="flex items-center gap-2 mt-2">
                <a href={contact.instagram} target="_blank" rel="noopener noreferrer">
                    <FontAwesomeIcon icon={faInstagram} className="w-6 h-6 text-white hover:animate-pulse"/>
                </a>
                <a href={`https://wa.me/${contact.whatsapp.replace('+', '')}`} target="_blank"
                   rel="noopener noreferrer">
                    <FontAwesomeIcon icon={faWhatsapp} className="w-6 h-6 text-white hover:animate-pulse"/>
                </a>
            </div>
        </div>
    );
};

export default FooterContent;