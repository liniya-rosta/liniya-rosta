'use client';

import React, {useEffect} from 'react';
import {Navigation, Pagination} from "swiper/modules";
import {Swiper, SwiperSlide} from "swiper/react";
import {useLaminateStore} from "@/store/laminateItems";
import LaminateCard from "@/app/spc/components/LaminateCard";
import Loading from "@/components/shared/Loading";
import {Laminate} from "@/lib/types";

interface Props {
    initialData: Laminate[] | null;
    error: string | null;
}

const SpcLaminatePage: React.FC<Props> = ({initialData, error}) => {
    const {
        laminateItems,
        setLaminateItems,
        setLaminateLoading,
        fetchLaminateLoading,
        fetchLaminateError,
        setFetchLaminateError,
    } = useLaminateStore()

    useEffect(() => {
        if (initialData) setLaminateItems(initialData)
        setLaminateLoading(false);
        setFetchLaminateError(error);
    }, [setLaminateItems,
        setLaminateLoading,
        setFetchLaminateError,
        initialData,
        error]);

    return (
        <div className="mb-[55px]">
                <h3 className="text-[28px] mb-10 text-center">Каталог</h3>
                <Swiper
                    slidesPerView={1}
                    navigation
                    pagination={{clickable: true}}
                    modules={[Navigation, Pagination]}
                    className="mySwiper py-4"
                >
                    {fetchLaminateLoading ? (
                        <SwiperSlide>
                            <Loading/>
                        </SwiperSlide>
                    ) : fetchLaminateError ? (
                        <SwiperSlide>
                            <h4>{fetchLaminateError}</h4>
                        </SwiperSlide>
                    ) : (
                        laminateItems.map(item => (
                            <SwiperSlide key={item._id}>
                                <LaminateCard title={item.title} image={item.image} description={item.description}/>
                            </SwiperSlide>
                        ))
                    )}

                </Swiper>
            </div>
    );
};

export default SpcLaminatePage;