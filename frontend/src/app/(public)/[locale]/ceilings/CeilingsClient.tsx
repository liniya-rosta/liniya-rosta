"use client"

import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {Filter, MessageCircle, Phone, Search, X} from 'lucide-react';
import RequestForm from "@/src/components/shared/RequestForm";
import {Dialog, DialogHeader} from '@/src/components/ui/dialog';
import {Category, Product} from "@/src/lib/types";
import {useCategoryStore} from "@/store/categoriesStore";
import {useProductStore} from "@/store/productsStore";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from '@/src/components/ui/card';
import {Button} from '@/src/components/ui/button';
import {Input} from '@/src/components/ui/input';
import {Badge} from '@/src/components/ui/badge';
import {Skeleton} from '@/src/components/ui/skeleton';
import {useLocale, useTranslations} from "next-intl";
import {CustomContainer} from '@/src/components/shared/CustomContainer';
import {DialogTitle} from "@radix-ui/react-dialog";
import AnimatedEntrance from "@/src/components/shared/AnimatedEntrance";
import CeilingsCard from "@/src/app/(public)/[locale]/ceilings/components/CeilingsCard";

type Props = {
    initialProducts: Product[];
    initialCategories: Category[];
};

const CeilingsClient: React.FC<Props> = ({initialProducts, initialCategories}) => {
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [showConsultationModal, setShowConsultationModal] = useState<boolean>(false);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const tCeilings = useTranslations("CeilingsPage");
    const tBtn = useTranslations("Buttons");
    const locale = useLocale() as "ky" | "ru";

    const {
        products,
        fetchProductsLoading,
        setProducts,
        setFetchProductsLoading
    } = useProductStore();

    const {
        categories,
        setCategories
    } = useCategoryStore();

    useEffect(() => {
        setProducts(initialProducts);
        setCategories(initialCategories);
        setFetchProductsLoading(false);
    }, [initialProducts, initialCategories, setProducts, setCategories, setFetchProductsLoading]);

    useEffect(() => {
        const fetchFilteredProducts = async () => {
            if (selectedCategory === 'all') {
                setProducts(initialProducts);
                return;
            }

            try {
                const filteredProducts = initialProducts.filter(product =>
                    product.category?._id === selectedCategory
                );
                setProducts(filteredProducts);
            } catch (error) {
                console.error('Error filtering products:', error);
            }
        };

        void fetchFilteredProducts();
    }, [selectedCategory, initialProducts, setProducts]);

    const filteredProducts = useMemo(() => {
        return products.filter(product =>
            product.title[locale]?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (product.description && product.description[locale].toLowerCase().includes(searchTerm.toLowerCase()))
        );
    }, [searchTerm, products]);

    const categoryCounts = useMemo<Record<string, number>>(() => {
        const counts: Record<string, number> = {};
        initialProducts.forEach(p => {
            const id = p.category?._id;
            if (id) counts[id] = (counts[id] || 0) + 1;
        });
        return counts;
    }, [initialProducts]);

    const openConsultationModal = useCallback(() => {
        setShowConsultationModal(true);
    }, []);

    const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    }, []);

    const handleCategoryChange = useCallback((categoryId: string) => {
        setSelectedCategory(categoryId);
    }, []);

    const resetFilters = useCallback(() => {
        setSelectedCategory('all');
        setSearchTerm('');
    }, []);



    const renderSkeleton = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {Array.from({length: 6}).map((_, i) => (
                <Card key={i} className="overflow-hidden">
                    <Skeleton className="h-48 w-full"/>
                    <CardHeader>
                        <Skeleton className="h-6 w-3/4"/>
                        <Skeleton className="h-4 w-full"/>
                        <Skeleton className="h-4 w-1/2"/>
                    </CardHeader>
                    <CardFooter>
                        <Skeleton className="h-10 w-full"/>
                    </CardFooter>
                </Card>
            ))}
        </div>
    );

    const renderEmptyState = () => (
        <Card className="text-center p-12">
            <CardContent className="space-y-4">
                <Search className="h-12 w-12 mx-auto text-muted-foreground"/>
                <CardTitle>Товары не найдены</CardTitle>
                <CardDescription>
                    Попробуйте изменить критерии поиска или фильтры
                </CardDescription>
                {(searchTerm || selectedCategory !== 'all') && (
                    <Button onClick={resetFilters} variant="outline">
                        Сбросить все фильтры
                    </Button>
                )}
            </CardContent>
        </Card>
    );

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
                <Badge variant="secondary">{categoryCounts[category._id] || 0}</Badge>
            </div>
        </div>
    );

    return (
        <CustomContainer className="md:my-7">
            <div className="border-b bg-card">
                <div className="pb-6 flex flex-col md:flex-row md:justify-between gap-4">
                    <AnimatedEntrance className="text-center md:text-left">
                        <h1 className="text-23-30-1_5 font-bold">{tCeilings("title")}</h1>
                        <p className="text-muted-foreground mt-1">{tCeilings("subTitle")}</p>
                    </AnimatedEntrance>

                    <AnimatedEntrance direction="right" className="flex gap-3 justify-center">
                        <Button onClick={openConsultationModal} className="btn-hover-scale">
                            <Phone className="h-4 w-4"/>
                            {tBtn("requestBtn1")}
                        </Button>
                        <Button asChild variant="secondary" className="btn-hover-scale">
                            <a href="https://wa.me/996552088988" target="_blank" rel="noopener noreferrer">
                                <MessageCircle className="h-4 w-4"/>
                                WhatsApp
                            </a>
                        </Button>
                    </AnimatedEntrance>
                </div>
            </div>

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
                                        <Badge variant="secondary">{initialProducts.length}</Badge>
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
                            className="font-semibold text-foreground">{filteredProducts.length}</span>
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
                        renderSkeleton()
                    ) : filteredProducts.length > 0 ? (
                        <AnimatedEntrance direction="bottom"
                                          className="grid grid-cols-[repeat(auto-fit,minmax(400px,1fr))] gap-6 justify-center">
                            {filteredProducts.map(product => (
                                <CeilingsCard key={product._id} product={product} />
                            ))}
                        </AnimatedEntrance>
                    ) : (
                        renderEmptyState()
                    )}
                </div>
            </div>

            {showConsultationModal && (
                <Dialog open={showConsultationModal} onOpenChange={setShowConsultationModal}>
                    <DialogHeader>
                        <DialogTitle className="text-center">Форма заявки</DialogTitle>
                    </DialogHeader>
                    <RequestForm closeModal={() => setShowConsultationModal(false)}/>
                </Dialog>
            )}
        </CustomContainer>
    );
};

export default CeilingsClient;