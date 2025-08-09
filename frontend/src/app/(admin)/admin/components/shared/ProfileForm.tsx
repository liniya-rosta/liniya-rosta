'use client';

import React, {useEffect} from 'react';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {toast} from 'react-toastify';
import {Button} from '@/src/components/ui/button';
import {
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from '@/src/components/ui/dialog';
import {Input} from '@/src/components/ui/input';
import {Label} from '@/src/components/ui/label';
import {Loader2} from 'lucide-react';
import {profileSchema} from '@/src/lib/zodSchemas/admin/profileSchema';
import {editProfile} from '@/actions/users';
import {EditProfileForm} from "@/src/lib/types";
import useUserStore from '@/store/usersStore';
import {handleKyError} from "@/src/lib/handleKyError";

interface Props {
    closeModal: () => void;
}

const ProfileForm: React.FC<Props> = ({closeModal}) => {
    const {
        register,
        handleSubmit,
        formState: {errors, isSubmitting},
        setError,
        reset
    } = useForm<EditProfileForm>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            displayName: '',
            email: '',
            password: '',
        }
    });

    const {user, setUser} = useUserStore();
    useEffect(() => {
        if (user) {
            reset({
                displayName: user.displayName || '',
                email: user.email || '',
                password: '',
            });
        }
    }, [user, reset]);

    const onSubmit = async (data: EditProfileForm) => {
        try {
            await editProfile(data);
            toast.success('Профиль успешно обновлён!');

            setUser({
                ...user!,
                displayName: data.displayName || user!.displayName,
                email: data.email || user!.email,
            });

            reset();
            closeModal();
        } catch (e) {
            const message = await handleKyError(e, 'Ошибка при обновлении профиля.');
            toast.error(message);

            if (message.toLowerCase().includes('пароль')) {
                setError('password', {message});
            } else if (message.toLowerCase().includes('email')) {
                setError('email', {message});
            } else if (message.toLowerCase().includes('имя')) {
                setError('displayName', {message});
            }

            console.error(e);
        }
    };

    return (
        <DialogContent>
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <DialogHeader>
                    <DialogTitle>Редактировать профиль</DialogTitle>
                    <DialogDescription>
                        Сохраните свои данные, чтобы обновить изменения.
                    </DialogDescription>
                    <DialogDescription>Сохраните свои данные, чтобы обновить изменения.</DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="grid gap-1">
                        <Label htmlFor="displayName">Имя</Label>
                        <Input id="displayName" {...register('displayName')} placeholder="Ваше имя"
                               disabled={isSubmitting}/>
                        {errors.displayName && <p className="text-sm text-red-600">{errors.displayName.message}</p>}
                    </div>

                    <div className="grid gap-1">
                        <Label htmlFor="email">Почта</Label>
                        <Input
                            id="email"
                            type="email"
                            {...register('email')}
                            placeholder="example@email.com"
                            disabled={isSubmitting}
                        />
                        {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
                    </div>

                    <div className="grid gap-1">
                        <Label htmlFor="password">Пароль</Label>
                        <Input
                            id="password"
                            type="password"
                            {...register('password')}
                            placeholder="Новый пароль"
                            disabled={isSubmitting}
                        />
                        {errors.password && <p className="text-sm text-red-600">{errors.password.message}</p>}
                    </div>
                </div>

                <DialogFooter className="mt-4">
                    <DialogClose asChild>
                        <Button type="button" variant="outline" disabled={isSubmitting} className='cursor-pointer'>
                            Отмена
                        </Button>
                    </DialogClose>
                    <Button type="submit" disabled={isSubmitting} className='cursor-pointer bg-gray-800'>
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                        Сохранить
                    </Button>
                </DialogFooter>
            </form>
        </DialogContent>
    );
};

export default ProfileForm;