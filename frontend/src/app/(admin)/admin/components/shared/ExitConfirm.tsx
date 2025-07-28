'use client';

import React from 'react';
import {DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle} from '@/src/components/ui/dialog';
import {Button} from '@/src/components/ui/button';
import {logout} from '@/actions/users';
import {toast} from 'react-toastify';
import {useRouter} from 'next/navigation';
import {Loader2} from 'lucide-react';
import useUserStore from '@/store/usersStore';

interface Props {
    onClose: () => void;
}

const ExitConfirm: React.FC<Props> = ({onClose}) => {
    const router = useRouter();
    const {setLogout, setLoading, loading} = useUserStore();

    const handleLogout = async () => {
        try {
            setLoading(true);
            await logout();
            setLogout();
            onClose();
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
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Подтверждение выхода</DialogTitle>
                <DialogDescription>Вы уверены, что хотите выйти из аккаунта?</DialogDescription>
            </DialogHeader>

            <DialogFooter className="mt-4">
                <Button
                    variant="outline"
                    className="btn-hover-scale"
                    onClick={onClose}
                    disabled={loading}
                >
                    Отмена
                </Button>
                <Button
                    className="bg-destructive text-white btn-hover-scale"
                    onClick={handleLogout}
                    disabled={loading}
                >
                    {loading && <Loader2 className="h-4 w-4 animate-spin mr-2"/>}
                    Выйти
                </Button>
            </DialogFooter>
        </DialogContent>
    );
};

export default ExitConfirm;