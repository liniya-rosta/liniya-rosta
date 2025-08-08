"use client";

import React from "react";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/src/components/ui/dialog";
import {Input} from "@/src/components/ui/input";
import {Label} from "@/src/components/ui/label";
import {Button} from "@/src/components/ui/button";
import {User} from "@/src/lib/types";
import {editAdmin} from "@/actions/superadmin/admins";
import {useSuperadminAdminsStore} from "@/store/superadmin/superadminAdminsStore";
import {editAdminSchema, EditAdminSchema} from "@/src/lib/zodSchemas/admin/editAdminSchema";
import ErrorMsg from "@/src/components/ui/ErrorMsg";
import {toast} from "react-toastify";
import {handleKyError} from "@/src/lib/handleKyError";

interface AdminEditModalProps {
    admin: User;
    onClose: () => void;
}

const AdminEditModal: React.FC<AdminEditModalProps> = ({admin, onClose}) => {
    const {
        admins,
        setAdmins,
        editAdminLoading,
        editAdminError,
        setEditAdminLoading,
        setEditAdminError,
    } = useSuperadminAdminsStore();

    const {
        register,
        handleSubmit,
        formState: {errors},
    } = useForm<EditAdminSchema>({
        resolver: zodResolver(editAdminSchema),
        defaultValues: {
            email: admin.email,
            displayName: admin.displayName,
            role: admin.role as "admin" | "superadmin",
        },
    });

    const onSubmit = async (values: EditAdminSchema) => {
        try {
            setEditAdminLoading(true);
            setEditAdminError(null);

            const editedAdmin = (await editAdmin(admin._id, values)).user;
            const updatedAdmins = admins.map((a) => a._id === editedAdmin._id ? editedAdmin : a);

            setAdmins(updatedAdmins);
            toast.success('Вы успешно изменили данные');
            onClose();
        } catch (e) {
            const msg = await handleKyError(e, 'Ошибка при редактировании админа');
            setEditAdminError(msg);
            toast.error(msg);
        } finally {
            setEditAdminLoading(false);
        }
    };

    return (
        <Dialog open onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Редактировать администратора</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
                    <div>
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" {...register("email")} />
                        {errors.email && (
                            <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>
                        )}
                    </div>

                    <div>
                        <Label htmlFor="displayName">Имя</Label>
                        <Input id="displayName" {...register("displayName")} />
                        {errors.displayName && (
                            <p className="text-sm text-red-600 mt-1">{errors.displayName.message}</p>
                        )}
                    </div>

                    <div>
                        <Label htmlFor="role">Роль</Label>
                        <select
                            id="role"
                            {...register("role")}
                            className="w-full rounded-md border border-gray-300 px-3 py-2"
                        >
                            <option value="admin">admin</option>
                            <option value="superadmin">superadmin</option>
                        </select>
                        {errors.role && (
                            <p className="text-sm text-red-600 mt-1">{errors.role.message}</p>
                        )}
                    </div>

                    {editAdminError && <ErrorMsg error={editAdminError}/>}

                    <div className="flex justify-end gap-2 pt-2">
                        <Button type="button" variant="ghost" onClick={onClose} disabled={editAdminLoading}>
                            Отмена
                        </Button>
                        <Button type="submit" disabled={editAdminLoading}>
                            {editAdminLoading ? "Сохранение..." : "Сохранить"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default AdminEditModal;