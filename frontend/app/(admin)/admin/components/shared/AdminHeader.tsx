import Burger from "@/components/ui/Burger";
import ProfileDropdown from "@/app/(admin)/admin/components/shared/ProfileDropdown";

const AdminHeader = () => {
    const navItems = [
        {href: "/admin", label: "Заявки"},
        {href: "/admin/products", label: "Товары"},
        {href: "/admin/blog", label: "Блог"},
        {href: "/admin/admins", label: "Админы"},
        {href: "/admin/contacts", label: "Контакты"},
        {href: "/admin/portfolio", label: "Портфолио"},
    ];

    return (
        <header className="w-full bg-gray-800 text-white px-4 py-4 shadow mb-8">
            <div className="container mx-auto flex justify-between items-center">
                <Burger navItems={navItems} isAdmin/>
                <ProfileDropdown/>
            </div>
        </header>
    );
};

export default AdminHeader;
