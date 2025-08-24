import {fetchProducts} from "@/actions/products";
import {fetchCategories} from "@/actions/categories";
import CeilingsClient from "@/src/app/(public)/[locale]/ceilings/CeilingsClient";
import {Metadata} from "next";
import {getTranslations} from "next-intl/server";
import {handleKyError} from "@/src/lib/handleKyError";
import {Category, ProductResponse} from "@/src/lib/types";

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
        const categorySlug = 'spc';
        const limit = "4";
        const categories = await fetchCategories(categorySlug);
        const spcCategory = categories[0];

        let products: ProductResponse | null = null;
        let allCategories: Category[] | null = null;
        let productError: string | null = null;
        const tError = await getTranslations("Errors");

        try {
            [products, allCategories] = await Promise.all([
                fetchProducts({categoryExclude: spcCategory._id, limit}),
                fetchCategories()
            ]);
        } catch (e) {
            productError = await handleKyError(e, tError('productsError'));
        }

        return (
            <CeilingsClient
                data={products}
                initialCategories={allCategories}
                limit={limit}
                error={productError}
                categorySpc={spcCategory._id}
            />
        );
};

export default CeilingsPage;