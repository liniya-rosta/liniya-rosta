import React from 'react';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/src/components/ui/select";
import {Input} from "@/src/components/ui/input";
import CategoryFilter from "@/src/app/(admin)/admin/products/components/ProductTable/CategoryFilter";
import {Button} from "@/src/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/src/components/ui/dropdown-menu";
import {ChevronDown} from "lucide-react";
import {Product} from "@/src/lib/types";
import {Table} from "@tanstack/react-table";
import {useAdminCategoryStore} from "@/store/superadmin/superadminCategoriesStore";
import {handleKyError} from "@/src/lib/handleKyError";
import {toast} from "react-toastify";
import {deleteCategory} from "@/actions/superadmin/categories";
import ConfirmDialog from "@/src/components/ui/ConfirmDialog";
import CategoryForm from "@/src/app/(admin)/admin/products/components/Modal/CategoryCreateForm";

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
    onRefresh: () => void;
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
                                                   onRefresh
                                               }) => {
    const {categories, setCategories, setDeleteCategoryLoading, setDeleteCategoryError} = useAdminCategoryStore();
    const [deleteOpen, setDeleteOpen] = React.useState(false);
    const [editCategory, setEditCategory] = React.useState<typeof categories[0] | null>(null);

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
        "seoTitle": "SEO заголовок",
        "seoDescription": "SEO описание",
    };

    const onDeleteCategory = async () => {
        if (!categoryId) return;
        try {
            setDeleteCategoryLoading(true);
            setDeleteCategoryError(null);

            await deleteCategory(categoryId);
            setCategories(categories.filter(c => c._id !== categoryId));

            setCategoryId(null);
            setPageIndex(0);
        } catch (e) {
            const msg = await handleKyError(e, "Не удалось удалить категорию");
            setDeleteCategoryError(msg);
            toast.error(msg);
        } finally {
            setDeleteCategoryLoading(false);
        }
    };

    return (
        <div
            className="flex flex-wrap gap-3 items-start justify-center md:justify-between w-full mb-4 space-y-6 sm:space-y-0">
            <div className="flex flex-col sm:flex-row gap-2 flex-1 min-w-[250px]">
                <Select
                    value={activeFilterType}
                    onValueChange={(value: FilterType) => {
                        setActiveFilterType(value);
                        setFilterValue('');
                        table.setPageIndex(0);
                    }}
                >
                    <SelectTrigger className="w-full sm:w-[160px]">
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
                    className="w-full sm:flex-1"
                />
            </div>

            <div className="flex flex-wrap gap-2 items-start justify-start flex-1 min-w-[250px]">
                <CategoryFilter
                    selectedCategoryId={categoryId}
                    onCategoryChange={(id) => {
                        setCategoryId(id === "all" ? null : id);
                    }}
                    categories={categories}
                />
            </div>

            <div className="flex gap-2 items-start flex-wrap">
                <Button
                    disabled={actionLoading || table.getFilteredSelectedRowModel().rows.length === 0}
                    onClick={handleBulkDelete}
                    variant="outline"
                    className="shrink-0"
                >
                    Удалить {table.getFilteredSelectedRowModel().rows.length || ""}
                </Button>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="min-w-[150px]">
                            Показывать по {table.getState().pagination.pageSize}
                            <ChevronDown className="ml-2 h-4 w-4"/>
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
                                {size} элементов {size === table.getState().pagination.pageSize && '✓'}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="min-w-[120px]">
                            Столбцы <ChevronDown className="ml-2 h-4 w-4"/>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {table
                            .getAllColumns()
                            .filter((column) => column.getCanHide())
                            .map((column) => (
                                <DropdownMenuCheckboxItem
                                    key={column.id}
                                    className="capitalize"
                                    checked={column.getIsVisible()}
                                    onCheckedChange={(value) => column.toggleVisibility(value)}
                                >
                                    {columnLabels[column.id] ?? column.id}
                                </DropdownMenuCheckboxItem>
                            ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <div className="flex gap-3 flex-wrap">
                <Button
                    variant="destructive"
                    className="shrink-0"
                    disabled={!categoryId}
                    onClick={() => setDeleteOpen(true)}
                >
                    Удалить категорию
                </Button>

                <Button
                    variant="outline"
                    className="shrink-0"
                    disabled={!categoryId}
                    onClick={() => {
                        const cat = categories.find(c => c._id === categoryId);
                        if (cat) setEditCategory(cat);
                    }}
                >
                    Редактировать категорию
                </Button>
            </div>

            <ConfirmDialog
                open={deleteOpen}
                onOpenChange={setDeleteOpen}
                title="Удалить категорию?"
                text="Будут удалены все продукты, связанные с этой категорией. Операцию нельзя отменить."
                onConfirm={onDeleteCategory}
            />

            {editCategory && (
                <CategoryForm
                    open={!!editCategory}
                    onClose={() => setEditCategory(null)}
                    initialData={editCategory}
                    onSuccess={onRefresh}
                />
            )}

        </div>
    );
};

export default ProductsTableToolbar;