import Sidebar from "@/app/(admin)/admin/components/shared/Sidebar";
import AdminHeader from "@/app/(admin)/admin/components/shared/AdminHeader";

export default function AdminLayout({children}: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen flex flex-col">
            <AdminHeader />
            <div className="flex flex-1">
                <Sidebar />
                <main className="flex-grow">{children}</main>
            </div>
        </div>
    );
}
