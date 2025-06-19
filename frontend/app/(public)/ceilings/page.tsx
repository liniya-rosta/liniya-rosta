import { fetchProducts } from "@/actions/products";
import { fetchCategories } from "@/actions/categories";
import CeilingsClient from "@/app/(public)/ceilings/CeilingsClient";

const CeilingsPage = async () => {
    try {
        const [products, categories] = await Promise.all([
            fetchProducts(),
            fetchCategories()
        ]);

        return (
            <CeilingsClient
                initialProducts={products}
                initialCategories={categories}
            />
        );
    } catch (error) {
        console.error('Ошибка загрузки данных:', error);

        return (
            <CeilingsClient
                initialProducts={[]}
                initialCategories={[]}
            />
        );
    }
};

export default CeilingsPage;