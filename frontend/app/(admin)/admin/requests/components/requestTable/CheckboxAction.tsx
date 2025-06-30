"use client"

import React, {useEffect, useState} from 'react';
import {Button} from "@/components/ui/button";
import {Table} from "@tanstack/react-table";
import {deleteRequest, fetchAllRequests} from "@/actions/superadmin/requests";
import {toast} from "react-toastify";
import {useAdminRequestsStore} from "@/store/superadmin/adminRequestsStore";
import {IRequest} from "@/lib/types";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

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
        deleteLoading
    } = useAdminRequestsStore();
    const [showConfirm, setShowConfirm] = useState(false);

    const goToPage = async (targetPage: number) => {
        const res = await fetchAllRequests({status, page: targetPage, search, dateTo, dateFrom});
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
            await Promise.all(idsToDelete.map(id => deleteRequest(id)))
            const data = await goToPage(page);
            console.log(data, data.length);
            if (data.length === 0 && page > 1) {
                await goToPage(1);
            }
            table.setRowSelection({});
            toast.success("Заявки успешно удалены")
        } catch (error) {
            toast.error("Ошибка при удалении заявок");
        }
    }

    return (
        <div className="flex items-center py-4">
            <Button variant="outline"
                    onClick={() => setShowConfirm(true)}
                    disabled={btnDisabled}>
                Удалить</Button>
            <ConfirmDialog
                open={showConfirm}
                onOpenChange={setShowConfirm}
                title="Удалить выбранные заявки?"
                onConfirm={handleDelete}
                loading={deleteLoading}
            />
        </div>
    );
};

export default CheckboxAction;