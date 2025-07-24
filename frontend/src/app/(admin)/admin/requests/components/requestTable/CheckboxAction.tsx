"use client"

import React, {useEffect, useState} from 'react';
import {Button} from "@/src/components/ui/button";
import {Table} from "@tanstack/react-table";
import {deleteRequest, editRequest, fetchAllRequests, fetchOneRequest} from "@/actions/superadmin/requests";
import {toast} from "react-toastify";
import {useAdminRequestsStore} from "@/store/superadmin/adminRequestsStore";
import {IRequest} from "@/src/lib/types";
import ConfirmDialog from "@/src/components/ui/ConfirmDialog";

interface Props {
    table: Table<IRequest>;
}

const CheckboxAction: React.FC<Props> = ({table}) => {

    const selectedRows = table.getSelectedRowModel().rows
    const idsToDelete = selectedRows.map(row => row.original._id);
    const [btnDisabled, setBtnDisabled] = useState<boolean>(true);
    const {
        setRequests,
        page,
        setPage,
        setLastPage,
        setTotalItems,
        status,
        search,
        dateTo,
        dateFrom,
        deleteLoading,
        viewArchived,
        setDeleteLoading,
        updateLoading,
        setUpdateLoading,
    } = useAdminRequestsStore();
    const [showConfirm, setShowConfirm] = useState(false);
    const [actionType, setActionType] = useState<"delete" | "restore">("delete");

    const goToPage = async (targetPage: number) => {
        const res = await fetchAllRequests({
            status,
            page: targetPage,
            search,
            dateTo,
            dateFrom,
            archived: viewArchived
        });
        setRequests(res.data);
        setPage(targetPage);
        setLastPage(res.totalPages);
        setTotalItems(res.totalItems);
        return res.data;
    };

    useEffect(() => {
        setBtnDisabled(idsToDelete.length === 0)
    }, [idsToDelete.length])

    const handleDelete = async () => {
        try {
            setDeleteLoading(true);
            if (!viewArchived) {
                await Promise.all(
                    idsToDelete.map(async id => {
                            const res = await fetchOneRequest(id);
                            await editRequest(id, {isArchived: !res.isArchived});
                        }
                    )
                );

                toast.success("Заявки перенесены в архив!")
            } else {
                await Promise.all(
                    idsToDelete.map(async id => {
                            await deleteRequest(id)
                        }
                    )
                );
                toast.success("Заявки успешно удалены!")
            }
            table.setRowSelection({});

            const data = await goToPage(page);

            if (data.length === 0 && page > 1) {
                await goToPage(1);
            }

        } catch (error) {
            setDeleteLoading(false)
            toast.error("Ошибка при удалении заявок");
        } finally {
            setDeleteLoading(false)
        }
    }

    const handleRestore = async () => {
        try {
            setUpdateLoading(true);
            await Promise.all(
                idsToDelete.map(async id => {
                        const res = await fetchOneRequest(id);
                        await editRequest(id, {isArchived: !res.isArchived});
                    }
                )
            );
        } catch (e) {
            toast.error('Произошла ошибка при восстановлении')
            console.log(e)
            setUpdateLoading(false)
        } finally {
            setUpdateLoading(false)
        }

        table.setRowSelection({});

        const data = await goToPage(page);

        if (data.length === 0 && page > 1) {
            await goToPage(1);
        }
    }

    return (
        <div className="flex items-center gap-3">
            <Button
                variant="outline"
                className="border border-red-600 text-red-600 hover:bg-red-50 hover:text-red-600"
                onClick={() => {
                    setActionType("delete");
                    setShowConfirm(true);
                }}
                disabled={btnDisabled}
            >
                Удалить
            </Button>

            {viewArchived && (
                <Button
                    variant="outline"
                    className="border border-green-600 text-green-600 hover:bg-green-50 hover:text-green-600"
                    onClick={() => {
                        setActionType("restore");
                        setShowConfirm(true);
                    }}
                    disabled={btnDisabled}
                >
                    Восстановить
                </Button>
            )}

            <ConfirmDialog
                open={showConfirm}
                onOpenChange={setShowConfirm}
                title={
                    actionType === "delete"
                        ? "Удалить выбранные заявки?"
                        : "Восстановить выбранные заявки?"
                }
                text={
                    actionType === "delete" ?
                        !viewArchived ? "Заявки будут перенесены в архив."
                            : "Заявки будут удалены навсегда."
                        : "Заявки будут восстановлены."
                }
                onConfirm={
                    actionType === "delete" ? handleDelete : handleRestore
                }
                loading={actionType === "delete" ? deleteLoading : updateLoading}
            />
        </div>
    );
};

export default CheckboxAction;