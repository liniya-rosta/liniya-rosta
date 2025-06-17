'use client';

import React, {useEffect} from 'react';
import {useProductStore} from '@/store/productsStore';
import {usePortfolioStore} from "@/store/portfolioItemStore";
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import {Category, PortfolioItemPreview, Product} from '@/lib/types';
import {useCategoryStore} from "@/store/categoriesStore";
import Loading from "@/components/shared/Loading";
import ErrorMsg from "@/components/shared/ErrorMsg";
import HeroSection from "@/app/(home)/components/HeroSection";
import CategoriesSection from "@/app/(home)/components/CategoriesSection";
import ProductsSection from "@/app/(home)/components/ProductsSection";
import PortfolioSection from "@/app/(home)/components/PortfolioSection";
import InstagramSection from "@/app/(home)/components/InstagramSection";
import ConsultationSection from "@/app/(home)/components/ConsultationSection";

interface HomePageClientProps {
    categories: Category[];
    products: Product[];
    portfolioItems: PortfolioItemPreview[];
    categoriesError: string | null;
    productsError: string | null;
    portfolioError: string | null;
}

const HomePageClient: React.FC<HomePageClientProps> = ({
                                                           categories,
                                                           products,
                                                           portfolioItems,
                                                           categoriesError,
                                                           productsError,
                                                           portfolioError
                                                       }) => {

    const {
        categories: storedCategories,
        setCategories,
        fetchCategoriesLoading,
        fetchCategoriesError,
        setFetchCategoriesError,
        setFetchCategoriesLoading
    } = useCategoryStore();

    const {
        products: storedProducts,
        setProducts,
        fetchProductsLoading,
        fetchProductsError,
        setFetchProductsError,
        setFetchProductsLoading
    } = useProductStore();


    const {
        items: storedPortfolioItems,
        setPortfolioPreview,
        fetchLoading: portfolioLoading,
    } = usePortfolioStore();

    useEffect(() => {
        setCategories(categories);
        setProducts(products);
        setPortfolioPreview(portfolioItems);

        setFetchCategoriesError(categoriesError);
        setFetchProductsError(productsError);

        setFetchCategoriesLoading(false);
        setFetchProductsLoading(false);
    }, [categories, products, portfolioItems, categoriesError, productsError, portfolioError, setPortfolioPreview, setCategories, setProducts, setFetchCategoriesError, setFetchProductsError, setFetchCategoriesLoading, setFetchProductsLoading]);

    const overallLoading = fetchCategoriesLoading || fetchProductsLoading || portfolioLoading;
    const overallError = fetchCategoriesError || fetchProductsError || portfolioError;

    if (overallLoading) return <Loading/>;
    if (overallError && (!storedCategories.length && !storedProducts.length && !storedPortfolioItems.length)) {
        return <ErrorMsg error={overallError}/>
    }

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