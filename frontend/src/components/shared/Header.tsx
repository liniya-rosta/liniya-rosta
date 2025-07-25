"use client"

import React from 'react';
import NavBar from "@/src/components/shared/NavBar";
import LanguageSwitcher from "@/src/app/(admin)/admin/components/shared/LanguageSwitcher";
import Image from "next/image";
import logo from "../../../public/images/logo.png"

const Header = () => {
    return (
        <header className="py-4 bg-gray-800 shadow mb-8">
            <div className="container mx-auto px-4 flex items-center justify-between">
                <div className="flex flex-grow items-center gap-4">
                    <Image
                        src={logo}
                        alt="Логотип компании 'Линия Роста'"
                        className="h-15 w-auto"
                        priority
                    />
                        <NavBar/>
                </div>
                <LanguageSwitcher/>
            </div>
        </header>
    );
};

export default Header;