"use client";

import Link from "next/link";
import {usePathname} from "next/navigation";
import Burger from "@/src/components/ui/Burger";
import { useTranslations } from "next-intl";
import {AnimatePresence, motion } from "motion/react"
import {useState} from "react";
import { Check } from "lucide-react";

const NavBar = () => {
    const pathName = usePathname();

    const segments = pathName.split("/").filter(Boolean);
    const cleanPathname =
        ["ru", "ky"].includes(segments[0])
            ? "/" + segments.slice(1).join("/")
            : pathName;

    const tHeader = useTranslations("Header");

    const [isOpen, setIsOpen] = useState(false);

    const navItems = [
        {href: "/", label: tHeader("headerLinks.home")},
        {
            label: "Продукция",
            children: [
                {href: "/ceilings", label: tHeader("headerLinks.stretchCeilings")},
                {href: "/wallpaper", label: tHeader("headerLinks.stretchWallpaper")},
                {href: "/spc", label: "SPC ламинат"},
            ],
        },
        {href: "/services", label: tHeader("headerLinks.services")},
        {href: "/portfolio", label: "Портфолио"},
        {href: "/blog", label: "Блог"},
        { href: "/about", label: tHeader("headerLinks.aboutCompany")},
        {href: "/contacts", label: tHeader("headerLinks.contacts")},
    ];

    return (
        <nav className="py-4">
            <div className="hidden lg:flex gap-2 lg:gap-7.5 items-center justify-center">
                {navItems.map(({ href, label, children }) => {
                    const isActive = children
                        ? children.some(child => cleanPathname === child.href)
                        : cleanPathname === href;

                    if (children) {
                        return (
                            <div
                                key={label}
                                className="relative"
                                onMouseEnter={() => setIsOpen(true)}
                                onMouseLeave={() => setIsOpen(false)}
                            >
                                <button
                                    className={`py-1.5 transition-colors ${
                                        isActive ? "text-primary font-semibold" : "hover:text-primary"
                                    }`}
                                >
                                    {label}
                                </button>
                                {isActive && (
                                    <motion.div
                                        layoutId="underline"
                                        className="absolute left-0 right-0 -bottom-0.5 h-[2px] bg-primary rounded-sm"
                                        transition={{ type: "spring", stiffness: 200, damping: 50 }}
                                    />
                                )}

                                <AnimatePresence>
                                    {isOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            transition={{ duration: 0.2 }}
                                            className="absolute left-0 top-full mt-2 w-53 bg-white shadow-lg rounded-xl p-2"
                                        >
                                            {children.map((child) => {
                                                const isChildActive = cleanPathname === child.href;
                                                return (
                                                    <Link
                                                        key={child.href}
                                                        href={child.href}
                                                        className={`flex items-center px-4 py-2  text-sm rounded-lg transition hover:bg-gray-100 
                                                        ${isChildActive && "font-bold"}`}
                                                    >
                                                        {child.label}
                                                        {isChildActive && (
                                                             <Check className="ml-2 h-4 w-4 text-primary" />
                                                    )   }
                                                    </Link>
                                                );
                                            })}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        );
                    }

                    return (
                        <div key={href} className="relative">
                            <Link
                                href={href}
                                className={`py-1.5 transition-colors ${
                                    isActive
                                        ? "text-primary font-semibold"
                                        : "border-b border-b-transparent hover:border-b-primary"
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

            <Burger
                navItems={navItems.flatMap(item =>
                    item.children ? item.children : item
                )}
            />
        </nav>
    );
};
export default NavBar
