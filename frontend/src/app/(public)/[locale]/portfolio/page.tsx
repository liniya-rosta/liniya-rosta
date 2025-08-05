import React from 'react';
import PortfolioClient from "@/src/app/(public)/[locale]/portfolio/PortfolioClient";
import {fetchPortfolioPreviews} from "@/actions/portfolios";
import {PortfolioResponse} from "@/src/lib/types";
import {isAxiosError} from "axios";
import {getTranslations} from "next-intl/server";
import {Metadata} from "next";

export const revalidate = 1800;

export const generateMetadata = async (): Promise<Metadata> => {
    const t = await getTranslations("PortfolioPage");
    const tHeader = await getTranslations("Header");

    return {
        title: tHeader("headerLinks.portfolio"),
        description: t("descriptionSeo"),
        openGraph: {
            title: t("ogTitle"),
            description: t("ogDescription"),
            url: "/portfolio",
            siteName: "Линия Роста",
            images: [
                {
                    url: "/images/services/main-service.JPG",
                    width: 1200,
                    height: 630,
                    alt: t("ogImageAlt"),
                },
            ],
            type: "website",
        },
    };
};

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