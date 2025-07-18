import React from 'react';
import ErrorMsg from "@/components/ui/ErrorMsg";
import {Swiper, SwiperSlide} from "swiper/react";
import {Navigation, Pagination} from "swiper/modules";
import CategoryCard from "@/app/(public)/(home)/components/CategoryCard";
import {useCategoryStore} from "@/store/categoriesStore";

const CategoriesSection = () => {
    const {categories, fetchCategoriesError} = useCategoryStore();

    return (
        <section className="space-y-6" aria-labelledby="categories-heading">
            <h2 id="categories-heading" className="main-section-title text-20-30-1_2">Категории продукции</h2>
            {fetchCategoriesError && (
                <ErrorMsg error={fetchCategoriesError} label='категорий'/>
            )}
            {categories.length > 0 ? (
                <Swiper
                    slidesPerView={1}
                    spaceBetween={5}
                    breakpoints={{
                        500: {slidesPerView: 2, spaceBetween: 10},
                        640: {slidesPerView: 3, spaceBetween: 15},
                        1024: {slidesPerView: 4, spaceBetween: 20},
                    }}
                    navigation
                    pagination={{clickable: true}}
                    modules={[Navigation, Pagination]}
                    className="mySwiper py-4 w-full"
                >
                    {categories.map((cat) => (
                        <SwiperSlide key={cat._id}>
                            <CategoryCard category={cat}/>
                        </SwiperSlide>
                    ))}
                </Swiper>
            ) : (
                !fetchCategoriesError && <p className="text-center">Нет категорий</p>
            )}
        </section>
    );
};

export default CategoriesSection;