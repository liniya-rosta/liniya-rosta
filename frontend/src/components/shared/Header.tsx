"use client"

import React from 'react';
import NavBar from "@/src/components/shared/NavBar";
import LanguageSwitcher from "@/src/components/shared/LanguageSwitcher";

const Header = () => {
    return (
        <header className="py-4 bg-gray-800 shadow mb-8">
            <div className="container mx-auto px-4 flex items-center justify-between">
                <NavBar/>
                <LanguageSwitcher/>
            </div>
        </header>
    );
};

export default Header;