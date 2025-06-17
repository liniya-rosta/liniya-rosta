"use client";

import Link from "next/link";
import {Sheet, SheetTrigger, SheetContent} from "@/components/ui/sheet";
import {Button} from "@/components/ui/button";
import {Menu} from "lucide-react";
import {DialogTitle} from "@radix-ui/react-dialog";
import {VisuallyHidden} from "@radix-ui/react-visually-hidden";
import {usePathname} from "next/navigation";

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
        <nav className="w-full p-4 text-white">
            <div className="hidden md:flex flex-wrap gap-8 items-center justify-center">{navItems.map(({
                                                                                                           href,
                                                                                                           label
                                                                                                       }) => {
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

            <div className="flex justify-end md:hidden">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-white hover:bg-white/10 rounded-full"
                        >
                            <Menu className="w-6 h-6"/>
                        </Button>
                    </SheetTrigger>

                    <SheetContent
                        side="left"
                        className="bg-black text-white px-6 py-8 w-64 flex flex-col justify-between"
                    >
                        <DialogTitle asChild>
                            <VisuallyHidden>Меню навигации</VisuallyHidden>
                        </DialogTitle>

                        <div className="space-y-4">
                            <h2 className="text-lg font-semibold border-b border-white pb-2 mb-4">
                                Меню
                            </h2>
                            {navItems.map(({href, label}) => (
                                <Link
                                    key={href}
                                    href={href}
                                    className="block text-base px-2 py-2 rounded hover:bg-white/10 transition"
                                >
                                    {label}
                                </Link>
                            ))}
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </nav>
    );
}
