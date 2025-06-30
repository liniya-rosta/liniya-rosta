import Burger from "@/components/ui/Burger";
import ProfileDropdown from "@/app/(admin)/admin/components/shared/ProfileDropdown";
import useUserStore from "@/store/usersStore";

const AdminHeader = () => {
    const {user} = useUserStore();
    const isSuperadmin = user?.role === "superadmin";

    const navItems = [
        {href: "/admin", label: "Заявки"},
        {href: "/admin/products", label: "Товары"},
        {href: "/admin/blog", label: "Блог"},
        {href: "/admin/admins", label: "Админы"},
        {href: "/admin/contacts", label: "Контакты"},
        {href: "/admin/portfolio", label: "Портфолио"},
        {href: "/admin/services", label: "Услуги"},
    ];

    return (
        <header className="w-full bg-gray-800 text-white shadow mb-8">
            <div className={`container px-4 py-4 mx-auto flex items-center ${
                isSuperadmin ? "justify-between" : "justify-end"
            }`}>
                {isSuperadmin && <Burger navItems={navItems} isAdmin/>}
                <ProfileDropdown/>
            </div>
        </header>
    );
};

export default AdminHeader;
