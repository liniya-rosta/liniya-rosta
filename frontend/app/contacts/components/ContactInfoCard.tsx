'use client';

import {Mail, Phone, MapPin} from 'lucide-react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faInstagram, faWhatsapp} from '@fortawesome/free-brands-svg-icons';
import {useContactStore} from '@/store/contactsStore';

const ContactInfoCard = () => {
    const contact = useContactStore(state => state.contact);
    if (!contact) return <p>Данные контактов не загружены</p>;

    return (
        <section
            aria-labelledby="contact-info-heading"
            className="bg-white rounded-xl border border-gray-200 shadow-sm"
        >
            <div className="p-6 flex items-center space-x-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                    <Mail className="h-6 w-6 text-blue-700"/>
                </div>
                <h2 id="contact-info-heading" className="text-xl font-semibold text-gray-900">
                    Контактная информация
                </h2>
            </div>
            <div className="p-6 pt-0">
                <address className="not-italic space-y-6 text-gray-700">
                    <ul className="space-y-4">
                        <li>
                            <a
                                href={contact.linkLocation}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center space-x-2 group hover:text-blue-600 transition-colors"
                            >
                                <MapPin className="w-5 h-5 text-gray-700 transition-colors group-hover:text-blue-600"/>
                                <span>{contact.location}</span>
                            </a>
                        </li>
                        <li>
                            <a
                                href={`tel:${contact.phone1.replace(/\s+/g, '')}`}
                                className="inline-flex items-center space-x-2 group hover:text-blue-600 transition-colors"
                            >
                                <Phone className="w-5 h-5 text-gray-700 transition-colors group-hover:text-blue-600"/>
                                <span>{contact.phone1}</span>
                            </a>
                        </li>
                        {contact.phone2 && (
                            <li>
                                <a
                                    href={`tel:${contact.phone2.replace(/\s+/g, '')}`}
                                    className="inline-flex items-center space-x-2 group hover:text-blue-600 transition-colors"
                                >
                                    <Phone
                                        className="w-5 h-5 text-gray-700 transition-colors group-hover:text-blue-600"/>
                                    <span>{contact.phone2}</span>
                                </a>
                            </li>
                        )}
                        <li>
                            <a
                                href={`mailto:${contact.email}`}
                                className="inline-flex items-center space-x-2 group hover:text-blue-600 transition-colors"
                            >
                                <Mail className="w-5 h-5 text-gray-700 transition-colors group-hover:text-blue-600"/>
                                <span>{contact.email}</span>
                            </a>
                        </li>
                    </ul>

                    <ul className="flex gap-4 mt-6">
                        <li>
                            <a
                                href={contact.instagram}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Instagram"
                                className="group hover:scale-105 transform transition-all"
                            >
                                <div
                                    className="w-12 h-12 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-gray-200 shadow-sm transition-all">
                                    <FontAwesomeIcon
                                        icon={faInstagram}
                                        className="text-pink-600 group-hover:text-pink-700"
                                        style={{fontSize: '28px'}}
                                    />
                                </div>
                            </a>
                        </li>
                        <li>
                            <a
                                href={contact.whatsapp}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="WhatsApp"
                                className="group hover:scale-105 transform transition-all"
                            >
                                <div
                                    className="w-12 h-12 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-gray-200 shadow-sm transition-all">
                                    <FontAwesomeIcon
                                        icon={faWhatsapp}
                                        className="text-green-500 group-hover:text-green-600"
                                        style={{fontSize: '28px'}}
                                    />
                                </div>
                            </a>
                        </li>
                    </ul>
                </address>
            </div>
        </section>
    );
};

export default ContactInfoCard;
