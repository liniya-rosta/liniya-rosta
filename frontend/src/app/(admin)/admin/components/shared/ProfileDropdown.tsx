'use client';

import React from 'react';
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from '@/src/components/ui/dropdown-menu';
import useUserStore from '@/store/usersStore';
import Link from 'next/link';
import ProfileForm from '@/src/app/(admin)/admin/components/shared/ProfileForm';
import {Dialog} from '@/src/components/ui/dialog';
import ExitConfirm from '@/src/app/(admin)/admin/components/shared/ExitConfirm';

const ProfileDropdown = () => {
    const [isOpen, setIsOpen] = React.useState(false);
    const [showLogoutConfirm, setShowLogoutConfirm] = React.useState(false);
    const {user} = useUserStore();

    if (!user) {
        return (
            <Link
                href="/admin/login"
                className="bg-gray-700 px-4 py-2 rounded hover:bg-gray-600 transition"
            >
                Войти
            </Link>
        );
    }

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger
                    className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 duration-500 cursor-pointer"
                    aria-label="Открыть меню профиля"
                >
                    Привет, {user.displayName}
                </DropdownMenuTrigger>

                <DropdownMenuContent className="w-48 bg-white text-black">
                    <DropdownMenuItem onClick={() => setIsOpen(true)} className="cursor-pointer">
                        Профиль
                    </DropdownMenuItem>

                    <DropdownMenuItem onClick={() => setShowLogoutConfirm(true)} className='cursor-pointer'>
                        Выйти
                    </DropdownMenuItem>

                </DropdownMenuContent>
            </DropdownMenu>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <ProfileForm closeModal={() => setIsOpen(false)}/>
            </Dialog>

            <Dialog open={showLogoutConfirm} onOpenChange={setShowLogoutConfirm}>
                <ExitConfirm onClose={() => setShowLogoutConfirm(false)}/>
            </Dialog>
        </>
    );
};

export default ProfileDropdown;
