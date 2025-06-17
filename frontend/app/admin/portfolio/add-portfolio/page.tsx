import PortfolioForm from "@/app/admin/portfolio/components/PortfolioForm";

const AddPortfolio = () => {
    return (
        <div className="container mx-auto px-8">
            <div className="mt-20">
                <h2 className="font-bold text-3xl mb-5">Создать портфолио</h2>
                <PortfolioForm/>
            </div>
        </div>
    )
};

export default AddPortfolio;