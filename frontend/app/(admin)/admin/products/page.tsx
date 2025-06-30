import React from 'react';
import {Category, Product} from "@/lib/types";
import {fetchProducts} from "@/actions/products";
import {fetchCategories} from "@/actions/categories";
import ProductsClient from "@/app/(admin)/admin/products/ProductsClient";
import {AxiosError} from "axios";

const AdminProductsPage = async () => {
    let products: Product[] = [];
    let productsError: string | null = null;

    let categories: Category[] = [];
    let categoriesError: string | null = null;

    try {
        const data = await fetchProducts();
        products = data.items;
    } catch (e) {
        if (e instanceof AxiosError) {
            productsError = (e.response?.data?.error ?? "Ошибка при загрузке админов.");
        } else {
            productsError = "Неизвестная ошибка на сервере при загрузке продуктов.";
        }
    }

    try {
        categories = await fetchCategories();
    } catch (e) {
        if (e instanceof Error) {
            categoriesError = e.message;
        } else {
            categoriesError = 'Неизвестная ошибка на сервере при загрузке категории.';
        }
    }

    const combinedError = productsError || categoriesError;

    return (
        <>
            <ProductsClient
                initialProducts={products}
                initialCategories={categories}
                initialError={combinedError}
            />
        </>

    );
};

export default AdminProductsPage;