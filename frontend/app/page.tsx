import React from 'react';
import {fetchCategories} from '@/actions/categories';
import {fetchProducts} from '@/actions/products';
import {Category, Product, PortfolioItemPreview} from '@/lib/types';
import {fetchPortfolioPreviews} from "@/actions/portfolios";
import HomePageClient from "@/app/(home)/HomeClient";

interface HomePageClientProps {
    categories: Category[];
    products: Product[];
    portfolioItems: PortfolioItemPreview[];
    categoriesError: string | null;
    productsError: string | null;
    portfolioError: string | null;
}

const HomePage = async () => {
    let categoriesData: Category[] = [];
    let productsData: Product[] = [];
    let portfolioData: PortfolioItemPreview[] = [];
    let categoriesError: string | null = null;
    let productsError: string | null = null;
    let portfolioError: string | null = null;

    try {
        categoriesData = await fetchCategories();
    } catch (e) {
        if (e instanceof Error) {
            categoriesError = e.message;
        } else {
            categoriesError = 'Неизвестная ошибка на сервере при загрузке категорий.';
        }
    }

    try {
        productsData = await fetchProducts();
    } catch (e) {
        if (e instanceof Error) {
            productsError = e.message;
        } else {
            productsError = 'Неизвестная ошибка на сервере при загрузке товаров.';
        }
    }

    try {
        portfolioData = await fetchPortfolioPreviews();
    } catch (e) {
        if (e instanceof Error) {
            portfolioError = e.message;
        } else {
            portfolioError = 'Неизвестная ошибка на сервере при загрузке портфолио.';
        }
    }

    const initialProps: HomePageClientProps = {
        categories: categoriesData,
        products: productsData,
        portfolioItems: portfolioData,
        categoriesError: categoriesError,
        productsError: productsError,
        portfolioError: portfolioError,
    };

    return (
        <HomePageClient {...initialProps} />
    );
};

export default HomePage;