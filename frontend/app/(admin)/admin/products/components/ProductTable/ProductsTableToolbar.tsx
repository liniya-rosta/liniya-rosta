import React from 'react';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Input} from "@/components/ui/input";
import CategoryFilter from "@/app/(admin)/admin/products/components/ProductTable/CategoryFilter";
import {Button} from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent, DropdownMenuItem,
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

    categoryId: string | null;
    setCategoryId: (id: string | null) => void;

    setPageSize: (size: number) => void;
    setPageIndex: (page: number) => void;

    onConfirmDialogOpen: (ids: string[]) => void;
}

const ProductsTableToolbar: React.FC<Props> = ({
                                                   actionLoading,
                                                   table,
                                                   filterValue,
                                                   setFilterValue,
                                                   activeFilterType,
                                                   setActiveFilterType,
                                                   categoryId,
                                                   setCategoryId,
                                                   onConfirmDialogOpen,
                                                   setPageSize,
                                                   setPageIndex,
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
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 w-full flex-wrap mb-4">

            <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                <Select value={activeFilterType} onValueChange={(value: FilterType) => {
                    setActiveFilterType(value);
                    setFilterValue('');
                    table.setPageIndex(0);
                }}>
                    <SelectTrigger className="w-full sm:w-[180px]">
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
                    onChange={(e) => {
                        setFilterValue(e.target.value);
                        table.setPageIndex(0);
                    }}
                    className="w-full sm:max-w-xs"
                />
            </div>

            <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                <CategoryFilter
                    selectedCategoryId={categoryId}
                    onCategoryChange={(id) => {
                        setCategoryId(id === "all" ? null : id);
                    }}
                    categories={categories}
                />

                <Button
                    disabled={actionLoading || table.getFilteredSelectedRowModel().rows.length === 0}
                    onClick={handleBulkDelete}
                    variant="outline"
                    className="w-full sm:w-auto"
                >
                    Удалить выбранные {table.getFilteredSelectedRowModel().rows.length} элементы
                </Button>
            </div>

            <div className="flex gap-2 w-full md:w-auto">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="w-full sm:w-auto">
                            Показывать по {table.getState().pagination.pageSize}
                            <ChevronDown className="ml-2 h-4 w-5"/>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {[5, 10, 20, 30, 50].map((size) => (
                            <DropdownMenuItem
                                key={size}
                                onSelect={() => {
                                    setPageSize(size);
                                    setPageIndex(0);
                                }}
                            >
                                {size} элементов {size === table.getState().pagination.pageSize && '✓'}                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="w-full sm:w-auto">
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

        </div>
    );
};

export default ProductsTableToolbar;