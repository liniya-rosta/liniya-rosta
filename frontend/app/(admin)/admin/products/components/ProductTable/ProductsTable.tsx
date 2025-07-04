"use client";

import React from "react";
import {
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    RowSelectionState,
    SortingState,
    useReactTable,
    VisibilityState,
} from "@tanstack/react-table";

import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from "@/components/ui/table";
import {Button} from "@/components/ui/button";
import {getProductTableColumns} from "./ProductTableColumns";
import {Product} from "@/lib/types";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import ImagePreviewModal from "@/app/(admin)/admin/products/components/ImagePreviewModal";
import SaleLabelModal from "@/app/(admin)/admin/products/components/SaleLabelModal";
import {useCategoryStore} from "@/store/categoriesStore";
import {useAdminProductStore} from "@/store/superadmin/superadminProductsStore";
import TableToolbar from "@/app/(admin)/admin/products/components/ProductTable/TableToolbar";

interface ProductsTableProps {
    onEditProduct: (product: Product) => void;
    actionLoading: boolean;
    onDeleteProduct: (id: string) => void;
    onDeleteSelectedProducts: (ids: string[]) => void;
}

type FilterType = 'title' | 'description';

const ProductsTable: React.FC<ProductsTableProps> = ({
                                                         onEditProduct,
                                                         actionLoading,
                                                         onDeleteProduct,
                                                         onDeleteSelectedProducts,
                                                     }) => {
    const {categories} = useCategoryStore();
    const {products} = useAdminProductStore();

    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});

    const [showConfirmDialog, setShowConfirmDialog] = React.useState(false);
    const [idsToDelete, setIdsToDelete] = React.useState<string[]>([]);

    const [activeFilterType, setActiveFilterType] = React.useState<FilterType>('title');
    const [filterValue, setFilterValue] = React.useState<string>('');
    const [filteredProducts, setFilteredProducts] = React.useState<Product[]>(products);

    const [previewImage, setPreviewImage] = React.useState<{ url: string; alt: string } | null>(null);
    const [saleLabel, setSaleLabel] = React.useState<string | null>(null);

    const onImageClick = (image: { url: string; alt: string }) => {
        setPreviewImage(image);
    };

    const onSaleLabelClick = (label: string) => {
        setSaleLabel(label);
    };

    const columns = React.useMemo(
        () =>
            getProductTableColumns(
                categories,
                onEditProduct,
                (id: string) => {
                    setIdsToDelete([id]);
                    setShowConfirmDialog(true);
                },
                actionLoading,
                onImageClick,
                onSaleLabelClick,
            ),
        [categories, onEditProduct, actionLoading]
    );

    React.useEffect(() => {
        if (filterValue) {
            const lowercasedFilterValue = filterValue.toLowerCase();
            const newFilteredProducts = products.filter(product => {
                if (activeFilterType === 'title') {
                    return product.title.toLowerCase().includes(lowercasedFilterValue);
                }
                if (activeFilterType === 'description') {
                    return product.description?.toLowerCase().includes(lowercasedFilterValue);
                }
                return true;
            });
            setFilteredProducts(newFilteredProducts);
        } else {
            setFilteredProducts(products);
        }
    }, [products, activeFilterType, filterValue]);

    const table = useReactTable({
        data: filteredProducts,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
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

    const confirmDeletion = () => {
        if (idsToDelete.length > 1) {
            onDeleteSelectedProducts(idsToDelete);
            table.toggleAllRowsSelected(false);
        } else if (idsToDelete.length === 1) {
            onDeleteProduct(idsToDelete[0]);
        }
        setShowConfirmDialog(false);
        setIdsToDelete([]);
    };

    const confirmDialogTitle = idsToDelete.length > 1
        ? `Удалить выбранные ${idsToDelete.length} товаров?`
        : "Удалить товар?";

    return (
        <div className="w-full">
            <TableToolbar actionLoading={actionLoading} table={table} filterValue={filterValue}
                          setFilterValue={setFilterValue} activeFilterType={activeFilterType}
                          setActiveFilterType={setActiveFilterType} onConfirmDialogOpen={(ids: string[]) => {
                setIdsToDelete(ids);
                setShowConfirmDialog(true);
            }}/>

            <div className="rounded-md border overflow-x-auto">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id} className="min-w-[100px]">
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    );
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
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    Нет результатов.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className="flex items-center justify-end space-x-2 py-4">
                <div className="text-muted-foreground flex-1 text-sm">
                    {table.getFilteredSelectedRowModel().rows.length} из{" "}
                    {table.getFilteredRowModel().rows.length} выбрано.
                </div>
                <div className="space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Назад
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        Далее
                    </Button>
                </div>
            </div>

            <ConfirmDialog
                open={showConfirmDialog}
                onOpenChange={setShowConfirmDialog}
                title={confirmDialogTitle}
                onConfirm={confirmDeletion}
                loading={actionLoading}
            >
            </ConfirmDialog>
            <ImagePreviewModal
                image={previewImage}
                onClose={() => setPreviewImage(null)}
            />
            <SaleLabelModal saleLabel={saleLabel} onClose={() => setSaleLabel(null)}/>
        </div>
    );
};

export default ProductsTable;