'use client';

import '../../globals.css'
import React from "react";
import {useEffect, useState} from "react";
import {usePathname, useRouter} from "next/navigation";
import AdminHeader from "@/src/app/(admin)/admin/components/shared/AdminHeader";
import useUserStore from "@/store/usersStore";
import LoadingFullScreen from "@/src/components/ui/Loading/LoadingFullScreen";

export default function AdminLayout({children}: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const isLogin = pathname === "/admin/login";
    const adminAllowedPaths = ["/admin", "/admin/online-chat"];

    const {user, accessToken, hasHydrated} = useUserStore();
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
        if (!hasHydrated) return;

        const isLoginPage = pathname === "/admin/login";
        const isNotLoggedIn = !accessToken || !user;

        if (isNotLoggedIn && !isLoginPage) {
            router.replace("/admin/login");
            setAuthorized(false);
            return;
        }

        const role = user?.role;
        if (role === "superadmin") {
            setAuthorized(true);
        } else if (role === "admin") {
            if (adminAllowedPaths.includes(pathname)) {
                setAuthorized(true);
            } else {
                router.replace("/admin");
                setAuthorized(false);
            }
        } else {
            if (!isLoginPage) {
                router.replace("/admin/login");
                setAuthorized(false);
            }
        }
    }, [hasHydrated, user, accessToken, pathname, router]);

    if (!authorized && pathname !== "/admin/login") {
        return <LoadingFullScreen/>;
    }

    return (
        <div className="min-h-screen flex flex-col">
            {!isLogin && <AdminHeader/>}
            <div className="flex flex-1">
                <main className="flex-grow container mx-auto px-4">{children}</main>
            </div>
        </div>
    );
}