import React from 'react';
import Link from "next/link";
import {Swiper, SwiperSlide} from "swiper/react";
import {Navigation, Pagination, Autoplay} from "swiper/modules";
import ProductCard from "@/src/app/(public)/[locale]/(home)/components/ProductCard";
import {useProductStore} from "@/store/productsStore";
import {useTranslations} from "next-intl";
import {BtnArrow} from "@/src/components/ui/btn-arrow";
import SectionAnimation from "@/src/components/shared/SectionAnimation";

const ProductsSection = () => {
    const {products, fetchProductsError} = useProductStore();

    const tHome = useTranslations("HomePage");
    const tError = useTranslations("Errors");
    const tBtn = useTranslations("Buttons");

    return (
        <SectionAnimation ariaLabelledby="products-heading" className="py-12">
            <div className="flex flex-col-reverse lg:flex-row items-center lg:items-start gap-8">
                <div className="w-full lg:w-1/2 flex flex-col items-center gap-4">
                    {fetchProductsError && (
                        tError("productsError")
                    )}

                    <div className="flex items-center gap-2 w-full">
                        <Swiper
                            loop={true}
                            autoplay={{delay: 4000, disableOnInteraction: false}}
                            breakpoints={{
                                0: {slidesPerView: 1, spaceBetween: 10},
                                550: {slidesPerView: 2, spaceBetween: 10},
                                768: {slidesPerView: 3, spaceBetween: 15},
                                1024: {slidesPerView: 2, spaceBetween: 20},
                            }}
                            modules={[Navigation, Autoplay, Pagination]}
                            pagination={{clickable: true}}
                            className="w-full py-4"
                            navigation
                        >
                            {products?.length ? (
                                products.map((product) => (
                                    <SwiperSlide
                                        key={product._id}
                                        className="flex items-center justify-center h-full"
                                    >
                                        <ProductCard product={product}/>
                                    </SwiperSlide>
                                ))
                            ) : (
                                !fetchProductsError && <p className="text-center">{tHome("noProducts")}</p>
                            )}
                        </Swiper>
                    </div>
                </div>

                <div className="w-full lg:w-1/2 space-y-4 my-auto">
                    <h2 id="products-heading" className="text-23-30-1_5 main-section-title">{tHome("productsTitle")}</h2>

                    <div className="text-gray-600 leading-relaxed space-y-2">
                        <p className="hidden md:block">
                            {tHome("productsFullDescription")}
                        </p>

                        <p className="block md:hidden">
                            {tHome("productsShortDescription")}
                        </p>
                    </div>

                    <BtnArrow className="btn-hover-scale">
                        <Link href="/ceilings" className="text-sm font-medium">
                            {tBtn("allProductBtn")}
                        </Link>
                    </BtnArrow>
                </div>
            </div>
        </SectionAnimation>
    );
};

export default ProductsSection;