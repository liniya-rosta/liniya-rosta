"use client";

import React from "react";
import {
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import {getProductTableColumns} from "./ProductTableColumns";
import {Product} from "@/lib/types";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import ImagePreviewModal from "@/app/(admin)/admin/products/components/Modal/ImagePreviewModal";
import SaleLabelModal from "@/app/(admin)/admin/products/components/Modal/SaleLabelModal";
import {useCategoryStore} from "@/store/categoriesStore";
import ProductsTableToolbar from "@/app/(admin)/admin/products/components/ProductTable/ProductsTableToolbar";
import ImagesModal from "@/app/(admin)/admin/products/components/Modal/ImagesModal";
import {useProductsTableLogic} from "@/app/(admin)/admin/products/hooks/useProductsTableLogic";
import ProductTableContent from "@/app/(admin)/admin/products/components/ProductTable/ProductsTableContent";
import {useProductsQuery} from "@/app/(admin)/admin/products/hooks/useProductsQuery";
import ProductsTablePagination from "@/app/(admin)/admin/products/components/ProductTable/ProductsTablePagination";

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

    const {
        previewImage, setPreviewImage,
        saleLabel, setSaleLabel,
        isImagesModalOpen, setIsImagesModalOpen,
        showConfirmDialog, setShowConfirmDialog,
        idsToDelete, setIdsToDelete,
        onImageClick,
        onSaleLabelClick,
        onImages,
    } = useProductsTableLogic();

    const {
        products: filteredProducts,
        filterType, setFilterType,
        filterValue, setFilterValue,
        categoryId, setCategoryId,
        pageIndex, setPageIndex,
        pageSize, setPageSize,
        totalPages,
        totalItems
    } = useProductsQuery();

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
        manualPagination: true,
        pageCount: totalPages,
        onPaginationChange: (updater) => {
            const next = typeof updater === "function"
                ? updater({ pageIndex, pageSize })
                : updater;
            setPageIndex(next.pageIndex);
            setPageSize(next.pageSize);
        },
        state: {
            pagination: {pageIndex, pageSize},
        },
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
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
            <ProductsTableToolbar
                table={table}
                filterValue={filterValue}
                setFilterValue={setFilterValue}
                activeFilterType={filterType}
                setActiveFilterType={setFilterType}
                categoryId={categoryId}
                setCategoryId={setCategoryId}
                actionLoading={actionLoading}
                onConfirmDialogOpen={(ids: string[]) => {
                    setIdsToDelete(ids);
                    setShowConfirmDialog(true);
                }}
                setPageSize={setPageSize}
                setPageIndex={setPageIndex}
            />

            <ProductTableContent table={table}/>

            <ProductsTablePagination
                table={table}
                totalItems={totalItems}
            />

            <ConfirmDialog
                open={showConfirmDialog}
                onOpenChange={setShowConfirmDialog}
                title={confirmDialogTitle}
                onConfirm={confirmDeletion}
                loading={actionLoading}
                text="Это действие нельзя отменить. Вы уверены, что хотите удалить?"
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