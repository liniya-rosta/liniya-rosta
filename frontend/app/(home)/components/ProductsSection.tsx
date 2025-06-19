import React from 'react';
import Link from "next/link";
import ErrorMsg from "@/components/shared/ErrorMsg";
import {Swiper, SwiperSlide} from "swiper/react";
import {Navigation, Pagination} from "swiper/modules";
import ProductCard from "@/app/(home)/components/ProductCard";
import {useProductStore} from "@/store/productsStore";

const ProductsSection = () => {
    const {products, fetchProductsError} = useProductStore();

    return (
        <section className="space-y-6" aria-labelledby="products-heading">
            <div role="presentation" className="flex justify-between items-center">
                <h2 id="products-heading" className="text-3xl font-bold">Наши товары</h2>
                <Link href="/products" className="text-primary text-sm font-medium hover:underline">
                    Все товары →
                </Link>
            </div>
            {fetchProductsError && (
                <ErrorMsg error={fetchProductsError} label='продуктов'/>
            )}
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
                    autoplay={{
                        delay: 3000,
                        disableOnInteraction: false,
                    }}
                    modules={[Navigation, Pagination]}
                    className="mySwiper py-4"
                >
                    {products.map((product) => (
                        <SwiperSlide key={product._id} className="h-full flex">
                            <div className="h-full pb-10">
                                <ProductCard product={product}/>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            ) : (
                !fetchProductsError && <p className="text-center">Нет продуктов</p>
            )}
        </section>
    );
};

export default ProductsSection;