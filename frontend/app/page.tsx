'use client';

import React, {useEffect} from 'react';
import {useHomeStore} from '@/store/homeStore';
import {Button} from '@/components/ui/button';
import {API_BASE_URL} from '@/lib/globalConstants';
import {Swiper, SwiperSlide} from 'swiper/react';
import Link from 'next/link';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import {Navigation, Pagination} from 'swiper/modules';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faWhatsapp} from '@fortawesome/free-brands-svg-icons';
import {usePortfolioStore} from '@/store/portfolioItem';
import {CartPortfolio} from '@/app/portfolio/components/CartPortfolio';
import CategoryCard from "@/components/shared/CategoryCard";
import ProductCard from "@/components/shared/ProductCard";

const HomePage = () => {
    const {categories, products, fetchCategories, fetchProducts} = useHomeStore();
    const {items: portfolioItems, fetchPortfolio} = usePortfolioStore();

    useEffect(() => {
        fetchCategories();
        fetchProducts();
        fetchPortfolio();
    }, [fetchCategories, fetchProducts, fetchPortfolio]);

    return (
        <main className="space-y-16 py-8 px-4 sm:px-6 lg:px-8">
            <section aria-labelledby="hero-heading"
                     className="text-center space-y-6 max-w-4xl mx-auto">
                <h1 id="hero-heading"
                    className="text-4xl sm:text-5xl font-bold tracking-tight bg-gradient-to-r from-primary to-amber-600 bg-clip-text text-transparent">
                    Линия роста
                </h1>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    Натяжные потолки, SPC ламинат и монтажные услуги. Сделаем ваш дом стильным и функциональным.
                </p>
                <div className="flex gap-4 justify-center flex-wrap">
                    <Button size="lg" className="min-w-[180px]">Оставить заявку</Button>
                    <Button
                        variant="outline"
                        size="lg"
                        className="min-w-[180px] border-primary text-primary hover:bg-primary/10"
                        asChild
                    >
                        <a href="https://wa.me/996553088988" target="_blank" rel="noopener noreferrer">
                            <FontAwesomeIcon icon={faWhatsapp} className="mr-1"/>
                            Написать в WhatsApp
                        </a>
                    </Button>
                </div>
            </section>

            <section className="space-y-6" aria-labelledby="categories-heading">
                <h2 id="categories-heading" className="text-3xl font-bold text-center">Категории продукции</h2>
                {categories.length > 0 ? (
                    <Swiper
                        slidesPerView={2}
                        spaceBetween={10}
                        breakpoints={{
                            640: {slidesPerView: 3, spaceBetween: 15},
                            1024: {slidesPerView: 4, spaceBetween: 20},
                        }}
                        navigation
                        pagination={{clickable: true}}
                        modules={[Navigation, Pagination]}
                        className="mySwiper py-4"
                    >
                        {categories.map((cat) => (
                            <SwiperSlide key={cat._id}>
                                <CategoryCard category={cat}/>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                ) : <p>Нет категорий</p>}
            </section>

            <section className="space-y-6" aria-labelledby="products-heading">
                <div role="presentation" className="flex justify-between items-center">
                    <h2 id="products-heading" className="text-3xl font-bold">Наши товары</h2>
                    <Link href="/products" className="text-primary text-sm font-medium hover:underline">
                        Все товары →
                    </Link>
                </div>
                {products.length > 0 ? (
                    <Swiper
                        slidesPerView={1}
                        spaceBetween={10}
                        breakpoints={{
                            768: {slidesPerView: 2, spaceBetween: 20},
                            1024: {slidesPerView: 3, spaceBetween: 30},
                            1280: {slidesPerView: 4, spaceBetween: 30},
                        }}
                        navigation
                        pagination={{clickable: true}}
                        modules={[Navigation, Pagination]}
                        className="mySwiper py-4"
                    >
                        {products.map((product) => (
                            <SwiperSlide key={product._id}>
                                <ProductCard product={product}/>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                ) : (
                    <p>Нет продуктов</p>
                )}
            </section>

            <section className="space-y-6" aria-labelledby="portfolio-heading">
                <div role="presentation" className="flex justify-between items-center">
                    <h2 id="portfolio-heading" className="text-3xl font-bold">Наши работы</h2>
                    <Link href="/portfolio" className="text-primary text-sm font-medium hover:underline">
                        Все работы →
                    </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {portfolioItems && portfolioItems.length > 0 ? (
                        portfolioItems.map((item) => (
                            <CartPortfolio
                                key={item._id}
                                link={`/portfolio/${item._id}`}
                                imageSrc={`${API_BASE_URL}/${item.cover}`}
                            />
                        ))
                    ) : (
                        <p>Нет портфолио</p>
                    )}
                </div>
            </section>

            <section
                className="bg-gradient-to-r from-primary to-amber-600 rounded-2xl p-8 text-center text-white space-y-6">
                <h2 className="text-3xl font-bold">Хотите начать ремонт?</h2>
                <p className="max-w-2xl mx-auto text-primary-foreground/90">
                    Свяжитесь с нами — мы проконсультируем и подберём решения под ваш бюджет.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button variant="secondary" size="lg">Получить консультацию</Button>
                    <Button
                        variant="outline"
                        size="lg"
                        className="bg-transparent border-white text-white hover:bg-white/10"
                        asChild
                    >
                        <a href="tel:+996555757513">+996 555 757 513</a>
                    </Button>
                </div>
            </section>
        </main>
    );
};

export default HomePage;
