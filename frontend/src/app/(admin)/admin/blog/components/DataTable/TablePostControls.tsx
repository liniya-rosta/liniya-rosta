import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/src/components/ui/select";
import {Input} from "@/src/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent, DropdownMenuItem,
    DropdownMenuTrigger
} from "@/src/components/ui/dropdown-menu";
import React, {useState} from "react";
import {Table as TanStackTable} from "@tanstack/table-core/";
import { Post} from "@/src/lib/types";
import { Button } from "@/src/components/ui/button";
import { ChevronDown } from "lucide-react";
import {useSuperAdminPostStore} from "@/store/superadmin/superAdminPostsStore";

interface Props {
    handleBulkDelete: () => void;
    table: TanStackTable<Post>,
    onFilterChange: (column: string, value: string) => void;
    setPersistedPageSize: (value: number) => void;
}

const columnLabels: Record<string, string> = {
    "select": "Выбрать",
    "image": "Изображение",
    "title": "Заголовок",
    "description": "Описание",
};

const filterOptions = [
    { label: "По заголовку", value: "title" },
    { label: "По описанию", value: "description" },
];

const TablePostControls: React.FC<Props> = ({ table, onFilterChange, handleBulkDelete, setPersistedPageSize}) => {
    const [filterColumn, setFilterColumn] = useState("title");
    const filterValue = (table.getColumn(filterColumn)?.getFilterValue() as string) ?? "";

    const {deleteLoading} = useSuperAdminPostStore();

    return (
            <div className="flex justify-between gap-4 py-4 flex-wrap items-center">
                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                    <Select value={filterColumn} onValueChange={(value: string) => {
                        table.getColumn(filterColumn)?.setFilterValue("");
                        setFilterColumn(value);
                    }}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Фильтр по колонке" />
                        </SelectTrigger>
                        <SelectContent>
                            {filterOptions.map(option => (
                                <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Input
                        placeholder="Поиск..."
                        value={filterValue}
                        onChange={(e) => {
                            const value = e.target.value;
                            table.getColumn(filterColumn)?.setFilterValue(value);
                            onFilterChange(filterColumn, value);
                        }}
                        className="w-full sm:w-[300px]"
                    />
                </div>

                <div className="flex gap-2">
                    <Button
                        disabled={deleteLoading || table.getFilteredSelectedRowModel().rows.length === 0}
                        onClick={handleBulkDelete}
                        variant='outline'
                    >
                        Удалить выбранные {table.getFilteredSelectedRowModel().rows.length} элементы
                    </Button>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline">
                                Показать: {table.getState().pagination.pageSize} <ChevronDown />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            {[5, 10, 20, 30, 50].map((pageSize) => (
                                <DropdownMenuItem
                                    key={pageSize}
                                    onSelect={() => {
                                        table.setPageSize(pageSize);
                                        setPersistedPageSize(pageSize);
                                    }}
                                >
                                    {pageSize} элементов
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline">
                                Столбцы <ChevronDown className="ml-2 h-4 w-5" />
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
                                                column.toggleVisibility(value)
                                            }
                                        >
                                            {columnLabels[column.id] ?? column.id}
                                        </DropdownMenuCheckboxItem>
                                    );
                                })}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
    )
}

export default TablePostControls;