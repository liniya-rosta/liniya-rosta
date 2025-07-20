import React from 'react';
import {fetchCategories} from '@/actions/categories';
import {fetchProducts} from '@/actions/products';
import {Category, Contact, PortfolioItemPreview, Product, ServiceResponse} from '@/lib/types';
import {fetchPortfolioPreviews} from "@/actions/portfolios";
import {fetchContacts} from "@/actions/contacts";
import HomePageClient from "@/app/(public)/(home)/HomeClient";
import {fetchAllServices} from "@/actions/services";
import {Metadata} from "next";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
    return {
        title: 'Главная',
        description: 'Компания «Линия Роста» — натяжные потолки, SPC ламинат, багеты и интерьерные решения в Бишкеке. Качество, гарантия, профессиональный монтаж.',
        openGraph: {
            title: 'Линия Роста',
            description: 'Натяжные потолки, SPC ламинат, багеты и интерьерные решения в Бишкеке.',
            url: '/',
            siteName: 'Линия Роста',
            images: [
                {
                    url: '/images/services/main-service.JPG',
                    width: 1200,
                    height: 630,
                    alt: 'Натяжные потолки и ламинат в Бишкеке от Линии Роста',
                },
            ],
            type: 'website',
        },
    };
}

const HomePage = async () => {
    let categoriesData: Category[] = [];
    let productsData: Product[] = [];
    let portfolio: PortfolioItemPreview[] = [];
    let contactData: Contact | null = null;
    let serviceData: ServiceResponse | null = null;
    let categoriesError = null;
    let productsError = null;
    let portfolioError = null;
    let contactError = null;
    let serviceError = null;

    const limitPortfolio = "8";

    await Promise.all([
        fetchCategories()
            .then(data => categoriesData = data)
            .catch(e => {
                categoriesError = e instanceof Error ? e.message : String(e);
            }),

        fetchProducts()
            .then(data => productsData = data.items)
            .catch(e => {
                productsError = e instanceof Error ? e.message : String(e);
            }),

        fetchPortfolioPreviews(limitPortfolio)
            .then(data => portfolio = data.items)
            .catch(e => {
                portfolioError = e instanceof Error ? e.message : String(e);
            }),

        fetchContacts()
            .then(data => contactData = data)
            .catch(e => {
                contactError = e instanceof Error ? e.message : String(e);
            }),
        fetchAllServices()
            .then(data => serviceData = data)
            .catch(e => {
                serviceError = e instanceof Error ? e.message : String(e);
            }),
    ]);

    const initialProps = {
        categoriesData,
        productsData,
        portfolioItems: portfolio,
        contactData,
        serviceData,
        categoriesError,
        productsError,
        portfolioError,
        contactError,
        serviceError,
    };

    return (
        <HomePageClient {...initialProps} />
    );
};

export default HomePage;