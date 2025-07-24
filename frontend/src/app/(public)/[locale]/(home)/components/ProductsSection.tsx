import React from 'react';
import Link from "next/link";
import {Swiper, SwiperSlide} from "swiper/react";
import {Navigation, Pagination} from "swiper/modules";
import ProductCard from "@/src/app/(public)/[locale]/(home)/components/ProductCard";
import {useProductStore} from "@/store/productsStore";
import {useTranslations} from "next-intl";

const ProductsSection = () => {
    const {products, fetchProductsError} = useProductStore();

    const tHome = useTranslations("HomePage");
    const tError = useTranslations("Errors");
    const tBtn = useTranslations("Buttons");

    return (
        <section className="space-y-6" aria-labelledby="products-heading">
            <div role="presentation" className="flex justify-between items-center">
                <h2 id="products-heading" className="text-3xl font-bold">{tHome("productsTitle")}</h2>
                <Link href="/products" className="text-primary text-sm font-medium hover:underline">
                    {tBtn("allProductBtn")} →
                </Link>
            </div>
            {fetchProductsError && (
                tError("productsError")
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
                !fetchProductsError && <p className="text-center">{tHome("noProducts")}</p>
            )}
        </section>
    );
};

export default ProductsSection;