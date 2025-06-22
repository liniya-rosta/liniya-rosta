'use client';

import {usePortfolioStore} from "@/store/portfolioItemStore";
import React, {useEffect, useState} from "react";
import {API_BASE_URL} from "@/lib/globalConstants";
import { CartPortfolio } from '@/app/(public)/portfolio/components/CartPortfolio';
import {PortfolioItemPreview} from "@/lib/types";
import Link from "next/link";
import Loading from "@/components/ui/Loading/Loading";

interface Props {
    data: PortfolioItemPreview[] | null;
    error?: string | null;
}

const PortfolioClient: React.FC<Props> = ({ data, error }) => {
    const {
        items,
        setPortfolioPreview,
        fetchLoadingPortfolio,
        setPortfolioLoading
    } = usePortfolioStore();
    const [show, setShow] = useState(false);

    useEffect(() => {
        if (data) setPortfolioPreview(data);
        setPortfolioLoading(false);
    }, [setPortfolioPreview, data, setPortfolioLoading]);

    useEffect(() => {
        const timeout = setTimeout(() => setShow(true), 100);
        return () => clearTimeout(timeout);
    }, []);

    if (fetchLoadingPortfolio) return <Loading/>;

    if (error) {
        return (
            <div className="text-center py-10 text-destructive text-lg">
                <p>Ошибка загрузки: {error}</p>
            </div>
        );
    }

    return (
        <>
            <div
                className={`
                    transition-all duration-700 ease-out
                    ${show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}
                    mb-10
                `}
            >
                <h1 className="text-3xl font-bold text-foreground">
                    Портфолио
                    <span className="block font-medium text-muted-foreground text-sm tracking-wider uppercase">
                         Идеи, воплощённые в реальность
                    </span>
                </h1>
            </div>

            <div
                className={`transition-all duration-700 ease-out
                    ${show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}
                `}
            >
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 mb-15">
                    {items.map((item) => {
                        const imageUrl = API_BASE_URL + "/" + item.cover;
                        const pageUrl = "/portfolio/" + item._id;

                        return (
                            <Link key={item._id} href={pageUrl}>
                                <CartPortfolio
                                    alt={item.coverAlt}
                                    imageSrc={imageUrl}
                                    textBtn="Смотреть все"
                                />
                            </Link>
                        );
                    })}
                </div>
            </div>
        </>

    );
}

export default PortfolioClient;