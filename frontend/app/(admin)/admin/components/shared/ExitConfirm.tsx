'use client';

import React from 'react';
import {Dialog, DialogContent, DialogTitle, DialogDescription} from '@/components/ui/dialog';
import {Button} from '@/components/ui/button';
import {logout} from '@/actions/users';
import {toast} from 'react-toastify';
import {useRouter} from 'next/navigation';
import {Loader2} from 'lucide-react';
import useUserStore from '@/store/usersStore';

interface ExitConfirmProps {
    open: boolean;
    onClose: () => void;
}

const ExitConfirm: React.FC<ExitConfirmProps> = ({open, onClose}) => {
    const router = useRouter();
    const {setLogout, setLoading, loading} = useUserStore();

    const handleLogout = async () => {
        try {
            setLoading(true);
            await logout();
            setLogout();
            toast.success('Вы успешно вышли');
            router.push('/admin/login');
        } catch (error) {
            let errorMessage = "Неизвестная ошибка при выходе из системы";
            if (error instanceof Error) {
                errorMessage = error.message;
            }
            toast.error(errorMessage);
        } finally {
            setLoading(false);
            onClose();
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <DialogTitle>Подтверждение выхода</DialogTitle>
                <DialogDescription>Вы уверены, что хотите выйти из аккаунта?</DialogDescription>
                <div className="flex justify-end gap-2 mt-4">
                    <Button variant="outline" className='cursor-pointer duration-500' onClick={onClose}
                            disabled={loading}>
                        Отмена
                    </Button>
                    <Button className="bg-red-600 text-white cursor-pointer duration-500" onClick={handleLogout}
                            disabled={loading}>
                        {loading && <Loader2 className="h-4 w-4 animate-spin"/>}
                        Выйти
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ExitConfirm;