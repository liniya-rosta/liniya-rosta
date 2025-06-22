'use client';

import React, {useState, useEffect} from 'react';
import {usePortfolioStore} from "@/store/portfolioItemStore";
import {API_BASE_URL} from "@/lib/globalConstants";
import Image from "next/image";
import {GalleryItem, PortfolioItemDetail} from "@/lib/types";
import {ModalImage} from "@/components/shared/ModalImage";
import Loading from "@/components/ui/Loading/Loading";
import GalleryCard from '../components/GalleryCard';

type Props = {
    detailItem?: PortfolioItemDetail | null,
    error: string | null,
};

const GalleryClient: React.FC<Props> = ({detailItem, error=null}) => {
    const {
        fetchLoadingPortfolio,
        setPortfolioItemDetail,
        setPortfolioLoading
    } = usePortfolioStore();

    const gallery = detailItem?.gallery;
    const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
    const [currentIndex, setCurrentIndex] = useState<number | null>(null);

    const handleOpen = (index: number) => setCurrentIndex(index);
    const handleClose = () => setCurrentIndex(null);

    const handleNext = () => {
        if (!gallery) return;
        const total = gallery.length + 1;
        setCurrentIndex((prev) => ((prev === null ? 0 : (prev + 1) % total)));
    };

    const handlePrev = () => {
        if (!gallery) return;
        const total = gallery.length + 1;
        setCurrentIndex((prev) => ((prev === null ? 0 : (prev - 1 + total) % total)));
    };

    useEffect(() => {
        if (detailItem) {
            setPortfolioItemDetail(detailItem);
            if (currentIndex === null) {
                setSelectedItem(null);
            } else if (currentIndex === -1) {
                setSelectedItem({image: detailItem.cover, _id: detailItem._id, alt: detailItem.coverAlt});
            } else if (gallery && currentIndex >= 0) {
                setSelectedItem(gallery[currentIndex]);
            }
        }

        setPortfolioLoading(false)
    }, [setPortfolioItemDetail, detailItem, setPortfolioLoading, error, currentIndex, gallery]);


    if (!detailItem) return  <p className="text-center">Галерея пуста</p>
    if (fetchLoadingPortfolio) return <Loading/>

    if (error) {
        return (
            <div className="text-center py-10 text-destructive text-lg">
                <p>Ошибка загрузки: {error}</p>
            </div>
        );
    }

    return (
        <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">

                <GalleryCard
                    imageUrl={`${API_BASE_URL}/${detailItem.cover}`}
                    alt={detailItem.coverAlt}
                    handleOpen={handleOpen}
                    index={-1}
                    id={detailItem._id}
                    className="aspect-[3/4] sm:aspect-[3/2] sm:col-span-2 col-span-1 w-full overflow-hidden group cursor-pointer rounded-2xl hover:shadow-xl transition"
                    classNameImage="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                />

                {gallery?.map((item, index) => {
                    const imageUrl = `${API_BASE_URL}/${item.image}`;
                    return (
                        <GalleryCard
                            key={item._id}
                            index={index}
                            id={item._id}
                            imageUrl={imageUrl}
                            handleOpen={handleOpen}
                            alt={item.alt}
                            className="aspect-[3/4] w-full overflow-hidden group cursor-pointer rounded-2xl hover:shadow-xl transition"
                            classNameImage="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                        />
                    );
                })}
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
                    ><Image
                            src={`${API_BASE_URL}/${selectedItem.image}`}
                            alt={selectedItem.alt}
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
