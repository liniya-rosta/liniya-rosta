import React from 'react';
import {Swiper, SwiperSlide} from "swiper/react";
import {Navigation, Pagination} from "swiper/modules";
import CategoryCard from "@/src/app/(public)/[locale]/(home)/components/CategoryCard";
import {useCategoryStore} from "@/store/categoriesStore";
import {useTranslations} from "next-intl";

const CategoriesSection = () => {
    const {categories, fetchCategoriesError} = useCategoryStore();

    const tHome = useTranslations("HomePage");
    const tError = useTranslations("Errors");

    return (
        <section className="space-y-6" aria-labelledby="categories-heading">
            <h2 id="categories-heading" className="text-3xl font-bold text-center">{tHome("categoriesTitle")}</h2>
            {fetchCategoriesError &&
                tError("categoriesError")
            }
            {categories.length > 0 ? (
                <Swiper
                    slidesPerView={4}
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
            ) : (
                !fetchCategoriesError && <p className="text-center">{tHome("noCategories")}</p>
            )}
        </section>
    );
};

export default CategoriesSection;