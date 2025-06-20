import React from "react";

export const dynamicParams = true;
import {fetchPortfolioItems} from "@/actions/portfolios";
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
        detailItem = await fetchPortfolioItems(id);
    } catch (error) {
        if (isAxiosError(error)) {
            errorMessage = error.response?.data?.error || "Ошибка при загрузке галереи";
        } else {
            errorMessage = "Неизвестная ошибка при загрузке галереи";
        }
    }

    return (
        <main className="container mx-auto px-4">
            <h1 className="text-3xl font-bold mb-4 text-center">Галерея</h1>
            <p className="mb-8 text-lg text-muted-foreground text-center">{detailItem?.description}</p>
            <GalleryClient detailItem={detailItem} error={errorMessage}/>
        </main>
    );
};

export default GalleryPage;
