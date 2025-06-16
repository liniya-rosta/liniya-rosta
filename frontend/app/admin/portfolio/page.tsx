import {fetchPortfolioPreviews} from "@/actions/portfolios";
import AdminPortfolioClient from "@/app/admin/portfolio/PortfolioClient";

const AdminPortfolioPage = async () => {
    const portfolioData = await fetchPortfolioPreviews();
    return (
        <div className="container">
            <AdminPortfolioClient data={portfolioData}/>
        </div>
    )
};

export default AdminPortfolioPage;