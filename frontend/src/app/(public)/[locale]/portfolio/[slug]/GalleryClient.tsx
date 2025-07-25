'use client';

import React, { useState, useEffect } from 'react';
import { usePortfolioStore } from "@/store/portfolioItemStore";
import { API_BASE_URL } from "@/src/lib/globalConstants";
import Image from "next/image";
import { GalleryItem, PortfolioItemDetail } from "@/src/lib/types";
import { ModalImage } from "@/src/components/shared/ModalImage";
import GalleryCard from '../components/GalleryCard';
import LoadingFullScreen from "@/src/components/ui/Loading/LoadingFullScreen";
import {useLocale, useTranslations} from 'next-intl';

type Props = {
    detailItem?: PortfolioItemDetail | null;
    error: string | null;
};

const GalleryClient: React.FC<Props> = ({ detailItem, error = null }) => {
    const {
        fetchLoadingPortfolio,
        setPortfolioItemDetail,
        setPortfolioLoading,
    } = usePortfolioStore();

    const gallery = detailItem?.gallery;
    const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
    const [currentIndex, setCurrentIndex] = useState<number | null>(null);
    const locale = useLocale() as "ru" | "ky";
    const tPortfolio = useTranslations("PortfolioPage");

    const handleOpen = (index: number) => setCurrentIndex(index);
    const handleClose = () => setCurrentIndex(null);

    const handleNext = () => {
        if (!gallery) return;
        const total = gallery.length + 1;
        setCurrentIndex((prev) => (prev === null ? 0 : (prev + 1) % total));
    };

    const handlePrev = () => {
        if (!gallery) return;
        const total = gallery.length + 1;
        setCurrentIndex((prev) => (prev === null ? 0 : (prev - 1 + total) % total));
    };

    useEffect(() => {
        if (detailItem) {
            setPortfolioItemDetail(detailItem);

            if (currentIndex === null) {
                setSelectedItem(null);
            } else if (currentIndex === -1) {
                setSelectedItem({
                    image: detailItem.cover,
                    _id: detailItem._id,
                    alt: detailItem.coverAlt,
                });
            } else if (gallery && currentIndex >= 0) {
                setSelectedItem(gallery[currentIndex]);
            }
        }

        setPortfolioLoading(false);
    }, [
        setPortfolioItemDetail,
        detailItem,
        setPortfolioLoading,
        error,
        currentIndex,
        gallery,
    ]);

    if (!detailItem) return <p className="text-center">{tPortfolio("portfolioSubtitle")}</p>;
    if (fetchLoadingPortfolio) return <LoadingFullScreen />;
    if (error) return <p>{error}</p>

    return (
        <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <GalleryCard
                    imageUrl={`${API_BASE_URL}/${detailItem.cover}`}
                    alt={detailItem.coverAlt[locale]}
                    handleOpen={handleOpen}
                    index={-1}
                    id={detailItem._id}
                    className="aspect-[3/4] sm:aspect-[3/2] sm:col-span-2 col-span-1 w-full overflow-hidden group cursor-pointer rounded-2xl hover:shadow-xl transition"
                    classNameImage="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                />

                {gallery && gallery.length > 0 ? (
                    gallery.map((item, index) => (
                        <GalleryCard
                            key={item._id}
                            index={index}
                            id={item._id}
                            imageUrl={`${API_BASE_URL}/${item.image}`}
                            handleOpen={handleOpen}
                            alt={item.alt[locale]}
                            className="aspect-[3/4] w-full overflow-hidden group cursor-pointer rounded-2xl hover:shadow-xl transition"
                            classNameImage="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                        />
                    ))
                ) : (
                    <div className="flex justify-center items-center min-h-[200px]">
                        <p className="text-muted-foreground text-lg">{tPortfolio("portfolioSubtitle")}</p>
                    </div>
                )}
            </div>

            {selectedItem && (
                <ModalImage
                    isOpen={true}
                    onClose={handleClose}
                    handleNext={handleNext}
                    handlePrev={handlePrev}
                    isNavigable
                >
                    <a
                        className="block max-w-[90vw] max-h-[90vh] w-auto h-auto"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <Image
                            src={`${API_BASE_URL}/${selectedItem.image}`}
                            alt={selectedItem.alt[locale]}
                            width={800}
                            height={600}
                            className="w-auto h-auto max-w-full max-h-[80vh] object-contain"
                        />
                    </a>
                </ModalImage>
            )}
        </div>
    );
};

export default GalleryClient;
