import React from 'react';
import {fetchCategories} from '@/actions/categories';
import {fetchProducts} from '@/actions/products';
import {Category, Contact, PortfolioItemPreview, Product} from '@/lib/types';
import {fetchPortfolioPreviews} from "@/actions/portfolios";
import {fetchContacts} from "@/actions/contacts";
import HomePageClient from "@/app/(public)/(home)/HomeClient";

export const revalidate = 300;

const HomePage = async () => {
    let categoriesData: Category[] = [];
    let productsData: Product[] = [];
    let portfolio: PortfolioItemPreview[] = [];
    let contactData: Contact | null = null;
    let categoriesError = null;
    let productsError = null;
    let portfolioError = null;
    let contactError = null;

    await Promise.all([
        fetchCategories()
            .then(data => categoriesData = data)
            .catch(e => {
                categoriesError = e instanceof Error ? e.message : String(e);
            }),

        fetchProducts()
            .then(data => productsData = data)
            .catch(e => {
                productsError = e instanceof Error ? e.message : String(e);
            }),

        fetchPortfolioPreviews()
            .then(data => portfolio = data.items)
            .catch(e => {
                portfolioError = e instanceof Error ? e.message : String(e);
            }),

        fetchContacts()
            .then(data => contactData = data)
            .catch(e => {
                contactError = e instanceof Error ? e.message : String(e);
            }),
    ]);

    const initialProps = {
        categoriesData,
        productsData,
        portfolioItems: portfolio,
        contactData,
        categoriesError,
        productsError,
        portfolioError,
        contactError,
    };

    return (
        <HomePageClient {...initialProps} />
    );
};

export default HomePage;