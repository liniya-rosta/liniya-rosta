import React from 'react';
import PortfolioClient from "@/app/portfolio/PortfolioClient";
import {fetchPortfolio} from "@/actions/portfolio";

const PortfolioPage = async () => {

    const portfolioData = await fetchPortfolio();

    return (
        <PortfolioClient data={portfolioData}/>
    );
};

export default PortfolioPage;