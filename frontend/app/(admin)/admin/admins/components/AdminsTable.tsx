"use client";

import * as React from "react";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from "@/components/ui/table";
import {useSuperadminAdminsStore} from "@/store/superadmin/superadminAdminsStore";
import ErrorMsg from "@/components/ui/ErrorMsg";

import RoleConfirm from "@/app/(admin)/admin/admins/components/RoleConfirm";
import DeleteConfirm from "@/app/(admin)/admin/admins/components/DeleteConfirm";

const AdminsTable = () => {
    const {
        admins,
        setEditAdmin,
        setDeleteAdmin,
        editAdminError,
        deleteAdminError,
    } = useSuperadminAdminsStore();

    return (
        <div className="rounded-md border p-2 mt-3">

            {editAdminError && <ErrorMsg error={editAdminError} label='админов'/>}
            {deleteAdminError && <ErrorMsg error={deleteAdminError} label='админов'/>}

            <div className="w-full overflow-x-auto">
                <Table className="min-w-[600px]">
                    <TableHeader>
                        <TableRow>
                            <TableHead>Почта</TableHead>
                            <TableHead>Имя</TableHead>
                            <TableHead>Роль</TableHead>
                            <TableHead>Действия</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {admins.length > 0 ? (
                            admins.map((admin, index) => (
                                <TableRow
                                    key={admin._id ?? index}
                                    className="odd:bg-white even:bg-gray-50 hover:bg-blue-50"
                                >
                                    <TableCell>{admin.email}</TableCell>
                                    <TableCell>{admin.displayName}</TableCell>
                                    <TableCell>
                                        <button
                                            onClick={() => setEditAdmin(admin)}
                                            className="text-blue-600 underline cursor-pointer"
                                        >
                                            {admin.role}
                                        </button>
                                    </TableCell>
                                    <TableCell>
                                        <button
                                            onClick={() => setDeleteAdmin(admin)}
                                            className="text-red-600 hover:underline cursor-pointer"
                                        >
                                            Удалить
                                        </button>
                                    </TableCell>

                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={4} className="h-24 text-center">
                                    Нет администраторов
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <RoleConfirm/>
            <DeleteConfirm/>
        </div>
    );
};

export default AdminsTable;