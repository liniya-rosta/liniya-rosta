'use client';

import {usePortfolioStore} from "@/store/portfolioItemStore";
import React, {useEffect, useState} from "react";
import {API_BASE_URL} from "@/lib/globalConstants";
import {CartPortfolio} from '@/app/(public)/portfolio/components/CartPortfolio';
import {PortfolioResponse} from "@/lib/types";
import Link from "next/link";
import ErrorMsg from "@/components/ui/ErrorMsg";
import LoadingFullScreen from "@/components/ui/Loading/LoadingFullScreen";
import {Button} from "@/components/ui/button";
import {isAxiosError} from "axios";
import {toast} from "react-toastify";
import {fetchPortfolioPreviews} from "@/actions/portfolios";
import {getPaginationButtons} from "@/lib/utils";
import {BtnArrow} from "@/components/ui/btn-arrow";

interface Props {
    data: PortfolioResponse | null;
    error?: string | null;
    limit?: string;
}

const PortfolioClient: React.FC<Props> = ({data, error, limit ="8"}) => {
    const {
        items,
        fetchLoadingPortfolio,
        paginationPortfolio,
        setPortfolioPreview,
        setPortfolioLoading,
        setPaginationPortfolio,
    } = usePortfolioStore();

    useEffect(() => {
        if (data) {
            setPortfolioPreview(data.items);
            setPaginationPortfolio({
                total: data.total,
                page: data.page,
                pageSize: data.pageSize,
                totalPages: data.totalPages,
            });
        }
        setPortfolioLoading(false);
    }, [setPortfolioPreview, data, setPortfolioLoading, setPaginationPortfolio]);

    const [page, setPage] = useState(1);
    let paginationButtons: (string | number)[] | null = null;

    if (paginationPortfolio) paginationButtons = getPaginationButtons(page, paginationPortfolio.totalPages)

    const handlePageChange = async (newPage: number) => {
        try {
            setPortfolioLoading(true);
            const updated = await fetchPortfolioPreviews(limit, String(newPage));
            setPortfolioPreview(updated.items);
            setPage(newPage);
        } catch (error) {
            let errorMessage = "Неизвестная ошибка при загрузке портфолио";
            if (isAxiosError(error) && error.response) {
                errorMessage = error.response.data.error;
            } else if (error instanceof Error) {
                errorMessage = error.message;
            }

            toast.error(errorMessage);
        } finally {
            setPortfolioLoading(false);
        }
    };

    if (fetchLoadingPortfolio) return <LoadingFullScreen/>;
    if (error) return <ErrorMsg error={error}/>

    return (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 mb-15">
                {items && items.length > 0 ? (
                    items.map((item) => {
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
                    })
                ) : <div className="flex justify-center items-center min-h-[200px]">
                        <p className="text-muted-foreground text-lg">Нет портфолио</p>
                    </div>
                }
            </div>

            {paginationPortfolio && paginationPortfolio.totalPages > 1 && (
                <div className="flex justify-center mt-6 gap-4">
                    <BtnArrow
                        onClick={() => handlePageChange(page - 1)}
                        disabled={page === 1}
                        isLeft
                        className="bg-muted text-foreground hover:bg-muted-foreground/10"
                        classNameIcon="text-primary"
                    />

                    {paginationButtons && paginationButtons.map((btn, index) =>
                        typeof btn === "number" ? (
                            <Button
                                key={btn}
                                onClick={() => handlePageChange(btn)}
                                className={`px-3 py-1 rounded-md border text-sm font-medium ${
                                    page === btn
                                        ? "bg-primary text-white"
                                        : "bg-muted text-foreground hover:bg-muted-foreground/10"
                                }`}
                                aria-current={page === btn ? "page" : undefined}
                            >
                                {btn}
                            </Button>
                        ) : (
                            <span key={"dots-" + index} className="px-3 py-1 select-none">
                                {btn}
                            </span>
                        )
                    )}
                    <BtnArrow
                        onClick={() => handlePageChange(page + 1)}
                        disabled={page === paginationPortfolio.totalPages}
                        className="bg-muted text-foreground hover:bg-muted-foreground/10"
                        classNameIcon="text-primary"
                    />
                </div>
            )}
        </>
    );
}

export default PortfolioClient;