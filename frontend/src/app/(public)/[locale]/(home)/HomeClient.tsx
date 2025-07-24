'use client';

import React, {useEffect} from 'react';
import {useProductStore} from '@/store/productsStore';
import {usePortfolioStore} from "@/store/portfolioItemStore";
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import {Category, Contact, PortfolioItemPreview, Product, ServiceResponse} from '@/src/lib/types';
import {useCategoryStore} from "@/store/categoriesStore";
import ErrorMsg from "@/src/components/ui/ErrorMsg";
import HeroSection from "@/src/app/(public)/[locale]/(home)/components/HeroSection";
import CategoriesSection from "@/src/app/(public)/[locale]/(home)/components/CategoriesSection";
import ProductsSection from "@/src/app/(public)/[locale]/(home)/components/ProductsSection";
import PortfolioSection from "@/src/app/(public)/[locale]/(home)/components/PortfolioSection";
import InstagramSection from "@/src/app/(public)/[locale]/(home)/components/InstagramSection";
import ConsultationSection from "@/src/app/(public)/[locale]/(home)/components/ConsultationSection";
import {useContactStore} from "@/store/contactsStore";
import LoadingFullScreen from "@/src/components/ui/Loading/LoadingFullScreen";
import {useServiceStore} from "@/store/serviceStore";
import ServiceSection from "@/src/app/(public)/[locale]/(home)/components/ServiceSection";

interface HomePageClientProps {
    categoriesData: Category[];
    productsData: Product[];
    portfolioItems: PortfolioItemPreview[];
    contactData: Contact | null,
    serviceData: ServiceResponse | null,
    categoriesError: string | null;
    productsError: string | null;
    portfolioError: string | null;
    contactError: string | null;
    serviceError: string | null;
    title: string
}

const HomePageClient: React.FC<HomePageClientProps> = ({
                                                           categoriesData,
                                                           productsData,
                                                           portfolioItems,
                                                           contactData,
                                                           serviceData,
                                                           categoriesError,
                                                           productsError,
                                                           portfolioError,
                                                           contactError,
                                                           serviceError,
                                                           title
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
        fetchLoadingPortfolio: portfolioLoading,
        setPortfolioLoading,
    } = usePortfolioStore();

    const {
        setAllServices,
        fetchLoadingService,
        setFetchServiceLoading,
    } = useServiceStore();

    useEffect(() => {
        setCategories(categoriesData);
        setProducts(productsData);
        setPortfolioPreview(portfolioItems);
        if (contactData) setContact(contactData);
        if (serviceData) setAllServices(serviceData.items);

        setFetchCategoriesError(categoriesError);
        setFetchProductsError(productsError);
        setFetchContactError(contactError);

        setFetchCategoriesLoading(false);
        setFetchProductsLoading(false);
        setFetchContactLoading(false);
        setPortfolioLoading(false);
        setFetchServiceLoading(false);
    }, [
        categoriesData,
        productsData,
        portfolioItems,
        contactData,
        serviceData,
        categoriesError,
        productsError,
        portfolioError,
        serviceError,
        contactError,
        setPortfolioPreview,
        setCategories,
        setProducts,
        setAllServices,
        setFetchCategoriesError,
        setFetchProductsError,
        setFetchCategoriesLoading,
        setFetchProductsLoading,
        setFetchServiceLoading,
        setContact,
        setFetchContactError,
        setFetchContactLoading,
        setPortfolioLoading
    ]);

    const overallLoading = fetchCategoriesLoading || fetchProductsLoading || portfolioLoading || fetchContactLoading || fetchLoadingService;
    const overallError = fetchCategoriesError || fetchProductsError || portfolioError || fetchContactError || serviceError;

    if (overallLoading) return <LoadingFullScreen/>;
    if (overallError) return <ErrorMsg error={overallError}/>

    return (
        <>
            <HeroSection title={title} />

            <ServiceSection/>
            <div className="container mx-auto px-4 py-8 space-y-16">

                <CategoriesSection />

                <ProductsSection />

                <PortfolioSection />

                <ConsultationSection />

                <InstagramSection />
            </div>
        </>

    );
};

export default HomePageClient;