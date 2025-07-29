import React from 'react';
import {Category, Product} from "@/src/lib/types";
import {fetchProducts} from "@/actions/products";
import {fetchCategories} from "@/actions/categories";
import ProductsClient from "@/src/app/(admin)/admin/products/ProductsClient";
import {AxiosError} from "axios";

const AdminProductsPage = async () => {
    let products: Product[] = [];
    let productsError: string | null = null;

    let categories: Category[] = [];
    let categoriesError: string | null = null;

    await Promise.all([
        fetchCategories()
            .then(data => categories = data)
            .catch(e => {
                if (e instanceof AxiosError) {
                    categoriesError = (e.response?.data?.error ?? "Ошибка при загрузке категории.");
                } else {
                    categoriesError = "Неизвестная ошибка на сервере при загрузке категории.";
                }
            }),

        fetchProducts({})
            .then(data => products = data.items)
            .catch(e => {
                if (e instanceof AxiosError) {
                    productsError = (e.response?.data?.error ?? "Ошибка при загрузке продуктов.");
                } else {
                    productsError = "Неизвестная ошибка на сервере при загрузке продуктов.";
                }
            }),
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