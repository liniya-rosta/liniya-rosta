import React from "react";

import {fetchPortfolioItems} from "@/actions/portfolios";
import GalleryClient from './GalleryClient';

type Params = { id: string };

const GalleryPage = async ({ params }: { params: Params }) => {
    const { id } = params;
    const detailItem = await fetchPortfolioItems(id);

    return (
        <main className="container mx-auto px-4">
            <h1 className="text-3xl font-bold mb-4 text-center">Галерея</h1>
            <p className="mb-8 text-lg text-muted-foreground text-center">{detailItem?.description}</p>
            {
               detailItem ? <GalleryClient detailItem={detailItem}/>
                    : <p className="text-center">Галерея пуста</p>
            }
        </main>
    );
};

export default GalleryPage;
