import React from 'react';
import {Category, Product} from "@/lib/types";
import {fetchProducts} from "@/actions/products";
import {fetchCategories} from "@/actions/categories";
import ProductsClient from "@/src/app/(admin)/admin/products/ProductsClient";

const AdminProductsPage = async () => {
    let products: Product[] = [];
    let productsError: string | null = null;

    let categories: Category[] = [];
    let categoriesError: string | null = null;

    try {
        products = await fetchProducts();
    } catch (e) {
        if (e instanceof Error) {
            productsError = e.message;
        } else {
            productsError = 'Неизвестная ошибка на сервере при загрузке продуктов.';
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
        <div>
            <ProductsClient
                initialProducts={products}
                initialCategories={categories}
                initialError={combinedError}
            />
        </div>

    );
};

export default AdminProductsPage;