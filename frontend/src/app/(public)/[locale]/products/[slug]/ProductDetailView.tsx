"use client";

import React, {useEffect} from "react";
import Image from "next/image";
import {Badge} from "@/src/components/ui/badge";
import {Product} from "@/src/lib/types";
import {Swiper, SwiperSlide} from "swiper/react";
import {Navigation} from "swiper/modules";
import LoadingFullScreen from "@/src/components/ui/Loading/LoadingFullScreen";
import {useProductStore} from "@/store/productsStore";
import {useLocale, useTranslations} from "next-intl";

interface Props {
    productData: Product | null;
    fetchProductError: string | null;
}

const ProductDetailView: React.FC<Props> = ({productData, fetchProductError}) => {
    const {
        setProduct,
        product,
        setFetchProductsError,
        setFetchProductsLoading,
        fetchProductsError,
        fetchProductsLoading
    } = useProductStore();

    const [previewImage, setPreviewImage] = React.useState<{
        url: string;
        alt: { ru: string, ky?: string } | null
    } | null>(null);

    const tError = useTranslations("Errors");
    const tCeilings = useTranslations("CeilingsPage");
    const locale = useLocale() as "ky" | "ru";

    useEffect(() => {
        if (productData) setProduct(productData);
        if (fetchProductError) setFetchProductsError(null);
        setFetchProductsLoading(false);
    }, [fetchProductError, productData, setFetchProductsError, setFetchProductsLoading, setProduct]);

    if (fetchProductsLoading) return <LoadingFullScreen/>;
    if (fetchProductsError) return <p>{tError("CeilingDetailError")}</p>

    const IMG_BASE = process.env.NEXT_PUBLIC_IMG_SERVER;
    console.log(IMG_BASE);
    console.log(process.env.NEXT_PUBLIC_IMG_SERVER);

    const src = `${IMG_BASE}/${product?.cover.url}`;

    if (product) return (
        <div
            className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(320px,400px)] gap-10 container mx-auto px-4 py-12">
            <div>
                <div
                    className="relative w-full h-[360px] sm:h-[440px] md:h-[500px] rounded-xl overflow-hidden border shadow-lg">
                    <Image
                        src={src}
                        alt={product.cover.alt[locale] || product.title[locale] || "Изображение"}
                        fill
                        className="object-cover"
                    />
                </div>

                {product.images?.length > 0 && (
                    <div className="mt-6 bg-muted p-4 rounded-xl">
                        <Swiper
                            spaceBetween={12}
                            slidesPerView="auto"
                            navigation
                            modules={[Navigation]}
                            className="pt-2"
                        >
                            {product.images.map((img) => (
                                <SwiperSlide key={img._id}
                                             className="!w-[300px]"
                                             onClick={() => setPreviewImage({
                                                 url: img.url,
                                                 alt: img.alt || {ru: "Изображение", ky: "Сүрөт"}
                                             })}

                                >
                                    <div
                                        className="relative w-full h-[200px] rounded-lg overflow-hidden shadow-md border hover:scale-105 transition-transform duration-300">
                                        <Image
                                            src={`${IMG_BASE}/${img.url}`}
                                            alt={img.alt?.[locale] || "Изображение"}
                                            fill
                                            className="object-cover"
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        />
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                )}
            </div>

            <div className="space-y-6">
                <h1 className="text-3xl font-bold">{product.title[locale]}</h1>
                <p className="text-muted-foreground text-lg">{product.description?.[locale]}</p>
                <Badge variant="secondary" className="text-sm px-3 py-1">
                    {product.category.title[locale]}
                </Badge>

                {Array.isArray(product.characteristics) && product.characteristics.length > 0 ? (
                    <div className="space-y-3 mt-6">
                        <h2 className="font-semibold text-lg">Характеристики</h2>
                        <ul className="list-disc list-inside space-y-1 text-base">
                            {product.characteristics.map((c, index) => (
                                <li key={`${c.key?.[locale] || "key"}-${index}`}>
                                    <strong>{c.key?.[locale] || "—"}:</strong> {c.value?.[locale] || "—"}
                                </li>
                            ))}
                        </ul>
                    </div>
                ) : (
                    <div className="mt-4 text-sm text-muted-foreground">
                        {tCeilings("noCharacteristics")}
                    </div>
                )}
            </div>
            {/*{previewImage && (*/}
            {/*    <ImagePreviewModal*/}
            {/*        image={previewImage}*/}
            {/*        onClose={() => setPreviewImage(null)}*/}
            {/*    />*/}
            {/*)}*/}
            {previewImage && (
                <p>asdfasdf</p>
            )}


        </div>
    );
};

//надо доработать подробный просмотр!!!!

export default ProductDetailView;