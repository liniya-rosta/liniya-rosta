"use client"

import React, {useEffect, useMemo, useState} from 'react';
import {Filter, MessageCircle, Phone, Search, X} from 'lucide-react';
import RequestForm from "@/components/shared/RequestForm";
import { ModalWindow } from '@/components/ui/modal-window';
import { Category, Product } from "@/lib/types";
import { useCategoryStore } from "@/store/categoriesStore";
import { useProductStore } from "@/store/productsStore";
import { API_BASE_URL } from "@/lib/globalConstants";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

type Props = {
    initialProducts: Product[];
    initialCategories: Category[];
};

const CeilingsClient: React.FC<Props> = ({initialProducts, initialCategories}) => {
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [showConsultationModal, setShowConsultationModal] = useState<boolean>(false);
    const [activeProductId, setActiveProductId] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>('');

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
            product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()))
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

    const openConsultationModal = () => {
        setShowConsultationModal(true);
    };

    const closeModal = () => {
        setShowConsultationModal(false);

    };

    return (
        <div className="min-h-screen bg-background">
            <div className="border-b bg-card">
                <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col md:flex-row justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">Натяжные потолки</h1>
                        <p className="text-muted-foreground mt-1">Все необходимое для создания идеального потолка</p>
                    </div>
                    <div className="flex gap-3">
                        <Button onClick={openConsultationModal} className="gap-2">
                            <Phone className="h-4 w-4" />
                            Консультация
                        </Button>
                        <Button asChild variant="secondary" className="gap-2">
                            <a href="https://wa.me/996552088988" target="_blank" rel="noopener noreferrer">
                                <MessageCircle className="h-4 w-4" />
                                WhatsApp
                            </a>
                        </Button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8">
                <div className="lg:w-80">
                    <Card className="sticky top-4">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Filter className="h-5 w-5" />
                                Категории
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                                <Input
                                    type="text"
                                    placeholder="Поиск товаров..."
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>

                            <div className="space-y-2">
                                <div
                                    onClick={() => setSelectedCategory('all')}
                                    className={`cursor-pointer p-3 rounded-lg transition-colors ${
                                        selectedCategory === 'all'
                                            ? 'bg-primary text-primary-foreground'
                                            : 'hover:bg-muted'
                                    }`}
                                >
                                    <div className="flex justify-between items-center">
                                        <span>Все товары</span>
                                        <Badge variant="secondary">{initialProducts.length}</Badge>
                                    </div>
                                </div>
                                {categories.map(cat => (
                                    <div
                                        key={cat._id}
                                        onClick={() => setSelectedCategory(cat._id)}
                                        className={`cursor-pointer p-3 rounded-lg transition-colors ${
                                            selectedCategory === cat._id
                                                ? 'bg-primary text-primary-foreground'
                                                : 'hover:bg-muted'
                                        }`}
                                    >
                                        <div className="flex justify-between items-center">
                                            <span>{cat.title}</span>
                                            <Badge variant="secondary">{categoryCounts[cat._id] || 0}</Badge>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="flex-1">
                    <div className="flex justify-between items-center mb-6">
                        <p className="text-muted-foreground">
                            Найдено товаров: <span className="font-semibold text-foreground">{filteredProducts.length}</span>
                        </p>
                        {selectedCategory !== 'all' && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setSelectedCategory('all')}
                                className="gap-1"
                            >
                                <X className="h-4 w-4" />
                                Сбросить фильтр
                            </Button>
                        )}
                    </div>

                    {fetchProductsLoading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <Card key={i} className="overflow-hidden">
                                    <Skeleton className="h-48 w-full" />
                                    <CardHeader>
                                        <Skeleton className="h-6 w-3/4" />
                                        <Skeleton className="h-4 w-full" />
                                        <Skeleton className="h-4 w-1/2" />
                                    </CardHeader>
                                    <CardFooter>
                                        <Skeleton className="h-10 w-full" />
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    ) : filteredProducts.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {filteredProducts.map(product => (
                                <Card key={product._id} className="overflow-hidden hover:shadow-lg transition-shadow">
                                    <div className="relative w-full h-48">
                                        <Image
                                            src={`${API_BASE_URL}/${product.image}`}
                                            fill
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop';
                                            }}
                                            alt={product.title || 'Product image'}
                                            className="object-cover"
                                        />
                                    </div>
                                    <CardHeader>
                                        <CardTitle className="text-lg">{product.title}</CardTitle>
                                        <CardDescription className="line-clamp-2">
                                            {product.description}
                                        </CardDescription>
                                        <Badge variant="outline" className="w-fit">
                                            {product.category?.title || 'Без категории'}
                                        </Badge>
                                    </CardHeader>
                                    <CardFooter>
                                        <Button
                                            onClick={openConsultationModal}
                                            className="w-full"
                                        >
                                            Консультация по товару
                                        </Button>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <Card className="text-center p-12">
                            <CardContent className="space-y-4">
                                <Search className="h-12 w-12 mx-auto text-muted-foreground" />
                                <CardTitle>Товары не найдены</CardTitle>
                                <CardDescription>
                                    Попробуйте изменить критерии поиска или фильтры
                                </CardDescription>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>

            <Dialog open={!!activeProductId} onOpenChange={(open) => {
                if (!open) setActiveProductId(null);
            }}>
                <RequestForm closeModal={() => setActiveProductId(null)}/>
            </Dialog>
        </div>
    );
};

export default CeilingsClient;