'use client';

import React, {useEffect} from 'react';
import {useProductStore} from '@/store/productsStore';
import {usePortfolioStore} from "@/store/portfolioItemStore";
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import {Category, Contact, PortfolioItemPreview, Product} from '@/lib/types';
import {useCategoryStore} from "@/store/categoriesStore";
import Loading from "@/components/shared/Loading";
import ErrorMsg from "@/components/shared/ErrorMsg";
import HeroSection from "@/app/(public)/(home)/components/HeroSection";
import CategoriesSection from "@/app/(public)/(home)/components/CategoriesSection";
import ProductsSection from "@/app/(public)/(home)/components/ProductsSection";
import PortfolioSection from "@/app/(public)/(home)/components/PortfolioSection";
import InstagramSection from "@/app/(public)/(home)/components/InstagramSection";
import ConsultationSection from "@/app/(public)/(home)/components/ConsultationSection";
import {useContactStore} from "@/store/contactsStore";

interface HomePageClientProps {
    categoriesData: Category[];
    productsData: Product[];
    portfolioItems: PortfolioItemPreview[];
    contactData: Contact | null,
    categoriesError: string | null;
    productsError: string | null;
    portfolioError: string | null;
    contactError: string | null;
}

const HomePageClient: React.FC<HomePageClientProps> = ({
                                                           categoriesData,
                                                           productsData,
                                                           portfolioItems,
                                                           contactData,
                                                           categoriesError,
                                                           productsError,
                                                           portfolioError,
                                                           contactError,
                                                       }) => {

    const {
        setCategories,
        fetchCategoriesLoading,
        fetchCategoriesError,
        setFetchCategoriesError,
        setFetchCategoriesLoading
    } = useCategoryStore();

    const {
        setProducts,
        fetchProductsLoading,
        fetchProductsError,
        setFetchProductsError,
        setFetchProductsLoading
    } = useProductStore();

    const {
        setContact,
        setFetchContactError,
        fetchContactLoading,
        setFetchContactLoading,
        fetchContactError
    } = useContactStore();

    const {
        setPortfolioPreview,
        fetchLoading: portfolioLoading,
    } = usePortfolioStore();

    useEffect(() => {
        setCategories(categoriesData);
        setProducts(productsData);
        setPortfolioPreview(portfolioItems);
        if (contactData) setContact(contactData);

        setFetchCategoriesError(categoriesError);
        setFetchProductsError(productsError);
        setFetchContactError(contactError);

        setFetchCategoriesLoading(false);
        setFetchProductsLoading(false);
        setFetchContactLoading(false);
    }, [categoriesData, productsData, portfolioItems, categoriesError, productsError, portfolioError, setPortfolioPreview, setCategories, setProducts, setFetchCategoriesError, setFetchProductsError, setFetchCategoriesLoading, setFetchProductsLoading, contactData, setContact, setFetchContactError, contactError, setFetchContactLoading]);

    const overallLoading = fetchCategoriesLoading || fetchProductsLoading || portfolioLoading || fetchContactLoading || fetchContactLoading;
    const overallError = fetchCategoriesError || fetchProductsError || portfolioError || fetchContactError;

    if (overallLoading) return <Loading/>;
    if (overallError) return <ErrorMsg error={overallError}/>

    return (
        <div className="container mx-auto px-4 py-8 space-y-16">
            <HeroSection/>

            <CategoriesSection/>

            <ProductsSection/>

            <PortfolioSection/>

            <ConsultationSection/>

            <InstagramSection/>
        </div>
    );
};

export default HomePageClient;