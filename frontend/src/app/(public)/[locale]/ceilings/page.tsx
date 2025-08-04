import {fetchProducts} from "@/actions/products";
import {fetchCategories} from "@/actions/categories";
import CeilingsClient from "@/src/app/(public)/[locale]/ceilings/CeilingsClient";
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
        const categorySlug = 'spc';
        const categories = await fetchCategories(categorySlug);
        const spcCategory = categories[0];

        const [products, allCategories] = await Promise.all([
            fetchProducts({categoryExclude: spcCategory._id}),
            fetchCategories()
        ]);

        return (
            <CeilingsClient
                initialProducts={products.items}
                initialCategories={allCategories}
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