import React from 'react';
import {fetchPortfolioItems} from "@/actions/portfolios";
import GalleryClient from './GalleryClient';

type Props = {
    params: { id: string }
};

const GalleryPage = async ({ params }: Props) => {
    const detailItem = await fetchPortfolioItems(params.id);

    return (
        <main className="container">
            <h1 className="text-3xl font-bold mb-8">Галерея</h1>
            <GalleryClient detailItem={detailItem}/>
        </main>
    );
};

export default GalleryPage;
