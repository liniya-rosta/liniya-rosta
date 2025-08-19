import Burger from "@/src/components/ui/Burger";
import ProfileDropdown from "@/src/app/(admin)/admin/components/shared/ProfileDropdown";
import useUserStore from "@/store/usersStore";

const AdminHeader = () => {
    const {user} = useUserStore();
    const isSuperadmin = user?.role === "superadmin";

    const superadminNavItems = [
        { href: "/admin", label: "Заявки" },
        { href: "/admin/products", label: "Товары" },
        { href: "/admin/blog", label: "Блог" },
        { href: "/admin/admins", label: "Админы" },
        { href: "/admin/contacts", label: "Контакты" },
        { href: "/admin/portfolio", label: "Портфолио" },
        { href: "/admin/services", label: "Услуги" },
        { href: "/admin/online-chat", label: "Чаты" },
    ];

    const adminNavItems = [
        { href: "/admin", label: "Заявки" },
        { href: "/admin/online-chat", label: "Чаты" },
    ];

    const navItems = isSuperadmin ? superadminNavItems : adminNavItems;

    return (
        <header className="w-full shadow mb-8">
            <div className="container px-4 py-4 mx-auto flex items-center justify-between">
                <Burger navItems={navItems} isAdmin/>
                <ProfileDropdown/>
            </div>
        </header>
    );
};

export default AdminHeader;
