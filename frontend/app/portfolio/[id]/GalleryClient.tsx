'use client';

import React, {useState, useEffect} from 'react';
import {usePortfolioStore} from "@/store/portfolioItemStore";
import {API_BASE_URL} from "@/lib/globalConstants";
import Image from "next/image";
import {GalleryItem, PortfolioItemDetail} from "@/lib/types";
import {ModalImage} from "@/app/portfolio/components/Modal-image";

type Props = {
    detailItem: PortfolioItemDetail
};

const GalleryClient: React.FC<Props> = ({detailItem}) => {
    const {setPortfolioItemDetail} = usePortfolioStore();
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
        setPortfolioItemDetail(detailItem);
    }, [setPortfolioItemDetail, detailItem]);

    useEffect(() => {
        if (currentIndex === null) {
            setSelectedItem(null);
        } else if (currentIndex === -1) {
            setSelectedItem({image: detailItem.cover, _id: detailItem._id});
        } else if (gallery && currentIndex >= 0) {
            setSelectedItem(gallery[currentIndex]);
        }
    }, [currentIndex, gallery, detailItem]);


    return (
        <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <a
                    key={detailItem._id}
                    target="_blank"
                    rel="noopener noreferrer"
                    href={`${API_BASE_URL}/${detailItem.cover}`}
                    onClick={(e) => {
                        e.preventDefault();
                        handleOpen(-1)
                    }}
                    className="block relative aspect-[3/4] sm:aspect-[3/2] sm:col-span-2 col-span-1 w-full overflow-hidden group cursor-pointer rounded-2xl hover:shadow-xl transition"
                >
                    <Image
                        src={`${API_BASE_URL}/${detailItem.cover}`}
                        alt={detailItem._id}
                        fill
                        priority
                        className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                    />
                </a>

                {gallery?.map((item, index) => {
                    const imageUrl = `${API_BASE_URL}/${item.image}`;
                    return (
                        <a
                            key={item._id}
                            href={imageUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => {
                                e.preventDefault();
                                handleOpen(index);
                            }}
                            className="block relative aspect-[3/4] w-full overflow-hidden group cursor-pointer rounded-2xl hover:shadow-xl transition"
                        >
                            <Image
                                src={imageUrl}
                                alt={item._id}
                                fill
                                priority
                                className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                            />
                        </a>
                    );
                })}
            </div>

            {selectedItem && (
                <ModalImage isOpen={true} onClose={handleClose} handleNext={handleNext} handlePrev={handlePrev}>
                    <a
                        className="block max-w-[90vw] max-h-[90vh] w-auto h-auto"
                        target="_blank"
                        rel="noopener noreferrer"
                    ><Image
                            src={`${API_BASE_URL}/${selectedItem.image}`}
                            alt="modal"
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
