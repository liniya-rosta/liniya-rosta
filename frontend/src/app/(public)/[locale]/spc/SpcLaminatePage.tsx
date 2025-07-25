'use client';

import React, {useEffect} from 'react';
import {Navigation, Pagination} from "swiper/modules";
import {Swiper, SwiperSlide} from "swiper/react";
import LaminateCard from "@/src/app/(public)/[locale]/spc/components/LaminateCard";
import Loading from "@/src/components/ui/Loading/Loading";
import {Product} from "@/src/lib/types";
import {useProductStore} from "@/store/productsStore";
import {useLocale, useTranslations} from "next-intl";

interface Props {
    initialData: Product[] | null;
    error: string | null;
}

const SpcLaminatePage: React.FC<Props> = ({initialData, error}) => {
    const {
        products,
        setProducts,
        fetchProductsLoading,
        setFetchProductsLoading,
        fetchProductsError,
        setFetchProductsError,
    } = useProductStore();

    const tSpc = useTranslations("SpcPage");
    const tError = useTranslations("Errors");
    const locale = useLocale() as "ru" | "ky";

    useEffect(() => {
        if (initialData) setProducts(initialData);
        setFetchProductsLoading(false);
        setFetchProductsError(error);
    }, [initialData, error, setProducts, setFetchProductsLoading, setFetchProductsError]);

    return (
        <div className="mb-[55px]">
            <h3 className="sm:text-2xl text-xl mb-8 text-center">{tSpc("catalogTitle")}</h3>
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
                        <h4>{tError("spcError")}</h4>
                    </SwiperSlide>
                ) : (
                    products.map(item => (
                        <SwiperSlide key={item._id}>
                            <LaminateCard title={item.title[locale]} image={item.cover.url} description={item.description?.[locale]}/>
                        </SwiperSlide>
                    ))
                )}

            </Swiper>
        </div>
    );
};

export default SpcLaminatePage;