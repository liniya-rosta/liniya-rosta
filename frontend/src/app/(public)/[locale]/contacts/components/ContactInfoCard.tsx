'use client';

import {Card, CardContent, CardFooter, CardHeader} from "@/src/components/ui/card";
import {Mail, MapPin, Phone} from "lucide-react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faInstagram, faWhatsapp} from "@fortawesome/free-brands-svg-icons";
import {useContactStore} from "@/store/contactsStore";

const ContactInfoCard = () => {
    const contact = useContactStore(state => state.contact);
    if (!contact) return <p>Данные контактов не загружены</p>;

    const linkClass = "inline-flex items-center space-x-2 group hover:text-blue-600 transition-colors duration-300";
    const iconClass = "w-5 h-5 text-muted-foreground group-hover:text-blue-600 duration-300";

    return (
        <Card className="w-full h-full">
            <CardHeader className="flex items-center space-x-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                    <Mail className="h-6 w-6 text-blue-700"/>
                </div>
                <h2 className="text-xl font-semibold">Контактная информация</h2>
            </CardHeader>

            <CardContent className="space-y-6 text-gray-700">
                <ul className="space-y-4">
                    <li>
                        <a
                            href={contact.mapLocation}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={linkClass}
                        >
                            <MapPin className={iconClass}/>
                            <span>{contact.location}</span>
                        </a>
                    </li>
                    <li>
                        <a
                            href={`tel:${contact.phone1.replace(/\s+/g, '')}`}
                            className={linkClass}
                        >
                            <Phone className={iconClass}/>
                            <span>{contact.phone1}</span>
                        </a>
                    </li>
                    {contact.phone2 && (
                        <li>
                            <a
                                href={`tel:${contact.phone2.replace(/\s+/g, '')}`}
                                className={linkClass}
                            >
                                <Phone className={iconClass}/>
                                <span>{contact.phone2}</span>
                            </a>
                        </li>
                    )}
                    <li>
                        <a
                            href={`mailto:${contact.email}`}
                            className={linkClass}
                        >
                            <Mail className={iconClass}/>
                            <span>{contact.email}</span>
                        </a>
                    </li>
                </ul>
            </CardContent>

            <CardFooter className="pt-0">
                <ul className="flex gap-4">
                    <li>
                        <a
                            href={contact.instagram}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Instagram"
                            className="group transform transition-all duration-500 hover:scale-125 hover:shadow-lg"
                        >
                            <div
                                className="w-10 h-10 flex items-center justify-center rounded-md bg-muted hover:bg-muted/70 shadow-sm transition-all duration-500">
                                <FontAwesomeIcon
                                    icon={faInstagram}
                                    className="text-pink-600 group-hover:text-pink-800 drop-shadow-md transition-colors duration-500"
                                    style={{fontSize: '24px'}}
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
                            className="group transform transition-all duration-500 hover:scale-110 hover:shadow-lg"
                        >
                            <div
                                className="w-10 h-10 flex items-center justify-center rounded-md bg-muted hover:bg-muted/70 shadow-sm transition-all duration-500">
                                <FontAwesomeIcon
                                    icon={faWhatsapp}
                                    className="text-green-500 group-hover:text-green-700 drop-shadow-md transition-colors duration-500"
                                    style={{fontSize: '24px'}}
                                />
                            </div>
                        </a>
                    </li>
                </ul>
            </CardFooter>
        </Card>
    );
};

export default ContactInfoCard;
