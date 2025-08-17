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
import {Product} from "@/src/lib/types";
import ConfirmDialog from "@/src/components/ui/ConfirmDialog";
import SaleLabelModal from "@/src/app/(admin)/admin/products/components/Modal/SaleLabelModal";
import ProductsTableToolbar from "@/src/app/(admin)/admin/products/components/ProductTable/ProductsTableToolbar";
import ImagesModal from "@/src/app/(admin)/admin/products/components/Modal/ImagesModal";
import {useProductsTableLogic} from "@/src/app/(admin)/admin/products/hooks/useProductsTableLogic";
import ProductTableContent from "@/src/app/(admin)/admin/products/components/ProductTable/ProductsTableContent";
import {useProductsQuery} from "@/src/app/(admin)/admin/products/hooks/useProductsQuery";
import ProductsTablePagination from "@/src/app/(admin)/admin/products/components/ProductTable/ProductsTablePagination";
import ProductEditModal from "@/src/app/(admin)/admin/products/components/Modal/ProductEditModal";
import ImageModal from "@/src/app/(admin)/admin/portfolio/components/ImageModal";
import {useAdminCategoryStore} from "@/store/superadmin/superadminCategoriesStore";

interface ProductsTableProps {
    actionLoading: boolean;
    onDeleteProduct: (id: string) => void;
    onDeleteSelectedProducts: (ids: string[]) => void;
}

const ProductsTable: React.FC<ProductsTableProps> = ({
                                                         actionLoading,
                                                         onDeleteProduct,
                                                         onDeleteSelectedProducts,
                                                     }) => {
    const [editingProduct, setEditingProduct] = React.useState<Product | null>(null);

    const handleEditProduct = React.useCallback((product: Product) => {
        setEditingProduct(product);
    }, []);

    const {categories} = useAdminCategoryStore();

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
        totalItems,
        refresh,
    } = useProductsQuery();

    const columns = React.useMemo(
        () =>
            getProductTableColumns(
                categories,
                handleEditProduct,
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
            handleEditProduct,
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
                ? updater({pageIndex, pageSize})
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

            <ImageModal
                open={!!previewImage}
                openChange={() => setPreviewImage(null)}
                image={previewImage?.url || ""}
                alt={previewImage?.alt?.ru || "Изображение"}
            />

            <SaleLabelModal
                saleLabel={saleLabel}
                onClose={() => setSaleLabel(null)}
            />

            <ImagesModal
                open={isImagesModalOpen}
                onClose={() => setIsImagesModalOpen(false)}
                onAfterChange={refresh}
            />

            {editingProduct && (
                <ProductEditModal
                    open={true}
                    onClose={() => setEditingProduct(null)}
                    product={editingProduct}
                    refresh={refresh}
                />
            )}
        </div>
    );
};

export default ProductsTable;