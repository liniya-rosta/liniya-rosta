import type {ReactNode} from "react";
import Sidebar from "@/app/admin/components/shared/Sidebar";
import manrope from "@/lib/fonts";
import AdminHeader from "@/app/admin/components/shared/AdminHeader";



export default function AdminLayout({children}: { children: ReactNode }) {
    return (
        <html lang="ru">
        <body
            className={`${manrope.variable} antialiased`}
        >
        <AdminHeader />
        <div className="min-h-screen flex">
            <Sidebar/>
            <main className="flex-grow">{children}</main>
        </div>
        </body>
        </html>
    );
}