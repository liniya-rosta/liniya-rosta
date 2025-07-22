import React from 'react';
import Link from "next/link";
import ErrorMsg from "@/components/ui/ErrorMsg";
import ProductCard from "@/app/(public)/(home)/components/ProductCard";
import {useProductStore} from "@/store/productsStore";
import {BtnArrow} from "@/components/ui/btn-arrow";
import {Pagination, Navigation, Autoplay} from 'swiper/modules';
import {Swiper, SwiperSlide} from 'swiper/react';

const ProductsSection = () => {
    const {products, fetchProductsError} = useProductStore();

    return (
        <section aria-labelledby="products-heading" className="px-4 py-12">
            <div className="flex flex-col-reverse lg:flex-row items-center lg:items-start gap-8">
                <div className="w-full lg:w-1/2 flex flex-col items-center gap-4">
                    {fetchProductsError && (
                        <ErrorMsg error={fetchProductsError} label="продуктов"/>
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
                                !fetchProductsError && <p className="text-center">Нет продуктов</p>
                            )}
                        </Swiper>
                    </div>
                </div>

                <div className="w-full lg:w-1/2 space-y-4 my-auto">
                    <h2 id="products-heading" className="text-20-30-1_2 main-section-title">Продукция</h2>

                    <div className="text-gray-600 leading-relaxed space-y-2">
                        <p className="hidden md:block">
                            Мы предлагаем широкий ассортимент продукции, сочетающей качество, надёжность и актуальный
                            дизайн. Каждый товар подбирается с особым вниманием, чтобы соответствовать требованиям
                            клиентов и трендам рынка.
                        </p>

                        <p className="block md:hidden">
                            Надёжная и стильная продукция для вашего пространства.
                        </p>
                    </div>

                    <BtnArrow isLeft className="btn-hover-scale">
                        <Link href="/ceilings" className="text-sm font-medium">
                            Все товары
                        </Link>
                    </BtnArrow>
                </div>
            </div>
        </section>
    );
};

export default ProductsSection;