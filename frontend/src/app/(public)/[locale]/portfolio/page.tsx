import React from 'react';
import PortfolioClient from "@/src/app/(public)/[locale]/portfolio/PortfolioClient";
import {fetchPortfolioPreviews} from "@/actions/portfolios";
import {PortfolioResponse} from "@/src/lib/types";
import {isAxiosError} from "axios";
import {getTranslations} from "next-intl/server";
import {Metadata} from "next";

export const revalidate = 1800;

export const generateMetadata = async (): Promise<Metadata> => ({
    title: "Портфолио",
    description: "Примеры реализованных проектов компании Линия Роста. Натяжные потолки, SPC ламинат и интерьерные решения — фото наших работ.",
    openGraph: {
        title: "Портфолио | Линия Роста",
        description: "Галерея выполненных работ от Линии Роста. Посмотрите реальные примеры потолков и ламината.",
        url: "/portfolio",
        siteName: "Линия Роста",
        type: "website",
    },
});

const PortfolioPage = async () => {
    let errorMessage: string | null = null;
    let portfolioData: PortfolioResponse | null = null;
    const limit = "9";

    const tErrors = await getTranslations("Errors");

    try {
        portfolioData = await fetchPortfolioPreviews(limit);

    } catch (error) {
        if (isAxiosError(error) && error.response) {
            errorMessage = error.response.data.error;
        } else if (error instanceof Error) {
            errorMessage = error.message;
        } else {
            errorMessage = tErrors("portfolioError");
        }
    }

    return (
        <PortfolioClient data={portfolioData}
                     error={errorMessage}
                     limit={limit}/>
    );
};

export default PortfolioPage;