import React from 'react';
import {Category, Product} from "@/src/lib/types";
import {fetchProducts} from "@/actions/products";
import {fetchCategories} from "@/actions/categories";
import ProductsClient from "@/src/app/(admin)/admin/products/ProductsClient";
import {handleKyError} from "@/src/lib/handleKyError";
import {API_BASE_URL} from "@/src/lib/globalConstants";

const AdminProductsPage = async () => {
    let products: Product[] = [];
    let productsError: string | null = null;

    let categories: Category[] = [];
    let categoriesError: string | null = null;

    await Promise.all([
        (async () => {
            try {
                categories = await fetchCategories();
            } catch (e) {
                categoriesError = await handleKyError(e, "Ошибка при загрузке категории.");
            }
        })(),
        (async () => {
            try {
                console.log("API_BASE_URL =", API_BASE_URL);
                const data = await fetchProducts({});
                products = data.items;
            } catch (e) {
                productsError = await handleKyError(e, "Ошибка при загрузке продуктов");
            }
        })()
    ]);



    return (
        <>
            <ProductsClient
                initialProducts={products}
                initialCategories={categories}
                initialProductsError={productsError}
                initialCategoriesError={categoriesError}
            />
        </>

    );
};

export default AdminProductsPage;