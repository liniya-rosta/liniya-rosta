import {fetchPortfolioPreviews} from "@/actions/portfolios";
import AdminPortfolioClient from "@/app/(admin)/admin/portfolio/PortfolioClient";
import {PortfolioItemPreview} from "@/lib/types";
import {isAxiosError} from "axios";

const AdminPortfolioPage = async () => {
    let errorMessage: string | null = null;
    let portfolioData: PortfolioItemPreview[] | null = null;

    try {
        portfolioData = await fetchPortfolioPreviews();

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