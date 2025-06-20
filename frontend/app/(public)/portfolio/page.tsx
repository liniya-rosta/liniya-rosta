import React from 'react';
import PortfolioClient from "@/app/(public)/portfolio/PortfolioClient";
import {fetchPortfolioPreviews} from "@/actions/portfolios";

const PortfolioPage = async () => {
    const portfolioData = await fetchPortfolioPreviews();

    return (
        <main className="container mx-auto px-8">
            <h1 className="text-3xl font-bold mb-4 text-center" >Портфолио</h1>
            <p className="mb-8 mx-auto text-lg text-muted-foreground text-center max-w-3/6">
                Примеры наших реализованных проектов: потолки, освещение, ламинат и другие решения. Посмотрите, как мы работаем и вдохновляйтесь для своего ремонта.
            </p>
            <PortfolioClient data={portfolioData}/>
        </main>
    );
};

export default PortfolioPage;