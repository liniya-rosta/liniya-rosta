"use client";

import React, { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CardContent } from "@/components/ui/card";

import { AxiosError } from "axios";
import Loading from "@/components/shared/Loading";
import {useCategoryStore} from "@/store/categoriesStore";
import {useProductStore} from "@/store/productsStore";
import {CreateProductFormData, UpdateProductFormData} from "@/lib/zodSchemas/productSchema";
import {createProduct, deleteProduct, updateProduct} from "@/actions/products";
import ProductFormModal from "@/app/admin/products/components/ProductFormModal";
import {Category, Product} from "@/lib/types";
import ProductsTable from "@/app/admin/products/components/ProductsTable";

interface ProductsClientProps {
    initialProducts: Product[];
    initialCategories: Category[];
    initialError: string | null;
}

const ProductsClient: React.FC<ProductsClientProps> = ({initialProducts, initialCategories, initialError,}) => {
    const {
        products,
        setProducts,
        fetchProductsLoading,
        fetchProductsError,
        setFetchProductsLoading,
        setFetchProductsError,
    } = useProductStore();

    const { categories, setCategories } = useCategoryStore();

    const [isHydrating, setIsHydrating] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        if (initialProducts) setProducts(initialProducts);
        if (initialCategories) setCategories(initialCategories);
        setFetchProductsError(initialError);
        setFetchProductsLoading(false);
        setIsHydrating(false);
    }, [
        initialProducts,
        initialCategories,
        initialError,
        setProducts,
        setCategories,
        setFetchProductsError,
        setFetchProductsLoading,
    ]);

    const resetAndCloseModal = () => {
        setEditingProduct(null);
        setIsModalOpen(false);
        setFetchProductsError(null);
    };

    const openCreateModal = () => {
        setEditingProduct(null);
        setIsModalOpen(true);
        setFetchProductsError(null);
    };

    const openEditModal = (product: Product) => {
        setEditingProduct(product);
        setIsModalOpen(true);
        setFetchProductsError(null);
    };

    const onSubmit = async (formData: CreateProductFormData | UpdateProductFormData, isEditingMode: boolean) => {
        setActionLoading(true);
        try {
            let resultProduct: Product;
            if (isEditingMode) {
                const updateFormData = formData as UpdateProductFormData;
                if (!editingProduct) throw new Error("Editing product is null");

                const productDataForUpdate = {
                    category: updateFormData.category,
                    title: updateFormData.title,
                    description: updateFormData.description || "",
                };

                const imageFileOrNull =
                    updateFormData.image === null
                        ? undefined
                        : updateFormData.image instanceof File
                            ? updateFormData.image
                            : undefined;

                resultProduct = await updateProduct(
                    editingProduct._id,
                    productDataForUpdate,
                    imageFileOrNull
                );
                setProducts(
                    products.map((product) =>
                        product._id === editingProduct._id ? resultProduct : product
                    )
                );
                alert("Товар успешно обновлен!");
            } else {
                const createFormData = formData as CreateProductFormData;

                const productDataForCreate = {
                    category: createFormData.category,
                    title: createFormData.title,
                    description: createFormData.description || "",
                    image: createFormData.image,
                };

                resultProduct = await createProduct(
                    productDataForCreate,
                    productDataForCreate.image
                );
                setProducts([...products, resultProduct]);
                alert("Товар успешно создан!");
            }
            resetAndCloseModal();
        } catch (err) {
            const errorMessage =
                err instanceof AxiosError
                    ? err.response?.data?.error
                    : err instanceof Error
                        ? err.message
                        : "Ошибка при сохранении товара";
            setFetchProductsError(errorMessage);
            alert(errorMessage);
        } finally {
            setActionLoading(false);
        }
    };

    const handleDeleteProduct = async (id: string) => {
        if (!window.confirm("Вы уверены, что хотите удалить этот товар?")) return;

        try {
            setActionLoading(true);
            await deleteProduct(id);
            setProducts(products.filter((product) => product._id !== id));
            alert("Товар успешно удален!");
        } catch (err) {
            const errorMessage =
                err instanceof AxiosError
                    ? err.response?.data?.error
                    : "Ошибка при удалении товара";
            setFetchProductsError(errorMessage);
            alert(errorMessage);
        } finally {
            setActionLoading(false);
        }
    };

    if (isHydrating || fetchProductsLoading) return <Loading />;

    if (fetchProductsError) {
        return (
            <div className="flex items-center justify-center min-h-64">
                <Alert variant="destructive" className="max-w-md">
                    <AlertDescription>
                        Ошибка при загрузке продуктов: {fetchProductsError}
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
                    disabled={actionLoading}
                    className="flex items-center gap-2 w-full sm:w-auto"
                >
                    <Plus size={16} />
                    Добавить продукт
                </Button>
            </div>

            <CardContent className="px-0">
                {products.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                        <p>Продукты не найдены</p>
                        <p className="text-sm mt-2">
                            Нажмите "Добавить продукт" для создания первого товара
                        </p>
                    </div>
                ) : (
                    <ProductsTable
                        products={products}
                        categories={categories}
                        onEditProduct={openEditModal}
                        onDeleteProduct={handleDeleteProduct}
                        actionLoading={actionLoading}
                    />
                )}
            </CardContent>

            <ProductFormModal
                isOpen={isModalOpen}
                onClose={resetAndCloseModal}
                isEditing={!!editingProduct}
                editingProduct={editingProduct}
                categories={categories}
                actionLoading={actionLoading}
                onSubmit={onSubmit}
            />
        </div>
    );
};

export default ProductsClient;