"use client"

import * as React from "react"
import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, SortingState,
    useReactTable, VisibilityState,
} from "@tanstack/react-table"

import {
    Table,
    TableBody,
    TableCell, TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import Loading from '@/components/shared/Loading/Loading'
import TablePagination from "@/app/(admin)/admin/requests/components/requestTable/TablePagination";
import {useState} from "react";
import StatusFilter from "@/app/(admin)/admin/requests/components/requestTable/StatusFilter";
import ColumnVisibility from "./ColumnVisibility"
import {Input} from "@/components/ui/input";

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    error: string | null
    loading: boolean
}

export const DataTable = <TData, TValue>({
                                             columns,
                                             data,
                                             error,
                                             loading,
                                         }: DataTableProps<TData, TValue>) => {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({})

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        state: {
            pagination: {
                pageSize: 20,
                pageIndex: 0,

            },
            sorting,
            columnFilters,
            columnVisibility,
        },
    })

    const statusColumn = table.getColumn("status");

    return (
        <div className="rounded-md border p-2">
            <Table>
                <TableHeader>
                    <TableRow
                        className="hover:bg-transparent">
                        <TableCell colSpan={columns.length}>
                            <div className="flex justify-between items-center gap-4">
                                {statusColumn && <StatusFilter column={statusColumn}/>}
                                <div className="flex items-center py-4">
                                    <Input
                                        placeholder="Поиск по имени"
                                        value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                                        onChange={(event) =>
                                            table.getColumn("name")?.setFilterValue(event.target.value)
                                        }
                                        className="max-w-sm"
                                    />
                                </div>
                                <ColumnVisibility table={table}/>
                                <TablePagination<TData> table={table}/>
                            </div>
                        </TableCell>
                    </TableRow>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow
                            className="hover:bg-transparent"
                            key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <TableHead key={header.id}>
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                        )}
                                </TableHead>
                            ))}
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
                            <TableCell colSpan={columns.length} className="h-24 text-center text-red-500">
                                {error}
                            </TableCell>
                        </TableRow>
                    ) : table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => (
                            <TableRow
                                className="odd:bg-white even:bg-gray-50 hover:bg-blue-50 cursor-pointer"
                                key={row.id}
                                data-state={row.getIsSelected() && "selected"}
                            >
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id}>
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
                <TableFooter>
                    <TableRow>
                        <TableCell colSpan={columns.length}>
                            <div className="flex justify-end">
                                <TablePagination<TData> table={table}/>
                            </div>
                        </TableCell>
                    </TableRow>
                </TableFooter>
            </Table>
        </div>
    )
};