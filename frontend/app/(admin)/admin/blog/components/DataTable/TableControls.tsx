import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Input} from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent, DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import React from "react";
import {Table as TanStackTable} from "@tanstack/table-core/";
import { Post} from "@/lib/types";
import { FilterType } from "./PostsTable";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

interface Props {
    activeFilterType: FilterType;
    setActiveFilterType: (val: FilterType) => void;
    filterValue: string;
    setFilterValue: (val: string) => void;
    handleBulkDelete: () => void;
    table: TanStackTable<Post>,
    actionLoading: boolean;
    getFilterPlaceholder: () => string;
    onPageSizeChange: (size: string) => void;

}

const TableControls: React.FC<Props> = (
    { table, actionLoading, getFilterPlaceholder, filterValue, setFilterValue, activeFilterType, setActiveFilterType, handleBulkDelete, onPageSizeChange}
) => {
    const columnLabels: Record<string, string> = {
        "select": "Выбрать",
        "image": "Изображение",
        "title": "Заголовок",
        "description": "Описание",
    };

    return (
            <div className="flex justify-between gap-4 py-4 flex-wrap items-center">
                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                    <Select value={activeFilterType} onValueChange={(value: FilterType) => {
                        setActiveFilterType(value);
                        setFilterValue('');
                    }}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Выберите фильтр"/>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="title">По названию</SelectItem>
                            <SelectItem value="description">По описанию</SelectItem>
                        </SelectContent>
                    </Select>

                    <Input
                        placeholder={getFilterPlaceholder()}
                        value={filterValue}
                        onChange={(e) => setFilterValue(e.target.value)}
                        className="flex-grow max-w-sm"
                    />
                </div>

                <div className="flex gap-2">
                    <Button
                        disabled={actionLoading || table.getFilteredSelectedRowModel().rows.length === 0}
                        onClick={handleBulkDelete}
                        variant='outline'
                    >
                        Удалить выбранные {table.getFilteredSelectedRowModel().rows.length} элементы
                    </Button>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline">
                                Показать на странице <ChevronDown />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            {[5, 10, 20, 30, 50].map((pageSize) => (
                                <DropdownMenuItem
                                    key={pageSize}
                                    onSelect={() => {
                                        table.setPageSize(pageSize);
                                        onPageSizeChange(String(pageSize));
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

export default TableControls;