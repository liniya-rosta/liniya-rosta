import {useState} from "react";
import {isAxiosError} from "axios";
import {usePortfolioStore} from "@/store/portfolioItemStore";
import {fetchPortfolioPreviews} from "@/actions/portfolios";
import {PortfolioResponse} from "@/src/lib/types";
import {getPaginationButtons} from "@/src/lib/utils";

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

    if (paginationPortfolio)
        paginationButtons = getPaginationButtons(page, paginationPortfolio.totalPages);

    const updatedData = async (initialData?: PortfolioResponse | null, newPage?: number) => {
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
            let errorMessage = "Неизвестная ошибка при загрузке портфолио";

            if (isAxiosError(error) && error.response) {
                errorMessage = error.response.data.error;
            } else if (error instanceof Error) {
                errorMessage = error.message;
            }
            setFetchErrorPortfolio(errorMessage);
        } finally {
            setPortfolioLoading(false);
        }
    }

    const handlePageChange = async (newPage: number) => {
        await updatedData(null, newPage);
        setPage(newPage);
    };

    return {
        page,
        setPage,
        updatedData,
        handlePageChange,
        paginationButtons,
    };
};
