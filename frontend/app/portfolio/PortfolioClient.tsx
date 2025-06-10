'use client';

import {usePortfolioStore} from "@/store/portfolioItemStore";
import React, {useEffect} from "react";
import {API_BASE_URL} from "@/lib/globalConstants";
import {CartPortfolio} from "@/app/portfolio/components/CartPortfolio";
import {PortfolioItemPreview} from "@/lib/types";

type Props = {
    data: PortfolioItemPreview[]
}

const PortfolioClient: React.FC<Props> = ({ data }) => {
    const {items, setPortfolioPreview} = usePortfolioStore();

    useEffect(() => {
        setPortfolioPreview(data)
    }, [setPortfolioPreview, data]);

    return (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                {items.map((item) => {
                    const imageUrl = API_BASE_URL + "/" + item.cover;
                    const pageUrl = "/portfolio/" + item._id;

                    return (
                        <CartPortfolio key={item._id} link={pageUrl} imageSrc={imageUrl}/>
                    )
                })}
            </div>

    );
}

export default PortfolioClient;