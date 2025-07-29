"use client";

import Link from "next/link";
import {usePathname} from "next/navigation";
import Burger from "@/src/components/ui/Burger";
import { useTranslations } from "next-intl";
import { motion } from "motion/react"

const NavBar = () => {
    const pathName = usePathname();

    const segments = pathName.split("/").filter(Boolean);
    const cleanPathname =
        ["ru", "ky"].includes(segments[0])
            ? "/" + segments.slice(1).join("/")
            : pathName;

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
        <nav className="py-4">
            <div className="hidden md:flex flex-wrap gap-7.5 items-center justify-center">
                {navItems.map(({href, label}) => {
                    const isActive = cleanPathname === href;

                    return (
                        <div key={href} className="relative">
                            <Link
                                href={href}
                                className={`py-1.5 transition-colors ${
                                    isActive ? "text-primary font-semibold" : "border-b border-b-transparent hover:border-b-primary"
                                }`}
                            >
                                {label}
                            </Link>

                            {isActive && (
                                <motion.div
                                    layoutId="underline"
                                    className="absolute left-0 right-0 -bottom-0.5 h-[2px] bg-primary rounded-sm"
                                    transition={{ type: "spring", stiffness: 200, damping: 50 }}
                                />
                            )}
                        </div>
                    );
                })}
            </div>

            <Burger navItems={navItems}/>
        </nav>
    );
};
export default NavBar
