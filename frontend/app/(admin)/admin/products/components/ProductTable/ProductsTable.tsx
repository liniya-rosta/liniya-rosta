"use client";

import React from "react";
import {
    ColumnFiltersState,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    RowSelectionState,
    SortingState,
    useReactTable,
    VisibilityState,
} from "@tanstack/react-table";
import {Button} from "@/components/ui/button";
import {getProductTableColumns} from "./ProductTableColumns";
import {Product} from "@/lib/types";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import ImagePreviewModal from "@/app/(admin)/admin/products/components/Modal/ImagePreviewModal";
import SaleLabelModal from "@/app/(admin)/admin/products/components/Modal/SaleLabelModal";
import {useCategoryStore} from "@/store/categoriesStore";
import {useAdminProductStore} from "@/store/superadmin/superadminProductsStore";
import TableToolbar from "@/app/(admin)/admin/products/components/ProductTable/TableToolbar";
import ImagesModal from "@/app/(admin)/admin/products/components/Modal/ImagesModal";
import {useProductsTableLogic} from "@/app/(admin)/admin/products/hooks/useProductsTableLogic";
import ProductTableContent from "@/app/(admin)/admin/products/components/ProductTable/ProductsTableContent";

interface ProductsTableProps {
    onEditProduct: (product: Product) => void;
    actionLoading: boolean;
    onDeleteProduct: (id: string) => void;
    onDeleteSelectedProducts: (ids: string[]) => void;
}

const ProductsTable: React.FC<ProductsTableProps> = ({
                                                         onEditProduct,
                                                         actionLoading,
                                                         onDeleteProduct,
                                                         onDeleteSelectedProducts,
                                                     }) => {
    const {categories} = useCategoryStore();
    const {products} = useAdminProductStore();

    const {
        activeFilterType, setActiveFilterType,
        filterValue, setFilterValue,
        filteredProducts,
        previewImage, setPreviewImage,
        saleLabel, setSaleLabel,
        isImagesModalOpen, setIsImagesModalOpen,
        showConfirmDialog, setShowConfirmDialog,
        idsToDelete, setIdsToDelete,
        onImageClick,
        onSaleLabelClick,
        onImages,
    } = useProductsTableLogic(products);

    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});

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
                onImages
            ),
        [
            categories,
            onEditProduct,
            actionLoading,
            onImageClick,
            onSaleLabelClick,
            onImages,
            setIdsToDelete,
            setShowConfirmDialog
        ]
    );

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
            <TableToolbar
                actionLoading={actionLoading}
                table={table}
                filterValue={filterValue}
                setFilterValue={setFilterValue}
                activeFilterType={activeFilterType}
                setActiveFilterType={setActiveFilterType}
                onConfirmDialogOpen={(ids: string[]) => {
                    setIdsToDelete(ids);
                    setShowConfirmDialog(true);
                }}
            />

            <ProductTableContent table={table}/>

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
            />
            <ImagePreviewModal
                image={previewImage}
                onClose={() => setPreviewImage(null)}
            />
            <SaleLabelModal
                saleLabel={saleLabel}
                onClose={() => setSaleLabel(null)}
            />
            <ImagesModal
                open={isImagesModalOpen}
                onClose={() => setIsImagesModalOpen(false)}
            />
        </div>
    );
};

export default ProductsTable;