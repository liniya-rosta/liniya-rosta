import PortfolioForm from "@/app/(admin)/admin/portfolio/components/PortfolioForm";
import {Container} from "@/components/shared/Container";

const AddPortfolio = async () => {
    return (
        <Container className="px-8">
            <div className="my-20">
                <div className="mx-auto w-[80%]">
                    <h2 className="font-bold text-3xl mb-5 text-center">Создать портфолио</h2>
                    <div className="max-w-4xl mx-auto">
                        <PortfolioForm/>
                    </div>
                </div>
            </div>
        </Container>
    )
};

export default AddPortfolio;