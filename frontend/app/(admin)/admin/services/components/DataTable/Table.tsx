import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { ChevronDown } from "lucide-react";
import {Table as TanStackTable} from "@tanstack/table-core";
import {Service} from "@/lib/types";
import React from "react";
import {TableBody, TableCell, TableHead, TableHeader, TableRow, Table } from "@/components/ui/table";
import { flexRender } from "@tanstack/react-table";
import {DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";

interface Props {
    table: TanStackTable<Service>;
    selectedToDelete: string[];
    showConfirm: (value: boolean) => void;
}

const columnLabels: Record<string, string> = {
    title: "Название услуг",
    description: "Описание",
};

const CustomTable: React.FC<Props> = ({table, selectedToDelete, showConfirm}) => {
return (
    <div className="w-full">
        <div className="flex items-center py-4">
            <Input
                placeholder="Поиск по названию..."
                value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
                onChange={(event) =>
                    table.getColumn("title")?.setFilterValue(event.target.value)
                }
                className="max-w-sm"
            />
            <Button
                variant="outline"
                disabled={!selectedToDelete || selectedToDelete.length < 1}
                onClick={() => {
                    showConfirm(true);
                }}
            >Удалить выбранные {selectedToDelete?.length} элементы</Button>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="ml-auto">
                        Колонки <ChevronDown />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    {table
                        .getAllColumns()
                        .filter((column) => column.getCanHide())
                        .map((column) => {
                            return (
                                <DropdownMenuCheckboxItem
                                    key={column.id}
                                    className="capitalize"
                                    checked={column.getIsVisible()}
                                    onCheckedChange={(value) =>
                                        column.toggleVisibility(!!value)
                                    }
                                >
                                    {columnLabels[column.id] ?? column.id}
                                </DropdownMenuCheckboxItem>
                            )
                        })}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => {
                                return (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </TableHead>
                                )
                            })}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => (
                            <TableRow
                                key={row.id}
                                data-state={row.getIsSelected() && "selected"}
                            >
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id}>
                                        {flexRender(
                                            cell.column.columnDef.cell,
                                            cell.getContext()
                                        )}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell
                                colSpan={table.getAllColumns().length}
                                className="h-24 text-center"
                            >
                               Нет данных
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
        <div className="flex items-center justify-end space-x-2 py-4">

            <div className="space-x-2">

            </div>
        </div>
    </div>
)
}

export default CustomTable;