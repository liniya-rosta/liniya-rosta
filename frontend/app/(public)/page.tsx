import React from 'react';
import {fetchCategories} from '@/actions/categories';
import {fetchProducts} from '@/actions/products';
import {Category, PortfolioItemPreview, Product} from '@/lib/types';
import {fetchPortfolioPreviews} from "@/actions/portfolios";
import HomePageClient from "@/app/(public)/(home)/HomeClient";

export const revalidate = 300;

const HomePage = async () => {
    let categories: Category[] = [];
    let products: Product[] = [];
    let portfolio: PortfolioItemPreview[] = [];
    let categoriesError = null;
    let productsError = null;
    let portfolioError = null;

    await Promise.all([
        fetchCategories()
            .then(data => categories = data)
            .catch(e => {
                categoriesError = e instanceof Error ? e.message : String(e);
            }),

        fetchProducts()
            .then(data => products = data)
            .catch(e => {
                productsError = e instanceof Error ? e.message : String(e);
            }),

        fetchPortfolioPreviews()
            .then(data => portfolio = data)
            .catch(e => {
                portfolioError = e instanceof Error ? e.message : String(e);
            }),
    ]);

    const initialProps = {
        categories,
        products,
        portfolioItems: portfolio,
        categoriesError,
        productsError,
        portfolioError,
    };

    return (
        <HomePageClient {...initialProps} />
    );
};

export default HomePage;