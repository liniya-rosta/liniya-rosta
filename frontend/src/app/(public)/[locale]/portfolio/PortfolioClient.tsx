'use client';

import {usePortfolioStore} from "@/store/portfolioItemStore";
import React, {useEffect, useState} from "react";
import {API_BASE_URL} from "@/src/lib/globalConstants";
import {CartPortfolio} from '@/src/app/(public)/[locale]/portfolio/components/CartPortfolio';
import {PortfolioResponse} from "@/src/lib/types";
import Link from "next/link";
import ErrorMsg from "@/src/components/ui/ErrorMsg";
import {Button} from "@/src/components/ui/button";
import {isAxiosError} from "axios";
import {toast} from "react-toastify";
import {fetchPortfolioPreviews} from "@/actions/portfolios";
import {getPaginationButtons} from "@/src/lib/utils";
import {BtnArrow} from "@/src/components/ui/btn-arrow";
import EmptyState from "@/src/components/ui/emptyState";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/src/components/ui/select";
import SearchByAltGallery from "@/src/app/(public)/[locale]/portfolio/components/SearchTypes/SearchByAltGallery";
import SearchByDescription from "@/src/app/(public)/[locale]/portfolio/components/SearchTypes/SearchByDescription";
import {useLocale, useTranslations} from "next-intl";


interface Props {
    data: PortfolioResponse | null;
    error?: string | null;
    limit?: string;
}

const PortfolioClient: React.FC<Props> = ({data, error, limit = "8"}) => {
    const {
        items,
        coverAlt,
        description,
        paginationPortfolio,
        setDescription,
        setCoverAlt,
        setPortfolioPreview,
        setPortfolioLoading,
        setPaginationPortfolio,
    } = usePortfolioStore();

    const tPortfolio = useTranslations("PortfolioPage");
    const tError = useTranslations("Errors")
    const locale = useLocale() as "ru" | "ky";

    const [selectedValue, setSelectedValue] = useState('');
    const [showFilter, setShowFilter] = useState(false);

    const [page, setPage] = useState(1);
    let paginationButtons: (string | number)[] | null = null;

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

    const fetchFilteredItems = async () => {
        try {
            setPortfolioLoading(true);
            const updated = await fetchPortfolioPreviews(limit, "1", coverAlt, description);
            setPortfolioPreview(updated.items);
            setPaginationPortfolio({
                total: updated.total,
                page: updated.page,
                pageSize: updated.pageSize,
                totalPages: updated.totalPages,
            });
            setPage(1);
        } catch (error) {
            let errorMessage = "Ошибка при фильтрации";
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

    useEffect(() => {

        void fetchFilteredItems()

        const hasFilter = (selectedValue === "coverAlt" && coverAlt.trim()) || (selectedValue === "description" && description.trim());

        if (selectedValue && hasFilter) {
            void fetchFilteredItems();
        } else if (selectedValue && !hasFilter) {
            void handlePageChange(1);
        }

    }, [coverAlt, description, selectedValue]);

    if (paginationPortfolio)
        paginationButtons = getPaginationButtons(page, paginationPortfolio.totalPages);

    const handlePageChange = async (newPage: number) => {
        try {
            setPortfolioLoading(true);
            const updated = await fetchPortfolioPreviews(limit, String(newPage), coverAlt, description);
            setPortfolioPreview(updated.items);
            setPage(newPage);
        } catch (error) {
            let errorMessage = tError("portfolioError");
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

    const handleFilterChange = (value: string) => {
        setSelectedValue(value);
        if (value !== 'coverAlt') setCoverAlt('');
        if (value !== 'description') setDescription('');
    };

    const toggleFilter = () => {
        if (showFilter) {
            setSelectedValue('');
            setCoverAlt('')
            setDescription('')

            if (data) {
                setPortfolioPreview(data.items);
                setPaginationPortfolio({
                    total: data.total,
                    page: data.page,
                    pageSize: data.pageSize,
                    totalPages: data.totalPages,
                });
                setPage(1);
            }
        }
        setShowFilter(prev => !prev);
    };


    if (error) return <ErrorMsg error={error}/>;

    return (
        <>
            <Button onClick={toggleFilter} variant="outline" className="mb-4">
                {showFilter ? "Сбросить фильтр" : "Фильтр"}
            </Button>

            {showFilter && (
                <div className='flex flex-wrap gap-1 '>
                    <Select onValueChange={handleFilterChange} value={selectedValue}>
                        <SelectTrigger className="w-[180px] mb-4 mr-2">
                            <SelectValue placeholder="Выберите фильтр"/>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="coverAlt">По названию</SelectItem>
                            <SelectItem value="description">По описанию</SelectItem>
                        </SelectContent>
                    </Select>

                    {selectedValue === 'coverAlt' && <SearchByAltGallery/>}
                    {selectedValue === 'description' && <SearchByDescription/>}
                </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 mb-15">
                {items && items.length > 0 ? (
                    items.map((item) => {
                        const imageUrl = API_BASE_URL + "/" + item.cover;
                        const pageUrl = "/portfolio/" + item.slug;
                        return (
                            <Link key={item._id} href={pageUrl}>
                                <CartPortfolio
                                    alt={item.coverAlt[locale]}
                                    imageSrc={imageUrl}
                                />
                            </Link>
                        );
                    })
                ) : (
                    <div className="flex flex-col items-center justify-center col-span-full min-h-[300px]">
                        <EmptyState message={tPortfolio("noData")} />
                    </div>
                )}
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
};

export default PortfolioClient;
