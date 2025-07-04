import React from 'react';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Input} from "@/components/ui/input";
import CategoryFilter from "@/app/(admin)/admin/products/components/CategoryFilter";
import {Button} from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {ChevronDown} from "lucide-react";
import {Product} from "@/lib/types";
import {useCategoryStore} from "@/store/categoriesStore";
import {Table} from "@tanstack/react-table";

type FilterType = 'title' | 'description';

interface Props {
    actionLoading: boolean;
    table: Table<Product>;

    filterValue: string;
    setFilterValue: (value: string) => void;

    activeFilterType: FilterType;
    setActiveFilterType: (type: FilterType) => void;

    onConfirmDialogOpen: (ids: string[]) => void;
}

const TableToolbar: React.FC<Props> = ({
                                           actionLoading,
                                           table,
                                           filterValue,
                                           setFilterValue,
                                           activeFilterType,
                                           setActiveFilterType,
                                           onConfirmDialogOpen
                                       }) => {
    const {categories} = useCategoryStore();

    const getFilterPlaceholder = () => {
        switch (activeFilterType) {
            case 'title':
                return 'Фильтр по названию';
            case 'description':
                return 'Фильтр по описанию';
            default:
                return 'Введите значение для фильтра';
        }
    };

    const handleBulkDelete = () => {
        const selectedIds = table.getSelectedRowModel().rows.map(row => row.original._id);
        if (selectedIds.length > 0) {
            onConfirmDialogOpen(selectedIds);
        }
    };

    const columnLabels: Record<string, string> = {
        "select": "Выбрать",
        "cover": "Обложка",
        "title": "Название",
        "description": "Описание",
        "category": "Категория",
        "images": "Изображения",
        "icon": "Иконка",
        "characteristics": "Характеристики",
        "sale": "Скидка",
    };

    return (
        <div className="flex items-center py-4 flex-wrap gap-2">
            <Select value={activeFilterType} onValueChange={(value: FilterType) => {
                setActiveFilterType(value);
                setFilterValue('');
            }}>
                <SelectTrigger className="md:w-[180px] w-full">
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

            <CategoryFilter
                column={table.getColumn("category")}
                categories={categories}
            />

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
                        Столбцы <ChevronDown className="ml-2 h-4 w-5"/>
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
    );
};

export default TableToolbar;