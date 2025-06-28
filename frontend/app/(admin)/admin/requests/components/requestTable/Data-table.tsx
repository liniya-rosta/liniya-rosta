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
} from "@/components/ui/table"
import Loading from '@/components/ui/Loading/Loading'
import TablePagination from "@/app/(admin)/admin/requests/components/requestTable/TablePagination";
import {useState} from "react";
import StatusFilter from "@/app/(admin)/admin/requests/components/requestTable/StatusFilter";
import ColumnVisibility from "./ColumnVisibility"
import SearchTable from "@/app/(admin)/admin/requests/components/requestTable/SearchTable";
import CheckboxAction from "@/app/(admin)/admin/requests/components/requestTable/CheckboxAction";
import {DateFilter} from "@/app/(admin)/admin/requests/components/requestTable/DateFilter";
import {IRequest} from "@/lib/types";
import RequestsModal from "@/app/(admin)/admin/requests/components/RequestsModal";

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
                <div className="flex justify-between items-center gap-3 flex-wrap">
                    <SearchTable/>
                    <StatusFilter/>
                    <div>
                        <DateFilter/>
                    </div>

                </div>
                <div className="flex justify-between items-center gap-4">
                    <div className="flex items-center gap-3">
                        <ColumnVisibility table={table}/>
                        <CheckboxAction table={table}/>
                    </div>
                    <TablePagination/>
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
                                <TableCell colSpan={columns.length} className="h-24 text-center">
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
