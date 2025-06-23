'use client';

import {useEffect, useState} from "react";
import {usePathname, useRouter} from "next/navigation";
import AdminHeader from "@/app/(admin)/admin/components/shared/AdminHeader";
import useUserStore from "@/store/usersStore";
import LoadingFullScreen from "@/components/ui/Loading/LoadingFullScreen";

export default function AdminLayout({children}: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const isLogin = pathname === "/admin/login";

    const {user, accessToken, hasHydrated} = useUserStore();
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
        if (!hasHydrated) return;

        const isLoginPage = pathname === "/admin/login";
        const isNotLoggedIn = !accessToken || !user;
        const isNotAdmin = user?.role !== "superadmin";

        if (!isLoginPage && (isNotLoggedIn || isNotAdmin)) {
            router.replace("/admin/login");
            setAuthorized(false);
        } else {
            setAuthorized(true);
        }
    }, [hasHydrated, user, accessToken, pathname, router]);

    if (!hasHydrated || !authorized) return <LoadingFullScreen/>;

    return (
        <div className="min-h-screen flex flex-col">
            {!isLogin && <AdminHeader/>}
            <div className="flex flex-1">
                <main className="flex-grow container mx-auto px-4">{children}</main>
            </div>
        </div>
    );
}