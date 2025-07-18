"use client";

import Link from "next/link";
import {usePathname} from "next/navigation";
import Burger from "@/components/ui/Burger";

const navItems = [
    {href: "/", label: "Главная"},
    {href: "/ceilings", label: "Натяжные потолки"},
    {href: "/spc", label: "SPC ламинат"},
    {href: "/services", label: "Услуги"},
    {href: "/portfolio", label: "Портфолио"},
    {href: "/blog", label: "Блог"},
    {href: "/contacts", label: "Контакты"},
];

export default function NavBar() {
    const pathName = usePathname();

    return (
        <nav className="py-4">
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
}
