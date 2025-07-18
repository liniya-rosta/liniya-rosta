import React from 'react';
import PortfolioClient from "@/app/(public)/portfolio/PortfolioClient";
import {fetchPortfolioPreviews} from "@/actions/portfolios";
import {PortfolioResponse} from "@/lib/types";
import {isAxiosError} from "axios";

const PortfolioPage = async () => {
    let errorMessage: string | null = null;
    let portfolioData: PortfolioResponse | null = null;
    const limit = "8";

    try {
        portfolioData = await fetchPortfolioPreviews(limit);

    } catch (error) {
        if (isAxiosError(error) && error.response) {
            errorMessage = error.response.data.error;
        } else if (error instanceof Error) {
            errorMessage = error.message;
        } else {
            errorMessage = "Неизвестная ошибка при загрузке портфолио";
        }
    }

    return (
        <main className="container mx-auto px-8">
            <h1 className="text-3xl font-bold text-foreground mb-5">
                Портфолио
                <span className="block font-medium text-muted-foreground text-sm tracking-wider uppercase">
                    Идеи, воплощённые в реальность
                </span>
            </h1>
            <PortfolioClient data={portfolioData} error={errorMessage} limit={limit}/>
        </main>
    );
};

export default PortfolioPage;