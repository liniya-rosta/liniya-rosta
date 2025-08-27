"use client"

import React from 'react';
import NavBar from "@/src/components/shared/NavBar";
import LanguageSwitcher from "@/src/app/(admin)/admin/components/shared/LanguageSwitcher";
import Image from "next/image";
import logo from "../../../public/logo.png"
import { CustomContainer } from './CustomContainer';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import {CircleUserRound} from "lucide-react";

const Header = () => {
    const locale = useLocale();

    return (
        <header className="py-6 shadow mb-15 md:mb-8 gap-4 z-50">
            <CustomContainer>
                <div className="flex items-center lg:justify-between gap-4">
                    <Link href={`/${locale}`} className="shrink-0 block">
                        <Image
                            src={logo}
                            alt="Логотип компании 'Линия Роста'"
                            className="h-14 w-auto"
                            priority
                        />
                    </Link>
                    <NavBar />
                    <div className="flex items-center gap-4 ml-auto lg:ml-0">
                        <Link href={"/admin"}>
                            <CircleUserRound />
                        </Link>
                        <LanguageSwitcher/>
                    </div>
                </div>
            </CustomContainer>
        </header>
    );
};

export default Header;