import React from "react";
export const dynamic = "force-dynamic";

import {fetchPortfolioItems} from "@/actions/portfolios";
import GalleryClient from './GalleryClient';

type Params = { id: string };

const GalleryPage = async ({ params }: { params: Promise<Params> }) => {
    const { id } = await params;
    const detailItem = await fetchPortfolioItems(id);

    return (
        <main className="container">
            <h1 className="text-3xl font-bold mb-4 text-center">Галерея</h1>
            <p className="mb-8 text-lg text-muted-foreground text-center">{detailItem?.description}</p>
            {
               detailItem ? <GalleryClient detailItem={detailItem}/>
                    : <p>Галерея пуста</p>
            }
        </main>
    );
};

export default GalleryPage;
