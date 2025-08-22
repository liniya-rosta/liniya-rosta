"use client";

import React, {useEffect, useState} from "react";
import {Plus} from "lucide-react";
import {Button} from "@/src/components/ui/button";
import {CardContent} from "@/src/components/ui/card";
import {deleteProduct, fetchProductsAdmin} from "@/actions/superadmin/products";
import ProductsTable from "@/src/app/(admin)/admin/products/components/ProductTable/ProductsTable";
import {toast} from "react-toastify";
import {useAdminProductStore} from "@/store/superadmin/superadminProductsStore";
import DataSkeleton from "@/src/components/shared/DataSkeleton";
import ErrorMsg from "@/src/components/ui/ErrorMsg";
import Link from "next/link";
import {useAdminCategoryStore} from "@/store/superadmin/superadminCategoriesStore";
import {handleKyError} from "@/src/lib/handleKyError";
import CreateCategoryForm from "@/src/app/(admin)/admin/products/components/Modal/CategoryCreateForm";
import {fetchCategories} from "@/actions/categories";

const ProductsClient = ({}) => {
    const {
        products,
        setProducts,

        fetchLoading,
        setFetchLoading,

        fetchError,
        setFetchError,

        deleteLoading,
        setDeleteLoading,

        createLoading,
        updateLoading,

        setCreateError,
        setUpdateError,
        setDeleteError,
    } = useAdminProductStore();

    const {setCategories, fetchCategoriesError, setFetchCategoriesError} = useAdminCategoryStore();
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const anyLoading = createLoading || updateLoading || deleteLoading;
    const overallError = fetchError || fetchCategoriesError;

    // await Promise.all([
//     (async () => {
//         try {
//             categories = await fetchCategories();
//         } catch (e) {
//             categoriesError = await handleKyError(e, "Ошибка при загрузке категории.");
//         }
//     })(),
//     (async () => {
//         try {
//             console.log("API_BASE_URL =", API_BASE_URL);
//             const data = await fetchProducts({});
//             products = data.items;
//         } catch (e) {
//             productsError = await handleKyError(e, "Ошибка при загрузке продуктов");
//         }
//     })()
// ]);

    useEffect(() => {
        const getData = async () => {
            setFetchLoading(true);
            try {
                const categories = await fetchCategories();
                const products = await fetchProductsAdmin({});
                setProducts(products.items);
                setCategories(categories);
            } catch (e) {
                const categoriesError = await handleKyError(e, "Ошибка при загрузке категории.");
                console.log(categoriesError);
            } finally {
                setFetchLoading(false);
            }
        };

        void getData();
    }, [setProducts, setCategories, setFetchLoading]);

    const resetErrors = () => {
        setFetchError(null);
        setFetchCategoriesError(null);
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
            const errorMessage = await handleKyError(err, "Неизвестная ошибка при удалении товара")
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
            const errorMessage = await handleKyError(err, "Неизвестная ошибка при удалении выбранных товаров")
            setDeleteError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setDeleteLoading(false);
        }
    };

    if (fetchLoading) return <DataSkeleton/>;

    if (overallError) return <ErrorMsg error={overallError}/>

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:justify-between items-center gap-4">
                <div>
                    <h1 className="text-23-30-1_5 font-bold text-center sm:text-left">
                        Управление товарами
                    </h1>
                    <p className="text-muted-foreground mt-1 text-center sm:text-left">
                        Создавайте и редактируйте товары
                    </p>
                </div>
                <div className="flex gap-2 flex-wrap">
                    <Link href="/admin/products/add-product">
                        <Button className="flex items-center gap-2" disabled={anyLoading}>
                            <Plus size={16}/> Создать продукт
                        </Button>
                    </Link>
                    <Button
                        onClick={() => setIsCategoryModalOpen(true)}
                        variant="outline"
                    >
                        + Категория
                    </Button>
                </div>
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
                        onDeleteProduct={handleDeleteProduct}
                        onDeleteSelectedProducts={handleDeleteSelectedProducts}
                        actionLoading={anyLoading}
                    />
                )}
            </CardContent>

            <CreateCategoryForm
                open={isCategoryModalOpen}
                onClose={() => setIsCategoryModalOpen(false)}
            />
        </div>
    );
};

export default ProductsClient;