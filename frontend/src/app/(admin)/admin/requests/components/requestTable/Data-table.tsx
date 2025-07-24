"use client"

import * as React from "react"
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    RowSelectionState,
    useReactTable,
    VisibilityState,
} from "@tanstack/react-table"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/src/components/ui/table"
import Loading from '@/src/components/ui/Loading/Loading'
import TablePagination from "@/src/app/(admin)/admin/requests/components/requestTable/TablePagination";
import {useState} from "react";
import StatusFilter from "@/src/app/(admin)/admin/requests/components/requestTable/StatusFilter";
import ColumnVisibility from "./ColumnVisibility"
import SearchTable from "@/src/app/(admin)/admin/requests/components/requestTable/SearchTable";
import CheckboxAction from "@/src/app/(admin)/admin/requests/components/requestTable/CheckboxAction";
import {DateFilter} from "@/src/app/(admin)/admin/requests/components/requestTable/DateFilter";
import {IRequest} from "@/src/lib/types";
import RequestsModal from "@/src/app/(admin)/admin/requests/components/RequestsModal";
import {Button} from "@/src/components/ui/button";
import {useAdminRequestsStore} from "@/store/superadmin/adminRequestsStore";

interface DataTableProps {
    columns: ColumnDef<IRequest, any>[]
    data: IRequest[]
    error: string | null
    loading: boolean
}

export const DataTable = ({
                              columns,
                              data,
                              error,
                              loading,
                          }: DataTableProps) => {
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
    const [selectedRow, setSelectedRow] = useState<IRequest | null>(null);
    const {setViewArchived, viewArchived} = useAdminRequestsStore();
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            columnVisibility,
            rowSelection,
        },
    });

    return (
        <div className="mb-[40px]">
            <h1 className="text-3xl font-bold mb-4">Заявки</h1>
            <div>
                <div className="flex justify-between items-center gap-5 flex-wrap">
                    <SearchTable/>
                    <StatusFilter/>
                    <div>
                        <DateFilter/>
                    </div>

                </div>
                <div className="flex flex-wrap justify-between items-center py-4 gap-4">
                    <div className="flex flex-wrap items-center gap-3">
                        <ColumnVisibility table={table}/>
                        <Button onClick={() => setViewArchived(!viewArchived)} variant="outline">
                            {!viewArchived ? "Архив" : "Активные заявки"}
                        </Button>
                        <CheckboxAction table={table}/>
                    </div>
                    <div className="ml-auto mb-2 sm:mb-0">
                        <TablePagination/>
                    </div>
                </div>
            </div>


            <div className="rounded-md border mb-2">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    const isCheckbox = header.id === "_id";
                                    const widthClass = isCheckbox ? 'px-3' : 'min-w-45 max-w-45 whitespace-normal break-words px-3';
                                    return (
                                        <TableHead key={header.id} className={widthClass}>
                                            {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center flex items-center justify-center">
                                    <Loading/>
                                </TableCell>
                            </TableRow>
                        ) : error ? (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-48 text-center text-red-500">
                                    {error}
                                </TableCell>
                            </TableRow>
                        ) : table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    onClick={() => setSelectedRow(row.original)}
                                    className="odd:bg-white even:bg-gray-50 hover:bg-blue-50 cursor-pointer"
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell className="h-15 whitespace-normal break-words px-3" key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    Пока нет заявок
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className="flex justify-end">
                <TablePagination/>
            </div>

            <RequestsModal request={selectedRow} onClose={() => setSelectedRow(null)}/>
        </div>
    );
};
