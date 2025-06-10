'use client';

import React, {useState, useEffect} from 'react';
import {usePortfolioStore} from "@/store/portfolioItemStore";
import {API_BASE_URL} from "@/lib/globalConstants";
import Image from "next/image";
import {GalleryItem, PortfolioItemDetail} from "@/lib/types";
import {ModalWindow} from "@/components/ui/modal-window";

type Props = {
    detailItem: PortfolioItemDetail
};

const GalleryClient: React.FC<Props> = ({ detailItem }) => {
    const { setPortfolioItemDetail } = usePortfolioStore();
    const gallery = detailItem?.gallery;
    const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

    useEffect(() => {
        setPortfolioItemDetail(detailItem);
    }, [setPortfolioItemDetail, detailItem]);

    return (
        <div>
            <div className="grid grid-cols-3 gap-4">
                {gallery?.map((item) => {
                    const imageUrl = `${API_BASE_URL}/${item.image}`;

                    return (
                        <div
                            key={item._id}
                            onClick={() => setSelectedItem(item)}
                            className="relative w-full h-100 overflow-hidden rounded-xl group"
                        >
                            <Image
                                src={imageUrl}
                                alt={item._id}
                                fill
                                priority
                                className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                        </div>
                    );
                })}
            </div>

            {selectedItem && (
                <ModalWindow isOpen={true} onClose={() => setSelectedItem(null)}>
                    <Image
                        src={`${API_BASE_URL}/${selectedItem.image}`}
                        alt="modal"
                        width={800}
                        height={600}
                        className="w-full h-auto object-contain"
                    />
                </ModalWindow>
            )}
        </div>
    );
};

export default GalleryClient;
