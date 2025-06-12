import React from 'react';
import PortfolioClient from "@/app/portfolio/PortfolioClient";
import {fetchPortfolioPreviews} from "@/actions/portfolios";

const PortfolioPage = async () => {
    const portfolioData = await fetchPortfolioPreviews();

    return (
        <main className="container">
            <h1 className="text-3xl font-bold mb-8" >Портфолио</h1>
            <PortfolioClient data={portfolioData}/>
        </main>

    );
};

export default PortfolioPage;