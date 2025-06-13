'use client';

import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInstagram, faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import RequestBtn from "@/components/ui/RequestBtn";
import { ModalWindow } from "@/components/ui/modal-window";
import RequestForm from "@/components/shared/RequestForm";
import { Contact } from '@/lib/types';
import {fetchContacts} from "@/actions/contacts";

const Footer = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [contact, setContact] = useState<Contact | null>(null);

    useEffect(() => {
        fetchContacts()
            .then(setContact)
            .catch((error) => console.error('Ошибка получения контактов:', error));
    }, []);

    const openModal = () => setIsOpen(true);
    const closeModal = () => setIsOpen(false);

    if (!contact) return null;

    return (
        <>
            <footer className="p-10 bg-gray-800 mt-8 text-white">
                <div className="flex flex-wrap items-center justify-around w-full">
                    <div className="flex flex-col gap-2">
                        <p><a href={contact.mapLocation} target="_blank" rel="noopener noreferrer">{contact.location}</a></p>
                        <p><a href={`tel:${contact.phone1}`} target="_blank">{contact.phone1}</a></p>
                        <p><a href={`tel:${contact.phone2}`} target="_blank">{contact.phone2}</a></p>
                        <p><a href={`mailto:${contact.email}`} target="_blank">{contact.email}</a></p>
                        <div className="flex items-center gap-2 mt-2">
                            <a href={contact.instagram} target="_blank" rel="noopener noreferrer">
                                <FontAwesomeIcon icon={faInstagram} className="w-6 h-6 text-white hover:animate-pulse" />
                            </a>
                            <a href={`https://wa.me/${contact.whatsapp.replace('+', '')}`} target="_blank" rel="noopener noreferrer">
                                <FontAwesomeIcon icon={faWhatsapp} className="w-6 h-6 text-white hover:animate-pulse" />
                            </a>
                        </div>
                    </div>

                    <RequestBtn onClick={openModal} />
                </div>
            </footer>

            <ModalWindow isOpen={isOpen} onClose={closeModal}>
                <RequestForm closeModal={closeModal} />
            </ModalWindow>
        </>
    );
};

export default Footer;
