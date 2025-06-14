import React from 'react';
import {Category, Product} from "@/lib/types";
import ProductsClient from "@/app/admin/products/ProductsClient";
import { fetchProducts } from "@/actions/products";
import {fetchCategories} from "@/actions/categories";

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
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="rounded-lg">
                    <ProductsClient
                        initialProducts={products}
                        initialCategories={categories}
                        initialError={combinedError}
                    />
                </div>
            </div>
        </div>
    );
};

export default AdminProductsPage;