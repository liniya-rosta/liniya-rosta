"use client";

import React from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {Loader2} from "lucide-react";
import {AxiosError} from "axios";
import {useSuperadminAdminsStore} from "@/store/superadmin/superadminAdminsStore";
import {removeAdmin} from "@/actions/superadmin/admins";

const DeleteConfirm = () => {
    const {
        admins,
        setAdmins,
        deleteAdmin,
        setDeleteAdmin,
        deleteAdminLoading,
        setDeleteAdminLoading,
        setDeleteAdminError,
    } = useSuperadminAdminsStore();

    const handleConfirmDelete = async () => {
        if (!deleteAdmin || !deleteAdmin._id) return;

        try {
            setDeleteAdminLoading(true);
            await removeAdmin(deleteAdmin._id);
            setAdmins(admins.filter((a) => a._id !== deleteAdmin._id));
        } catch (err) {
            if (err instanceof AxiosError && err.response?.data?.error) {
                setDeleteAdminError(err.response.data.error);
            } else {
                setDeleteAdminError("Ошибка при удалении админа");
            }
        } finally {
            setDeleteAdminLoading(false);
            setDeleteAdmin(null);
        }
    };

    return (
        <Dialog open={!!deleteAdmin} onOpenChange={(v) => !v && setDeleteAdmin(null)}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Подтвердите удаление</DialogTitle>
                    <DialogDescription>
                        Удалить пользователя <span className="font-semibold">{deleteAdmin?.email}</span>?
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="mt-4">
                    <Button
                        variant="outline"
                        onClick={() => setDeleteAdmin(null)}
                        disabled={deleteAdminLoading}
                        className="cursor-pointer"
                    >
                        Отмена
                    </Button>
                    <Button
                        className="bg-destructive text-white hover:bg-destructive/90 cursor-pointer"
                        onClick={handleConfirmDelete}
                        disabled={deleteAdminLoading}
                    >
                        {deleteAdminLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                        Удалить
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default DeleteConfirm;