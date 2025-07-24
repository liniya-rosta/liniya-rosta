import React from 'react';
import PortfolioClient from "@/src/app/(public)/[locale]/portfolio/PortfolioClient";
import {fetchPortfolioPreviews} from "@/actions/portfolios";
import {PaginatedPortfolioResponse} from "@/src/lib/types";
import {isAxiosError} from "axios";
import {getTranslations} from "next-intl/server";

const PortfolioPage = async () => {
    let errorMessage: string | null = null;
    let portfolioData: PaginatedPortfolioResponse | null = null;
    const limit = "8";

    const tPortfolio = await getTranslations("PortfolioPage");
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
        <main className="container mx-auto px-8">
            <h1 className="text-3xl font-bold text-foreground mb-5">
                Портфолио
                <span className="block font-medium text-muted-foreground text-sm tracking-wider uppercase">
                    {tPortfolio("portfolioSubtitle")}
                </span>
            </h1>
            <PortfolioClient data={portfolioData}
                             error={errorMessage}
                             limit={limit}/>
        </main>
    );
};

export default PortfolioPage;