"use client"

import React from 'react';
import NavBar from "@/src/components/shared/NavBar";
import LanguageSwitcher from "@/src/app/(admin)/admin/components/shared/LanguageSwitcher";
import Image from "next/image";
import logo from "../../../public/images/logo.png"
import { Container } from './Container';
import Link from 'next/link';

const Header = () => {
    return (
        <header className="py-4 shadow mb-15 md:mb-8">
            <Container>
                <div className="flex items-center justify-between">
                    <div className="flex flex-grow items-center gap-4">
                        <Link href="/frontend/public">
                            <Image
                                src={logo}
                                alt="Логотип компании 'Линия Роста'"
                                className="h-15 w-auto"
                                priority
                            />
                        </Link>
                        <NavBar/>
                    </div>
                    <LanguageSwitcher/>
                </div>
            </Container>
        </header>
    );
};

export default Header;