'use client';

import React, {useEffect} from 'react';
import {Navigation, Pagination} from "swiper/modules";
import {Swiper, SwiperSlide} from "swiper/react";
import LaminateCard from "@/app/(public)/spc/components/LaminateCard";
import Loading from "@/components/ui/Loading/Loading";
import {Product} from "@/lib/types";
import {useProductStore} from "@/store/productsStore";

interface Props {
    initialData: Product[] | null;
    error: string | null;
    categoryName: string;
}

const SpcLaminatePage: React.FC<Props> = ({initialData, error, categoryName}) => {
    const {
        products,
        setProducts,
        fetchProductsLoading,
        setFetchProductsLoading,
        fetchProductsError,
        setFetchProductsError,
    } = useProductStore();

    useEffect(() => {
        if (initialData) setProducts(initialData);
        setFetchProductsLoading(false);
        setFetchProductsError(error);
    }, [initialData, error, setProducts, setFetchProductsLoading, setFetchProductsError]);

    return (
        <div className="mb-[55px]">
            <h3 className="sm:text-2xl text-xl mb-8 text-center">Каталог {categoryName ? `${categoryName}` : ''}</h3>
            <Swiper
                slidesPerView={1}
                navigation
                pagination={{clickable: true}}
                modules={[Navigation, Pagination]}
                className="mySwiper py-4"
            >
                {fetchProductsLoading ? (
                    <SwiperSlide>
                        <Loading/>
                    </SwiperSlide>
                ) : fetchProductsError ? (
                    <SwiperSlide>
                        <h4>Ошибка загрузки: {fetchProductsError}</h4>
                    </SwiperSlide>
                ) : (
                    products.map(item => (
                        <SwiperSlide key={item._id}>
                            <LaminateCard title={item.title} image={item.cover.url} description={item.description}/>
                        </SwiperSlide>
                    ))
                )}

            </Swiper>
        </div>
    );
};

export default SpcLaminatePage;