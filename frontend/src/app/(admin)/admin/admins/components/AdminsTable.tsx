"use client";

import * as React from "react";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/src/components/ui/table";
import {useSuperadminAdminsStore} from "@/store/superadmin/superadminAdminsStore";
import ErrorMsg from "@/src/components/ui/ErrorMsg";

import DeleteConfirm from "@/src/app/(admin)/admin/admins/components/DeleteConfirm";
import AdminEditModal from "./AdminEditModal";
import {User} from "@/src/lib/types";

const AdminsTable = () => {
    const {
        admins,
        setDeleteAdmin,
        editAdminError,
        deleteAdminError,
    } = useSuperadminAdminsStore();

    const [selectedAdmin, setSelectedAdmin] = React.useState<User | null>(null);

    return (
        <div className="rounded-md border p-2 mt-3">
            {editAdminError && <ErrorMsg error={editAdminError}/>}
            {deleteAdminError && <ErrorMsg error={deleteAdminError}/>}

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
                                    <TableCell>
                                        <button
                                            onClick={() => setSelectedAdmin(admin)}
                                            className="cursor-pointer hover:underline hover:text-blue-600"
                                        >
                                            {admin.email}
                                        </button>
                                    </TableCell>
                                    <TableCell>
                                        <button
                                            onClick={() => setSelectedAdmin(admin)}
                                            className="cursor-pointer hover:underline hover:text-blue-600"
                                        >
                                            {admin.displayName}
                                        </button>
                                    </TableCell>
                                    <TableCell>
                                        <button
                                            onClick={() => setSelectedAdmin(admin)}
                                            className="cursor-pointer hover:underline hover:text-blue-600"
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

            <DeleteConfirm/>

            {selectedAdmin && (
                <AdminEditModal
                    admin={selectedAdmin}
                    onClose={() => setSelectedAdmin(null)}
                />
            )}
        </div>
    );
};

export default AdminsTable;