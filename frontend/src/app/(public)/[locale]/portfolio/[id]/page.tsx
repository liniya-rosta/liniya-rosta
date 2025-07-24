import React from "react";

import {fetchPortfolioItem} from "@/actions/portfolios";
import GalleryClient from './GalleryClient';
import {isAxiosError} from "axios";
import {getLocale, getTranslations} from "next-intl/server";

interface Params {
    id: string
}

const GalleryPage = async ({params}: { params: Promise<Params> }) => {
    let errorMessage: string | null = null;
    let detailItem = null;

    const tPortfolio = await getTranslations("PortfolioPage");
    const tErrors = await getTranslations("Errors");
    const locale = (await getLocale()) as "ru" | "ky";

    try {
        const {id} = await params;
        detailItem = await fetchPortfolioItem(id);
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            errorMessage = error.response.data.error;
        } else if (error instanceof Error) {
            errorMessage = error.message;
        } else {
            errorMessage = tErrors("galleryError");
        }
    }

    return (
        <main className="container mx-auto px-4">
            <h1 className="text-3xl font-bold text-foreground">
                Галерея
            </h1>
            <p className="mb-8 text-lg text-muted-foreground">{detailItem?.description[locale]}</p>
            <GalleryClient detailItem={detailItem} error={errorMessage} emptyGalleryText={tPortfolio("noElementOnGallery")} />
        </main>
    );
};

export default GalleryPage;
