'use client'

import React, {useEffect} from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faInstagram, faWhatsapp} from "@fortawesome/free-brands-svg-icons";
import {useContactStore} from "@/store/contactsStore";
import {Contact} from "@/lib/types";
import Loading from "@/components/ui/Loading/Loading";
import ErrorMsg from "@/components/ui/ErrorMsg";
import {Button} from "@/components/ui/button";

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

    useEffect(() => {
        if (contactData) setContact(contactData);
        setFetchContactError(contactError);
        setFetchContactLoading(false);
    }, [contactData, contactError, setContact, setFetchContactError, setFetchContactLoading]);

    const socialLinks = contact
        ? [
            {
                icon: faInstagram,
                href: contact.instagram,
                label: "Instagram",
            },
            {
                icon: faWhatsapp,
                href: `https://wa.me/${contact.whatsapp.replace('+', '')}`,
                label: "WhatsApp",
            },
        ]
        : [];

    if (fetchContactLoading) return <Loading/>;
    if (fetchContactError) return <ErrorMsg error={fetchContactError} label='контактов'/>

    return (
        contact &&
        <div className="flex flex-col gap-2">
            <p><a href={contact.mapLocation} target="_blank"
                  rel="noopener noreferrer">{contact.location}</a></p>
            <p><a href={`tel:${contact.phone1}`} target="_blank">{contact.phone1}</a></p>
            <p><a href={`tel:${contact.phone2}`} target="_blank">{contact.phone2}</a></p>
            <p><a href={`mailto:${contact.email}`} target="_blank">{contact.email}</a></p>
            <div className="flex items-center gap-3 mt-2">
                {socialLinks.map(({ icon, href, label }) => (
                    <Button
                        key={label}
                        variant="secondary"
                        size="icon"
                        className="w-9 h-9 rounded-full p-0"
                    >
                        <a
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full h-full flex items-center justify-center text-foreground hover:text-primary transition hover:scale-110"
                            aria-label={label}
                        >
                            <FontAwesomeIcon icon={icon} className="w-7 h-7 text-xl" />
                        </a>
                    </Button>
                ))}
            </div>
        </div>
    );
};

export default FooterContent;