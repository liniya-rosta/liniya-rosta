'use client'

import {ServiceResponse} from "@/lib/types";
import React, {useEffect, useState} from "react";
import {useSuperAdminServicesStore} from "@/store/superadmin/superAdminServices";
import DataSkeleton from "@/components/ui/Loading/DataSkeleton";
import ErrorMsg from "@/components/ui/ErrorMsg";
import {
    ColumnFiltersState,
    getCoreRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
    VisibilityState
} from "@tanstack/react-table";
import {getColumns} from "@/app/(admin)/admin/services/components/DataTable/Columns";
import CustomTable from "@/app/(admin)/admin/services/components/DataTable/Table";
import {Button} from "@/components/ui/button";
import {Plus} from "lucide-react";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import {toast} from "react-toastify";
import {isAxiosError} from "axios";
import {fetchAllServices} from "@/actions/services";

interface Props {
    data: ServiceResponse | null;
    error: string | null;
}

const AdminServiceClient: React.FC<Props> = ({data, error}) => {
    const {
        services,
        fetchServiceLoading,
        deleteServiceLoading,
        setServices,
        setFetchServiceLoading,
        setDeleteServiceLoading,
    } = useSuperAdminServicesStore();

    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = useState({});
    const [showConfirm, setShowConfirm] =  useState(false);
    const [selectedToDelete, setSelectedToDelete] = useState<string[]>([]);

    useEffect(() => {
        if (data) setServices(data);
        setFetchServiceLoading(false);
    }, [data, setServices, setFetchServiceLoading]);

    useEffect(() => {
        const selectedRows = table.getSelectedRowModel().rows;
        setSelectedToDelete(selectedRows.map(row => row.original._id));
    }, [rowSelection]);

    const editService = (id: string) => {
        // Здесь открой модалку или переадресуй
        console.log("Edit", id);
    };

    const deleteService = async (id: string) => {
        // Здесь вызов на удаление
        console.log("Delete", id);
    };

    const table = useReactTable({
        data: services?.items ?? [],
        columns: getColumns(deleteService, editService),
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    });

    const multipleDeletion = async () => {
        try {
            setShowConfirm(false);
            setDeleteServiceLoading(true);


                await Promise.all(
                    selectedToDelete.map((id) => deleteService(id))
                );

            const updated = await fetchAllServices();
            setServices(updated);

            toast.success(`Удалено ${selectedToDelete.length} элемента`);

        } catch (error) {
            let errorMessage = "Ошибка при удалении";
            if (isAxiosError(error) && error.response) {
                errorMessage = error.response.data.error;
            } else if (error instanceof Error) {
                errorMessage = error.message;
            }

            toast.error(errorMessage);
        } finally {
            setDeleteServiceLoading(false);
            setSelectedToDelete([]);
            setRowSelection({});
        }
    }

    if (fetchServiceLoading) return <DataSkeleton/>
    if (error) return <ErrorMsg error={error}/>

    return (
        <div>
            <div className="flex flex-col sm:flex-row sm:justify-between items-center gap-4 mb-4">
                <div>
                    <h1 className="text-3xl font-bold text-foreground text-center sm:text-left">
                        Управление услугами
                    </h1>
                    <p className="text-muted-foreground mt-1 text-center sm:text-left">
                        Создавайте и редактируйте услуги
                    </p>
                </div>
                <Button className="flex items-center gap-2 w-full sm:w-auto">
                    <Plus size={16}/>
                    Создать услугу
                </Button>

            </div>
            <CustomTable table={table}/>

            <ConfirmDialog
                open={showConfirm}
                onOpenChange={setShowConfirm}
                title={
                    selectedToDelete.length > 1
                        ? "Удалить выбранные элементы?"
                        : "Удалить элемент?"
                }
                onConfirm={ async () => {
                    if (selectedToDelete.length > 1) {
                        await multipleDeletion();
                    } else if (selectedToDelete.length === 1) {
                        await deleteService(selectedToDelete[0]);
                    }
                }}
                loading={deleteServiceLoading}
            />
        </div>
    )
}

export default AdminServiceClient