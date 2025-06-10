import React from 'react';
import PortfolioClient from "@/app/portfolio/PortfolioClient";
import {fetchAllPortfolio} from "@/actions/portfolio";

const PortfolioPage = async () => {
    const portfolioData = await fetchAllPortfolio();

    return (
        <main className="container">
            <h1 className="text-3xl font-bold mb-8" >Портфолио</h1>
            <PortfolioClient data={portfolioData}/>
        </main>

    );
};

export default PortfolioPage;