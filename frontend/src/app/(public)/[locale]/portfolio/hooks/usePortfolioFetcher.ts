import {useCallback, useState} from "react";
import {usePortfolioStore} from "@/store/portfolioItemStore";
import {fetchPortfolioPreviews} from "@/actions/portfolios";
import {PortfolioResponse} from "@/src/lib/types";
import {getPaginationButtons} from "@/src/lib/utils";
import {useTranslations} from "next-intl";
import {handleKyError} from "@/src/lib/handleKyError";

export const usePortfolioFetcher = (limit: string) => {
    const {
        paginationPortfolio,
        setPortfolioPreview,
        setPortfolioLoading,
        setPaginationPortfolio,
        setFetchErrorPortfolio
    } = usePortfolioStore();

    const [page, setPage] = useState(1);
    let paginationButtons: (string | number)[] | null = null;
    const tError = useTranslations("Errors")

    if (paginationPortfolio)
        paginationButtons = getPaginationButtons(page, paginationPortfolio.totalPages);

    const updatedData = useCallback(
        async (initialData?: PortfolioResponse | null, newPage?: number) => {
            try {
                setPortfolioLoading(true);
                let data: PortfolioResponse;

                if (initialData) {
                    data = initialData;
                } else {
                    data = await fetchPortfolioPreviews(limit, String(newPage));
                }

                setPortfolioPreview(data.items);
                setPaginationPortfolio({
                    total: data.total,
                    page: data.page,
                    pageSize: data.pageSize,
                    totalPages: data.totalPages,
                });

                setFetchErrorPortfolio(null);
            } catch (error) {
                const errorMessage = await handleKyError(error, tError("portfolioError"));
                setFetchErrorPortfolio(errorMessage);
            } finally {
                setPortfolioLoading(false);
            }
        },
        [limit, setFetchErrorPortfolio, setPaginationPortfolio, setPortfolioLoading, setPortfolioPreview, tError]
    );

    const handlePageChange = useCallback(
        async (newPage: number) => {
            await updatedData(null, newPage);
            setPage(newPage);
        },
        [updatedData]
    );

    return {
        page,
        setPage,
        updatedData,
        handlePageChange,
        paginationButtons,
    };
};