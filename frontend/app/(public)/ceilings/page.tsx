import {fetchProducts} from "@/actions/products";
import {fetchCategories} from "@/actions/categories";
import CeilingsClient from "@/app/(public)/ceilings/CeilingsClient";
import {Metadata} from "next";

export const revalidate = 1800;

export const generateMetadata = async (): Promise<Metadata> => ({
    title: "Натяжные потолки",
    description: "Натяжные потолки в Бишкеке от компании Линия Роста. Качество, гарантия, профессиональный монтаж.",
    openGraph: {
        title: "Натяжные потолки | Линия Роста",
        description: "Стильные и качественные натяжные потолки от Линии Роста.",
        url: '/ceilings',
        siteName: "Линия Роста",
        type: "website",
    },
});

const CeilingsPage = async () => {
    try {
        const [products, categories] = await Promise.all([
            fetchProducts(),
            fetchCategories()
        ]);

        return (
            <CeilingsClient
                initialProducts={products.items}
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