import ProductDetailView from "@/src/app/(public)/[locale]/ceilings/[slug]/ProductDetailView";
import {Product} from "@/src/lib/types";
import {fetchProductBySlug} from "@/actions/products";
import {isAxiosError} from "axios";
import {Metadata} from "next";
import {getTranslations} from "next-intl/server";

type Props = {
    params: Promise<{ slug: string }>;
};

export async function generateMetadata({params}: Props): Promise<Metadata> {
    try {
        const {slug} = await params;
        const product = await fetchProductBySlug(slug);

        return {
            title: product.seoTitle || product.title.ru,
            description: product.seoDescription || `Подробнее о продукте "${product.title}"`,
            openGraph: {
                title: product.seoTitle || product.title.ru,
                description: product.seoDescription || `Описание продукта ${product.title}`,
                images: [
                    {
                        url: product.cover?.url,
                        alt: product.cover?.alt.ru || product.title.ru,
                    },
                ],
                type: "website",
            },
        };
    } catch {
        return {
            title: "Продукт не найден",
            description: "Информация о продукте недоступна",
        };
    }
}

export default async function ProductDetailPage({params}: Props) {
    const {slug} = await params;
    let product: Product | null = null;
    let fetchProductError: string | null = null;
    const tError = await getTranslations("Errors");

    try {
        product = await fetchProductBySlug(slug);
    } catch (e) {
        fetchProductError =
            isAxiosError(e) && e.response?.data?.error
                ? e.response.data.error
                : tError("CeilingDetailError");
    }

    return (
        <ProductDetailView
            productData={product}
            fetchProductError={fetchProductError}
        />
    );
}