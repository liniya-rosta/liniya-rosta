'use client';

import React, {useEffect, useState} from 'react';
import {useProductStore} from '@/store/productsStore';
import {usePortfolioStore} from "@/store/portfolioItemStore";
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
import { CartPortfolio } from '@/app/portfolio/components/CartPortfolio';
import CategoryCard from "@/app/home/components/CategoryCard";
import ProductCard from "@/app/home/components/ProductCard";
import {Category, PortfolioItemPreview, Product} from '@/lib/types';
import {useCategoryStore} from "@/store/categoriesStore";
import Loading from "@/components/shared/Loading";

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
                                                           categoriesError: initialCategoriesError,
                                                           productsError: initialProductsError,
                                                           portfolioError: initialPortfolioError
                                                       }) => {
    const {
        categories: storedCategories,
        setCategories,
        fetchError: storedCategoriesError,
        fetchLoading: categoriesLoading,
        setFetchError: setCategoriesError,
        setFetchLoading: setCategoriesLoading,
    } = useCategoryStore();

    const {
        products: storedProducts,
        setProducts,
        fetchError: storedProductsError,
        fetchLoading: productsLoading,
        setFetchError: setProductsError,
        setFetchLoading: setProductsLoading,
    } = useProductStore();

    const {
        items: storedPortfolioItems,
        setPortfolioPreview,
        fetchLoading: portfolioLoading,
    } = usePortfolioStore();

    const [isHydrating, setIsHydrating] = useState(true);

    useEffect(() => {
        setCategories(categories);
        setProducts(products);
        setPortfolioPreview(portfolioItems);

        setCategoriesError(initialCategoriesError);
        setProductsError(initialProductsError);

        setCategoriesLoading(false);
        setProductsLoading(false);

        setIsHydrating(false);
    }, [
        categories, products, portfolioItems, initialCategoriesError,
        initialProductsError, initialPortfolioError,
        setCategories, setProducts, setPortfolioPreview,
        setCategoriesError, setProductsError,
        setCategoriesLoading, setProductsLoading,
    ]);

    const overallLoading = isHydrating || categoriesLoading || productsLoading || portfolioLoading;
    const overallError = storedCategoriesError || storedProductsError;

    if (overallLoading) return <Loading/>;

    if (overallError && (!storedCategories.length && !storedProducts.length && !storedPortfolioItems.length)) {
        return (
            <div className="flex justify-center items-center h-screen text-red-500 text-xl text-center">
                Произошла ошибка при загрузке данных: {overallError}
                <br/>
                Пожалуйста, попробуйте обновить страницу или зайти позже
            </div>
        );
    }

    return (
        <main className="space-y-16 py-8 px-4 sm:px-6 lg:px-8">
            <section aria-labelledby="hero-heading" className="text-center space-y-6 max-w-4xl mx-auto">
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
                {storedCategoriesError && (
                    <div className="text-center text-red-500">Ошибка загрузки категорий: {storedCategoriesError}</div>
                )}
                {storedCategories.length > 0 ? (
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
                        {storedCategories.map((cat) => (
                            <SwiperSlide key={cat._id}>
                                <CategoryCard category={cat}/>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                ) : (
                    !storedCategoriesError && <p className="text-center">Нет категорий</p>
                )}
            </section>

            <section className="space-y-6" aria-labelledby="products-heading">
                <div role="presentation" className="flex justify-between items-center">
                    <h2 id="products-heading" className="text-3xl font-bold">Наши товары</h2>
                    <Link href="/products" className="text-primary text-sm font-medium hover:underline">
                        Все товары →
                    </Link>
                </div>
                {storedProductsError && (
                    <div className="text-center text-red-500">Ошибка загрузки товаров: {storedProductsError}</div>
                )}
                {storedProducts.length > 0 ? (
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
                        {storedProducts.map((product) => (
                            <SwiperSlide key={product._id}>
                                <div className="max-w-xs mx-auto md:max-w-none">
                                    <ProductCard product={product}/>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                ) : (
                    !storedProductsError && <p className="text-center">Нет продуктов</p>
                )}
            </section>

            <section className="space-y-6" aria-labelledby="portfolio-heading">
                <div role="presentation" className="flex justify-between items-center">
                    <h2 id="portfolio-heading" className="text-3xl font-bold">Наши работы</h2>
                    <Link href="/portfolio" className="text-primary text-sm font-medium hover:underline">
                        Все работы →
                    </Link>
                </div>
                {storedPortfolioItems && storedPortfolioItems.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {storedPortfolioItems.map((item) => (
                            <Link key={item._id} href={`/portfolio/${item._id}`}>
                                <CartPortfolio
                                    textBtn={"Смотреть все"}
                                    key={item._id}
                                    imageSrc={`${API_BASE_URL}/${item.cover}`}
                                />
                            </Link>
                        ))}
                    </div>
                ) : (
                    <p className="text-center">Нет портфолио</p>
                )}
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

            <section className=" space-y-6 mx-auto bg-white">
                <h2 className="text-3xl font-bold text-center from-primary">
                    Наша лента в Instagram
                </h2>
                <iframe
                    src="//lightwidget.com/widgets/a5595befc0b75c39ae732dfc56693cbd.html"
                    className="lightwidget-widget w-full h-[500px] border-none rounded-xl shadow-md transition-opacity duration-700 ease-in-out"
                    style={{overflow: 'hidden'}}
                ></iframe>
            </section>
        </main>
    );
};

export default HomePageClient;