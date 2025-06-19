import PortfolioForm from "@/app/(admin)/admin/portfolio/components/PortfolioForm";

const AddPortfolio = async () => {
    return (
        <div className="container mx-auto px-8">
            <div className="my-20 ">
                <div className="mx-auto w-[80%]">
                    <h2 className="font-bold text-3xl mb-5 text-center">Создать портфолио</h2>
                    <PortfolioForm/>
                </div>
            </div>
        </div>
    )
};

export default AddPortfolio;