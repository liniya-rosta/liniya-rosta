"use client";

import React, {useEffect} from "react";
import Image from "next/image";
import {Badge} from "@/components/ui/badge";
import {Product} from "@/lib/types";
import {API_BASE_URL} from "@/lib/globalConstants";
import {Swiper, SwiperSlide} from "swiper/react";
import {Navigation} from "swiper/modules";
import LoadingFullScreen from "@/components/ui/Loading/LoadingFullScreen";
import ErrorMsg from "@/components/ui/ErrorMsg";
import {useProductStore} from "@/store/productsStore";
import ImagePreviewModal from "@/app/(admin)/admin/products/components/Modal/ImagePreviewModal";

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

    const [previewImage, setPreviewImage] = React.useState<{ url: string; alt: string } | null>(null);

    useEffect(() => {
        if (productData) setProduct(productData);
        if (fetchProductError) setFetchProductsError(null);
        setFetchProductsLoading(false);
    }, [fetchProductError, productData, setFetchProductsError, setFetchProductsLoading, setProduct]);

    if (fetchProductsLoading) return <LoadingFullScreen/>;
    if (fetchProductsError) return <ErrorMsg error={fetchProductsError} label='продукта'/>

    if (product) return (
        <div
            className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(320px,400px)] gap-10 container mx-auto px-4 py-12">
            <div>
                <div
                    className="relative w-full h-[360px] sm:h-[440px] md:h-[500px] rounded-xl overflow-hidden border shadow-lg">
                    <Image
                        src={`${API_BASE_URL}/${product.cover.url}`}
                        alt={product.cover.alt || product.title}
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
                                             onClick={() => setPreviewImage({url: img.url, alt: img.alt})}

                                >
                                    <div
                                        className="relative w-full h-[200px] rounded-lg overflow-hidden shadow-md border hover:scale-105 transition-transform duration-300">
                                        <Image
                                            src={`${API_BASE_URL}/${img.url}`}
                                            alt={img.alt}
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
                <h1 className="text-3xl font-bold">{product.title}</h1>
                <p className="text-muted-foreground text-lg">{product.description}</p>
                <Badge variant="secondary" className="text-sm px-3 py-1">
                    {product.category.title}
                </Badge>

                {Array.isArray(product.characteristics) && product.characteristics.length > 0 ? (
                    <div className="space-y-3 mt-6">
                        <h2 className="font-semibold text-lg">Характеристики</h2>
                        <ul className="list-disc list-inside space-y-1 text-base">
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
                        Свяжитесь с нами и мы сразу же проконсультируем вас
                    </div>
                )}
            </div>
            {previewImage && (
                <ImagePreviewModal
                    image={previewImage}
                    onClose={() => setPreviewImage(null)}
                />
            )}
        </div>
    );
};

export default ProductDetailView;