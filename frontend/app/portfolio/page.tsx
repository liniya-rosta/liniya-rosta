"use client";

import React, {useLayoutEffect} from 'react';
import {usePortfolioStore} from "@/store/portfolioItem";
import {Container} from "@/components/shared/container";
import {CartPortfolio} from "@/components/shared/cart-portfolio";
import {API_BASE_URL} from "@/lib/globalConstants";

const PortfolioPage = () => {
    const {items, fetchPortfolio} = usePortfolioStore();

    useLayoutEffect(() => {
        void fetchPortfolio();
    }, [fetchPortfolio]);


    return (
        <Container>
            <h1 className="text-3xl md:text-5xl font-bold mb-8" >Портфолио</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
                {items.map((item) => {
                    const imageUrl = API_BASE_URL + "/" + item.cover;
                    const pageUrl = "/portfolio/" + item._id;

                    return (
                        <CartPortfolio key={item._id} link={pageUrl} imageSrc={imageUrl}/>
                    )
                })}
            </div>
        </Container>
    );
};

export default PortfolioPage;