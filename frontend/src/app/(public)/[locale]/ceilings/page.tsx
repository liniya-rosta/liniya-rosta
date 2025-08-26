import {fetchProducts} from "@/actions/products";
import {fetchCategories} from "@/actions/categories";
import CeilingsClient from "@/src/app/(public)/[locale]/ceilings/CeilingsClient";
import {Metadata} from "next";
import {getTranslations} from "next-intl/server";
import {handleKyError} from "@/src/lib/handleKyError";
import {ProductResponse} from "@/src/lib/types";

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
    const limit = "4";
    const allCategories = await fetchCategories();

    const spcCategory = allCategories.find(cat => cat.slug === "spc");
    const stretchWallpaperCategory = allCategories.find(cat => cat.slug === "stretch-wallpaper");

    const excludedCategories = [spcCategory?._id, stretchWallpaperCategory?._id].filter(Boolean) as string[];

    let products: ProductResponse | null = null;
    let productError: string | null = null;
    const tError = await getTranslations("Errors");

    try {
        products = await fetchProducts({
            categoryExclude: [spcCategory?._id, stretchWallpaperCategory?._id].filter(Boolean) as string[],
            limit,
        });
    } catch (e) {
        productError = await handleKyError(e, tError("productsError"));
    }

    const filteredCategories = allCategories.filter(cat =>
        !excludedCategories.includes(cat._id)
    );

        return (
            <CeilingsClient
                data={products}
                initialCategories={filteredCategories}
                limit={limit}
                error={productError}
                excludedCategories={excludedCategories}
            />
        );
};

export default CeilingsPage;