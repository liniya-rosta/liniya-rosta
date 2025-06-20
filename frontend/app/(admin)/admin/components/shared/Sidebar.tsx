"use client"

import React from 'react';
import Link from "next/link";
import useUserStore from "@/store/usersStore";

const Sidebar = () => {
    const {user} = useUserStore();

    const navLinks = [
        {href: "/admin", label: "Заявки"},
        {href: "/admin/products", label: "Товары"},
        {href: "/admin/blog", label: "Блог"},
        {href: "/admin/admins", label: "Админы"},
        {href: "/admin/contacts", label: "Контакты"},
        {href: "/admin/portfolio", label: "Портфолио"},
    ];

    if (!user) return null;

    return (
        <aside className="w-64 bg-gray-800 text-white p-6 space-y-6">
            <nav className="flex flex-col space-y-2">
                {navLinks.map(({href, label}) => (
                    <Link
                        key={href}
                        href={href}
                        className={`px-4 py-2 rounded hover:bg-gray-700 }`}
                    >
                        {label}
                    </Link>
                ))}
            </nav>
        </aside>
    );
};

export default Sidebar;