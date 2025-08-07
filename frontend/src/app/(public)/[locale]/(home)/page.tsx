import React from 'react';
import {fetchCategories} from '@/actions/categories';
import {fetchProducts} from '@/actions/products';
import {Category, Contact, PortfolioItemPreview, Product, ServiceResponse} from '@/src/lib/types';
import {fetchPortfolioPreviews} from "@/actions/portfolios";
import {fetchContacts} from "@/actions/contacts";
import HomePageClient from "@/src/app/(public)/[locale]/(home)/HomeClient";
import {fetchAllServices} from "@/actions/services";
import {getTranslations} from "next-intl/server";
import {Metadata} from "next";
import {handleKyError} from "@/src/lib/handleKyError";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations('HomePage');
    const tHeader = await getTranslations('Header');

    return {
        title: tHeader('headerLinks.home'),
        description: t('descriptionSeo'),
        openGraph: {
            title: t('ogTitle'),
            description: t('ogDescription'),
            url: '/',
            siteName: 'Линия Роста',
            images: [
                {
                    url: '/images/services/main-service.JPG',
                    width: 1200,
                    height: 630,
                    alt: t('ogImageAlt'),
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

    const tError = await getTranslations("Errors");

    await Promise.all([
        fetchCategories()
            .then(data => categoriesData = data)
            .catch(e => {
                categoriesError = e instanceof Error ? e.message : String(e);
            }),

        (async () => {
            try {
                const data = await fetchProducts({});
                productsData = data.items;
            } catch (e) {
                productsError = await handleKyError(e, tError("productsError"));
            }
        })(),

        fetchPortfolioPreviews(limitPortfolio)
            .then(data => portfolio = data.items)
            .catch(e => {
                portfolioError = e instanceof Error ? e.message : String(e);
            }),

        (async () => {
            try {
                contactData = await fetchContacts();
            } catch (e) {
                contactError = await handleKyError(e, tError('contactsError'));
            }
        })(),

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

    const tHome = await getTranslations('HomePage');

    return (
        <HomePageClient {...initialProps}
                        title={tHome("mainText")}
        />
    );
};

export default HomePage;