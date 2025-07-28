import Link from "next/link";
import {CartPortfolio} from "@/src/app/(public)/portfolio/components/CartPortfolio";
import {API_BASE_URL} from "@/src/lib/globalConstants";
import React from "react";
import {usePortfolioStore} from "@/store/portfolioItemStore";
import {BtnArrow} from "@/src/components/ui/btn-arrow";
import {Swiper, SwiperSlide} from "swiper/react";
import {Autoplay, Navigation, Pagination} from "swiper/modules";
import SectionAnimation from "@/src/app/(public)/(home)/components/SectionAnimation";

const PortfolioSection = () => {
    const {
        items: storedPortfolioItems,
    } = usePortfolioStore();

    return (
        <SectionAnimation
            ariaLabelledby="portfolio-heading"
            className="px-4 py-12"
        >
            <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
                <div className="w-full lg:w-1/2 space-y-4 my-auto">
                    <h2 className="text-23-30-1_5 main-section-title">Портфолио</h2>
                    <div className="text-gray-600 leading-relaxed space-y-2">
                        <p className="hidden md:block">
                            В портфолио представлены наши реализованные проекты — от смелых идей до практичного
                            исполнения. Здесь вы найдёте работы, в которых сочетаются современный подход, внимание к
                            деталям и эстетика.
                        </p>

                        <p className="block md:hidden">
                            Портфолио с нашими проектами, в которых сочетаются стиль и качество.
                        </p>
                    </div>

                    <BtnArrow className="btn-hover-scale">
                        <Link href="/portfolio" className="text-sm font-medium">
                            Все работы
                        </Link>
                    </BtnArrow>
                </div>

                <div className="w-full lg:w-1/2 flex flex-col items-center gap-4">
                    <Swiper
                        loop={true}
                        autoplay={{
                            delay: 4000,
                            disableOnInteraction: false,
                            reverseDirection: true,
                        }}
                        breakpoints={{
                            0: {slidesPerView: 1, spaceBetween: 20},
                            550: {slidesPerView: 2, spaceBetween: 10},
                            768: {slidesPerView: 3, spaceBetween: 15},
                            1024: {slidesPerView: 2, spaceBetween: 20},
                        }}
                        modules={[Navigation, Autoplay, Pagination]}
                        pagination={{clickable: true}}
                        className="w-full py-4"
                        navigation
                    >
                        {storedPortfolioItems?.length ? (
                            storedPortfolioItems.map((item) => (
                                <SwiperSlide
                                    key={item._id}
                                    className="flex items-center justify-center w-full h-full"
                                >
                                    <CartPortfolio buttonLink={item._id} imageSrc={`${API_BASE_URL}/${item.cover}`}/>
                                </SwiperSlide>
                            ))
                        ) : (
                            <p className="text-center">Нет портфолио</p>
                        )}
                    </Swiper>
                </div>
            </div>
        </SectionAnimation>
    );
};

export default PortfolioSection;