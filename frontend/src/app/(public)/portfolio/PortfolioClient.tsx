'use client';

import {usePortfolioStore} from "@/store/portfolioItemStore";
import React, {useEffect} from "react";
import {API_BASE_URL} from "@/src/lib/globalConstants";
import {CartPortfolio} from '@/src/app/(public)/portfolio/components/CartPortfolio';
import {PortfolioResponse} from "@/src/lib/types";
import Link from "next/link";
import ErrorMsg from "@/src/components/ui/ErrorMsg";
import EmptyState from "@/src/components/ui/emptyState";
import PaginationButtons from "@/src/components/shared/PaginationButtons";
import LoadingFullScreen from "@/src/components/ui/Loading/LoadingFullScreen";
import {usePortfolioFetcher} from "@/src/app/(public)/portfolio/hooks/usePortfolioFetcher";

interface Props {
    data: PortfolioResponse | null;
    error: string | null;
    limit: string;
}

const PortfolioClient: React.FC<Props> = ({data, error, limit}) => {
    const {
        items,
        paginationPortfolio,
        fetchLoadingPortfolio,
        fetchErrorPortfolio,
        setFetchErrorPortfolio
    } = usePortfolioStore();

    const {
        page,
        updatedData,
        paginationButtons,
        handlePageChange,
    } = usePortfolioFetcher(limit);

    useEffect(() => {
        if (data) {
           void updatedData(data);
        }
        setFetchErrorPortfolio(error);
    }, [data, error]);

    if (fetchLoadingPortfolio) return <LoadingFullScreen/>
    if (fetchErrorPortfolio) return <ErrorMsg error={fetchErrorPortfolio}/>;

    return (
        <>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(290px,1fr))] gap-3 mb-15">
                {items && items.length > 0 ? (
                    items.map((item) => {
                        const imageUrl = API_BASE_URL + "/" + item.cover;
                        const pageUrl = "/portfolio/" + item._id;
                        return (
                            <Link key={item._id} href={pageUrl}>
                                <CartPortfolio
                                    className={"max-h-[450px]"}
                                    alt={item.coverAlt}
                                    imageSrc={imageUrl}
                                />
                            </Link>
                        );
                    })
                ) : (
                    <div className="flex flex-col items-center justify-center col-span-full min-h-[300px]">
                        <EmptyState message="Нет данных"/>
                    </div>
                )}
            </div>

            {paginationPortfolio && paginationPortfolio.totalPages > 1 && (
                <PaginationButtons
                    page={page}
                    totalPages={paginationPortfolio.totalPages}
                    paginationButtons={paginationButtons ?? []}
                    onPageChange={handlePageChange}
                />
            )}
        </>
    );
};

export default PortfolioClient;
