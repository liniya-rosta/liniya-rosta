"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAdmin = pathname.startsWith("/admin");

    return (
        <div className="min-h-screen flex flex-col">
            {!isAdmin && <Header />}
            <main className="flex-grow">{children}</main>
            {!isAdmin && <Footer />}
        </div>
    );
}