import React from 'react';
import MainPageClient from "@/app/mainPage/MainPageClient";
import type {Metadata} from "next";

export const metadata: Metadata = {
    title: 'Главная страницаю Линия Роста',
    description: '',
    keywords: '',
    openGraph: {
        title: 'Свежие новости — Главные события мира тенниса в Кыргызстане',
        description:
            'Читайте последние новости о турнирах, достижениях спортсменов и других событиях теннисного мира в Кыргызстане.',
        images: 'https://tennis.kg/kslt.svg',
        type: 'website',
    },
};

const Page = async () => {

    return (
        <MainPageClient/>
    );
};

export default Page;