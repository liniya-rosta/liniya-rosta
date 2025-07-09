"use client";

import React from "react";
import Image from "next/image";
import {Badge} from "@/components/ui/badge";
import {Product} from "@/lib/types";
import {API_BASE_URL} from "@/lib/globalConstants";
import {Swiper, SwiperSlide} from "swiper/react";
import {Navigation, Pagination} from "swiper/modules";

interface Props {
    product: Product;
}

const ProductDetailView: React.FC<Props> = ({product}) => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8 container mx-auto px-4 py-10">
            <div>
                <div className="relative w-full h-[400px] sm:h-[500px] md:h-[600px] rounded overflow-hidden">
                    <Image
                        src={`${API_BASE_URL}/${product.cover.url}`}
                        alt={product.cover.alt || product.title}
                        fill
                        className="object-cover"
                    />
                </div>

                {product.images?.length > 0 && (
                    <div className="mt-4">
                        <Swiper
                            spaceBetween={10}
                            slidesPerView="auto"
                            navigation
                            pagination={{ clickable: true }}
                            modules={[Navigation, Pagination]}
                            className="py-2"
                        >
                            {product.images.map((img) => (
                                <SwiperSlide key={img._id} className="!w-auto">
                                    <div className="relative h-[120px] aspect-[4/3] rounded-lg overflow-hidden shadow-md border hover:scale-105 transition-transform duration-300">
                                        <Image
                                            src={`${API_BASE_URL}/${img.url}`}
                                            alt={img.alt}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                )}
            </div>

            <div className="space-y-6">
                <h1 className="text-3xl font-bold">{product.title}</h1>
                <p className="text-muted-foreground">{product.description}</p>
                <Badge variant="secondary">{product.category.title}</Badge>

                {Array.isArray(product.characteristics) && product.characteristics.length > 0 ? (
                    <div className="space-y-2 mt-4">
                        <h2 className="font-semibold">Характеристики:</h2>
                        <ul className="list-disc list-inside">
                            {product.characteristics.map((c, index) => (
                                <li key={`${c.key}-${index}`}>
                                    <strong>{c.key}:</strong> {c.value}
                                </li>
                            ))}
                        </ul>
                    </div>
                ) : (
                    <div className="mt-4 text-sm text-muted-foreground">
                        Характеристики отсутствуют. <br/>
                        Свяжитесь с нами, и мы с радостью проконсультируем вас.
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductDetailView;