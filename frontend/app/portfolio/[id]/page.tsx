"use client";

import React, {useLayoutEffect, useState} from 'react';
import {usePortfolioStore} from "@/store/portfolioItem";
import {Container} from "@/components/shared/container";
import {useParams} from 'next/navigation';
import {API_BASE_URL} from "@/lib/globalConstants";
import Image from "next/image";
import {GalleryItem} from "@/lib/types";
import {ModalWindow} from "@/components/UI/modal-window";

const GalleryPage = () => {
    const {detailItem, fetchItem} = usePortfolioStore();
    const gallery = detailItem?.gallery;
    const params = useParams();
    const id = params?.id as string;
    const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

    useLayoutEffect(() => {
        if (id) {
            void fetchItem(id);
        }

    }, [fetchItem, id]);


    return (
        <Container>
            <div className="grid grid-cols-3 gap-4">
                {gallery?.map((item) => {
                    const imageUrl = API_BASE_URL + "/" + item.image;

                    return (
                        <div
                            key={item._id}
                            onClick={() => setSelectedItem(item)}
                            className="relative w-full h-100  overflow-hidden rounded-xl group">
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
                        src={API_BASE_URL + "/" + selectedItem.image}
                        alt="modal"
                        width={800}
                        height={600}
                        className="w-full h-auto object-contain"
                    />
                </ModalWindow>
            )}
        </Container>
    );
};

export default GalleryPage;