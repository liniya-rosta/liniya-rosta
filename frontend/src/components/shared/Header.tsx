"use client"

import React from 'react';
import NavBar from "@/src/components/shared/NavBar";
import LanguageSwitcher from "@/src/app/(admin)/admin/components/shared/LanguageSwitcher";
import Image from "next/image";
import logo from "../../../public/logo.png"
import { Container } from './Container';
import Link from 'next/link';
import { useLocale } from 'next-intl';

const Header = () => {
    const locale = useLocale();

    return (
        <header className="py-6 shadow mb-15 md:mb-8 gap-4">
            <Container>
                <div className="flex items-center flex-wrap xl:justify-between gap-4">
                    <Link href={`/${locale}`} className="shrink-0 block">
                        <Image
                            src={logo}
                            alt="Логотип компании 'Линия Роста'"
                            className="h-14 w-auto"
                            priority
                        />
                    </Link>
                    <NavBar />
                    <LanguageSwitcher className="ml-auto xl:ml-0"/>
                </div>
            </Container>
        </header>
    );
};

export default Header;