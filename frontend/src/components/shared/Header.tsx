"use client"

import React from 'react';
import NavBar from "@/src/components/shared/NavBar";
import LanguageSwitcher from "@/src/app/(admin)/admin/components/shared/LanguageSwitcher";
import Image from "next/image";
import logo from "../../../public/images/logo.png"
import { Container } from './Container';
import Link from 'next/link';
import { useLocale } from 'next-intl';

const Header = () => {
    const locale = useLocale();

    return (
        <header className="py-4 shadow mb-15 md:mb-8">
            <Container>
                <div className="flex items-center justify-between">
                    <div className="flex flex-grow items-center gap-4">
                        <Link href={`/${locale}`} className="shrink-0 block">
                            <Image
                                src={logo}
                                alt="Логотип компании 'Линия Роста'"
                                className="h-10 w-auto md:h-14"
                                priority
                            />
                        </Link>
                            <NavBar />
                    </div>
                    <LanguageSwitcher/>
                </div>
            </Container>
        </header>
    );
};

export default Header;