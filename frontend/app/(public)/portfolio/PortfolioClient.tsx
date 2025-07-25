'use client';

import {usePortfolioStore} from "@/store/portfolioItemStore";
import React, {useEffect} from "react";
import {API_BASE_URL} from "@/lib/globalConstants";
import {CartPortfolio} from '@/app/(public)/portfolio/components/CartPortfolio';
import {PortfolioResponse} from "@/lib/types";
import Link from "next/link";
import ErrorMsg from "@/components/ui/ErrorMsg";
import EmptyState from "@/components/ui/emptyState";
import PaginationButtons from "@/components/shared/PaginationButtons";
import LoadingFullScreen from "@/components/ui/Loading/LoadingFullScreen";
import {usePortfolioFetcher} from "@/app/(public)/portfolio/hooks/usePortfolioFetcher";

interface Props {
    data: PortfolioResponse | null;
    error: string | null;
    limit?: string;
}

const PortfolioClient: React.FC<Props> = ({data, error, limit = "8"}) => {
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
            <div className="flex flex-col md:flex-row justify-between gap-6 mb-12">
                <div className="flex flex-col gap-4 max-w-xl">
                    <h2 className="text-3xl font-bold">Наше портфолио</h2>
                    <p className="text-muted-foreground text-base leading-relaxed">
                        Здесь вы можете ознакомиться с нашими последними проектами. Мы стараемся делать каждый проект уникальным и отражающим индивидуальность клиента.
                    </p>
                    <input
                        type="text"
                        placeholder="Поиск по проектам..."
                        className="px-4 py-2 border border-input rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                </div>

                <div className="flex gap-4 w-full md:w-auto">
                    <div className="h-60 w-40 md:h-48 md:w-48 bg-muted rounded-xl shadow-md flex items-center justify-center text-muted-foreground text-lg font-semibold">
                        Кубик 1
                    </div>
                    <div className="h-60 w-40 md:h-48 md:w-48 bg-muted rounded-xl shadow-md flex items-center justify-center text-muted-foreground text-lg font-semibold">
                        Кубик 2
                    </div>
                </div>
            </div>

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
