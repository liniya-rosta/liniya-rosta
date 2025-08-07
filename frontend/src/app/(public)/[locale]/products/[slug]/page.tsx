import {Product} from "@/src/lib/types";
import {fetchProductBySlug} from "@/actions/products";
import {isAxiosError} from "axios";
import {Metadata} from "next";
import {getTranslations} from "next-intl/server";
import ProductDetailView from "@/src/app/(public)/[locale]/products/[slug]/ProductDetailView";

type Props = {
    params: { slug: string; locale: 'ru' | 'ky' };
};

export async function generateMetadata({params}: Props): Promise<Metadata> {
    try {
        const { slug, locale } = params;
        const product = await fetchProductBySlug(slug);

        const title = product.seoTitle?.[locale] || product.title?.[locale];
        const description = product.seoDescription?.[locale] || `Подробнее о продукте "${product.title?.[locale]}"`;

        return {
            title,
            description,
            openGraph: {
                title,
                description,
                images: [
                    {
                        url: product.cover?.url,
                        alt: product.cover?.alt?.[locale] || product.title?.[locale],
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
    const { slug} = params;
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