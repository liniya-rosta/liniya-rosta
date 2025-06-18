"use client"

import { useState } from "react";
import useUserStore from "@/store/usersStore";
import Link from "next/link";
import {logout} from "@/actions/users";
import {useRouter} from "next/navigation";

const AdminHeader = () => {
    const { user, setLogout } = useUserStore();
    const [menuOpen, setMenuOpen] = useState(false);
    const router = useRouter();

    const toggleMenu = () => setMenuOpen((prev) => !prev);

    const handleLogout = async () => {
        setLogout();
        await logout();
        router.push("/admin/login");
        setMenuOpen(false);
    };

    return (
        <header className="w-full bg-gray-800 text-white px-6 py-4 flex justify-between items-center shadow">
            <div className="text-lg font-semibold">Админ-панель</div>
            <div className="relative">
                {
                    user ?
                        <button
                            onClick={toggleMenu}
                            className="flex items-center gap-2 bg-gray-700 px-4 py-2 rounded hover:bg-gray-600 transition"
                        >
                            <span>Привет, {user.displayName}</span>
                            <svg
                                className={`w-4 h-4 transition-transform ${menuOpen ? "rotate-180" : ""}`}
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={2}
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                        : <Link
                            href="/admin/login"
                            className="bg-gray-700 px-4 py-2 rounded hover:bg-gray-600 transition"
                        >Войти</Link>
                }

                {menuOpen && (
                    <div className="absolute right-0 mt-2 w-40 bg-white text-gray-800 rounded shadow-lg z-10">
                        <button
                            onClick={handleLogout}
                            className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                        >
                            Выйти
                        </button>
                    </div>
                )}
            </div>
        </header>
    );
};

export default AdminHeader;
