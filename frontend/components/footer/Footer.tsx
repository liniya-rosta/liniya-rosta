import React from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faInstagram, faWhatsapp} from "@fortawesome/free-brands-svg-icons";

const Footer = () => {
    return (
        <footer className="p-10 bg-gray-800 mt-8 text-white">
            <div className="flex flex-wrap items-center justify-around w-full">
                <div className="flex flex-col gap-2">
                    <p className="hover:animate-pulse"><a href="https://2gis.kg/bishkek/firm/70000001094990183">г. Бишкек, ул. Куренкеева, 49</a></p>
                    <p className="hover:animate-pulse"><a href="tel:+996552088988" target="_blank">+996 552 088 988</a></p>
                    <p className="hover:animate-pulse"><a href="tel:+996555757513" target="_blank">+996 555 757 513</a></p>
                    <p className="hover:animate-pulse"><a href="mailto:liniyarosta49@gmail.com" target="_blank">liniyarosta49@gmail.com</a></p>
                    <div className="flex items-center gap-2 mt-2">
                        <a href="https://www.instagram.com/liniya_rosta.kg/"
                           target="_blank"
                           rel="noopener noreferrer"
                           aria-label="Instagram"
                           title="Instagram">
                            <FontAwesomeIcon icon={faInstagram} size="1x"
                                             className="mr-2.5 w-6 h-6 hover:animate-pulse text-white"/>
                            <span className="sr-only">Instagram</span>
                        </a>

                        <a href="https://wa.me/996553088988" target="_blank" rel="noopener noreferrer">
                            <FontAwesomeIcon icon={faWhatsapp} size="1x"
                                             className="w-6 h-6 hover:animate-pulse text-white"/>
                        </a>
                    </div>
                </div>

                <button
                    className="mt-4 px-5 py-3 bg-blue-500 text-white rounded-full bg-transparent border border-white hover:animate-pulse">
                    Оставить заявку
                </button>
            </div>
        </footer>
    );
};

export default Footer;