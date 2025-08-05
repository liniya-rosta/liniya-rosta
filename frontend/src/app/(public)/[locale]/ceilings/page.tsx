import {fetchProducts} from "@/actions/products";
import {fetchCategories} from "@/actions/categories";
import CeilingsClient from "@/src/app/(public)/[locale]/ceilings/CeilingsClient";
import {Metadata} from "next";
import {getTranslations} from "next-intl/server";

export const revalidate = 1800;

export const generateMetadata = async (): Promise<Metadata> => {
    const t = await getTranslations("CeilingsPage");
    const tHeader = await getTranslations("Header");

    return {
        title: tHeader("headerLinks.stretchCeilings"),
        description: t("descriptionSeo"),
        openGraph: {
            title: t("ogTitle"),
            description: t("ogDescription"),
            url: '/ceilings',
            siteName: "Линия Роста",
            images: [
                {
                    url: '/images/services/main-service.JPG',
                    width: 1200,
                    height: 630,
                    alt: t("ogImageAlt"),
                },
            ],
            type: "website",
        },
    };
};

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