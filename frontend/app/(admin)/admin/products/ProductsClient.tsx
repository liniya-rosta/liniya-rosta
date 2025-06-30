"use client";

import React, {useEffect, useState} from "react";
import {Plus} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Alert, AlertDescription} from "@/components/ui/alert";
import {CardContent} from "@/components/ui/card";
import {AxiosError} from "axios";
import {useCategoryStore} from "@/store/categoriesStore";
import {deleteProduct} from "@/actions/superadmin/products";
import ProductModal from "@/app/(admin)/admin/products/components/ProductModal";
import ProductsTable from "@/app/(admin)/admin/products/components/ProductsTable";
import {Category, Product} from "@/lib/types";
import {toast} from "react-toastify";
import {useAdminProductStore} from "@/store/superadmin/superadminProductsStore";
import DataSkeleton from "@/components/ui/Loading/DataSkeleton";

interface ProductsClientProps {
    initialProducts: Product[];
    initialCategories: Category[];
    initialError: string | null;
}

const ProductsClient: React.FC<ProductsClientProps> = ({
                                                           initialProducts,
                                                           initialCategories,
                                                           initialError,
                                                       }) => {
    const {
        products,
        setProducts,
        fetchLoading,
        createLoading,
        updateLoading,
        deleteLoading,
        fetchError,
        setFetchLoading,
        setDeleteLoading,
        setFetchError,
        setCreateError,
        setUpdateError,
        setDeleteError,
    } = useAdminProductStore();

    const {categories, setCategories} = useCategoryStore();

    const [isHydrating, setIsHydrating] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

    const anyLoading = createLoading || updateLoading || deleteLoading;

    useEffect(() => {
        if (initialProducts) setProducts(initialProducts);
        if (initialCategories) setCategories(initialCategories);
        if (initialError) setFetchError(initialError);
        setFetchLoading(false);
        setIsHydrating(false);
    }, [
        initialProducts,
        initialCategories,
        initialError,
        setProducts,
        setCategories,
        setFetchError,
        setFetchLoading,
    ]);

    const resetAndCloseModal = () => {
        setEditingProduct(null);
        setIsModalOpen(false);
        setCreateError(null);
        setUpdateError(null);
    };

    const openCreateModal = () => {
        setEditingProduct(null);
        setIsModalOpen(true);
        resetErrors();
    };

    const openEditModal = (product: Product) => {
        setEditingProduct(product);
        setIsModalOpen(true);
        resetErrors();
    };

    const resetErrors = () => {
        setFetchError(null);
        setCreateError(null);
        setUpdateError(null);
        setDeleteError(null);
    };

    const handleDeleteProduct = async (id: string) => {
        resetErrors();
        setDeleteLoading(true);
        try {
            await deleteProduct(id);
            setProducts(products.filter((product) => product._id !== id));
            toast.success("Товар успешно удален!");
        } catch (err) {
            const errorMessage =
                err instanceof AxiosError
                    ? err.response?.data?.error
                    : "Неизвестная ошибка при удалении товара";
            setDeleteError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setDeleteLoading(false);
        }
    };

    const handleDeleteSelectedProducts = async (ids: string[]) => {
        resetErrors();
        setDeleteLoading(true);
        try {
            for (const id of ids) {
                await deleteProduct(id);
            }
            setProducts(products.filter((product) => !ids.includes(product._id)));
            toast.success("Выбранные товары успешно удалены!");
        } catch (err) {
            const errorMessage =
                err instanceof AxiosError
                    ? err.response?.data?.error
                    : "Неизвестная ошибка при удалении выбранных товаров";
            setDeleteError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setDeleteLoading(false);
        }
    };

    if (isHydrating || fetchLoading) return <DataSkeleton/>;

    if (fetchError) {
        return (
            <div className="flex items-center justify-center min-h-64">
                <Alert variant="destructive" className="max-w-md">
                    <AlertDescription>
                        Ошибка при загрузке продуктов: {fetchError}
                    </AlertDescription>
                </Alert>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:justify-between items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-foreground text-center sm:text-left">
                        Управление продуктами
                    </h1>
                    <p className="text-muted-foreground mt-1 text-center sm:text-left">
                        Создавайте и редактируйте товары
                    </p>
                </div>
                <Button
                    onClick={openCreateModal}
                    disabled={anyLoading}
                    className="flex items-center gap-2 w-full sm:w-auto"
                >
                    <Plus size={16}/>
                    Добавить продукт
                </Button>
            </div>

            <CardContent className="px-0">
                {products.length === 0 && !fetchLoading ? (
                    <div className="text-center py-8 text-muted-foreground">
                        <p>Продукты не найдены</p>
                        <p className="text-sm mt-2">
                            Нажмите &#34;Добавить продукт&#34; для создания первого товара
                        </p>
                    </div>
                ) : (
                    <ProductsTable
                        products={products}
                        categories={categories}
                        onEditProduct={openEditModal}
                        onDeleteProduct={handleDeleteProduct}
                        onDeleteSelectedProducts={handleDeleteSelectedProducts}
                        actionLoading={anyLoading}
                    />
                )}
            </CardContent>

            <ProductModal
                isOpen={isModalOpen}
                onClose={resetAndCloseModal}
                isEditing={!!editingProduct}
                editingProduct={editingProduct}
                categories={categories}
            />
        </div>
    );
};

export default ProductsClient;