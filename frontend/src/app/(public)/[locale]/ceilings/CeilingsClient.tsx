"use client"

import React, {useCallback, useEffect, useState} from 'react';
import {Filter, Search, X} from 'lucide-react';
import {Category, ProductResponse} from "@/src/lib/types";
import {useCategoryStore} from "@/store/categoriesStore";
import {useProductStore} from "@/store/productsStore";
import {Card, CardContent, CardHeader, CardTitle} from '@/src/components/ui/card';
import {Button} from '@/src/components/ui/button';
import {Input} from '@/src/components/ui/input';
import {Skeleton} from '@/src/components/ui/skeleton';
import {useLocale, useTranslations} from "next-intl";
import {CustomContainer} from '@/src/components/shared/CustomContainer';
import AnimatedEntrance from "@/src/components/shared/AnimatedEntrance";
import CeilingsCard from "@/src/app/(public)/[locale]/ceilings/components/CeilingsCard";
import {useProductFetcher} from "@/src/app/(public)/[locale]/ceilings/hooks/useProductFetcher";
import BasicInfoProductPage from "@/src/app/(public)/[locale]/ceilings/components/BasicInfoProductPage";

type Props = {
    data: ProductResponse | null;
    error: string | null;
    limit: string;
    initialCategories: Category[] | null;
    categorySpc: string;
};

const CeilingsClient: React.FC<Props> = ({data, error, limit, initialCategories, categorySpc}) => {
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [searchTerm, setSearchTerm] = useState<string>('');
    const tCeilings = useTranslations("CeilingsPage");
    const locale = useLocale() as "ky" | "ru";

    const {
        products,
        fetchProductsLoading,
        setProducts,
        setFetchProductsLoading,
        setFetchProductsError
    } = useProductStore();

    const {
        categories,
        setCategories
    } = useCategoryStore();

    const {updatedData} = useProductFetcher(limit, categorySpc)

    useEffect(() => {
        if (initialCategories) {
            setCategories(initialCategories);
        }
        if (data) {
            void updatedData(data);
        }
        setFetchProductsError(error);
    }, [data, error]);

    const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    }, []);

    const handleCategoryChange = useCallback((categoryId: string) => {
        setSelectedCategory(categoryId);
        if(categoryId === "all") {
            void updatedData(data);
        }
        void updatedData(null, 1, categoryId);
    }, []);

    const resetFilters = useCallback(() => {
        setSelectedCategory('all');
        setSearchTerm('');
    }, []);


    const renderCategoryFilter = (category: Category) => (
        <div
            key={category._id}
            onClick={() => handleCategoryChange(category._id)}
            className={`cursor-pointer p-3 rounded-lg transition-colors ${
                selectedCategory === category._id
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-muted'
            }`}
        >
            <div className="flex justify-between items-center gap-3">
                <span>{category.title[locale]}</span>
            </div>
        </div>
    );

    return (
        <CustomContainer className="md:my-7">
            <BasicInfoProductPage/>
            <div className="py-8 flex flex-col content-center md:flex-row gap-8">
                <AnimatedEntrance
                    direction="bottom"
                    duration={0.8}
                    className="lg:max-w-[300px]"
                >
                    <Card className="sticky top-4">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Filter className="h-5 w-5"/>
                                {tCeilings("filter.categoriesTitle")}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="relative">
                                <Search
                                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4"/>
                                <Input
                                    type="text"
                                    placeholder={tCeilings("filter.filterSearch")}
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                    className="pl-10"
                                />
                                {searchTerm && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setSearchTerm('')}
                                        className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                                    >
                                        <X className="h-3 w-3"/>
                                    </Button>
                                )}
                            </div>

                            <AnimatedEntrance direction="bottom" className="space-y-2">
                                <div
                                    onClick={() => handleCategoryChange('all')}
                                    className={`cursor-pointer p-3 rounded-lg transition-colors ${
                                        selectedCategory === 'all'
                                            ? 'bg-primary text-primary-foreground'
                                            : 'hover:bg-muted'
                                    }`}
                                >
                                    <div className="flex justify-between items-center">
                                        <span>{tCeilings("filter.allProducts")}</span>
                                    </div>
                                </div>
                                {categories
                                    .filter(category => category.title[locale].toLowerCase() !== "spc")
                                    .map(renderCategoryFilter)}
                            </AnimatedEntrance>
                        </CardContent>
                    </Card>
                </AnimatedEntrance>

                <div className="flex-1">
                    <div className="flex justify-between items-center mb-6">
                        <p className="text-muted-foreground">
                            {tCeilings("filter.countProductsTitle")} <span
                            className="font-semibold text-foreground">{data?.total}</span>
                        </p>
                        {selectedCategory !== 'all' && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setSelectedCategory('all')}
                                className="gap-1"
                            >
                                <X className="h-4 w-4"/>
                                {tCeilings("filter.removeFilter")}
                            </Button>
                        )}
                    </div>

                    {fetchProductsLoading ? (
                        <Skeleton/>
                    ) : products.length > 0 ? (
                        <AnimatedEntrance direction="bottom"
                                          className="grid grid-cols-[repeat(auto-fit,minmax(400px,1fr))] gap-6 justify-center">
                            {products.map(product => (
                                <CeilingsCard key={product._id} product={product}/>
                            ))}
                        </AnimatedEntrance>
                    ) : (
                        <p>Пока нет товаров</p>
                    )}
                </div>
            </div>

        </CustomContainer>
    );
};

export default CeilingsClient;