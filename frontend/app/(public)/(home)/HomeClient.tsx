'use client';

import React, {useEffect} from 'react';
import {useProductStore} from '@/store/productsStore';
import {usePortfolioStore} from "@/store/portfolioItemStore";
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import {Category, Contact, PortfolioItemPreview, Product} from '@/lib/types';
import {useCategoryStore} from "@/store/categoriesStore";
import ErrorMsg from "@/components/ui/ErrorMsg";
import HeroSection from "@/app/(public)/(home)/components/HeroSection";
import CategoriesSection from "@/app/(public)/(home)/components/CategoriesSection";
import ProductsSection from "@/app/(public)/(home)/components/ProductsSection";
import PortfolioSection from "@/app/(public)/(home)/components/PortfolioSection";
import InstagramSection from "@/app/(public)/(home)/components/InstagramSection";
import ConsultationSection from "@/app/(public)/(home)/components/ConsultationSection";
import {useContactStore} from "@/store/contactsStore";
import LoadingFullScreen from "@/components/ui/Loading/LoadingFullScreen";

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
        fetchLoadingPortfolio: portfolioLoading,
        setPortfolioLoading,
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
        setPortfolioLoading(false);
    }, [categoriesData, productsData, portfolioItems, categoriesError, productsError, portfolioError, setPortfolioPreview, setCategories, setProducts, setFetchCategoriesError, setFetchProductsError, setFetchCategoriesLoading, setFetchProductsLoading, contactData, setContact, setFetchContactError, contactError, setFetchContactLoading, setPortfolioLoading]);

    const overallLoading = fetchCategoriesLoading || fetchProductsLoading || portfolioLoading || fetchContactLoading || fetchContactLoading;
    const overallError = fetchCategoriesError || fetchProductsError || portfolioError || fetchContactError;

    if (overallLoading) return <LoadingFullScreen/>;
    if (overallError) return <ErrorMsg error={overallError}/>

    return (
        <>
            <div className="relative w-full h-[300px] md:h-[400px] bg-cover bg-center mb-8"
                 style={{ backgroundImage: "url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80')" }}>
                <div className="absolute inset-0 bg-black/70" />

                <div className="container mx-auto absolute inset-0  flex items-center justify-center text-white text-center px-4">
                    <div>
                        <h1 className="text-3xl md:text-5xl font-bold mb-2">Линия роста</h1>
                        <p className="text-lg md:text-xl max-w-3xl mx-auto">
                            Современные решения для вашего дома: натяжные потолки, SPC ламинат и отделочные работы под ключ.
                            Мы создаём уют и стиль с использованием качественных материалов и индивидуального подхода.
                            Доверьтесь профессионалам — и вы получите результат, который будет радовать долгие годы.
                        </p>
                    </div>
                </div>
            </div>
            <div className="container mx-auto px-4 py-8 space-y-16">
                <HeroSection/>

                <CategoriesSection/>

                <ProductsSection/>

                <PortfolioSection/>

                <ConsultationSection/>

                <InstagramSection/>
            </div>
        </>

    );
};

export default HomePageClient;