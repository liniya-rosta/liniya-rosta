import React from 'react';
import {
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/src/components/ui/dialog";
import {Label} from "@/src/components/ui/label";
import {Input} from "@/src/components/ui/input";
import {Button} from "@/src/components/ui/button";
import {Loader2} from "lucide-react";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {createAdmin} from "@/actions/superadmin/admins";
import {AxiosError} from "axios";
import {toast} from "react-toastify";
import createAdminSchema from "@/lib/zodSchemas/admin/createAdminSchema";
import {useSuperadminAdminsStore} from "@/store/superadmin/superadminAdminsStore";
import ErrorMsg from "@/src/components/ui/ErrorMsg";

interface CreateAdminFormData {
    displayName: string;
    email: string;
    password: string;
    confirmPassword: string;
    role: "admin" | "superadmin";
}

interface Props {
    closeModal: () => void;
}

const CreateAdmin: React.FC<Props> = ({closeModal}) => {
    const {setCreateAdminError, createAdminError, setAdmins, admins} = useSuperadminAdminsStore();
    const {
        register,
        handleSubmit,
        formState: {errors, isSubmitting},
        setError,
        reset
    } = useForm<CreateAdminFormData>({
        resolver: zodResolver(createAdminSchema),
        defaultValues: {
            displayName: '',
            email: '',
            password: '',
            confirmPassword: '',
            role: 'admin'
        }
    });

    const onSubmit = async (data: CreateAdminFormData) => {
        try {
            const res = await createAdmin(data);
            const createdAdmin = res.user;
            toast.success("Администратор создан");
            setCreateAdminError(null);

            setAdmins([...admins, createdAdmin]);

            reset();
            closeModal();
        } catch (e) {
            let message = "Ошибка при создании администратора";

            if (e instanceof AxiosError) {
                message = e.response?.data?.error || message;

            }

            toast.error(message);
            setCreateAdminError(message);
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
                    <DialogTitle>Создать администратора</DialogTitle>
                    <DialogDescription>Введите данные для создания нового администратора.</DialogDescription>
                </DialogHeader>

                {createAdminError && <ErrorMsg label="при создании админа" error={createAdminError}/>}

                <div className="grid gap-4 py-4">
                    <div className="grid gap-1">
                        <Label htmlFor="displayName">Имя</Label>
                        <Input id="displayName" {...register('displayName')} placeholder="Имя админа"
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
                        {errors.email?.message && <p className="text-sm text-red-600">{errors.email.message}</p>}
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

                    <div className="grid gap-1">
                        <Label htmlFor="confirmPassword">Подтвердите пароль</Label>
                        <Input
                            id="confirmPassword"
                            type="password"
                            {...register('confirmPassword')}
                            placeholder="Подтвердите пароль"
                            disabled={isSubmitting}
                        />
                        {errors.confirmPassword &&
                            <p className="text-sm text-red-600">{errors.confirmPassword.message}</p>}
                    </div>

                    <div className="grid gap-1">
                        <Label htmlFor="role">Роль</Label>
                        <select id="role" {...register('role')} disabled={isSubmitting}
                                className="rounded-md border border-input px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                        >
                            <option value="admin">Админ</option>
                            <option value="superadmin">Суперадмин</option>
                        </select>
                        {errors.role && <p className="text-sm text-red-600">{errors.role.message}</p>}
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

export default CreateAdmin;