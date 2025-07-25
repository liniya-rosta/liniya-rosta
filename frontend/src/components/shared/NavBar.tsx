"use client";

import Link from "next/link";
import {usePathname} from "next/navigation";
import Burger from "@/src/components/ui/Burger";
import { useTranslations } from "next-intl";

const NavBar = () => {
    const pathName = usePathname();

    const tHeader = useTranslations("Header");

    const navItems = [
        {href: "/", label: tHeader("headerLinks.home")},
        {href: "/ceilings", label: tHeader("headerLinks.stretchCeilings")},
        {href: "/spc", label: "SPC ламинат"},
        {href: "/services", label: tHeader("headerLinks.services")},
        {href: "/portfolio", label: "Портфолио"},
        {href: "/blog", label: "Блог"},
        {href: "/contacts", label: tHeader("headerLinks.contacts")},
    ];

    return (
        <nav className="w-full p-4 text-white">
            <div className="hidden md:flex flex-wrap gap-7.5 items-center justify-center">
                {navItems.map(({href, label}) => {
                    const isActive = pathName === href;

                    return (
                        <Link
                            key={href}
                            href={href}
                            className={`py-1.5 border-b transition-colors ${
                                isActive ? "border-b-white font-semibold" : "border-b-transparent hover:border-b-white"
                            }`}
                        >
                            {label}
                        </Link>
                    );
                })}
            </div>

            <Burger navItems={navItems}/>
        </nav>
    );
};
export default NavBar
