"use client"

import React from 'react';
import NavBar from "@/src/components/shared/NavBar";
import LanguageSwitcher from "@/src/components/shared/LanguageSwitcher";

const Header = () => {
    return (
        <header className="py-4 bg-gray-800 shadow mb-8">
            <LanguageSwitcher />
            <NavBar/>
        </header>
    );
};

export default Header;