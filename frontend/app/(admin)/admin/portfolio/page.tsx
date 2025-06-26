import {fetchPortfolioPreviews} from "@/actions/portfolios";
import AdminPortfolioClient from "@/app/(admin)/admin/portfolio/PortfolioClient";
import {PaginatedPortfolioResponse} from "@/lib/types";
import {isAxiosError} from "axios";

const AdminPortfolioPage = async () => {
    let errorMessage: string | null = null;
    let portfolioData: PaginatedPortfolioResponse | null = null;
    const limit = "8";

    try {
        portfolioData = await fetchPortfolioPreviews(limit);

    } catch (error) {
        if (isAxiosError(error) && error.response) {
            errorMessage = error.response.data.error;
        } else if (error instanceof Error) {
            errorMessage = error.message;
        } else {
            errorMessage = "Неизвестная ошибка при загрузке портфолио";
        }
    }

    return (
        <div>
            <AdminPortfolioClient data={portfolioData} error={errorMessage}/>
        </div>
    )
};

export default AdminPortfolioPage;