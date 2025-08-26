"use client"

import React, {useCallback, useEffect} from 'react';
import {Category, ProductResponse} from "@/src/lib/types";
import {useCategoryStore} from "@/store/categoriesStore";
import {useProductStore} from "@/store/productsStore";
import {Skeleton} from '@/src/components/ui/skeleton';
import {useTranslations} from "next-intl";
import {CustomContainer} from '@/src/components/shared/CustomContainer';
import AnimatedEntrance from "@/src/components/shared/AnimatedEntrance";
import CeilingsCard from "@/src/app/(public)/[locale]/ceilings/components/CeilingsCard";
import {useProductFetcher} from "@/src/app/(public)/[locale]/ceilings/hooks/useProductFetcher";
import BasicInfoProductPage from "@/src/app/(public)/[locale]/ceilings/components/BasicInfoProductPage";
import PaginationButtons from "@/src/components/shared/PaginationsButtons";
import {useDebouncedCallback} from 'use-debounce';
import LoadingFullScreen from "@/src/components/ui/Loading/LoadingFullScreen";
import FilterPanel from "@/src/app/(public)/[locale]/ceilings/components/FilterPanel";
import ResetFilter from "@/src/app/(public)/[locale]/ceilings/components/ResetFilter";

type Props = {
    data: ProductResponse | null;
    error: string | null;
    limit: string;
    initialCategories: Category[] | null;
    categorySpc: string;
};

const CeilingsClient: React.FC<Props> = ({data, error, limit, initialCategories, categorySpc}) => {
    const tError = useTranslations("Errors");
    const tCeilings = useTranslations("CeilingsPage");

    const {
        products,
        fetchProductsLoading,
        paginationProducts,
        setFetchProductsError
    } = useProductStore();

    const {
        categories,
        setCategories
    } = useCategoryStore();

    const {
        updatedData,
        page,
        paginationButtons,
        handlePageChange,
        setCategoryId, categoryId,
        searchTitle, setSearchTitle,
        handleSearch
    } = useProductFetcher(limit, categorySpc)

    useEffect(() => {
        if (initialCategories) {
            setCategories(initialCategories);
        }
        if (data) {
            void updatedData(data);
        }
        setFetchProductsError(error);
    }, [data, error]);

    const handleSearchDebounced = useDebouncedCallback((value: string) => {
        void handleSearch(value, categoryId);
    }, 800);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchTitle(value);
        handleSearchDebounced(value);
    };

    const handleCategoryChange = useCallback((categoryId: string) => {
        setCategoryId(categoryId);
        void updatedData(null, 1, categoryId);
    }, []);

    const handleResetFilters = async () => {
        setCategoryId("all");
        setSearchTitle('');
        await updatedData(null, 1, "all", "");
    };

    const clearSearch = async () => {
        setSearchTitle('');
        await handleSearch('', categoryId);
    };

    if (fetchProductsLoading) return <LoadingFullScreen/>
    if (error) return <p>{tError("productsError")}</p>;

    return (
        <CustomContainer className="md:my-7">
            <BasicInfoProductPage/>
            <div className="py-8 flex flex-col content-center md:flex-row gap-8">
                <FilterPanel handleSearchChange={handleSearchChange}
                             searchTitle={searchTitle}
                             clearSearch={clearSearch}
                             handleCategoryChange={handleCategoryChange}
                             categoryId={categoryId}
                             categories={categories}/>
                <div className="flex-1">
                    <ResetFilter data={data}
                                 categoryId={categoryId}
                    handleResetFilters={handleResetFilters}/>

                    {fetchProductsLoading ? (
                        <Skeleton/>
                    ) : products.length > 0 ? (
                        <>
                            <AnimatedEntrance direction="bottom"
                                              className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-6 justify-center">
                                {products.map(product => (
                                    <CeilingsCard key={product._id} product={product}/>
                                ))}
                            </AnimatedEntrance>
                            {paginationProducts && paginationProducts.totalPages > 1 && (
                                <PaginationButtons
                                    page={page}
                                    totalPages={paginationProducts.totalPages}
                                    paginationButtons={paginationButtons ?? []}
                                    onPageChange={handlePageChange}
                                />
                            )}
                        </>
                    ) : (
                        <p>{tCeilings("noProducts")}</p>
                    )}
                </div>
            </div>
        </CustomContainer>
    );
};

export default CeilingsClient;