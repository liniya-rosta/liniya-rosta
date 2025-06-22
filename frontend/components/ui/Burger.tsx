import React from 'react';
import {Sheet, SheetContent, SheetTrigger} from "@/components/ui/sheet";
import {Button} from "@/components/ui/button";
import {Menu} from "lucide-react";
import {DialogTitle} from "@radix-ui/react-dialog";
import {VisuallyHidden} from "@radix-ui/react-visually-hidden";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
    href: string;
    label: string;
}

interface BurgerProps {
    navItems: NavItem[];
}

const Burger: React.FC<BurgerProps> = ({navItems}) => {
    const pathname = usePathname();

    return (
        <div className="flex justify-end md:hidden">
            <Sheet>
                <SheetTrigger asChild>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="text-white hover:bg-white/10 rounded-full cursor-pointer"
                    >
                        <Menu className="w-6 h-6"/>
                    </Button>
                </SheetTrigger>

                <SheetContent
                    side="left"
                    className="bg-gray-800 text-white px-6 py-8 w-full flex flex-col justify-between"
                    aria-describedby="menu-description"
                >
                    <DialogTitle asChild>
                        <VisuallyHidden>Меню навигации</VisuallyHidden>
                    </DialogTitle>
                    <p id="menu-description" className="sr-only">
                        Это боковое меню навигации по сайту
                    </p>

                    <ul className="space-y-2 mt-5">
                        {navItems.map(({ href, label }) => {
                            const isActive = pathname === href;

                            return (
                                <li key={href}>
                                    <SheetTrigger asChild>
                                        <Link
                                            href={href}
                                            className={`block text-base px-3 py-2 rounded-md border transition-all duration-200 ${
                                                isActive
                                                    ? "bg-white text-black font-semibold border-white shadow"
                                                    : "border-white/20 text-white hover:bg-white/10 hover:border-white"
                                            }`}
                                        >
                                            {label}
                                        </Link>
                                    </SheetTrigger>
                                </li>
                            );
                        })}
                    </ul>
                </SheetContent>
            </Sheet>
        </div>
    );
};

export default Burger;