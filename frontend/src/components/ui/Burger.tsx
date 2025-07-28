import React from 'react';
import {Sheet, SheetContent, SheetTrigger} from "@/src/components/ui/sheet";
import {Button} from "@/src/components/ui/button";
import {Menu} from "lucide-react";
import {DialogTitle} from "@radix-ui/react-dialog";
import {VisuallyHidden} from "@radix-ui/react-visually-hidden";
import Link from "next/link";
import {usePathname} from "next/navigation";
import {cn} from "@/src/lib/utils";

interface NavItem {
    href: string;
    label: string;
}

interface BurgerProps {
    navItems: NavItem[];
    isAdmin?: boolean;
}

const Burger: React.FC<BurgerProps> = ({navItems, isAdmin}) => {
    const pathname = usePathname();

    return (
        <div className={`flex justify-end ${isAdmin ? '' : 'md:hidden'}`}>
            <Sheet>
                <SheetTrigger asChild>
                    <Button
                        variant="outline"
                        className="p-3 rounded-md bg-transpatent border border-primary"
                    >
                        <Menu className="w-7 h-7"/>
                    </Button>
                </SheetTrigger>

                <SheetContent
                    side="left"
                    className="px-6 py-8 w-full flex flex-col justify-between sidebar-container"
                    aria-describedby="menu-description"
                >
                    <DialogTitle asChild>
                        <VisuallyHidden>Меню навигации</VisuallyHidden>
                    </DialogTitle>
                    <p id="menu-description" className="sr-only">
                        Это боковое меню навигации по сайту
                    </p>

                    <ul className="space-y-2 mt-5">
                        {navItems.map(({href, label}) => {
                            const isActive = pathname === href;

                            return (
                                <li key={href}>
                                    <SheetTrigger asChild>
                                        <Link
                                            href={href}
                                            className={cn(
                                                "block text-base px-4 py-2 rounded-lg border transition-all duration-200 border-transparent",
                                                isActive
                                                    ? "sidebar-link-active"
                                                    : "sidebar-link-inactive"
                                            )}
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