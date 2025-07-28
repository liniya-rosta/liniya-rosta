import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/src/components/ui/dialog';
import {Button} from '@/src/components/ui/button';
import {Loader2} from 'lucide-react';
import {useSuperadminAdminsStore} from "@/store/superadmin/superadminAdminsStore";
import {editAdminRole} from "@/actions/superadmin/admins";
import {AxiosError} from "axios";

const RoleConfirm = () => {
    const {
        editAdmin,
        editAdminLoading,
        admins,
        setAdmins,
        setEditAdmin,
        setEditAdminLoading,
        setEditAdminError,
    } = useSuperadminAdminsStore();

    const confirmToggleRole = async () => {
        if (!editAdmin || !editAdmin._id || !editAdmin.role) return;

        setEditAdminLoading(true);
        setEditAdminError(null);

        try {
            const {user: updatedAdmin} = await editAdminRole(editAdmin._id, editAdmin.role === "admin" ? "superadmin" : "admin");
            const updatedAdmins = admins.map((admin) =>
                admin._id === updatedAdmin._id ? updatedAdmin : admin
            );
            setAdmins(updatedAdmins);
            setEditAdmin(null);
        } catch (error) {
            if (error instanceof AxiosError && error.response?.data?.error) {
                setEditAdminError(error.response.data.error);
            } else {
                setEditAdminError("Ошибка при смене роли");
            }
        } finally {
            setEditAdminLoading(false);
            setEditAdmin(null);
        }
    };

    return (
        <Dialog open={!!editAdmin} onOpenChange={(v) => !v && setEditAdmin(null)}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Подтвердите действие</DialogTitle>
                    <DialogDescription>
                        Изменить роль пользователя <span className="font-semibold">{editAdmin?.email}</span>?
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="mt-4">
                    <Button
                        variant="outline"
                        onClick={() => setEditAdmin(null)}
                        disabled={editAdminLoading}
                        className="cursor-pointer"
                    >
                        Отмена
                    </Button>
                    <Button
                        className="bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer"
                        onClick={confirmToggleRole}
                        disabled={editAdminLoading}
                    >
                        {editAdminLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                        Подтвердить
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default RoleConfirm;