import React from "react";

import {fetchPortfolioItem} from "@/actions/portfolios";
import GalleryClient from './GalleryClient';
import {isAxiosError} from "axios";

interface Params {
    id: string
}

const GalleryPage = async ({params}: { params: Promise<Params> }) => {
    let errorMessage: string | null = null;
    let detailItem = null;

    try {
        const {id} = await params;
        detailItem = await fetchPortfolioItem(id);
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            errorMessage = error.response.data.error;
        } else if (error instanceof Error) {
            errorMessage = error.message;
        } else {
            errorMessage = "Неизвестная ошибка при загрузке  галереи";
        }
    }

    return (
        <main className="container mx-auto px-4">
            <h1 className="text-3xl font-bold text-foreground">
                Галерея
            </h1>
            <p className="mb-8 text-lg text-muted-foreground">{detailItem?.description}</p>
            <GalleryClient detailItem={detailItem} error={errorMessage}/>
        </main>
    );
};

export default GalleryPage;
